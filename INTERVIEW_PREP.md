# 🎯 APIVault India — Technical Interview Preparation Guide
### Author: Ashish Mohod (Full Stack Python Developer, Nagpur)

This guide contains **15 high-impact questions and answers** that interviewers (technical leads, senior backend engineers, hiring managers) will ask about **APIVault India**.

---

### Q1: Can you give a 60-second elevator pitch of APIVault India?
**Answer:**
> *"APIVault India is an enterprise-grade Developer API Marketplace and Metered Gateway platform built with Python FastAPI, SQLAlchemy 2.0, and React. Unlike a standard e-commerce store that sells physical goods, APIVault sells **software microservices**—specifically authentic Indian services like GSTIN verification, Indian Bank IFSC lookup, 6-digit Postal PIN directories, and UPI QR generation. 
>
> On the backend, I engineered a custom **API Gateway engine** that intercepts incoming traffic, validates cryptographically hashed API keys via the `X-APIVault-Key` header, enforces a 60-second **Sliding-Window Rate Limiter** (`429 Too Many Requests`), deducts monthly subscription quotas, and asynchronously logs call telemetry and latency in milliseconds."*

---

### Q2: Why did you choose FastAPI instead of Django or Flask for this project?
**Answer:**
> *"I chose FastAPI for three primary reasons:
> 1. **Asynchronous Non-Blocking I/O (ASGI)**: An API gateway needs to handle high concurrent throughput and proxy requests to microservices with minimal latency overhead. FastAPI uses `asyncio` and `uvicorn`, enabling non-blocking execution unlike synchronous WSGI frameworks.
> 2. **Native Pydantic v2 Validation**: FastAPI offers lightning-fast request/response serialization and strict type validation out of the box.
> 3. **Automatic OpenAPI/Swagger Generation**: It automatically documents every endpoint at `/docs`, which is essential for a developer-centric product."*

---

### Q3: How did you implement the Rate Limiting algorithm in Python?
**Answer:**
> *"I implemented a **Sliding-Window Rate Limiter** using an in-memory timestamp queue per API Key hash:
> 1. When a request arrives, the current UNIX epoch timestamp (`time.time()`) is recorded.
> 2. The algorithm computes a 60-second window cutoff (`now - 60.0`) and prunes all timestamps older than 60 seconds.
> 3. If the count of remaining timestamps exceeds the user's tier limit (e.g. 10 req/min for Free, 60 req/min for Pro), the gateway raises an HTTP `429 Too Many Requests` exception.
> 4. Crucially, I calculate the `Retry-After` header value based on how many seconds remain until the oldest timestamp drops out of the sliding 60-second window, giving clients a compliant retry backoff time."*

---

### Q4: How do you store and verify Secret API Keys securely?
**Answer:**
> *"I follow industry standard security practices (similar to GitHub or Stripe):
> 1. **Key Structure**: A key consists of a recognizable prefix and high-entropy random hex: `vault_live_<40_random_hex_chars>`.
> 2. **One-Time Display**: When a developer creates a key, the raw key is returned to the client **only once**.
> 3. **Cryptographic Hashing**: In the database, I never store raw keys in plaintext. I compute a **SHA-256 hash** of the key and store the hash alongside an indexed 18-character prefix (`vault_live_...`).
> 4. **Lookup**: When a request arrives with `X-APIVault-Key`, the gateway hashes the incoming string and executes a fast indexed lookup in the `api_keys` table. Even if the database is compromised, the attacker cannot reverse the hash to obtain raw API keys."*

---

### Q5: How does the Metered Subscription & Quota Deduction work?
**Answer:**
> *"Every API service has tiered pricing in Indian Rupees (Free: ₹0/250 calls, Pro: ₹499/10,000 calls, Scale: ₹1,499/50,000 calls).
> 
> In the database, the `subscriptions` table tracks `calls_used_this_month` against the pricing tier's `request_limit_monthly`.
> When a request passes the rate limiter, the `QuotaManager` checks if `calls_used_this_month < limit`. If valid, it atomically increments the count by 1. If exhausted, it updates the status to `EXHAUSTED` and returns HTTP `402 Payment Required` prompting the developer to upgrade their plan."*

---

### Q6: Can you explain the data model relationships in SQLAlchemy?
**Answer:**
> *"I designed a normalized relational schema with 5 primary entities:
> - **User**: 1-to-many relationship with `ApiKey` and `Subscription`. Includes role-based access (`SUPER_ADMIN` for Ashish, `DEVELOPER` for external engineers).
> - **ApiService**: 1-to-many with `ApiEndpoint` and `PricingTier`.
> - **Subscription**: Many-to-1 with both `User` and `ApiService`, tracking monthly usage state.
> - **ApiKey**: Stores the SHA-256 hash and tracks `last_used_at`.
> - **UsageLog**: High-volume telemetry table tracking `api_service_id`, `endpoint_path`, `http_method`, `status_code`, `latency_ms`, and `caller_ip` with database indexes on `timestamp` and `user_id` for fast analytics querying."*

---

### Q7: How does the in-browser Interactive Playground work?
**Answer:**
> *"The interactive playground lets developers test endpoints before writing code.
> 1. The user selects an endpoint and enters custom parameters or edits the JSON request body.
> 2. The client attaches the developer's active `X-APIVault-Key` header and sends the request to `/api/gateway/{api_slug}/{subpath}`.
> 3. The frontend captures the HTTP status code, roundtrip latency in milliseconds (`Date.now() - startTime`), and renders the JSON response with syntax highlighting.
> 4. In parallel, it generates instant copy-pasteable code snippets in **Python (`requests`)**, **JavaScript (`fetch`)**, and **cURL**."*

