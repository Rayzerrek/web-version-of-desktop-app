from fastapi import APIRouter, HTTPException, Depends
from models import UserLogin, RegisterRequest, AuthResponse
from supabase_client import get_supabase
from utils import create_auth_response, require_admin, get_access_token


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=AuthResponse)
async def login_user(request: UserLogin):
    try:
        supabase = get_supabase()
        response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })

        if response.user:
            return create_auth_response(
                success=True,
                message="Zalogowano pomyślnie",
                user=response.user,
                session=response.session
            )
        else:
            return create_auth_response(
                success=False,
                message="Błąd logowania"
            )
    except Exception as e:
        return create_auth_response(
            success=False,
            message="Nieprawidłowy email lub hasło"
        )


@router.post("/register", response_model=AuthResponse)
async def register_user(request: RegisterRequest):
    try:
        supabase = get_supabase()
        response = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password,
            "options": {
                "data": {
                    "username": request.username
                }
            }
        })

        if response.user:
            message = f"Konto {request.username} zostało utworzone pomyślnie"
            if response.user.confirmation_sent_at:
                message = f"Konto {request.username} zostało utworzone! Sprawdź swojego maila i potwierdź adres email"
            
            return create_auth_response(
                success=True,
                message=message,
                user=response.user,
                session=response.session
            )
        else:
            return create_auth_response(
                success=False,
                message="Błąd rejestracji"
            )
    except Exception as e:
        error_msg = str(e).lower()
        if "already registered" in error_msg or "already exists" in error_msg:
            message = "Ten email jest już zarejestrowany"
        else:
            message = "Błąd rejestracji. Spróbuj ponownie."
        
        return create_auth_response(
            success=False,
            message=message
        )


@router.get("/google")
async def google_sign_in():
    from config import settings
    try:
        url = f"{settings.supabase_url}/auth/v1/authorize?provider=google"
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/check_admin")
async def check_is_admin(token: str = Depends(get_access_token)):
    from supabase_client import get_supabase
    from constants import ADMIN_ROLES
    import logging
    
    logger = logging.getLogger(__name__)
    supabase = get_supabase()
    
    try:
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            return {"isAdmin": False}
        
        user_id = user_response.user.id
        profile_response = supabase.table("profiles")\
            .select("role")\
            .eq("id", user_id)\
            .execute()
        
        if not profile_response.data:
            return {"isAdmin": False}
        
        role = profile_response.data[0].get("role", "")
        return {"isAdmin": role in ADMIN_ROLES}
        
    except Exception as e:
        logger.error(f"Error checking admin status: {str(e)}")
        return {"isAdmin": False}
