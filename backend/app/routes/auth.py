from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr

from app.core.security import hash_password, verify_password, create_access_token
from app.core.dependencies import current_principal
from app.core.database import transaction
from app.schemas.auth import UserCreate, UserLogin, TokenResponse, UserMe

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate):
    """Register a new patient account. Only PATIENT role allowed for public registration."""
    with transaction() as conn:
        with conn.cursor() as cur:
            # Check if email already exists
            cur.execute("SELECT user_id FROM users WHERE email = %s", (user_data.email,))
            if cur.fetchone():
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail={"success": False, "data": None, "error": {"message": "Email already registered"}}
                )

            # Hash password
            password_hash = hash_password(user_data.password)

            # Insert user with PATIENT role (role_id = 4)
            cur.execute(
                """INSERT INTO users (role_id, email, password_hash, is_active)
                   VALUES (4, %s, %s, TRUE)""",
                (user_data.email, password_hash)
            )
            user_id = cur.lastrowid

            # Create patient profile
            cur.execute(
                """INSERT INTO patients (user_id, full_name, date_of_birth, phone, address,
                   emergency_contact_name, emergency_contact_phone, blood_group)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                (user_id, user_data.full_name, user_data.date_of_birth, user_data.phone,
                 user_data.address, user_data.emergency_contact_name,
                 user_data.emergency_contact_phone, user_data.blood_group)
            )

            # Create access token
            access_token = create_access_token(subject=str(user_id), role="PATIENT")

    return TokenResponse(access_token=access_token, token_type="bearer")


@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin):
    """Login with email and password. Returns JWT access token."""
    with transaction() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """SELECT u.user_id, u.email, u.password_hash, u.is_active, r.role_name
                   FROM users u JOIN roles r ON u.role_id = r.role_id
                   WHERE u.email = %s""",
                (credentials.email,)
            )
            user = cur.fetchone()

            if not user or not verify_password(credentials.password, user["password_hash"]):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail={"success": False, "data": None, "error": {"message": "Invalid email or password"}},
                    headers={"WWW-Authenticate": "Bearer"}
                )

            if not user["is_active"]:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail={"success": False, "data": None, "error": {"message": "Account is deactivated"}}
                )

            access_token = create_access_token(subject=str(user["user_id"]), role=user["role_name"])

    return TokenResponse(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserMe)
def get_me(principal=Depends(current_principal)):
    """Get current authenticated user info."""
    with transaction() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """SELECT u.user_id, u.email, r.role_name as role, u.is_active
                   FROM users u JOIN roles r ON u.role_id = r.role_id
                   WHERE u.user_id = %s""",
                (principal.user_id,)
            )
            user = cur.fetchone()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
    return UserMe(**user)