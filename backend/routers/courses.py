"""Course management routes"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models import CourseCreate, CourseUpdate, CourseResponse
from supabase_client import get_supabase, get_admin_supabase
from utils import get_access_token, require_admin, handle_supabase_error


router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("", response_model=List[CourseResponse])
async def get_all_courses(token: str = Depends(get_access_token)):
    """Get all published courses with modules and lessons"""
    try:
        supabase = get_supabase()
        response = supabase.table("courses") \
            .select("*, modules(*, lessons(*))") \
            .eq("is_published", True) \
            .order("order_index") \
            .execute()
        
        return response.data
    except Exception as e:
        handle_supabase_error(e, "Failed to fetch courses")


@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(course_id: str, token: str = Depends(get_access_token)):
    """Get single course with modules and lessons"""
    try:
        supabase = get_supabase()
        response = supabase.table("courses") \
            .select("*, modules(*, lessons(*))") \
            .eq("id", course_id) \
            .execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Course not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        handle_supabase_error(e, "Failed to fetch course")


@router.post("", response_model=CourseResponse)
async def create_course(
    course: CourseCreate,
    user = Depends(require_admin)
):
    """Create new course (admin only)"""
    try:
        supabase = get_admin_supabase()
        response = supabase.table("courses").insert(course.model_dump()).execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create course")
        
        course_data = response.data[0]
        course_data["modules"] = []
        return course_data
    except HTTPException:
        raise
    except Exception as e:
        handle_supabase_error(e, "Failed to create course")


@router.put("/{course_id}", response_model=CourseResponse)
async def update_course(
    course_id: str,
    updates: CourseUpdate,
    user = Depends(require_admin)
):
    """Update course (admin only)"""
    try:
        supabase = get_admin_supabase()
        update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
        
        response = supabase.table("courses") \
            .update(update_data) \
            .eq("id", course_id) \
            .execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Course not found")
        
        # Fetch full course with relations
        full_response = supabase.table("courses") \
            .select("*, modules(*, lessons(*))") \
            .eq("id", course_id) \
            .execute()
        
        return full_response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        handle_supabase_error(e, "Failed to update course")


@router.delete("/{course_id}")
async def delete_course(
    course_id: str,
    user = Depends(require_admin)
):
    """Delete course (admin only)"""
    try:
        supabase = get_admin_supabase()
        supabase.table("courses").delete().eq("id", course_id).execute()
        return {"success": True, "message": "Course deleted"}
    except Exception as e:
        handle_supabase_error(e, "Failed to delete course")
