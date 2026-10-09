from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies.auth import current_principal
from app.schemas.auth import TokenResponse, UserCreate, UserLogin, UserMe
from app.services.auth import AuthError, get_current_user, login_user, register_patient

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate):
    """Register a new patient account. Only PATIENT role allowed for public registration."""
    try:
        return register_patient(user_data)
    except AuthError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail, headers=exc.headers) from None


@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin):
    """Login with email and password. Returns JWT access token."""
    try:
        return login_user(credentials)
    except AuthError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail, headers=exc.headers) from None


@router.get("/me", response_model=UserMe)
def get_me(principal=Depends(current_principal)):
    """Get current authenticated user info."""
    try:
        return get_current_user(principal.user_id)
    except AuthError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail, headers=exc.headers) from None
