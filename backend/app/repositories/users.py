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
        cursor.execute(
            """INSERT INTO users (role_id, email, password_hash, is_active)
               VALUES (4, %s, %s, TRUE)""",
            (email, password_hash),
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
            """SELECT u.user_id, u.email, r.role_name as role, u.is_active
               FROM users u JOIN roles r ON u.role_id = r.role_id
               WHERE u.user_id = %s""",
            (user_id,),
        )
        return cursor.fetchone()
