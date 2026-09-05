from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class ApiKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), default="Default Secret Key")
    key_prefix = Column(String(20), index=True, nullable=False) # e.g. vault_live_8f7a...
    hashed_key = Column(String(64), index=True, nullable=False) # SHA256 of raw key
    environment = Column(String(10), default="live") # live, test
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    last_used_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="api_keys")
    usage_logs = relationship("UsageLog", back_populates="api_key")
