from pydantic import BaseModel, EmailStr, field_validator, Field
from typing import Optional
from datetime import datetime
import re


class UserBase(BaseModel):
    email: EmailStr = Field(..., description="User email address")
    username: str = Field(..., min_length=3, max_length=20, description="Username")


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="User password")
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        return v
    
    @field_validator('username')
    @classmethod
    def validate_username(cls, v: str) -> str:
        
        if len(v) < 3:
            raise ValueError('Username must be at least 3 characters')
        if len(v) > 20:
            raise ValueError('Username must be at most 20 characters')
        if not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError('Username can only contain letters, numbers, and underscores')
        return v


class RegisterRequest(UserCreate):
    pass


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: str
    created_at: datetime
    onboarding_completed: Optional[bool] = False
    learning_path: Optional[str] = None
    experience_level: Optional[str] = None
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None


class AuthResponse(BaseModel):
    success: bool
    message: str
    user_id: Optional[str] = None
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
