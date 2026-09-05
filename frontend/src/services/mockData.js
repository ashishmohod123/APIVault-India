export const INITIAL_USERS = [
  {
    id: 1,
    full_name: "Ashish Mohod",
    email: "ashish@apivault.in",
    role: "SUPER_ADMIN",
    organization: "APIVault India Central Administration",
    location_city: "Nagpur",
    country: "India",
    is_active: true
  },
  {
    id: 2,
    full_name: "Amit Sharma",
    email: "amit@paybharat.tech",
    role: "DEVELOPER",
    organization: "PayBharat Fintech Labs",
    location_city: "Pune",
    country: "India",
    is_active: true
  },
  {
    id: 3,
    full_name: "Priya Nair",
    email: "priya@indicai.in",
    role: "DEVELOPER",
    organization: "IndicAI Research",
    location_city: "Bengaluru",
    country: "India",
    is_active: true
  }
];

export const INITIAL_APIS = [
  {
    id: 1,
    name: "India GSTIN Verification & Tax Calculator API",
    slug: "india-gst",
    category: "Fintech & Tax",
    tagline: "Real-time GSTIN validation, State Code extraction, and CGST/SGST/IGST calculation.",
    description: "Enterprise API for verifying 15-digit Goods and Services Tax Identification Numbers (GSTIN) across all Indian states, checking format integrity, and calculating split tax liabilities.",
    version: "v2.1",
    icon_name: "Receipt",
    base_latency_ms: 18,
    uptime_pct: 99.98,
    total_calls: 5420,
    is_featured: true,
    endpoints: [
      {
        id: 1,
        path: "/verify-calculate",
        http_method: "POST",
        summary: "Verify GSTIN & Compute Split Taxes",
        description: "Takes a GSTIN, invoice amount, and supplier state to compute CGST, SGST, or IGST tax amounts.",
        headers_json: JSON.stringify({"X-APIVault-Key": "vault_live_..."}),
        query_params_json: JSON.stringify({"tax_rate_pct": "18.0"}),
        request_body_json: JSON.stringify({
          gstin: "27AAPCA1234F1Z5",
          invoice_amount: 25000.0,
          supplier_state_code: "27",
          tax_rate_pct: 18.0
        }, null, 2),
        sample_response_json: JSON.stringify({
          status: "SUCCESS",
          gstin_input: "27AAPCA1234F1Z5",
          is_valid_format: true,
          registered_state: "Maharashtra",
          state_code: "27",
          taxation_mode: "INTRA_STATE (CGST + SGST)",
          base_amount: 25000.0,
          tax_breakup: {
            cgst_inr: 2250.0,
            sgst_inr: 2250.0,
            igst_inr: 0.0,
            total_tax_inr: 4500.0
          },
          total_invoice_inr: 29500.0
        }, null, 2),
        is_active: true
      }
    ],
    pricing_tiers: [
      { id: 1, tier_type: "FREE", name: "Free Sandbox", price_inr: 0.0, request_limit_monthly: 250, rate_limit_per_min: 10, features_json: JSON.stringify(["250 calls/month", "Community support", "10 req/min limit"]) },
      { id: 2, tier_type: "PRO", name: "Fintech Pro", price_inr: 499.0, request_limit_monthly: 10000, rate_limit_per_min: 60, features_json: JSON.stringify(["10,000 calls/month", "Email support", "60 req/min limit", "HSN code lookups"]) },
      { id: 3, tier_type: "SCALE", name: "Startup Scale", price_inr: 1499.0, request_limit_monthly: 50000, rate_limit_per_min: 150, features_json: JSON.stringify(["50,000 calls/month", "Priority 24/7 SLA", "150 req/min limit", "Webhooks"]) },
      { id: 4, tier_type: "ENTERPRISE", name: "Enterprise Hub", price_inr: 4999.0, request_limit_monthly: 250000, rate_limit_per_min: 500, features_json: JSON.stringify(["250,000 calls/month", "Dedicated Account Manager", "Unlimited bursts"]) }
    ]
  },
  {
    id: 2,
    name: "Indian Bank IFSC & Branch Directory API",
    slug: "india-banking",
    category: "Banking & Payments",
    tagline: "Instant lookup of 150,000+ Indian bank branches with RTGS, NEFT & UPI support.",
    description: "High-availability financial directory API providing authentic bank name, branch address, MICR code, city, and digital payment mode support for any 11-digit IFSC code.",
    version: "v1.4",
    icon_name: "Landmark",
    base_latency_ms: 14,
    uptime_pct: 99.99,
    total_calls: 8920,
    is_featured: true,
    endpoints: [
      {
        id: 2,
        path: "/ifsc/{code}",
        http_method: "GET",
        summary: "Lookup Branch Details by IFSC Code",
        description: "Returns full bank profile, branch address, MICR, and digital payment settlement flags.",
        headers_json: JSON.stringify({"X-APIVault-Key": "vault_live_..."}),
        query_params_json: JSON.stringify({"code": "SBIN0000432"}),
        request_body_json: "{}",
        sample_response_json: JSON.stringify({
          status: "SUCCESS",
          ifsc_code: "SBIN0000432",
          is_valid: true,
          bank_details: {
            bank: "State Bank of India",
            branch: "Nagpur Main Branch",
            address: "Kingsway, Station Road, Nagpur, Maharashtra - 440001",
            city: "Nagpur",
            state: "Maharashtra",
            rtgs: true,
            neft: true,
            upi: true
          }
        }, null, 2),
        is_active: true
      }
    ],
    pricing_tiers: [
      { id: 5, tier_type: "FREE", name: "Free Sandbox", price_inr: 0.0, request_limit_monthly: 250, rate_limit_per_min: 10, features_json: JSON.stringify(["250 calls/month", "Standard lookups"]) },
      { id: 6, tier_type: "PRO", name: "Banking Pro", price_inr: 499.0, request_limit_monthly: 10000, rate_limit_per_min: 60, features_json: JSON.stringify(["10,000 calls/month", "60 req/min limit", "MICR verification"]) },
      { id: 7, tier_type: "SCALE", name: "Scale Hub", price_inr: 1499.0, request_limit_monthly: 50000, rate_limit_per_min: 150, features_json: JSON.stringify(["50,000 calls/month", "150 req/min limit"]) }
    ]
  },
  {
    id: 3,
    name: "India Postal PIN Code Directory & Hub API",
    slug: "india-postal",
    category: "Postal & Geolocation",
    tagline: "Lookup authentic post offices, delivery hubs, and taluks for all 6-digit Indian PIN codes.",
    description: "Essential logistics and e-commerce verification API mapping 6-digit Indian PIN codes to Post Office name, Taluk, District, State, and express delivery availability.",
    version: "v1.0",
    icon_name: "MapPin",
    base_latency_ms: 12,
    uptime_pct: 99.95,
    total_calls: 6200,
    is_featured: true,
    endpoints: [
      {
        id: 3,
        path: "/pincode/{pincode}",
        http_method: "GET",
        summary: "Lookup Postal Office & Taluk by PIN",
        description: "Enter any 6-digit Indian PIN code to get city, district, post office, and state.",
        headers_json: JSON.stringify({"X-APIVault-Key": "vault_live_..."}),
        query_params_json: JSON.stringify({"pincode": "440001"}),
        request_body_json: "{}",
        sample_response_json: JSON.stringify({
          status: "SUCCESS",
          pincode: "440001",
          is_valid_format: true,
          postal_info: {
            post_office: "Nagpur G.P.O.",
            taluk: "Nagpur Urban",
            district: "Nagpur",
            state: "Maharashtra",
            delivery_status: "Delivery"
          },
          logistics_tier: "Tier-1 Express Delivery Available"
        }, null, 2),
        is_active: true
      }
    ],
    pricing_tiers: [
      { id: 8, tier_type: "FREE", name: "Developer Free", price_inr: 0.0, request_limit_monthly: 250, rate_limit_per_min: 10, features_json: JSON.stringify(["250 calls/month"]) },
      { id: 9, tier_type: "PRO", name: "E-Commerce Pro", price_inr: 499.0, request_limit_monthly: 15000, rate_limit_per_min: 80, features_json: JSON.stringify(["15,000 calls/month", "80 req/min limit"]) }
    ]
  },
  {
    id: 4,
    name: "Indian PAN & Identity Format Validator API",
    slug: "india-identity",
    category: "Identity & Verification",
    tagline: "Validate Permanent Account Numbers (PAN), verify entity classification and checksum.",
    description: "Lightweight KYC validation API verifying 10-character Indian PAN cards and extracting entity designations (Individual, Company, Firm, HUF, Trust).",
    version: "v1.2",
    icon_name: "ShieldCheck",
    base_latency_ms: 15,
    uptime_pct: 99.96,
    total_calls: 4180,
    is_featured: false,
    endpoints: [
      {
        id: 4,
        path: "/pan/validate",
        http_method: "POST",
        summary: "Verify PAN Card Structure & Entity",
        description: "Analyzes the 4th character entity code and verifies format conformity with Income Tax standards.",
        headers_json: JSON.stringify({"X-APIVault-Key": "vault_live_..."}),
        query_params_json: JSON.stringify({}),
        request_body_json: JSON.stringify({ pan_number: "AAPCA1234F" }, null, 2),
        sample_response_json: JSON.stringify({
          status: "SUCCESS",
          pan_number: "AAPCA1234F",
          is_valid_structure: true,
          entity_type: "Company (Private / Public Limited)",
          holder_type_code: "C"
        }, null, 2),
        is_active: true
      }
    ],
    pricing_tiers: [
      { id: 10, tier_type: "FREE", name: "Free Tier", price_inr: 0.0, request_limit_monthly: 250, rate_limit_per_min: 10, features_json: JSON.stringify(["250 calls/month"]) },
      { id: 11, tier_type: "PRO", name: "KYC Pro", price_inr: 499.0, request_limit_monthly: 10000, rate_limit_per_min: 60, features_json: JSON.stringify(["10,000 calls/month", "Bulk batching"]) }
    ]
  },
  {
    id: 5,
    name: "UPI Payment QR & BharatQR Generator API",
    slug: "india-upi",
    category: "Banking & Payments",
    tagline: "Dynamic NPCI UPI deep links and SVG QR codes for instant payments across all UPI apps.",
    description: "Generate standard NPCI-compliant UPI deep links (upi://pay) and high-resolution QR codes for Google Pay, PhonePe, Paytm, and BHIM UPI.",
    version: "v2.0",
    icon_name: "QrCode",
    base_latency_ms: 20,
    uptime_pct: 99.99,
    total_calls: 7320,
    is_featured: true,
    endpoints: [
      {
        id: 5,
        path: "/generate-qr",
        http_method: "POST",
        summary: "Generate Dynamic UPI Payment QR",
        description: "Accepts VPA, Payee Name, Amount in INR, and Transaction Note to generate URI and SVG QR code.",
        headers_json: JSON.stringify({"X-APIVault-Key": "vault_live_..."}),
        query_params_json: JSON.stringify({}),
        request_body_json: JSON.stringify({
          vpa: "ashish@upi",
          payee_name: "Ashish Mohod",
          amount: 499.0,
          transaction_note: "APIVault Pro Subscription"
        }, null, 2),
        sample_response_json: JSON.stringify({
          status: "SUCCESS",
          vpa_handle: "ashish@upi",
          amount_inr: 499.0,
          currency: "INR",
          transaction_ref_id: "TXN90812398",
          deep_link_uri: "upi://pay?pa=ashish@upi&pn=Ashish%20Mohod&am=499.00&cu=INR"
        }, null, 2),
        is_active: true
      }
    ],
    pricing_tiers: [
      { id: 12, tier_type: "FREE", name: "Sandbox Free", price_inr: 0.0, request_limit_monthly: 250, rate_limit_per_min: 10, features_json: JSON.stringify(["250 dynamic QR codes/month"]) },
      { id: 13, tier_type: "PRO", name: "Merchant Pro", price_inr: 499.0, request_limit_monthly: 10000, rate_limit_per_min: 60, features_json: JSON.stringify(["10,000 dynamic QR codes/month"]) }
    ]
  },
  {
    id: 6,
    name: "Hinglish & Regional NLP Sentiment API",
    slug: "india-nlp",
    category: "AI & Language Processing",
    tagline: "AI sentiment analysis tailored for Indian customer feedback in Hinglish and regional dialects.",
    description: "Detects sentiment polarity, confidence scores, and toxicity flags for informal Indian multilingual reviews containing terms like 'badhiya', 'mast', 'bekar', 'shandar'.",
    version: "v1.1",
    icon_name: "MessageSquare",
    base_latency_ms: 32,
    uptime_pct: 99.92,
    total_calls: 3100,
    is_featured: false,
    endpoints: [
      {
        id: 6,
        path: "/sentiment",
        http_method: "POST",
        summary: "Analyze Hinglish Review Sentiment",
        description: "Computes polarity score and detects whether content requires human review.",
        headers_json: JSON.stringify({"X-APIVault-Key": "vault_live_..."}),
        query_params_json: JSON.stringify({}),
        request_body_json: JSON.stringify({
          text: "Bohot badhiya service hai, payment turant verify ho gaya!"
        }, null, 2),
        sample_response_json: JSON.stringify({
          status: "SUCCESS",
          detected_language: "Hinglish / Indo-Aryan",
          sentiment: "POSITIVE",
          polarity_score: 0.88,
          confidence_pct: 94.2
        }, null, 2),
        is_active: true
      }
    ],
    pricing_tiers: [
      { id: 14, tier_type: "FREE", name: "Free Tier", price_inr: 0.0, request_limit_monthly: 250, rate_limit_per_min: 10, features_json: JSON.stringify(["250 sentiment analyses/month"]) },
      { id: 15, tier_type: "PRO", name: "NLP Pro", price_inr: 699.0, request_limit_monthly: 12000, rate_limit_per_min: 60, features_json: JSON.stringify(["12,000 analyses/month"]) }
    ]
  }
];

export const INITIAL_API_KEYS = [
  {
    id: 1,
    name: "Ashish Master Production Key",
    key_prefix: "vault_live_ashish_",
    raw_api_key: "vault_live_ashish_998271049102",
    environment: "live",
    is_active: true,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    last_used_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Test Sandbox Key",
    key_prefix: "vault_test_ashish",
    raw_api_key: "vault_test_ashish_441029819201",
    environment: "test",
    is_active: true,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    last_used_at: new Date(Date.now() - 3600000).toISOString()
  }
];
