from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.api_service import ApiService, PricingTier
from app.models.subscription import Subscription, SubscriptionStatus
from app.models.api_key import ApiKey
from app.schemas.subscription import SubscriptionCreate, SubscriptionResponse
from app.schemas.api_key import ApiKeyCreate, ApiKeyResponse, ApiKeyCreatedResponse
from app.routers.auth import get_current_user
from app.core.security import generate_api_key

router = APIRouter(prefix="/subscriptions", tags=["Developer Subscriptions & API Keys"])

@router.get("/my-subscriptions", response_model=List[SubscriptionResponse])
def get_my_subscriptions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    subs = db.query(Subscription).filter(
        Subscription.user_id == current_user.id
    ).all()
    return [SubscriptionResponse.model_validate(s) for s in subs]

@router.post("/subscribe", response_model=SubscriptionResponse)
def subscribe_to_tier(
    sub_in: SubscriptionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tier = db.query(PricingTier).filter(
        PricingTier.id == sub_in.pricing_tier_id,
        PricingTier.api_service_id == sub_in.api_service_id
    ).first()
    if not tier:
        raise HTTPException(status_code=404, detail="Pricing tier not found for this API service")

    # Check if already subscribed to this API
    sub = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.api_service_id == sub_in.api_service_id
    ).first()

    if sub:
        # Upgrade tier
        sub.pricing_tier_id = tier.id
        sub.status = SubscriptionStatus.ACTIVE
    else:
        # New subscription
        sub = Subscription(
            user_id=current_user.id,
            api_service_id=sub_in.api_service_id,
            pricing_tier_id=tier.id,
            status=SubscriptionStatus.ACTIVE,
            calls_used_this_month=0
        )
        db.add(sub)

    db.commit()
    db.refresh(sub)
    return SubscriptionResponse.model_validate(sub)

@router.get("/keys", response_model=List[ApiKeyResponse])
def list_api_keys(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    keys = db.query(ApiKey).filter(
        ApiKey.user_id == current_user.id,
        ApiKey.is_active == True
    ).order_by(ApiKey.id.desc()).all()
    return [ApiKeyResponse.model_validate(k) for k in keys]

@router.post("/keys", response_model=ApiKeyCreatedResponse)
def create_new_api_key(
    key_in: ApiKeyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    raw_key, prefix, hashed = generate_api_key(environment=key_in.environment)

    key_record = ApiKey(
        user_id=current_user.id,
        name=key_in.name,
        key_prefix=prefix,
        hashed_key=hashed,
        environment=key_in.environment,
        is_active=True
    )
    db.add(key_record)
    db.commit()
    db.refresh(key_record)

    return ApiKeyCreatedResponse(
        id=key_record.id,
        name=key_record.name,
        key_prefix=key_record.key_prefix,
        raw_api_key=raw_key,
        environment=key_record.environment,
        created_at=key_record.created_at
    )

@router.delete("/keys/{key_id}")
def revoke_api_key(
    key_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    key = db.query(ApiKey).filter(
        ApiKey.id == key_id,
        ApiKey.user_id == current_user.id
    ).first()
    if not key:
        raise HTTPException(status_code=404, detail="API Key not found")

    key.is_active = False
    db.commit()
    return {"message": "API key revoked successfully."}
