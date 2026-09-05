from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.subscription import SubscriptionStatus
from app.schemas.api_service import ApiServiceResponse, PricingTierResponse

class SubscriptionCreate(BaseModel):
    api_service_id: int
    pricing_tier_id: int

class SubscriptionResponse(BaseModel):
    id: int
    user_id: int
    api_service_id: int
    pricing_tier_id: int
    status: SubscriptionStatus
    calls_used_this_month: int
    current_period_start: datetime
    current_period_end: Optional[datetime] = None
    created_at: datetime
    service: Optional[ApiServiceResponse] = None
    pricing_tier: Optional[PricingTierResponse] = None

    model_config = ConfigDict(from_attributes=True)
