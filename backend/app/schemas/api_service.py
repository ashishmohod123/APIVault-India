from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from datetime import datetime
from app.models.api_service import ApiCategory, TierType

class ApiEndpointResponse(BaseModel):
    id: int
    path: str
    http_method: str
    summary: str
    description: Optional[str] = None
    headers_json: Optional[str] = None
    query_params_json: Optional[str] = None
    request_body_json: Optional[str] = None
    sample_response_json: Optional[str] = None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class PricingTierResponse(BaseModel):
    id: int
    tier_type: TierType
    name: str
    price_inr: float
    request_limit_monthly: int
    rate_limit_per_min: int
    features_json: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class ApiServiceBase(BaseModel):
    name: str
    slug: str
    category: ApiCategory
    tagline: str
    description: str
    version: Optional[str] = "v1.0"
    icon_name: Optional[str] = "Terminal"

class ApiServiceResponse(ApiServiceBase):
    id: int
    base_latency_ms: int
    uptime_pct: float
    total_calls: int
    is_featured: bool
    is_active: bool
    created_at: datetime
    endpoints: List[ApiEndpointResponse] = []
    pricing_tiers: List[PricingTierResponse] = []

    model_config = ConfigDict(from_attributes=True)
