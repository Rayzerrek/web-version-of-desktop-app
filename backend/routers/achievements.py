"""
Achievements router.
Uses 'achievements' and 'user_achievements' tables from Supabase schema.
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from supabase_client import get_admin_supabase
from utils import get_access_token, handle_supabase_error


router = APIRouter(prefix="/achievements", tags=["Achievements"])


class Achievement(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    icon_url: Optional[str] = None
    requirement_type: str  # 'streak', 'xp', 'lessons_completed', 'course_completed'
    requirement_value: int
    badge_color: str = "#FFD700"


class UserAchievement(BaseModel):
    id: str
    achievement_id: str
    unlocked_at: str
    achievement: Optional[Achievement] = None


class UnlockResponse(BaseModel):
    newly_unlocked: List[Achievement]
    total_unlocked: int


@router.get("", response_model=List[Achievement])
async def get_all_achievements(
    token: str = Depends(get_access_token)
):
    """Get all available achievements"""
    try:
        supabase = get_admin_supabase()
        
        response = supabase.table("achievements") \
            .select("*") \
            .execute()
        
        return [Achievement(**ach) for ach in response.data]
    except Exception as e:
        handle_supabase_error(e, "Failed to fetch achievements")


@router.get("/users/{user_id}", response_model=List[Achievement])
async def get_user_achievements(
    user_id: str,
    token: str = Depends(get_access_token)
):
    """Get achievements unlocked by a specific user"""
    try:
        supabase = get_admin_supabase()
        
        # Get user achievements with achievement details
        response = supabase.table("user_achievements") \
            .select("*, achievements(*)") \
            .eq("user_id", user_id) \
            .execute()
        
        achievements = []
        for ua in response.data:
            if ua.get("achievements"):
                ach = ua["achievements"]
                achievements.append(Achievement(
                    id=ach["id"],
                    title=ach["title"],
                    description=ach.get("description"),
                    icon_url=ach.get("icon_url"),
                    requirement_type=ach["requirement_type"],
                    requirement_value=ach["requirement_value"],
                    badge_color=ach.get("badge_color", "#FFD700")
                ))
        
        return achievements
    except Exception as e:
        handle_supabase_error(e, "Failed to fetch user achievements")


@router.post("/users/{user_id}/check", response_model=UnlockResponse)
async def check_and_unlock_achievements(
    user_id: str,
    token: str = Depends(get_access_token)
):
    """Check user progress and unlock any earned achievements"""
    try:
        supabase = get_admin_supabase()
        
        # Get user profile for XP and streak
        profile_response = supabase.table("profiles") \
            .select("total_xp, streak_days") \
            .eq("id", user_id) \
            .execute()
        
        if not profile_response.data:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        profile = profile_response.data[0]
        total_xp = profile.get("total_xp", 0) or 0
        streak_days = profile.get("streak_days", 0) or 0
        
        # Get completed lessons count
        progress_response = supabase.table("user_progress") \
            .select("*", count="exact") \
            .eq("user_id", user_id) \
            .eq("status", "completed") \
            .execute()
        
        lessons_completed = progress_response.count or 0
        
        # Get currently unlocked achievement IDs
        unlocked_response = supabase.table("user_achievements") \
            .select("achievement_id") \
            .eq("user_id", user_id) \
            .execute()
        
        unlocked_ids = {ua["achievement_id"] for ua in unlocked_response.data}
        
        # Get all achievements
        all_achievements = supabase.table("achievements") \
            .select("*") \
            .execute()
        
        newly_unlocked = []
        
        for ach in all_achievements.data:
            if ach["id"] in unlocked_ids:
                continue  # Already unlocked
            
            requirement_type = ach["requirement_type"]
            requirement_value = ach["requirement_value"]
            
            should_unlock = False
            
            if requirement_type == "xp" and total_xp >= requirement_value:
                should_unlock = True
            elif requirement_type == "streak" and streak_days >= requirement_value:
                should_unlock = True
            elif requirement_type == "lessons_completed" and lessons_completed >= requirement_value:
                should_unlock = True
            # course_completed would need additional logic
            
            if should_unlock:
                # Unlock the achievement
                supabase.table("user_achievements").insert({
                    "user_id": user_id,
                    "achievement_id": ach["id"]
                }).execute()
                
                newly_unlocked.append(Achievement(
                    id=ach["id"],
                    title=ach["title"],
                    description=ach.get("description"),
                    icon_url=ach.get("icon_url"),
                    requirement_type=ach["requirement_type"],
                    requirement_value=ach["requirement_value"],
                    badge_color=ach.get("badge_color", "#FFD700")
                ))
        
        return UnlockResponse(
            newly_unlocked=newly_unlocked,
            total_unlocked=len(unlocked_ids) + len(newly_unlocked)
        )
    except HTTPException:
        raise
    except Exception as e:
        handle_supabase_error(e, "Failed to check achievements")
