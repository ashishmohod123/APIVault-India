import json
import random
from datetime import datetime, timezone, timedelta
from app.database import SessionLocal, engine, Base
from app.models.user import User, UserRole
from app.models.api_service import ApiService, ApiEndpoint, PricingTier, ApiCategory, TierType
from app.models.subscription import Subscription, SubscriptionStatus
from app.models.api_key import ApiKey
from app.models.usage_log import UsageLog
from app.core.security import hash_password, hash_api_key

def seed_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("[+] Seeding APIVault India with Admin Ashish and 6 authentic Indian microservices...")

        pwd = hash_password("password123")

        # 1. Users: Admin Ashish + Demo Developers
        admin_ashish = User(
            full_name="Ashish Mohod",
            email="ashish@apivault.in",
            hashed_password=pwd,
            role=UserRole.SUPER_ADMIN,
            organization="APIVault India Central Administration",
            location_city="Nagpur",
            country="India",
            is_active=True
        )

        dev_amit = User(
            full_name="Amit Sharma",
            email="amit@paybharat.tech",
            hashed_password=pwd,
            role=UserRole.DEVELOPER,
            organization="PayBharat Fintech Labs",
            location_city="Pune",
            country="India",
            is_active=True
        )

        dev_priya = User(
            full_name="Priya Nair",
            email="priya@indicai.in",
            hashed_password=pwd,
            role=UserRole.DEVELOPER,
            organization="IndicAI Research",
            location_city="Bengaluru",
            country="India",
            is_active=True
        )

        db.add_all([admin_ashish, dev_amit, dev_priya])
        db.commit()
        db.refresh(admin_ashish)
        db.refresh(dev_amit)
        db.refresh(dev_priya)

        # 2. Pre-generate API Keys for Admin Ashish and Amit
        ashish_raw_key = "vault_live_ashish_998271049102"
        ashish_key = ApiKey(
            user_id=admin_ashish.id,
            name="Ashish Master Production Key",
            key_prefix=ashish_raw_key[:18],
            hashed_key=hash_api_key(ashish_raw_key),
            environment="live",
            is_active=True
        )

        amit_raw_key = "vault_live_amit_771829048192"
        amit_key = ApiKey(
            user_id=dev_amit.id,
            name="PayBharat Default Secret Key",
            key_prefix=amit_raw_key[:18],
            hashed_key=hash_api_key(amit_raw_key),
            environment="live",
            is_active=True
        )

        db.add_all([ashish_key, amit_key])
        db.commit()

        # 3. Create 6 Authentic Indian Microservices
        apis_data = [
            {
                "name": "India GSTIN Verification & Tax Calculator API",
                "slug": "india-gst",
                "category": ApiCategory.FINTECH_TAX,
                "tagline": "Real-time GSTIN validation, State Code extraction, and CGST/SGST/IGST calculation.",
                "description": "Enterprise API for verifying 15-digit Goods and Services Tax Identification Numbers (GSTIN) across all Indian states, checking format integrity, and calculating split tax liabilities.",
                "version": "v2.1",
                "icon_name": "Receipt",
                "base_latency_ms": 18,
                "uptime_pct": 99.98,
                "total_calls": 5420,
                "is_featured": True,
                "endpoints": [
                    {
                        "path": "/verify-calculate",
                        "http_method": "POST",
                        "summary": "Verify GSTIN & Compute Split Taxes",
                        "description": "Takes a GSTIN, invoice amount, and supplier state to compute CGST, SGST, or IGST tax amounts.",
                        "headers_json": json.dumps({"X-APIVault-Key": "vault_live_..."}),
                        "query_params_json": json.dumps({"tax_rate_pct": "18.0"}),
                        "request_body_json": json.dumps({
                            "gstin": "27AAPCA1234F1Z5",
                            "invoice_amount": 25000.0,
                            "supplier_state_code": "27",
                            "tax_rate_pct": 18.0
                        }),
                        "sample_response_json": json.dumps({
                            "status": "SUCCESS",
                            "gstin_input": "27AAPCA1234F1Z5",
                            "is_valid_format": True,
                            "registered_state": "Maharashtra",
                            "state_code": "27",
                            "taxation_mode": "INTRA_STATE (CGST + SGST)",
                            "base_amount": 25000.0,
                            "tax_breakup": {
                                "cgst_inr": 2250.0,
                                "sgst_inr": 2250.0,
                                "igst_inr": 0.0,
                                "total_tax_inr": 4500.0
                            },
                            "total_invoice_inr": 29500.0
                        })
                    }
                ],
                "pricing": [
                    {"type": TierType.FREE, "name": "Free Sandbox", "price": 0.0, "monthly_limit": 250, "rate_limit": 10, "features": ["250 calls/month", "Community support", "10 req/min limit"]},
                    {"type": TierType.PRO, "name": "Fintech Pro", "price": 499.0, "monthly_limit": 10000, "rate_limit": 60, "features": ["10,000 calls/month", "Email support", "60 req/min limit", "HSN code lookups"]},
                    {"type": TierType.SCALE, "name": "Startup Scale", "price": 1499.0, "monthly_limit": 50000, "rate_limit": 150, "features": ["50,000 calls/month", "Priority 24/7 SLA", "150 req/min limit", "Webhooks"]},
                    {"type": TierType.ENTERPRISE, "name": "Enterprise High-Volume", "price": 4999.0, "monthly_limit": 250000, "rate_limit": 500, "features": ["250,000 calls/month", "Dedicated Account Manager", "Unlimited bursts"]}
                ]
            },
            {
                "name": "Indian Bank IFSC & Branch Directory API",
                "slug": "india-banking",
                "category": ApiCategory.BANKING_PAYMENTS,
                "tagline": "Instant lookup of 150,000+ Indian bank branches with RTGS, NEFT & UPI support.",
                "description": "High-availability financial directory API providing authentic bank name, branch address, MICR code, city, and digital payment mode support for any 11-digit IFSC code.",
                "version": "v1.4",
                "icon_name": "Landmark",
                "base_latency_ms": 14,
                "uptime_pct": 99.99,
                "total_calls": 8920,
                "is_featured": True,
                "endpoints": [
                    {
                        "path": "/ifsc/{code}",
                        "http_method": "GET",
                        "summary": "Lookup Branch Details by IFSC Code",
                        "description": "Returns full bank profile, branch address, MICR, and digital payment settlement flags.",
                        "headers_json": json.dumps({"X-APIVault-Key": "vault_live_..."}),
                        "query_params_json": json.dumps({"code": "SBIN0000432"}),
                        "request_body_json": json.dumps({}),
                        "sample_response_json": json.dumps({
                            "status": "SUCCESS",
                            "ifsc_code": "SBIN0000432",
                            "is_valid": True,
                            "bank_details": {
                                "bank": "State Bank of India",
                                "branch": "Nagpur Main Branch",
                                "address": "Kingsway, Station Road, Nagpur, Maharashtra - 440001",
                                "city": "Nagpur",
                                "state": "Maharashtra",
                                "rtgs": True,
                                "neft": True,
                                "upi": True
                            }
                        })
                    }
                ],
                "pricing": [
                    {"type": TierType.FREE, "name": "Free Sandbox", "price": 0.0, "monthly_limit": 250, "rate_limit": 10, "features": ["250 calls/month", "Standard lookups"]},
                    {"type": TierType.PRO, "name": "Banking Pro", "price": 499.0, "monthly_limit": 10000, "rate_limit": 60, "features": ["10,000 calls/month", "60 req/min limit", "MICR verification"]},
                    {"type": TierType.SCALE, "name": "Scale Hub", "price": 1499.0, "monthly_limit": 50000, "rate_limit": 150, "features": ["50,000 calls/month", "150 req/min limit"]},
                    {"type": TierType.ENTERPRISE, "name": "Bank Consortium", "price": 4999.0, "monthly_limit": 250000, "rate_limit": 500, "features": ["250,000 calls/month", "Sub-10ms response guarantee"]}
                ]
            },
            {
                "name": "India Postal PIN Code Directory & Hub API",
                "slug": "india-postal",
                "category": ApiCategory.GEOLOCATION_POSTAL,
                "tagline": "Lookup authentic post offices, delivery hubs, and taluks for all 6-digit Indian PIN codes.",
                "description": "Essential logistics and e-commerce verification API mapping 6-digit Indian PIN codes to Post Office name, Taluk, District, State, and express delivery availability.",
                "version": "v1.0",
                "icon_name": "MapPin",
                "base_latency_ms": 12,
                "uptime_pct": 99.95,
                "total_calls": 6200,
                "is_featured": True,
                "endpoints": [
                    {
                        "path": "/pincode/{pincode}",
                        "http_method": "GET",
                        "summary": "Lookup Postal Office & Taluk by PIN",
                        "description": "Enter any 6-digit Indian PIN code to get city, district, post office, and state.",
                        "headers_json": json.dumps({"X-APIVault-Key": "vault_live_..."}),
                        "query_params_json": json.dumps({"pincode": "440001"}),
                        "request_body_json": json.dumps({}),
                        "sample_response_json": json.dumps({
                            "status": "SUCCESS",
                            "pincode": "440001",
                            "is_valid_format": True,
                            "postal_info": {
                                "post_office": "Nagpur G.P.O.",
                                "taluk": "Nagpur Urban",
                                "district": "Nagpur",
                                "state": "Maharashtra",
                                "delivery_status": "Delivery"
                            },
                            "logistics_tier": "Tier-1 Express Delivery Available"
                        })
                    }
                ],
                "pricing": [
                    {"type": TierType.FREE, "name": "Developer Free", "price": 0.0, "monthly_limit": 250, "rate_limit": 10, "features": ["250 calls/month"]},
                    {"type": TierType.PRO, "name": "E-Commerce Pro", "price": 499.0, "monthly_limit": 15000, "rate_limit": 80, "features": ["15,000 calls/month", "80 req/min limit"]},
                    {"type": TierType.SCALE, "name": "Courier Scale", "price": 1499.0, "monthly_limit": 60000, "rate_limit": 200, "features": ["60,000 calls/month", "200 req/min limit"]}
                ]
            },
            {
                "name": "Indian PAN & Identity Format Validator API",
                "slug": "india-identity",
                "category": ApiCategory.IDENTITY_SECURITY,
                "tagline": "Validate Permanent Account Numbers (PAN), verify entity classification and checksum.",
                "description": "Lightweight KYC validation API verifying 10-character Indian PAN cards and extracting entity designations (Individual, Company, Firm, HUF, Trust).",
                "version": "v1.2",
                "icon_name": "ShieldCheck",
                "base_latency_ms": 15,
                "uptime_pct": 99.96,
                "total_calls": 4180,
                "is_featured": False,
                "endpoints": [
                    {
                        "path": "/pan/validate",
                        "http_method": "POST",
                        "summary": "Verify PAN Card Structure & Entity",
                        "description": "Analyzes the 4th character entity code and verifies format conformity with Income Tax standards.",
                        "headers_json": json.dumps({"X-APIVault-Key": "vault_live_..."}),
                        "query_params_json": json.dumps({}),
                        "request_body_json": json.dumps({"pan_number": "AAPCA1234F"}),
                        "sample_response_json": json.dumps({
                            "status": "SUCCESS",
                            "pan_number": "AAPCA1234F",
                            "is_valid_structure": True,
                            "entity_type": "Company (Private / Public Limited)",
                            "holder_type_code": "C"
                        })
                    }
                ],
                "pricing": [
                    {"type": TierType.FREE, "name": "Free Tier", "price": 0.0, "monthly_limit": 250, "rate_limit": 10, "features": ["250 calls/month"]},
                    {"type": TierType.PRO, "name": "KYC Pro", "price": 499.0, "monthly_limit": 10000, "rate_limit": 60, "features": ["10,000 calls/month", "Bulk batching"]}
                ]
            },
            {
                "name": "UPI Payment QR & BharatQR Generator API",
                "slug": "india-upi",
                "category": ApiCategory.BANKING_PAYMENTS,
                "tagline": "Dynamic NPCI UPI deep links and SVG QR codes for instant payments across all UPI apps.",
                "description": "Generate standard NPCI-compliant UPI deep links (upi://pay) and high-resolution QR codes for Google Pay, PhonePe, Paytm, and BHIM UPI.",
                "version": "v2.0",
                "icon_name": "QrCode",
                "base_latency_ms": 20,
                "uptime_pct": 99.99,
                "total_calls": 7320,
                "is_featured": True,
                "endpoints": [
                    {
                        "path": "/generate-qr",
                        "http_method": "POST",
                        "summary": "Generate Dynamic UPI Payment QR",
                        "description": "Accepts VPA, Payee Name, Amount in INR, and Transaction Note to generate URI and SVG QR code.",
                        "headers_json": json.dumps({"X-APIVault-Key": "vault_live_..."}),
                        "query_params_json": json.dumps({}),
                        "request_body_json": json.dumps({
                            "vpa": "ashish@upi",
                            "payee_name": "Ashish Mohod",
                            "amount": 499.0,
                            "transaction_note": "APIVault Pro Subscription"
                        }),
                        "sample_response_json": json.dumps({
                            "status": "SUCCESS",
                            "vpa_handle": "ashish@upi",
                            "amount_inr": 499.0,
                            "currency": "INR",
                            "transaction_ref_id": "TXN90812398",
                            "deep_link_uri": "upi://pay?pa=ashish@upi&pn=Ashish%20Mohod&am=499.00&cu=INR"
                        })
                    }
                ],
                "pricing": [
                    {"type": TierType.FREE, "name": "Sandbox Free", "price": 0.0, "monthly_limit": 250, "rate_limit": 10, "features": ["250 dynamic QR codes/month"]},
                    {"type": TierType.PRO, "name": "Merchant Pro", "price": 499.0, "monthly_limit": 10000, "rate_limit": 60, "features": ["10,000 dynamic QR codes/month"]}
                ]
            },
            {
                "name": "Hinglish & Regional NLP Sentiment API",
                "slug": "india-nlp",
                "category": ApiCategory.AI_NLP,
                "tagline": "AI sentiment analysis tailored for Indian customer feedback in Hinglish and regional dialects.",
                "description": "Detects sentiment polarity, confidence scores, and toxicity flags for informal Indian multilingual reviews containing terms like 'badhiya', 'mast', 'bekar', 'shandar'.",
                "version": "v1.1",
                "icon_name": "MessageSquare",
                "base_latency_ms": 32,
                "uptime_pct": 99.92,
                "total_calls": 3100,
                "is_featured": False,
                "endpoints": [
                    {
                        "path": "/sentiment",
                        "http_method": "POST",
                        "summary": "Analyze Hinglish Review Sentiment",
                        "description": "Computes polarity score and detects whether content requires human review.",
                        "headers_json": json.dumps({"X-APIVault-Key": "vault_live_..."}),
                        "query_params_json": json.dumps({}),
                        "request_body_json": json.dumps({
                            "text": "Bohot badhiya service hai, payment turant verify ho gaya!"
                        }),
                        "sample_response_json": json.dumps({
                            "status": "SUCCESS",
                            "detected_language": "Hinglish / Indo-Aryan",
                            "sentiment": "POSITIVE",
                            "polarity_score": 0.88,
                            "confidence_pct": 94.2
                        })
                    }
                ],
                "pricing": [
                    {"type": TierType.FREE, "name": "Free Tier", "price": 0.0, "monthly_limit": 250, "rate_limit": 10, "features": ["250 sentiment analyses/month"]},
                    {"type": TierType.PRO, "name": "NLP Pro", "price": 699.0, "monthly_limit": 12000, "rate_limit": 60, "features": ["12,000 analyses/month"]}
                ]
            }
        ]

        created_services = []
        for a_data in apis_data:
            endpoints_data = a_data.pop("endpoints")
            pricing_data = a_data.pop("pricing")

            service = ApiService(**a_data)
            db.add(service)
            db.flush()

            for ep in endpoints_data:
                endpoint = ApiEndpoint(api_service_id=service.id, **ep)
                db.add(endpoint)

            for pr in pricing_data:
                features_str = json.dumps(pr.pop("features"))
                tier = PricingTier(
                    api_service_id=service.id,
                    tier_type=pr["type"],
                    name=pr["name"],
                    price_inr=pr["price"],
                    request_limit_monthly=pr["monthly_limit"],
                    rate_limit_per_min=pr["rate_limit"],
                    features_json=features_str
                )
                db.add(tier)

            created_services.append(service)

        db.commit()

        # 4. Subscribe Admin Ashish and Amit to initial tiers
        for s in created_services:
            free_tier = db.query(PricingTier).filter(
                PricingTier.api_service_id == s.id,
                PricingTier.price_inr == 0.0
            ).first()

            sub_ashish = Subscription(
                user_id=admin_ashish.id,
                api_service_id=s.id,
                pricing_tier_id=free_tier.id if free_tier else 1,
                status=SubscriptionStatus.ACTIVE,
                calls_used_this_month=random.randint(15, 60)
            )
            db.add(sub_ashish)

        db.commit()

        # 5. Generate realistic sample UsageLogs for Developer Analytics
        now = datetime.now(timezone.utc)
        for i in range(25):
            s = random.choice(created_services)
            status_c = 200 if random.random() > 0.05 else 429
            log = UsageLog(
                api_key_id=ashish_key.id,
                user_id=admin_ashish.id,
                api_service_id=s.id,
                endpoint_path=s.endpoints[0].path if s.endpoints else "/test",
                http_method=s.endpoints[0].http_method if s.endpoints else "POST",
                status_code=status_c,
                latency_ms=s.base_latency_ms + random.randint(-4, 12),
                caller_ip="127.0.0.1",
                timestamp=now - timedelta(hours=random.randint(1, 48), minutes=random.randint(5, 50))
            )
            db.add(log)

        db.commit()
        print("[SUCCESS] APIVault India database successfully seeded with Admin Ashish & Indian APIs!")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
