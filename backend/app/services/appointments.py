from http import HTTPStatus

import pymysql

from app.db.connection import transaction
from app.dependencies.auth import Principal
from app.repositories import appointments as repo
from app.schemas.appointments import AppointmentCreate, AppointmentOut, SlotOut


class AppointmentError(Exception):
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message
        super().__init__(message)


def list_slots(doctor_id: int) -> list[SlotOut]:
    with transaction() as connection:
        repo.ensure_future_slots(connection, doctor_id)
        return [SlotOut(**row) for row in repo.list_available_slots(connection, doctor_id)]


def list_for(principal: Principal) -> list[AppointmentOut]:
    with transaction() as connection:
        return [AppointmentOut(**row) for row in repo.list_appointments(connection, principal)]


def request(data: AppointmentCreate, principal: Principal) -> AppointmentOut:
    if principal.role != "PATIENT":
        raise AppointmentError(HTTPStatus.FORBIDDEN, "Only patients can request appointments")

    with transaction() as connection:
        slot = repo.get_slot(connection, data.slot_id)
        if not slot or slot["doctor_id"] != data.doctor_id:
            raise AppointmentError(HTTPStatus.BAD_REQUEST, "That slot does not belong to this doctor")
        if not slot["is_available"] or not slot["doctor_active"]:
            raise AppointmentError(HTTPStatus.CONFLICT, "That slot is not available")
        patient_id = repo.patient_id_for_user(connection, principal.user_id)
        if patient_id is None:
            raise AppointmentError(HTTPStatus.NOT_FOUND, "Patient profile not found")

        appointment_id = repo.create_request(
            connection,
            patient_id=patient_id,
            doctor_id=data.doctor_id,
            slot_id=data.slot_id,
            reason=(data.reason or "New appointment request").strip() or None,
        )
        if appointment_id is None:
            raise AppointmentError(
                HTTPStatus.CONFLICT,
                "You already requested this slot. Wait for staff confirmation.",
            )
        row = repo.get_appointment(connection, appointment_id)
        if row is None:
            raise AppointmentError(HTTPStatus.INTERNAL_SERVER_ERROR, "Could not load the request")
        return AppointmentOut(**row)


def _authorised_for(principal: Principal, row: dict[str, object], connection) -> bool:
    if principal.role in ("ADMIN", "RECEPTIONIST"):
        return True
    if principal.role == "DOCTOR":
        doctor_id = repo.doctor_id_for_user(connection, principal.user_id)
        # Generic demo doctor (no profile row) keeps clinic-wide access.
        return doctor_id is None or doctor_id == row["doctor_id"]
    if principal.role == "PATIENT":
        patient_id = repo.patient_id_for_user(connection, principal.user_id)
        return patient_id is not None and patient_id == row["patient_id"]
    return False


def confirm(appointment_id: int, principal: Principal) -> AppointmentOut:
    if principal.role == "PATIENT":
        raise AppointmentError(HTTPStatus.FORBIDDEN, "Patients cannot confirm appointments")

    with transaction() as connection:
        row = repo.get_appointment(connection, appointment_id)
        if row is None:
            raise AppointmentError(HTTPStatus.NOT_FOUND, "Appointment not found")
        if not _authorised_for(principal, row, connection):
            raise AppointmentError(HTTPStatus.FORBIDDEN, "This appointment is not assigned to you")
        if row["status"] not in ("PENDING", "BOOKED"):
            raise AppointmentError(HTTPStatus.CONFLICT, "Only pending requests can be confirmed")

        try:
            repo.set_status(connection, appointment_id, "CONFIRMED")
        except pymysql.err.IntegrityError:
            raise AppointmentError(
                HTTPStatus.CONFLICT,
                "This slot was already booked by another appointment",
            ) from None
        updated = repo.get_appointment(connection, appointment_id)
        if updated is None:
            raise AppointmentError(HTTPStatus.INTERNAL_SERVER_ERROR, "Could not load the appointment")
        return AppointmentOut(**updated)


def cancel(appointment_id: int, principal: Principal) -> AppointmentOut:
    with transaction() as connection:
        row = repo.get_appointment(connection, appointment_id)
        if row is None:
            raise AppointmentError(HTTPStatus.NOT_FOUND, "Appointment not found")
        if not _authorised_for(principal, row, connection):
            raise AppointmentError(HTTPStatus.FORBIDDEN, "This appointment is not assigned to you")
        if row["status"] not in ("PENDING", "BOOKED", "CONFIRMED"):
            raise AppointmentError(HTTPStatus.CONFLICT, "This appointment can no longer be cancelled")

        repo.set_status(connection, appointment_id, "CANCELLED")
        updated = repo.get_appointment(connection, appointment_id)
        if updated is None:
            raise AppointmentError(HTTPStatus.INTERNAL_SERVER_ERROR, "Could not load the appointment")
        return AppointmentOut(**updated)
