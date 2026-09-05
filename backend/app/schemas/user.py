from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    organization: Optional[str] = "Independent Developer"
    location_city: Optional[str] = "Nagpur"
    country: Optional[str] = "India"

class UserCreate(UserBase):
    password: str
    role: Optional[UserRole] = UserRole.DEVELOPER

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
