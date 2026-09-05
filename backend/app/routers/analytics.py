from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime, timedelta, timezone
from app.database import get_db
from app.models.user import User
from app.models.usage_log import UsageLog
from app.models.subscription import Subscription
from app.models.api_service import ApiService
from app.schemas.usage_log import UsageLogResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["Developer Usage & Call Analytics"])

@router.get("/developer-summary")
def get_developer_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total_calls = db.query(UsageLog).filter(UsageLog.user_id == current_user.id).count()

    # Calculate average latency for this developer
    avg_latency = db.query(func.avg(UsageLog.latency_ms)).filter(
        UsageLog.user_id == current_user.id
    ).scalar() or 24.5

    # Success rate
    success_count = db.query(UsageLog).filter(
        UsageLog.user_id == current_user.id,
        UsageLog.status_code == 200
    ).count()
    success_rate_pct = round((success_count / total_calls * 100), 1) if total_calls > 0 else 100.0

    # Active subscriptions
    subs = db.query(Subscription).filter(Subscription.user_id == current_user.id).all()
    total_quota_allocated = sum(s.pricing_tier.request_limit_monthly for s in subs if s.pricing_tier)
    total_quota_consumed = sum(s.calls_used_this_month for s in subs)

    # Recent 10 logs
    recent_logs = db.query(UsageLog).filter(
        UsageLog.user_id == current_user.id
    ).order_by(UsageLog.id.desc()).limit(15).all()

    return {
        "developer_name": current_user.full_name,
        "total_calls": total_calls,
        "avg_latency_ms": round(float(avg_latency), 1),
        "success_rate_pct": success_rate_pct,
        "total_quota_allocated": total_quota_allocated or 250,
        "total_quota_consumed": total_quota_consumed,
        "quota_percentage": round((total_quota_consumed / max(1, total_quota_allocated) * 100), 1),
        "recent_logs": [
            {
                "id": l.id,
                "endpoint_path": l.endpoint_path,
                "http_method": l.http_method,
                "status_code": l.status_code,
                "latency_ms": l.latency_ms,
                "timestamp": l.timestamp
            }
            for l in recent_logs
        ]
    }
