"""
User profile and statistics router.
Uses 'profiles' table from Supabase schema.
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from supabase_client import get_admin_supabase
from utils import get_access_token, handle_supabase_error


router = APIRouter(prefix="/users", tags=["Users"])


class UserProfile(BaseModel):
    id: str
    email: str
    username: Optional[str] = None
    avatar_url: Optional[str] = None
    total_xp: int = 0
    level: int = 1
    current_streak_days: int = 0
    longest_streak_days: int = 0
    joined_at: Optional[str] = None
    role: str = "user"


class UserStatistics(BaseModel):
    total_lessons_completed: int = 0
    total_courses_completed: int = 0
    total_minutes_spent: int = 0
    average_score: float = 0.0
    lessons_this_week: int = 0


class UpdateAvatarRequest(BaseModel):
    avatar_url: str


class UpdateUsernameRequest(BaseModel):
    username: str


def calculate_level(total_xp: int) -> int:
    """Calculate level based on total XP (1000 XP per level)"""
    return max(1, (total_xp // 1000) + 1)


@router.get("/{user_id}/profile", response_model=UserProfile)
async def get_user_profile(
    user_id: str,
    token: str = Depends(get_access_token)
):
    """Get user profile with XP, level, and streak data from profiles table"""
    try:
        supabase = get_admin_supabase()
        
        user_response = supabase.auth.admin.get_user_by_id(user_id)
        
        if not user_response or not user_response.user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user = user_response.user
        
        profile_response = supabase.table("profiles") \
            .select("*") \
            .eq("id", user_id) \
            .execute()
        
        if not profile_response.data:
            profile_data = {
                "id": user_id,
                "username": user.email.split("@")[0] if user.email else "User",
                "total_xp": 0,
                "streak_days": 0
            }
            supabase.table("profiles").insert(profile_data).execute()
            profile = profile_data
        else:
            profile = profile_response.data[0]
        
        total_xp = profile.get("total_xp", 0) or 0
        streak_days = profile.get("streak_days", 0) or 0
        
        return UserProfile(
            id=user_id,
            email=user.email or "",
            username=profile.get("username"),
            avatar_url=profile.get("avatar_url"),
            total_xp=total_xp,
            level=calculate_level(total_xp),
            current_streak_days=streak_days,
            longest_streak_days=streak_days,  # Could be tracked separately if needed
            joined_at=str(user.created_at) if user.created_at else None,
            role=profile.get("role", "user")
        )
    except HTTPException:
        raise
    except Exception as e:
        handle_supabase_error(e, "Failed to fetch user profile")


@router.get("/{user_id}/statistics", response_model=UserStatistics)
async def get_user_statistics(
    user_id: str,
    token: str = Depends(get_access_token)
):
    """Get user learning statistics from user_progress and daily_activity"""
    try:
        supabase = get_admin_supabase()
        
        lessons_response = supabase.table("user_progress") \
            .select("*", count="exact") \
            .eq("user_id", user_id) \
            .eq("status", "completed") \
            .execute()
        
        total_lessons = lessons_response.count or 0
        
        total_time_seconds = 0
        total_score = 0
        score_count = 0
        
        if lessons_response.data:
            for progress in lessons_response.data:
                total_time_seconds += progress.get("time_spent_seconds", 0) or 0
                if progress.get("score") is not None:
                    total_score += progress.get("score", 0)
                    score_count += 1
        
        activity_response = supabase.table("daily_activity") \
            .select("time_spent_seconds") \
            .eq("user_id", user_id) \
            .execute()
        
        if activity_response.data:
            for activity in activity_response.data:
                total_time_seconds += activity.get("time_spent_seconds", 0) or 0
        
        average_score = (total_score / score_count) if score_count > 0 else 0.0
        
        return UserStatistics(
            total_lessons_completed=total_lessons,
            total_courses_completed=0,  
            total_minutes_spent=total_time_seconds // 60,
            average_score=average_score,
            lessons_this_week=0  
        )
    except Exception as e:
        handle_supabase_error(e, "Failed to fetch user statistics")


@router.put("/{user_id}/avatar")
async def update_user_avatar(
    user_id: str,
    request: UpdateAvatarRequest,
    token: str = Depends(get_access_token)
):
    """Update user avatar URL in profiles table"""
    try:
        supabase = get_admin_supabase()
        
        existing = supabase.table("profiles") \
            .select("*") \
            .eq("id", user_id) \
            .execute()
        
        if existing.data:
            supabase.table("profiles") \
                .update({"avatar_url": request.avatar_url, "updated_at": "now()"}) \
                .eq("id", user_id) \
                .execute()
        else:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        return {"success": True, "message": "Avatar updated"}
    except HTTPException:
        raise
    except Exception as e:
        handle_supabase_error(e, "Failed to update avatar")


@router.put("/{user_id}/username")
async def update_user_username(
    user_id: str,
    request: UpdateUsernameRequest,
    token: str = Depends(get_access_token)
):
    """Update user username in profiles table"""
    try:
        supabase = get_admin_supabase()
        
        existing = supabase.table("profiles") \
            .select("*") \
            .eq("id", user_id) \
            .execute()
        
        if existing.data:
            supabase.table("profiles") \
                .update({"username": request.username, "updated_at": "now()"}) \
                .eq("id", user_id) \
                .execute()
        else:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        return {"success": True, "message": "Username updated"}
    except HTTPException:
        raise
    except Exception as e:
        handle_supabase_error(e, "Failed to update username")
