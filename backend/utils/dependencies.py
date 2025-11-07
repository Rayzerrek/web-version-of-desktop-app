"""
FastAPI dependency injection functions for authentication and authorization.
"""
from fastapi import Header, HTTPException, Depends, status
from supabase import Client
from supabase_client import get_supabase
from typing import Optional
import logging

logger = logging.getLogger(__name__)


async def get_access_token(authorization: Optional[str] = Header(None)) -> str:
    """
    Extract and validate Bearer token from Authorization header.
    
    Args:
        authorization: Authorization header value
        
    Returns:
        Extracted JWT token
        
    Raises:
        HTTPException: If authorization header is missing or invalid
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization format. Expected 'Bearer <token>'",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    token = authorization.replace("Bearer ", "").strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return token


async def get_current_user(token: str = Depends(get_access_token)):
    """
    Get current authenticated user from JWT token.
    
    Args:
        token: JWT access token
        
    Returns:
        Authenticated user object
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    try:
        supabase = get_supabase()
        user_response = supabase.auth.get_user(token)
        
        if not user_response or not user_response.user:
            logger.warning("Invalid token provided")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        return user_response.user
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Authentication failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"}
        )


async def require_admin(token: str = Depends(get_access_token)):
    """
    Require admin or super_admin role for access.
    
    Args:
        token: JWT access token
        
    Returns:
        Authenticated admin user object
        
    Raises:
        HTTPException: If user is not authenticated or lacks admin privileges
    """
    supabase = get_supabase()
    
    try:
        # Authenticate user
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        user_id = user_response.user.id
        
        # Check admin role
        profile_response = supabase.table("profiles")\
            .select("role")\
            .eq("id", user_id)\
            .execute()
        
        if not profile_response.data:
            logger.warning(f"Profile not found for user {user_id}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )
        
        role = profile_response.data[0].get("role", "")
        
        # Import here to avoid circular dependency
        from constants import ADMIN_ROLES
        
        if role not in ADMIN_ROLES:
            logger.warning(f"User {user_id} attempted admin access with role: {role}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )
        
        logger.info(f"Admin access granted to user {user_id} with role {role}")
        return user_response.user
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Authorization check failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authorization check failed"
        )
