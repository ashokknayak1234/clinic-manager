from datetime import date, datetime, time, timedelta
from typing import Literal

from pydantic import BaseModel, Field, field_validator

AppointmentStatus = Literal[
    "PENDING", "BOOKED", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"
]


def _as_time(value: object) -> object:
    """PyMySQL returns TIME columns as timedelta; Pydantic wants a time."""
    if isinstance(value, timedelta):
        seconds = int(value.total_seconds())
        return time(seconds // 3600, (seconds % 3600) // 60, seconds % 60)
    return value


class AppointmentCreate(BaseModel):
    doctor_id: int = Field(gt=0)
    slot_id: int = Field(gt=0)
    reason: str | None = Field(default=None, max_length=500)


class SlotOut(BaseModel):
    slot_id: int
    doctor_id: int
    slot_date: date
    start_time: time
    end_time: time
    is_available: bool

    _times = field_validator("start_time", "end_time", mode="before")(_as_time)


class AppointmentOut(BaseModel):
    appointment_id: int
    patient_id: int
    doctor_id: int
    slot_id: int
    status: AppointmentStatus
    reason: str | None
    created_at: datetime
    updated_at: datetime
    patient_name: str
    patient_email: str | None = None
    patient_phone: str | None = None
    doctor_name: str
    specialty: str | None = None
    slot_date: date
    start_time: time
    end_time: time
    department_name: str | None = None

    _times = field_validator("start_time", "end_time", mode="before")(_as_time)
