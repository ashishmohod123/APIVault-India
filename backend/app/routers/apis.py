from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.api_service import ApiService, ApiCategory
from app.schemas.api_service import ApiServiceResponse

router = APIRouter(prefix="/apis", tags=["API Marketplace Catalog"])

@router.get("", response_model=List[ApiServiceResponse])
def list_apis(
    search: Optional[str] = None,
    category: Optional[str] = None,
    sort_by: Optional[str] = "popular", # popular, latency, newest
    db: Session = Depends(get_db)
):
    query = db.query(ApiService).filter(ApiService.is_active == True)

    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            (ApiService.name.ilike(s)) |
            (ApiService.tagline.ilike(s)) |
            (ApiService.description.ilike(s)) |
            (ApiService.slug.ilike(s))
        )

    if category and category != "All":
        query = query.filter(ApiService.category == category)

    if sort_by == "latency":
        query = query.order_by(ApiService.base_latency_ms.asc())
    elif sort_by == "newest":
        query = query.order_by(ApiService.id.desc())
    else: # popular
        query = query.order_by(ApiService.total_calls.desc())

    services = query.all()
    return [ApiServiceResponse.model_validate(s) for s in services]

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = [c.value for c in ApiCategory]
    return {
        "categories": ["All"] + categories
    }

@router.get("/{slug}", response_model=ApiServiceResponse)
def get_api_by_slug(slug: str, db: Session = Depends(get_db)):
    service = db.query(ApiService).filter(
        ApiService.slug == slug,
        ApiService.is_active == True
    ).first()
    if not service:
        raise HTTPException(status_code=404, detail="API service not found")
    return ApiServiceResponse.model_validate(service)