---

### Q8: What real Indian Microservices did you build into the system?
**Answer:**
> *"I built 6 authentic Indian business services:
> 1. **India GSTIN Verification & Tax Calc**: Parses the 2-digit state code (`27` for Maharashtra), verifies format regex, and computes intra-state CGST/SGST vs inter-state IGST.
> 2. **Indian Bank IFSC Directory**: Validates 11-digit IFSC codes (`SBIN0000432`, `HDFC0000128`, `MAHB0000012`), returning branch address, city (Nagpur, Mumbai, Pune), and payment modes (RTGS/NEFT/UPI).
> 3. **India Postal PIN Directory**: 6-digit Indian PIN code directory mapping codes like `440001` (Nagpur GPO) to delivery status and taluks.
> 4. **Indian PAN Validator**: Decodes entity codes (e.g. `P` = Individual, `C` = Company, `F` = Firm).
> 5. **UPI Payment QR Generator**: Constructs NPCI-compliant `upi://pay?pa=...` deep-link URIs and dynamic SVG QR codes.
> 6. **Hinglish Sentiment Analysis**: Analyzes informal Indian customer reviews in Hinglish and regional dialects for polarity and tone."*

---

### Q9: How did you implement Admin Ashish's Super Admin capabilities?
**Answer:**
> *"Admin authorization is enforced via FastAPI dependency injection:
> ```python
> def require_admin(current_user: User = Depends(get_current_user)):
>     if current_user.role != UserRole.SUPER_ADMIN:
>         raise HTTPException(status_code=403, detail='Admin access required.')
>     return current_user
> ```
> Under this dependency, Admin Ashish can:
> - View platform-wide revenue in INR (₹) and overall API call volumes.
> - Access the live telemetry stream of incoming requests.
> - Export platform call logs directly to **CSV** using Python's `io.StringIO` and streaming `Response`."*

---

### Q10: How did you test the backend to ensure code quality?
**Answer:**
> *"I wrote an automated pytest suite in `backend/tests/test_api.py` using FastAPI's `TestClient`. The test suite covers:
> 1. Health check verification (`/`).
> 2. Admin Ashish authentication and JWT token generation.
> 3. API catalog fetching.
> 4. Gateway authentication failure when `X-APIVault-Key` is missing (`401 Unauthorized`).
> 5. End-to-end GST verification through the Gateway proxy.
> 6. IFSC lookup through the Gateway proxy.
> All tests run and pass with 100% success."*

---

### Q11: How do you prevent SQL Injection and Cross-Site Scripting (XSS)?
**Answer:**
> *"1. **SQL Injection**: Prevented because I use SQLAlchemy ORM with parameterized queries. Raw unescaped SQL strings are never concatenated into queries.
> 2. **XSS & Payload Tampering**: All incoming payloads are strictly validated against Pydantic schemas before reaching business logic. Any unexpected or malformed types are rejected with standard HTTP `422 Unprocessable Entity`."*

---

### Q12: How is the frontend architected?
**Answer:**
> *"The frontend is a single-page React 18 application built with **Vite 5** and **Tailwind CSS**.
> - **State Management**: Uses React Context API (`AuthContext` for user session and active API keys, `ThemeContext` for Dark/Light mode).
> - **Offline / Cloud Fallback**: If the local Python server is unreachable (such as when hosted statically on Vercel), the frontend automatically uses a fallback dataset in `mockData.js`, ensuring the live website never shows broken cards or blank screens."*

---

### Q13: If this platform grew to 1,000,000 requests per minute, how would you scale it?
**Answer:**
> *"To scale APIVault India to high concurrency:
> 1. **Distributed Rate Limiting with Redis**: Replace the in-memory rate limiter with Redis using the Leaky Bucket or Sliding Log algorithm via Lua scripts for atomic operations across multiple server instances.
> 2. **Background Async Worker Queue**: Move heavy audit logging to a message queue like **RabbitMQ** or **Kafka** with **Celery**, so database write operations do not block the request-response proxy cycle.
> 3. **Database Read Replicas**: Separate reads (catalog, pricing) from writes (logs, subscriptions) using PostgreSQL read replicas and connection pooling with PgBouncer.
> 4. **Caching**: Cache immutable lookups (like IFSC and PIN codes) in Redis with a 24-hour TTL to reduce database hits by over 80%."*

---

### Q14: How does your password hashing work?
**Answer:**
> *"I use PBKDF2 with HMAC-SHA256 and 100,000 iterations from Python's standard `hashlib` library. When a user registers, a unique 16-byte random salt is generated and stored alongside the hashed key formatted as `salt:key`. For verification, we compute the PBKDF2 hash using the stored salt and use `secrets.compare_digest` to prevent timing attacks."*

---

### Q15: What was the most challenging bug you encountered and how did you resolve it?
**Answer:**
> *"The most interesting challenge was managing the **dual-response latency** in the Gateway proxy:
> When proxying a request, the Gateway has to measure its internal execution time while also streaming the target microservice's payload without buffering large objects in memory.
> I solved this by capturing high-resolution monotonic timestamps (`time.time()`) at the gateway entry and computing the round-trip latency (`(time.time() - start_time) * 1000`) before committing the audit log asynchronously, returning both the clean service response and a `_gateway_meta` diagnostic block."*
