from supabase import create_client, Client
from config import settings
from typing import Optional
import logging

logger = logging.getLogger(__name__)


# IMPORTANT: Create new client instances per request to avoid session leaking
# between different users. Each client should be isolated.

def get_supabase() -> Client:
    """
    Creates a NEW Supabase client instance for each request.
    This prevents session state from being shared between different users.
    """
    return create_client(
        settings.supabase_url,
        settings.supabase_anon_key
    )


def get_admin_supabase() -> Client:
    """
    Creates a NEW Supabase admin client instance for each request.
    Uses service key for elevated permissions.
    """
    key = settings.supabase_service_key or settings.supabase_anon_key
    
    if not settings.supabase_service_key:
        logger.warning(
            "SUPABASE_SERVICE_KEY not set, using anonymous key for admin client. "
            "This may result in permission issues."
        )
    
    return create_client(
        settings.supabase_url,
        key
    )

