import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from app.database import Base

class UserRole(str, enum.Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    DEVELOPER = "DEVELOPER"
    PROVIDER = "PROVIDER"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.DEVELOPER, nullable=False)
    organization = Column(String(150), nullable=True, default="Independent Developer")
    location_city = Column(String(100), default="Nagpur")
    country = Column(String(50), default="India")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    api_keys = relationship("ApiKey", back_populates="user", cascade="all, delete-orphan")
    subscriptions = relationship("Subscription", back_populates="user", cascade="all, delete-orphan")
    usage_logs = relationship("UsageLog", back_populates="user")
