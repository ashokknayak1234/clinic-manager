from datetime import date, timedelta
from typing import Any

from pymysql.connections import Connection

from app.dependencies.auth import Principal

_APPOINTMENT_SELECT = """
    SELECT a.appointment_id, a.patient_id, a.doctor_id, a.slot_id, a.status,
           a.reason, a.created_at, a.updated_at,
           p.full_name AS patient_name, u.email AS patient_email, p.phone AS patient_phone,
           d.full_name AS doctor_name, d.specialty, dep.name AS department_name,
           s.slot_date, s.start_time, s.end_time
      FROM appointments a
      JOIN patients p ON p.patient_id = a.patient_id
      JOIN users u ON u.user_id = p.user_id
      JOIN doctors d ON d.doctor_id = a.doctor_id
      LEFT JOIN departments dep ON dep.department_id = d.department_id
      JOIN time_slots s ON s.slot_id = a.slot_id
"""


def patient_id_for_user(connection: Connection, user_id: str) -> int | None:
    with connection.cursor() as cursor:
        cursor.execute("SELECT patient_id FROM patients WHERE user_id = %s", (user_id,))
        row = cursor.fetchone()
        return row["patient_id"] if row else None


def doctor_id_for_user(connection: Connection, user_id: str) -> int | None:
    with connection.cursor() as cursor:
        cursor.execute("SELECT doctor_id FROM doctors WHERE user_id = %s", (user_id,))
        row = cursor.fetchone()
        return row["doctor_id"] if row else None


def get_slot(connection: Connection, slot_id: int) -> dict[str, Any] | None:
    with connection.cursor() as cursor:
        cursor.execute(
            """SELECT s.slot_id, s.doctor_id, s.slot_date, s.start_time, s.end_time,
                      s.is_available, d.is_active AS doctor_active
                 FROM time_slots s
                 JOIN doctors d ON d.doctor_id = s.doctor_id
                WHERE s.slot_id = %s""",
            (slot_id,),
        )
        return cursor.fetchone()


_DEMO_SLOT_TIMES = (
    ("09:00:00", "10:00:00"),
    ("10:00:00", "11:00:00"),
    ("11:00:00", "12:00:00"),
    ("14:00:00", "15:00:00"),
    ("15:00:00", "16:00:00"),
    ("16:00:00", "17:00:00"),
)


def ensure_future_slots(connection: Connection, doctor_id: int, days: int = 7) -> None:
    """Keep a rolling week of demo slots so the booking screen never runs dry.

    The original seed/migration slots were fixed dates and expired; INSERT IGNORE
    makes this safe to call on every slot lookup.
    """
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT 1 FROM doctors WHERE doctor_id = %s AND is_active = TRUE",
            (doctor_id,),
        )
        if not cursor.fetchone():
            return
        today = date.today()
        rows = [
            (doctor_id, today + timedelta(days=offset), start, end, 1)
            for offset in range(days)
            for start, end in _DEMO_SLOT_TIMES
        ]
        cursor.executemany(
            """INSERT IGNORE INTO time_slots
                   (doctor_id, slot_date, start_time, end_time, is_available)
               VALUES (%s, %s, %s, %s, %s)""",
            rows,
        )


def list_available_slots(connection: Connection, doctor_id: int) -> list[dict[str, Any]]:
    with connection.cursor() as cursor:
        cursor.execute(
            """SELECT s.slot_id, s.doctor_id, s.slot_date, s.start_time, s.end_time,
                      s.is_available
                 FROM time_slots s
                WHERE s.doctor_id = %s
                  AND s.is_available = TRUE
                  AND s.slot_date >= CURDATE()
                  AND NOT EXISTS (
                        SELECT 1 FROM appointments a
                         WHERE a.slot_id = s.slot_id
                           AND a.status IN ('CONFIRMED', 'BOOKED')
                  )
                ORDER BY s.slot_date, s.start_time""",
            (doctor_id,),
        )
        return list(cursor.fetchall())


def get_appointment(connection: Connection, appointment_id: int) -> dict[str, Any] | None:
    with connection.cursor() as cursor:
        cursor.execute(
            _APPOINTMENT_SELECT + " WHERE a.appointment_id = %s", (appointment_id,)
        )
        return cursor.fetchone()


def list_appointments(
    connection: Connection, principal: Principal
) -> list[dict[str, Any]]:
    where = ""
    params: tuple[Any, ...] = ()
    if principal.role == "PATIENT":
        patient_id = patient_id_for_user(connection, principal.user_id)
        if patient_id is None:
            return []
        where = " WHERE a.patient_id = %s"
        params = (patient_id,)
    elif principal.role == "DOCTOR":
        # The generic doctor@demo.com account has no doctors row, so it keeps
        # clinic-wide demo access. Named doctors are scoped to their own rows.
        doctor_id = doctor_id_for_user(connection, principal.user_id)
        if doctor_id is not None:
            where = " WHERE a.doctor_id = %s"
            params = (doctor_id,)

    with connection.cursor() as cursor:
        cursor.execute(
            _APPOINTMENT_SELECT
            + where
            + " ORDER BY s.slot_date, s.start_time, a.appointment_id",
            params,
        )
        return list(cursor.fetchall())


def create_request(
    connection: Connection,
    *,
    patient_id: int,
    doctor_id: int,
    slot_id: int,
    reason: str | None,
) -> int | None:
    """Insert a PENDING request. Returns None when the patient already asked for this slot."""
    with connection.cursor() as cursor:
        cursor.execute(
            """SELECT appointment_id FROM appointments
                WHERE patient_id = %s AND slot_id = %s
                  AND status IN ('PENDING', 'BOOKED', 'CONFIRMED')""",
            (patient_id, slot_id),
        )
        if cursor.fetchone():
            return None
        cursor.execute(
            """INSERT INTO appointments (patient_id, doctor_id, slot_id, status, reason)
               VALUES (%s, %s, %s, 'PENDING', %s)""",
            (patient_id, doctor_id, slot_id, reason),
        )
        return int(cursor.lastrowid)


def set_status(connection: Connection, appointment_id: int, status: str) -> bool:
    with connection.cursor() as cursor:
        cursor.execute(
            "UPDATE appointments SET status = %s WHERE appointment_id = %s",
            (status, appointment_id),
        )
        return cursor.rowcount == 1
