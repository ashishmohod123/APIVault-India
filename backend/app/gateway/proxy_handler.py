import time
from typing import Dict, Any, Optional
from fastapi import Request, HTTPException, status
from sqlalchemy.orm import Session
from app.core.security import hash_api_key
from app.models.api_key import ApiKey
from app.models.api_service import ApiService, PricingTier
from app.models.subscription import Subscription, SubscriptionStatus
from app.models.usage_log import UsageLog
from app.gateway.rate_limiter import rate_limiter
from app.gateway.quota_manager import quota_manager
from app.services.mock_indian_apis import IndianMicroservicesEngine

class GatewayProxyHandler:
    @staticmethod
    async def handle_request(
        api_slug: str,
        subpath: str,
        request: Request,
        db: Session,
        body: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        start_time = time.time()

        # 1. Extract API Key from Headers or Query params
        raw_key = request.headers.get("X-APIVault-Key") or request.query_params.get("api_key")
        if not raw_key:
            auth_header = request.headers.get("Authorization", "")
            if auth_header.startswith("Bearer "):
                raw_key = auth_header.split(" ")[1]

        if not raw_key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing API Key. Pass 'X-APIVault-Key: vault_live_...' in headers or '?api_key=' in query."
            )

        # 2. Validate API Key Hash
        key_hash = hash_api_key(raw_key)
        api_key_record = db.query(ApiKey).filter(
            ApiKey.hashed_key == key_hash,
            ApiKey.is_active == True
        ).first()

        if not api_key_record:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid or deactivated API Key."
            )

        # 3. Find the Target API Service
        service = db.query(ApiService).filter(
            ApiService.slug == api_slug,
            ApiService.is_active == True
        ).first()

        if not service:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"API service '{api_slug}' not found in APIVault India catalog."
            )

        # 4. Get User Subscription & Rate Limits
        user_id = api_key_record.user_id
        sub = db.query(Subscription).filter(
            Subscription.user_id == user_id,
            Subscription.api_service_id == service.id,
            Subscription.status == SubscriptionStatus.ACTIVE
        ).first()

        rate_limit_per_min = sub.pricing_tier.rate_limit_per_min if sub and sub.pricing_tier else 10

        # 5. Sliding-Window Rate Limit Check
        is_limited, retry_after = rate_limiter.is_rate_limited(key_hash, rate_limit_per_min)
        if is_limited:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded ({rate_limit_per_min} req/min for your tier). Retry in {retry_after} seconds.",
                headers={"Retry-After": str(retry_after)}
            )

        # 6. Monthly Quota Check & Increment
        allowed, used_calls, max_limit = quota_manager.check_and_increment_quota(db, user_id, service.id)
        if not allowed:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail=f"Monthly call quota exhausted ({used_calls}/{max_limit}). Please upgrade your tier in APIVault Console."
            )

        # 7. Execute Target Microservice
        method = request.method
        payload = body or {}
        params = dict(request.query_params)
        full_endpoint_path = f"/{subpath}".replace("//", "/")

        try:
            if api_slug == "india-gst":
                result = IndianMicroservicesEngine.execute_gst_service(full_endpoint_path, method, payload, params)
            elif api_slug == "india-banking":
                result = IndianMicroservicesEngine.execute_ifsc_service(full_endpoint_path, method, payload, params)
            elif api_slug == "india-postal":
                result = IndianMicroservicesEngine.execute_postal_service(full_endpoint_path, method, payload, params)
            elif api_slug == "india-identity":
                result = IndianMicroservicesEngine.execute_pan_service(full_endpoint_path, method, payload, params)
            elif api_slug == "india-upi":
                result = IndianMicroservicesEngine.execute_upi_service(full_endpoint_path, method, payload, params)
            elif api_slug == "india-nlp":
                result = IndianMicroservicesEngine.execute_sentiment_service(full_endpoint_path, method, payload, params)
            else:
                result = {"status": "SUCCESS", "message": f"Processed via APIVault Gateway: {api_slug}"}
            status_code = 200
        except Exception as e:
            result = {"status": "ERROR", "message": str(e)}
            status_code = 500

        latency_ms = max(5, int((time.time() - start_time) * 1000))

        # 8. Log Call to UsageLog Table & Update Counter
        try:
            log_entry = UsageLog(
                api_key_id=api_key_record.id,
                user_id=user_id,
                api_service_id=service.id,
                endpoint_path=full_endpoint_path,
                http_method=method,
                status_code=status_code,
                latency_ms=latency_ms,
                caller_ip=request.client.host if request.client else "127.0.0.1"
            )
            db.add(log_entry)
            service.total_calls += 1
            db.commit()
        except Exception:
            db.rollback()

        return {
            "data": result,
            "_gateway_meta": {
                "service": service.name,
                "version": service.version,
                "latency_ms": latency_ms,
                "monthly_quota_used": used_calls,
                "monthly_quota_total": max_limit,
                "rate_limit_per_min": rate_limit_per_min,
                "authenticated_developer": api_key_record.name
            }
        }

gateway_proxy = GatewayProxyHandler()
