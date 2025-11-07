"""
Supabase client initialization and management.
Implements singleton pattern for efficient connection reuse.
"""
from supabase import create_client, Client
from config import settings
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class SupabaseClientSingleton:
    """
    Singleton manager for Supabase client instances.
    
    Maintains separate instances for regular and admin access.
    """
    _instance: Optional[Client] = None
    _admin_instance: Optional[Client] = None
    _lock = False  # Simple lock to prevent race conditions

    @classmethod
    def get_client(cls) -> Client:
        """
        Get or create the regular Supabase client instance.
        
        Returns:
            Supabase client with anonymous key access
        """
        if cls._instance is None:
            if not cls._lock:
                cls._lock = True
                try:
                    logger.info("Initializing Supabase client...")
                    cls._instance = create_client(
                        settings.supabase_url,
                        settings.supabase_anon_key
                    )
                    logger.info("Supabase client initialized successfully")
                finally:
                    cls._lock = False
        return cls._instance

    @classmethod
    def get_admin_client(cls) -> Client:
        """
        Get or create the admin Supabase client instance.
        
        Uses service key if available, otherwise falls back to anonymous key.
        
        Returns:
            Supabase client with admin access
        """
        if cls._admin_instance is None:
            if not cls._lock:
                cls._lock = True
                try:
                    key = settings.supabase_service_key or settings.supabase_anon_key
                    
                    if not settings.supabase_service_key:
                        logger.warning(
                            "SUPABASE_SERVICE_KEY not set, using anonymous key for admin client. "
                            "This may result in permission issues."
                        )
                    
                    logger.info("Initializing Supabase admin client...")
                    cls._admin_instance = create_client(
                        settings.supabase_url,
                        key
                    )
                    logger.info("Supabase admin client initialized successfully")
                finally:
                    cls._lock = False
        return cls._admin_instance
    
    @classmethod
    def close_connections(cls) -> None:
        """Close all Supabase connections (for cleanup)"""
        if cls._instance:
            logger.info("Closing Supabase client connection")
            cls._instance = None
        
        if cls._admin_instance:
            logger.info("Closing Supabase admin client connection")
            cls._admin_instance = None


def get_supabase() -> Client:
    """
    Get the regular Supabase client instance.
    
    Convenience function for dependency injection.
    
    Returns:
        Supabase client instance
    """
    return SupabaseClientSingleton.get_client()


def get_admin_supabase() -> Client:
    """
    Get the admin Supabase client instance.
    
    Convenience function for dependency injection.
    
    Returns:
        Supabase admin client instance
    """
    return SupabaseClientSingleton.get_admin_client()

