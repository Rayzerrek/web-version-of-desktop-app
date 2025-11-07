"""
Centralized error handling utilities for the application.
"""
from fastapi import HTTPException, status
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)


class APIError(Exception):
    """Base class for API errors"""
    def __init__(self, message: str, status_code: int = 500, details: Optional[str] = None):
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(self.message)


class DatabaseError(APIError):
    """Database operation errors"""
    def __init__(self, message: str = "Database operation failed", details: Optional[str] = None):
        super().__init__(message, status.HTTP_500_INTERNAL_SERVER_ERROR, details)


class ResourceNotFoundError(APIError):
    """Resource not found errors"""
    def __init__(self, resource: str = "Resource"):
        super().__init__(f"{resource} not found", status.HTTP_404_NOT_FOUND)


class ResourceConflictError(APIError):
    """Resource conflict errors (e.g., duplicate key)"""
    def __init__(self, message: str = "Resource already exists"):
        super().__init__(message, status.HTTP_409_CONFLICT)


def handle_supabase_error(
    e: Exception,
    default_message: str = "Database operation failed"
) -> None:
    """
    Handle Supabase database errors and convert them to appropriate HTTP exceptions.
    
    Args:
        e: The exception raised by Supabase
        default_message: Default error message if specific error not matched
        
    Raises:
        HTTPException: With appropriate status code and message
    """
    error_msg = str(e).lower()
    
    # Log the original error for debugging
    logger.error(f"Supabase error: {str(e)}", exc_info=True)
    
    # Map database errors to HTTP status codes
    if "duplicate key" in error_msg or "unique constraint" in error_msg:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Resource already exists. Please check for duplicates."
        )
    elif "not found" in error_msg or "no rows" in error_msg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )
    elif "foreign key" in error_msg:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reference to related resource"
        )
    elif "permission" in error_msg or "unauthorized" in error_msg:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied"
        )
    elif "timeout" in error_msg:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Database operation timed out"
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=default_message
        )


def create_success_response(
    message: str,
    data: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Create standardized success response.
    
    Args:
        message: Success message
        data: Optional additional data to include
        
    Returns:
        Standardized success response dictionary
    """
    response = {
        "success": True,
        "message": message
    }
    if data:
        response.update(data)
    return response


def create_error_response(
    message: str,
    details: Optional[str] = None
) -> Dict[str, Any]:
    """
    Create standardized error response.
    
    Args:
        message: Error message
        details: Optional error details
        
    Returns:
        Standardized error response dictionary
    """
    response = {
        "success": False,
        "message": message
    }
    if details:
        response["details"] = details
    return response
