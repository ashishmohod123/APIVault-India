import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.database import Base

class ApiCategory(str, enum.Enum):
    FINTECH_TAX = "Fintech & Tax"
    BANKING_PAYMENTS = "Banking & Payments"
    IDENTITY_SECURITY = "Identity & Verification"
    GEOLOCATION_POSTAL = "Postal & Geolocation"
    AI_NLP = "AI & Language Processing"
    UTILITIES_MEDIA = "Utilities & Media"

class TierType(str, enum.Enum):
    FREE = "FREE"
    PRO = "PRO"
    SCALE = "SCALE"
    ENTERPRISE = "ENTERPRISE"

class ApiService(Base):
    __tablename__ = "api_services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, unique=True)
    slug = Column(String(100), nullable=False, unique=True, index=True)
    category = Column(Enum(ApiCategory), nullable=False)
    tagline = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    version = Column(String(20), default="v1.0")
    icon_name = Column(String(50), default="Terminal")
    base_latency_ms = Column(Integer, default=28)
    uptime_pct = Column(Float, default=99.95)
    total_calls = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    endpoints = relationship("ApiEndpoint", back_populates="service", cascade="all, delete-orphan")
    pricing_tiers = relationship("PricingTier", back_populates="service", cascade="all, delete-orphan")
    subscriptions = relationship("Subscription", back_populates="service")

class ApiEndpoint(Base):
    __tablename__ = "api_endpoints"

    id = Column(Integer, primary_key=True, index=True)
    api_service_id = Column(Integer, ForeignKey("api_services.id"), nullable=False)
    path = Column(String(255), nullable=False) # e.g. /verify-calculate
    http_method = Column(String(10), default="POST") # GET, POST, PUT
    summary = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    headers_json = Column(Text, nullable=True) # JSON of required/optional headers
    query_params_json = Column(Text, nullable=True) # JSON schema
    request_body_json = Column(Text, nullable=True) # Sample body payload
    sample_response_json = Column(Text, nullable=True) # Sample return payload
    is_active = Column(Boolean, default=True)

    service = relationship("ApiService", back_populates="endpoints")

class PricingTier(Base):
    __tablename__ = "pricing_tiers"

    id = Column(Integer, primary_key=True, index=True)
    api_service_id = Column(Integer, ForeignKey("api_services.id"), nullable=False)
    tier_type = Column(Enum(TierType), nullable=False)
    name = Column(String(100), nullable=False)
    price_inr = Column(Float, default=0.0)
    request_limit_monthly = Column(Integer, nullable=False) # e.g. 250, 10000, 50000
    rate_limit_per_min = Column(Integer, default=10) # e.g. 10, 60, 150, 500
    features_json = Column(Text, nullable=True) # JSON list of bullet points

    service = relationship("ApiService", back_populates="pricing_tiers")
    subscriptions = relationship("Subscription", back_populates="pricing_tier")
