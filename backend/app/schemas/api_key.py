from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ApiKeyCreate(BaseModel):
    name: str = "Production API Key"
    environment: str = "live"

class ApiKeyCreatedResponse(BaseModel):
    id: int
    name: str
    key_prefix: str
    raw_api_key: str # Returned ONLY on creation!
    environment: str
    created_at: datetime

class ApiKeyResponse(BaseModel):
    id: int
    name: str
    key_prefix: str
    environment: str
    is_active: bool
    created_at: datetime
    last_used_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
