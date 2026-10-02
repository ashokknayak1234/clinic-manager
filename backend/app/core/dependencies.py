from dataclasses import dataclass
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


@dataclass(frozen=True)
class Principal:
    user_id: str
    role: str


def current_principal(token: Annotated[str, Depends(oauth2_scheme)]) -> Principal:
    try:
        payload = decode_access_token(token)
        subject, role = payload.get("sub"), payload.get("role")
        if not isinstance(subject, str) or not subject or not isinstance(role, str):
            raise ValueError("Missing token claims")
        return Principal(user_id=subject, role=role)
    except (jwt.PyJWTError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired access token", headers={"WWW-Authenticate": "Bearer"}) from None


def require_roles(*roles: str):
    def dependency(principal: Annotated[Principal, Depends(current_principal)]) -> Principal:
        if principal.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return principal

    return dependency
