from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from models import LessonCreate, LessonUpdate, LessonResponse
from supabase_client import get_supabase, get_admin_supabase
from utils import get_access_token, require_admin, handle_supabase_error


router = APIRouter(prefix="/lessons", tags=["Lessons"])


@router.get("/{lesson_id}", response_model=LessonResponse)
async def get_lesson_by_id(lesson_id: str):
    """Get single lesson by ID - public endpoint"""
    try:
        supabase = get_supabase()
        response = supabase.table("lessons") \
            .select("*") \
            .eq("id", lesson_id) \
            .execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail=f"Lesson {lesson_id} not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        handle_supabase_error(e, "Failed to fetch lesson")


@router.post("", response_model=LessonResponse)
async def create_lesson(
    lesson: LessonCreate,
    user = Depends(require_admin)
):
    try:
        supabase = get_admin_supabase()
        lesson_data = lesson.model_dump(by_alias=True)
        response = supabase.table("lessons").insert(lesson_data).execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create lesson")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        handle_supabase_error(e, "Failed to create lesson")


@router.put("/{lesson_id}", response_model=LessonResponse)
async def update_lesson(
    lesson_id: str,
    updates: LessonUpdate,
    user = Depends(require_admin)
):
    try:
        supabase = get_admin_supabase()
        raw_data = {k: v for k, v in updates.model_dump(by_alias=True).items() if v is not None}
        
        response = supabase.table("lessons") \
            .update(raw_data) \
            .eq("id", lesson_id) \
            .execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Lesson not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        handle_supabase_error(e, "Failed to update lesson")


@router.delete("/{lesson_id}")
async def delete_lesson(
    lesson_id: str,
    user = Depends(require_admin)
):
    try:
        supabase = get_admin_supabase()
        supabase.table("lessons").delete().eq("id", lesson_id).execute()
        return {"success": True, "message": "Lesson deleted"}
    except Exception as e:
        handle_supabase_error(e, "Failed to delete lesson")
