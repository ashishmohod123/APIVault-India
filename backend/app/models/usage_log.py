from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class UsageLog(Base):
    __tablename__ = "usage_logs"

    id = Column(Integer, primary_key=True, index=True)
    api_key_id = Column(Integer, ForeignKey("api_keys.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    api_service_id = Column(Integer, ForeignKey("api_services.id"), nullable=False)
    endpoint_path = Column(String(255), nullable=False)
    http_method = Column(String(10), default="POST")
    status_code = Column(Integer, default=200)
    latency_ms = Column(Integer, default=25)
    caller_ip = Column(String(50), default="127.0.0.1")
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    user = relationship("User", back_populates="usage_logs")
    api_key = relationship("ApiKey", back_populates="usage_logs")
