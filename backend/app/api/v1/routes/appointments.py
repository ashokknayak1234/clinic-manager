from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies.auth import current_principal
from app.schemas.appointments import AppointmentCreate, AppointmentOut, SlotOut
from app.services.appointments import AppointmentError, cancel, confirm, list_for, list_slots, request

router = APIRouter(tags=["appointments"])


def _raise(error: AppointmentError) -> None:
    raise HTTPException(
        status_code=error.status_code,
        detail={"success": False, "data": None, "error": {"message": error.message}},
    ) from None


@router.get("/appointments", response_model=list[AppointmentOut])
def get_appointments(principal=Depends(current_principal)):
    """Role-scoped appointment list: own requests, own doctor rows, or all for staff."""
    try:
        return list_for(principal)
    except AppointmentError as exc:
        _raise(exc)


@router.post(
    "/appointments",
    response_model=AppointmentOut,
    status_code=status.HTTP_201_CREATED,
)
def create_appointment(data: AppointmentCreate, principal=Depends(current_principal)):
    """Create a PENDING request. The slot is only reserved after staff confirmation."""
    try:
        return request(data, principal)
    except AppointmentError as exc:
        _raise(exc)


@router.patch("/appointments/{appointment_id}/confirm", response_model=AppointmentOut)
def confirm_appointment(appointment_id: int, principal=Depends(current_principal)):
    """Confirm a pending request (own rows for named doctors, all rows for staff)."""
    try:
        return confirm(appointment_id, principal)
    except AppointmentError as exc:
        _raise(exc)


@router.patch("/appointments/{appointment_id}/cancel", response_model=AppointmentOut)
def cancel_appointment(appointment_id: int, principal=Depends(current_principal)):
    """Cancel a request or appointment, freeing the slot again."""
    try:
        return cancel(appointment_id, principal)
    except AppointmentError as exc:
        _raise(exc)


@router.get("/doctors/{doctor_id}/slots", response_model=list[SlotOut])
def get_doctor_slots(doctor_id: int, principal=Depends(current_principal)):
    """Available future slots that are not already confirmed/booked."""
    try:
        return list_slots(doctor_id)
    except AppointmentError as exc:
        _raise(exc)
