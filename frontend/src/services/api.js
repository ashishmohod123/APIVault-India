import { INITIAL_USERS, INITIAL_APIS, INITIAL_API_KEYS } from './mockData';

const BASE_URL = '/api';

// Helper to retrieve auth header
function getAuthHeaders() {
  const token = localStorage.getItem('apivault_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

// Client-side mock storage helpers
function getStoredApis() {
  const saved = localStorage.getItem('apivault_apis');
  if (saved) return JSON.parse(saved);
  localStorage.setItem('apivault_apis', JSON.stringify(INITIAL_APIS));
  return INITIAL_APIS;
}

function getStoredKeys() {
  const saved = localStorage.getItem('apivault_keys');
  if (saved) return JSON.parse(saved);
  localStorage.setItem('apivault_keys', JSON.stringify(INITIAL_API_KEYS));
  return INITIAL_API_KEYS;
}

export const api = {
  // --- Auth ---
  async login(email, password) {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Login failed');
      return await res.json();
    } catch {
      // Fallback
      const user = INITIAL_USERS.find(u => u.email === email) || INITIAL_USERS[0];
      return {
        access_token: 'mock-jwt-token-ashish-nagpur',
        token_type: 'bearer',
        user
      };
    }
  },

  async register(userData) {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!res.ok) throw new Error('Registration failed');
      return await res.json();
    } catch {
      const user = {
        id: Date.now(),
        ...userData,
        role: userData.role || 'DEVELOPER',
        is_active: true,
        created_at: new Date().toISOString()
      };
      return {
        access_token: 'mock-jwt-token-new-user',
        token_type: 'bearer',
        user
      };
    }
  },

  async getMe() {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Unauthorized');
      return await res.json();
    } catch {
      const saved = localStorage.getItem('apivault_user');
      return saved ? JSON.parse(saved) : INITIAL_USERS[0];
    }
  },

  // --- API Catalog ---
  async listApis(search = '', category = 'All', sortBy = 'popular') {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category && category !== 'All') params.append('category', category);
      if (sortBy) params.append('sort_by', sortBy);

      const res = await fetch(`${BASE_URL}/apis?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch APIs');
      return await res.json();
    } catch {
      let list = getStoredApis();
      if (search) {
        const s = search.toLowerCase();
        list = list.filter(a => a.name.toLowerCase().includes(s) || a.tagline.toLowerCase().includes(s));
      }
      if (category && category !== 'All') {
        list = list.filter(a => a.category === category);
      }
      return list;
    }
  },

  async getApiBySlug(slug) {
    try {
      const res = await fetch(`${BASE_URL}/apis/${slug}`);
      if (!res.ok) throw new Error('API not found');
      return await res.json();
    } catch {
      const list = getStoredApis();
      return list.find(a => a.slug === slug) || list[0];
    }
  },

  // --- Subscriptions & Keys ---
  async getMySubscriptions() {
    try {
      const res = await fetch(`${BASE_URL}/subscriptions/my-subscriptions`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch subscriptions');
      return await res.json();
    } catch {
      return getStoredApis().map(a => ({
        id: a.id,
        user_id: 1,
        api_service_id: a.id,
        status: 'ACTIVE',
        calls_used_this_month: Math.floor(Math.random() * 80) + 12,
        service: a,
        pricing_tier: a.pricing_tiers[0]
      }));
    }
  },

  async subscribe(api_service_id, pricing_tier_id) {
    try {
      const res = await fetch(`${BASE_URL}/subscriptions/subscribe`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ api_service_id, pricing_tier_id })
      });
      if (!res.ok) throw new Error('Failed to subscribe');
      return await res.json();
    } catch {
      return { status: 'SUCCESS', message: 'Subscribed to tier successfully' };
    }
  },

  async listApiKeys() {
    try {
      const res = await fetch(`${BASE_URL}/subscriptions/keys`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to list keys');
      return await res.json();
    } catch {
      return getStoredKeys();
    }
  },

  async createApiKey(name = 'Production Key', environment = 'live') {
    try {
      const res = await fetch(`${BASE_URL}/subscriptions/keys`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, environment })
      });
      if (!res.ok) throw new Error('Failed to create key');
      return await res.json();
    } catch {
      const keys = getStoredKeys();
      const randomHex = Math.random().toString(16).substring(2, 14) + Math.random().toString(16).substring(2, 14);
      const rawKey = `vault_${environment}_${randomHex}`;
      const newKey = {
        id: Date.now(),
        name,
        key_prefix: rawKey.substring(0, 18),
        raw_api_key: rawKey,
        environment,
        is_active: true,
        created_at: new Date().toISOString()
      };
      keys.unshift(newKey);
      localStorage.setItem('apivault_keys', JSON.stringify(keys));
      return newKey;
    }
  },

  async revokeApiKey(keyId) {
    try {
      const res = await fetch(`${BASE_URL}/subscriptions/keys/${keyId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch {
      const keys = getStoredKeys().filter(k => k.id !== keyId);
      localStorage.setItem('apivault_keys', JSON.stringify(keys));
      return { message: 'Key revoked' };
    }
  },

  // --- Gateway Execution (Playground) ---
  async executeGatewayCall(apiSlug, endpointPath, method, body, apiKey) {
    const startTime = Date.now();
    const cleanPath = endpointPath.startsWith('/') ? endpointPath.slice(1) : endpointPath;
    const url = `${BASE_URL}/gateway/${apiSlug}/${cleanPath}`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-APIVault-Key': apiKey || 'vault_live_ashish_998271049102'
        },
        body: method !== 'GET' ? JSON.stringify(body || {}) : undefined
      });

      const data = await res.json();
      const latencyMs = Date.now() - startTime;
      return {
        status: res.status,
        statusText: res.statusText,
        data,
        latencyMs: data._gateway_meta?.latency_ms || latencyMs
      };
    } catch {
      // Offline / Vercel fallback simulation
      await new Promise(r => setTimeout(r, 45)); // simulate network latency
      const apiObj = getStoredApis().find(a => a.slug === apiSlug);
      const endpoint = apiObj?.endpoints.find(e => e.path === endpointPath) || apiObj?.endpoints[0];

      let responsePayload = endpoint ? JSON.parse(endpoint.sample_response_json) : { status: "SUCCESS" };

      // Dynamic overrides for interactive playground
      if (apiSlug === 'india-gst' && body?.gstin) {
        responsePayload.gstin_input = body.gstin;
        const stateCode = body.gstin.substring(0, 2);
        responsePayload.state_code = stateCode;
        if (stateCode === '27') responsePayload.registered_state = 'Maharashtra';
      }

      return {
        status: 200,
        statusText: 'OK',
        data: {
          data: responsePayload,
          _gateway_meta: {
            service: apiObj?.name || "APIVault India Gateway",
            version: apiObj?.version || "v1.0",
            latencyMs: apiObj?.base_latency_ms || 22,
            monthly_quota_used: 42,
            monthly_quota_total: 10000,
            rate_limit_per_min: 60,
            authenticated_developer: "Ashish Mohod (Active Key)"
          }
        },
        latencyMs: apiObj?.base_latency_ms || 22
      };
    }
  },

  // --- Analytics & Admin ---
  async getDeveloperAnalytics() {
    try {
      const res = await fetch(`${BASE_URL}/analytics/developer-summary`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return await res.json();
    } catch {
      return {
        developer_name: "Ashish Mohod",
        total_calls: 284,
        avg_latency_ms: 18.4,
        success_rate_pct: 99.4,
        total_quota_allocated: 10000,
        total_quota_consumed: 284,
        quota_percentage: 2.8,
        recent_logs: [
          { id: 101, endpoint_path: "/verify-calculate", http_method: "POST", status_code: 200, latency_ms: 19, timestamp: new Date().toISOString() },
          { id: 102, endpoint_path: "/ifsc/SBIN0000432", http_method: "GET", status_code: 200, latency_ms: 14, timestamp: new Date(Date.now() - 600000).toISOString() },
          { id: 103, endpoint_path: "/pincode/440001", http_method: "GET", status_code: 200, latency_ms: 12, timestamp: new Date(Date.now() - 1800000).toISOString() }
        ]
      };
    }
  },

  async getAdminMetrics() {
    try {
      const res = await fetch(`${BASE_URL}/admin/metrics`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to fetch admin metrics');
      return await res.json();
    } catch {
      return {
        admin_name: "Ashish Mohod",
        admin_role: "SUPER_ADMIN",
        admin_location: "Nagpur, Maharashtra, India",
        total_developers: 48,
        total_active_keys: 112,
        total_api_calls_processed: 35140,
        active_microservices: 6,
        total_revenue_inr: 48940.0,
        top_apis: [
          { id: 2, name: "Indian Bank IFSC Directory", slug: "india-banking", category: "Banking & Payments", total_calls: 8920, base_latency_ms: 14 },
          { id: 5, name: "UPI Payment QR Generator", slug: "india-upi", category: "Banking & Payments", total_calls: 7320, base_latency_ms: 20 },
          { id: 3, name: "India Postal PIN Directory", slug: "india-postal", category: "Postal & Geolocation", total_calls: 6200, base_latency_ms: 12 },
          { id: 1, name: "India GSTIN & Tax Calculator", slug: "india-gst", category: "Fintech & Tax", total_calls: 5420, base_latency_ms: 18 }
        ],
        recent_platform_calls: [
          { id: 901, endpoint: "/gateway/india-gst/verify-calculate", status: 200, latency_ms: 18, ip: "103.21.144.2", time: new Date().toISOString() },
          { id: 902, endpoint: "/gateway/india-banking/ifsc/SBIN0000432", status: 200, latency_ms: 14, ip: "49.36.12.8", time: new Date(Date.now() - 120000).toISOString() }
        ]
      };
    }
  },

  async downloadAdminCsv() {
    try {
      const res = await fetch(`${BASE_URL}/admin/export-csv`, { headers: getAuthHeaders() });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "APIVault_India_Usage_Report.csv";
      a.click();
    } catch {
      // Generate client-side CSV
      const csvContent = "data:text/csv;charset=utf-8,Log ID,Developer,Endpoint,Status,Latency (ms),Time\n1,Ashish Mohod,/verify-calculate,200,18,2026-09-05\n2,Amit Sharma,/ifsc/SBIN0000432,200,14,2026-09-05";
      const encodedUri = encodeURI(csvContent);
      const a = document.createElement('a');
      a.href = encodedUri;
      a.download = "APIVault_India_Usage_Report.csv";
      a.click();
    }
  }
};
