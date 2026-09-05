from sqlalchemy.orm import Session
from app.models.subscription import Subscription, SubscriptionStatus
from app.models.api_service import ApiService, PricingTier

class QuotaManager:
    @staticmethod
    def check_and_increment_quota(db: Session, user_id: int, api_service_id: int) -> tuple[bool, int, int]:
        """
        Verifies if the user has an active subscription for the API and remaining monthly calls.
        Returns: (is_allowed: bool, calls_used: int, max_limit: int)
        """
        sub = db.query(Subscription).filter(
            Subscription.user_id == user_id,
            Subscription.api_service_id == api_service_id,
            Subscription.status == SubscriptionStatus.ACTIVE
        ).first()

        # If user has no explicit subscription, auto-create a Free Tier subscription!
        if not sub:
            free_tier = db.query(PricingTier).filter(
                PricingTier.api_service_id == api_service_id,
                PricingTier.price_inr == 0.0
            ).first()

            if not free_tier:
                # Fallback to any lowest tier
                free_tier = db.query(PricingTier).filter(
                    PricingTier.api_service_id == api_service_id
                ).order_by(PricingTier.price_inr.asc()).first()

            if not free_tier:
                return False, 0, 0

            sub = Subscription(
                user_id=user_id,
                api_service_id=api_service_id,
                pricing_tier_id=free_tier.id,
                status=SubscriptionStatus.ACTIVE,
                calls_used_this_month=0
            )
            db.add(sub)
            db.commit()
            db.refresh(sub)

        tier = sub.pricing_tier
        if not tier:
            return False, 0, 0

        if sub.calls_used_this_month >= tier.request_limit_monthly:
            sub.status = SubscriptionStatus.EXHAUSTED
            db.commit()
            return False, sub.calls_used_this_month, tier.request_limit_monthly

        # Increment quota
        sub.calls_used_this_month += 1
        db.commit()
        return True, sub.calls_used_this_month, tier.request_limit_monthly

quota_manager = QuotaManager()
