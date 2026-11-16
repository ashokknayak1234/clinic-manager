from datetime import date
from typing import Any

from pymysql.connections import Connection

def email_exists(connection: Connection, email: str) -> bool:
    with connection.cursor() as cursor:
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
        return cursor.fetchone() is not None


def create_patient(
    connection: Connection,
    *,
    email: str,
    password_hash: str,
    full_name: str,
    date_of_birth: date | None,
    phone: str | None,
    address: str | None,
    emergency_contact_name: str | None,
    emergency_contact_phone: str | None,
    blood_group: str | None,
) -> int:
    with connection.cursor() as cursor:
        # Resolve by name: the numeric role ids differ between seed.sql and
        # the live database, so a hard-coded id can silently create the wrong role.
        cursor.execute("SELECT role_id FROM roles WHERE role_name = 'PATIENT'")
        role = cursor.fetchone()
        if role is None:
            raise RuntimeError("PATIENT role is missing from the roles table")
        cursor.execute(
            """INSERT INTO users (role_id, email, password_hash, is_active)
               VALUES (%s, %s, %s, TRUE)""",
            (role["role_id"], email, password_hash),
        )
        user_id = int(cursor.lastrowid)
        cursor.execute(
            """INSERT INTO patients (user_id, full_name, date_of_birth, phone, address,
               emergency_contact_name, emergency_contact_phone, blood_group)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
            (
                user_id,
                full_name,
                date_of_birth,
                phone,
                address,
                emergency_contact_name,
                emergency_contact_phone,
                blood_group,
            ),
        )
        return user_id


def find_for_login(connection: Connection, email: str) -> dict[str, Any] | None:
    with connection.cursor() as cursor:
        cursor.execute(
            """SELECT u.user_id, u.email, u.password_hash, u.is_active, r.role_name
               FROM users u JOIN roles r ON u.role_id = r.role_id
               WHERE u.email = %s""",
            (email,),
        )
        return cursor.fetchone()


def find_by_id(connection: Connection, user_id: str) -> dict[str, Any] | None:
    with connection.cursor() as cursor:
        cursor.execute(
            """SELECT u.user_id, u.email, r.role_name as role, u.is_active,
                      COALESCE(d.full_name, p.full_name) AS full_name,
                      p.phone AS phone, p.patient_id AS patient_id, d.doctor_id AS doctor_id
               FROM users u
               JOIN roles r ON u.role_id = r.role_id
               LEFT JOIN doctors d ON d.user_id = u.user_id
               LEFT JOIN patients p ON p.user_id = u.user_id
               WHERE u.user_id = %s""",
            (user_id,),
        )
        return cursor.fetchone()
