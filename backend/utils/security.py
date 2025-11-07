"""Security utilities"""
from models import AuthResponse


def create_auth_response(
    success: bool,
    message: str,
    user=None,
    session=None
) -> AuthResponse:
    return AuthResponse(
        success=success,
        message=message,
        user_id=user.id if user else None,
        access_token=session.access_token if session else None,
        refresh_token=session.refresh_token if session else None
    )
