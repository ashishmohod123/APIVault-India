import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models.api_key import ApiKey

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ONLINE"
    assert "Ashish Mohod" in data["admin"]

def test_admin_ashish_login():
    response = client.post("/api/auth/login", json={
        "email": "ashish@apivault.in",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["full_name"] == "Ashish Mohod"
    assert data["user"]["role"] == "SUPER_ADMIN"

def test_list_apis_catalog():
    response = client.get("/api/apis")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5
    slugs = [api["slug"] for api in data]
    assert "india-gst" in slugs
    assert "india-banking" in slugs
    assert "india-postal" in slugs

def test_gateway_gst_verification():
    # Retrieve Ashish's raw seeded key
    raw_key = "vault_live_ashish_998271049102"
    response = client.post(
        "/api/gateway/india-gst/verify-calculate",
        headers={"X-APIVault-Key": raw_key},
        json={
            "gstin": "27AAPCA1234F1Z5",
            "invoice_amount": 50000.0,
            "supplier_state_code": "27",
            "tax_rate_pct": 18.0
        }
    )
    assert response.status_code == 200
    res = response.json()
    assert res["data"]["status"] == "SUCCESS"
    assert res["data"]["registered_state"] == "Maharashtra"
    assert res["data"]["state_code"] == "27"
    assert res["data"]["tax_breakup"]["total_tax_inr"] == 9000.0
    assert "_gateway_meta" in res
    assert res["_gateway_meta"]["latency_ms"] >= 0

def test_gateway_ifsc_lookup():
    raw_key = "vault_live_ashish_998271049102"
    response = client.get(
        "/api/gateway/india-banking/ifsc/SBIN0000432",
        headers={"X-APIVault-Key": raw_key}
    )
    assert response.status_code == 200
    res = response.json()
    assert res["data"]["status"] == "SUCCESS"
    assert res["data"]["bank_details"]["bank"] == "State Bank of India"
    assert "Nagpur" in res["data"]["bank_details"]["city"]

def test_gateway_unauthorized():
    response = client.post(
        "/api/gateway/india-gst/verify-calculate",
        json={"gstin": "27AAPCA1234F1Z5"}
    )
    assert response.status_code == 401
