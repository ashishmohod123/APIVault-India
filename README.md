# ⚡ APIVault India — Developer API Marketplace & Metered Gateway

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Admin](https://img.shields.io/badge/Admin-Ashish%20Mohod%20(Nagpur)-amber)](https://github.com/ashishmohod123)

An enterprise-grade Developer API Marketplace and Gateway platform engineered specifically with **100% authentic Indian financial and utility microservices**. It features real-time API Key provisioning, sliding-window rate limiting (`429`), monthly quota meters, and an interactive in-browser playground, all overseen by **Admin Ashish Mohod (Nagpur, Maharashtra)**.

---

## 🌟 Key Architecture & Highlights

```
               ┌────────────────────────────────────────────────────────┐
               │        Developer Frontend (React 18 + Tailwind)        │
               │   Marketplace • Interactive Playground • API Console   │
               └──────────────────────────┬─────────────────────────────┘
                                          │ HTTP / JSON
                                          ▼
               ┌────────────────────────────────────────────────────────┐
               │              FastAPI Application Server                │
               ├──────────────────────────┬─────────────────────────────┤
               │   Marketplace Routers    │     API Gateway Engine      │
               │  - Auth & Demo Personas  │  - API Key Authenticator    │
               │  - API Catalog & Tiers   │  - Sliding Window Limiter   │
               │  - Subscriptions & Keys  │  - Quota Meter & Usage Log  │
               │  - Billing & Invoicing   │  - Request Dispatcher/Proxy │
               └──────────────────────────┴──────────────┬──────────────┘
                                                         │
                                                         ▼
                                          ┌─────────────────────────────┐
                                          │     SQLite / SQLAlchemy     │
                                          │  Users, Keys, APIs, Logs    │
                                          └─────────────────────────────┘
```

### 1. 🇮🇳 6 Real Working Indian Microservices Pre-Seeded
1. **India GSTIN Verification & Tax Calculator API** (`/api/gateway/india-gst/verify-calculate`): State code extraction (`27` = Maharashtra), checksum validation, and split tax liabilities (CGST + SGST or IGST).
2. **Indian Bank IFSC & Branch Directory API** (`/api/gateway/india-banking/ifsc/{code}`): Validates 11-digit IFSC codes (`SBIN0000432`, `HDFC0000128`, `MAHB0000012`), returns branch address, city (Nagpur, Pune, Mumbai), and UPI/NEFT support.
3. **India Postal PIN Code Directory API** (`/api/gateway/india-postal/pincode/{pincode}`): 6-digit Indian postal mapping (`440001` Nagpur, `441103` Katol, `400001` Mumbai).
4. **Indian PAN & Identity Format Validator API** (`/api/gateway/india-identity/pan/validate`): Checks 10-character PAN syntax and decodes entity classification (`P` for Individual, `C` for Company).
5. **UPI Payment QR & Deep-Link Generator API** (`/api/gateway/india-upi/generate-qr`): Generates NPCI-compliant `upi://pay` deep links and dynamic SVG QR codes for Google Pay, PhonePe, Paytm.
6. **Hinglish & Regional NLP Sentiment API** (`/api/gateway/india-nlp/sentiment`): Natural language sentiment parser for Indian reviews with polarity scoring.

### 2. 🎮 Interactive In-Browser API Playground
- Direct live testing of any Indian API without writing code:
  - Input sample GSTIN, IFSC, PIN Code, or UPI details.
  - Choose your active API Key (`vault_live_...`).
  - Click **"Execute Request ⚡"** ➔ Watch live JSON response, status code `200 OK`, and response latency (e.g., `18ms`).
  - Instant code snippet generator in **Python (`requests` / `httpx`)**, **JavaScript (`fetch`)**, and **cURL**.

### 3. 🛡️ API Gateway Engine Architecture
- **Sliding-Window Rate Limiter**: Returns `429 Too Many Requests` with `Retry-After` header when per-minute limits are exceeded.
- **Quota Meter**: Tracks monthly consumption and warns developers when usage reaches 80% and 100%.
- **Cryptographic API Key Vault**: Stored as salted SHA-256 hashes in the database.
- **Audit Logging**: Records client IP, endpoint, response status, and round-trip latency.

### 4. 👑 Admin Ashish Mohod (Nagpur Headquarters)
- Dedicated Admin dashboard with platform GMV in INR (₹), total API calls processed across Indian hubs (Nagpur, Pune, Bengaluru), top consumed endpoints, and 1-click **Export Platform CSV**.

---

## 🚀 Quick Start Guide

### Backend:
```bash
cd backend
python -m pip install -r requirements.txt
python seed.py
python run.py
```
Backend runs on `http://0.0.0.0:8000` (Swagger UI: `http://127.0.0.1:8000/docs`).

### Frontend:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://0.0.0.0:5173`.

---

## 👨‍💻 Project Developer
- **Ashish Mohod** (Full Stack Python Developer, Nagpur, Maharashtra, India)
- Enterprise Developer Portfolio Project.
