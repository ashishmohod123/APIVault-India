from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class UsageLogResponse(BaseModel):
    id: int
    api_service_id: int
    endpoint_path: str
    http_method: str
    status_code: int
    latency_ms: int
    caller_ip: str
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)
