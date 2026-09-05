from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, Request, Body
from sqlalchemy.orm import Session
from app.database import get_db
from app.gateway.proxy_handler import gateway_proxy

router = APIRouter(prefix="/gateway", tags=["API Gateway Proxy"])

@router.get("/{api_slug}/{subpath:path}")
async def gateway_get_proxy(
    api_slug: str,
    subpath: str,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Gateway GET Proxy: Routes request to the underlying microservice after
    verifying API Key, Rate Limits, and Quota.
    """
    return await gateway_proxy.handle_request(
        api_slug=api_slug,
        subpath=subpath,
        request=request,
        db=db,
        body=None
    )

@router.post("/{api_slug}/{subpath:path}")
async def gateway_post_proxy(
    api_slug: str,
    subpath: str,
    request: Request,
    body: Optional[Dict[str, Any]] = Body(None),
    db: Session = Depends(get_db)
):
    """
    Gateway POST Proxy: Routes payload to the underlying microservice after
    verifying API Key, Rate Limits, and Quota.
    """
    return await gateway_proxy.handle_request(
        api_slug=api_slug,
        subpath=subpath,
        request=request,
        db=db,
        body=body
    )
