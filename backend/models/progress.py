from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime


class ProgressStatus(BaseModel):
    status: Literal["not_started", "in_progress", "completed"]


class ProgressBase(BaseModel):
    user_id: str
    lesson_id: str
    status: Literal["not_started", "in_progress", "completed"]
    score: Optional[int] = None
    attempts: int = 0
    time_spent_seconds: Optional[int] = None


class ProgressCreate(ProgressBase):
    pass


class ProgressUpdate(BaseModel):
    status: Optional[Literal["not_started", "in_progress", "completed"]] = None
    score: Optional[int] = None
    attempts: Optional[int] = None
    time_spent_seconds: Optional[int] = None


class ProgressResponse(ProgressBase):
    id: str
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
