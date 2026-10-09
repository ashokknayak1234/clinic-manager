from http import HTTPStatus

from app.db.connection import transaction
from app.core.security import create_access_token, hash_password, verify_password
from app.repositories import users
from app.schemas.auth import TokenResponse, UserCreate, UserLogin, UserMe


class AuthError(Exception):
    def __init__(self, status_code: int, detail: object, headers: dict[str, str] | None = None):
        self.status_code = status_code
        self.detail = detail
        self.headers = headers
        super().__init__(str(detail))


def _token(user_id: int | str, role: str) -> TokenResponse:
    return TokenResponse(
        access_token=create_access_token(subject=str(user_id), role=role),
        token_type="bearer",
    )


def register_patient(user_data: UserCreate) -> TokenResponse:
    with transaction() as connection:
        if users.email_exists(connection, user_data.email):
            raise AuthError(
                HTTPStatus.CONFLICT,
                {"success": False, "data": None, "error": {"message": "Email already registered"}},
            )
        user_id = users.create_patient(
            connection,
            email=user_data.email,
            password_hash=hash_password(user_data.password),
            full_name=user_data.full_name,
            date_of_birth=user_data.date_of_birth,
            phone=user_data.phone,
            address=user_data.address,
            emergency_contact_name=user_data.emergency_contact_name,
            emergency_contact_phone=user_data.emergency_contact_phone,
            blood_group=user_data.blood_group,
        )
        token = _token(user_id, "PATIENT")
    return token


def login_user(credentials: UserLogin) -> TokenResponse:
    with transaction() as connection:
        user = users.find_for_login(connection, credentials.email)
        if not user or not verify_password(credentials.password, user["password_hash"]):
            raise AuthError(
                HTTPStatus.UNAUTHORIZED,
                {"success": False, "data": None, "error": {"message": "Invalid email or password"}},
                {"WWW-Authenticate": "Bearer"},
            )
        if not user["is_active"]:
            raise AuthError(
                HTTPStatus.FORBIDDEN,
                {"success": False, "data": None, "error": {"message": "Account is deactivated"}},
            )
        token = _token(user["user_id"], user["role_name"])
    return token


def get_current_user(user_id: str) -> UserMe:
    with transaction() as connection:
        user = users.find_by_id(connection, user_id)
        if not user:
            raise AuthError(HTTPStatus.NOT_FOUND, "User not found")
    return UserMe(**user)
