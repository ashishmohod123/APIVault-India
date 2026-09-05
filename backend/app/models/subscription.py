import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.database import Base

class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    EXHAUSTED = "EXHAUSTED"
    CANCELLED = "CANCELLED"

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    api_service_id = Column(Integer, ForeignKey("api_services.id"), nullable=False)
    pricing_tier_id = Column(Integer, ForeignKey("pricing_tiers.id"), nullable=False)
    status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.ACTIVE)
    calls_used_this_month = Column(Integer, default=0)
    current_period_start = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    current_period_end = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="subscriptions")
    service = relationship("ApiService", back_populates="subscriptions")
    pricing_tier = relationship("PricingTier", back_populates="subscriptions")
