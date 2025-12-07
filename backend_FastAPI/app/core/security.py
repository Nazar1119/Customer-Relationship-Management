# app/core/security.py
from jose import jwt
from fastapi import HTTPException, status
from app.core.config import reload_settings

def verify_jwt(token: str) -> dict:
    settings = reload_settings()
    try:
        payload = jwt.decode(
            token,
            settings.jwt_public_key,
            algorithms=["RS256"],
            audience=settings.jwt_audience,
            issuer=settings.jwt_issuer,
        )
        return payload
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
