from fastapi import APIRouter, Depends, HTTPException
from typing import List
from models import ProgressCreate, ProgressResponse
from supabase_client import get_supabase, get_admin_supabase
from utils import get_access_token, handle_supabase_error


router = APIRouter(prefix="/progress", tags=["Progress"])


@router.get("/users/{user_id}", response_model=List[ProgressResponse])
async def get_user_progress(
    user_id: str,
    token: str = Depends(get_access_token)
):
    try:
        supabase = get_admin_supabase()
        response = supabase.table("user_progress") \
            .select("*") \
            .eq("user_id", user_id) \
            .execute()
        
        return response.data
    except Exception as e:
        handle_supabase_error(e, "Failed to fetch progress")


@router.post("", response_model=ProgressResponse)
async def update_lesson_progress(
    progress: ProgressCreate,
    token: str = Depends(get_access_token)
):
    """Update lesson progress. XP is calculated dynamically from completed lessons."""
    try:
        supabase = get_admin_supabase()
        
        # Check if progress exists
        existing = supabase.table("user_progress") \
            .select("*") \
            .eq("user_id", progress.user_id) \
            .eq("lesson_id", progress.lesson_id) \
            .execute()
        
        if existing.data:
            # Update existing progress
            update_data = progress.model_dump()
            del update_data["user_id"]
            del update_data["lesson_id"]
            
            response = supabase.table("user_progress") \
                .update(update_data) \
                .eq("id", existing.data[0]["id"]) \
                .execute()
            
            if not response.data:
                raise HTTPException(status_code=500, detail="Failed to update progress")
            
            return response.data[0]
        else:
            # Create new progress
            response = supabase.table("user_progress") \
                .insert(progress.model_dump()) \
                .execute()
            
            if not response.data:
                raise HTTPException(status_code=500, detail="Failed to create progress")
            
            return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        handle_supabase_error(e, "Failed to update progress")
