from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database import engine, Base
from app.routers import auth, apis, subscriptions, gateway, analytics, admin

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="⚡ APIVault India — Developer API Marketplace & Gateway",
    description="""
## APIVault India — Enterprise Microservices & API Gateway
A high-performance Python FastAPI backend for discovering, testing, subscribing to, and consuming Indian financial, tax, postal, and utility APIs.

### Key Architecture:
* 👑 **Admin: Ashish Mohod (Nagpur)** — Central control panel, ₹ Revenue analytics & CSV audits.
* 🛡️ **API Gateway Engine** — Sliding-Window rate limiter (`429`), monthly quota meters, and cryptographic SHA-256 API Key verification.
* 🎮 **Interactive Live Playground** — In-browser Postman-style endpoint testing with real-time latency measurement.
* 🇮🇳 **Authentic Indian Data** — GSTIN tax verification, Indian Bank IFSC lookup, 6-digit Postal PIN Code directory, PAN validation, and UPI QR string generator.
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(apis.router, prefix=settings.API_V1_STR)
app.include_router(subscriptions.router, prefix=settings.API_V1_STR)
app.include_router(gateway.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health & Status"])
def root():
    return {
        "status": "ONLINE",
        "service": "APIVault India Gateway Engine",
        "admin": "Ashish Mohod (Nagpur, Maharashtra)",
        "version": settings.VERSION,
        "docs": "/docs"
    }
