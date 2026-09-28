// WelliPay API client — talks to the live wellipay-api backend (Fastify +
// Postgres) instead of the mock arrays in app.js's `state` object.
//
// Token issuance goes through the backend's own proxy endpoint
// (POST /public/frontend-token) instead of the browser holding a
// client_secret: the backend reads its own FRONTEND_CLIENT_ID /
// FRONTEND_CLIENT_SECRET env vars and hands back a short-lived token, so
// nothing secret ever ships in this file or shows up in view-source.
//
// Override this from index.html before app.js loads if needed:
//   <script>window.WELLIPAY_API_BASE = 'https://your-env.onrender.com';</script>
const API_BASE = window.WELLIPAY_API_BASE || 'https://wellipay-api.onrender.com';

let cachedToken = null; // { value: string, expiresAt: number }

async function getToken() {
  if (cachedToken && cachedToken.expiresAt - Date.now() > 15000) return cachedToken.value;
  const res = await fetch(`${API_BASE}/public/frontend-token`, { method: 'POST' });
  if (!res.ok) throw new Error(`WelliPay API: token request failed (HTTP ${res.status})`);
  const data = await res.json();
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.value;
}

function idempotencyKey(prefix) {
  const random = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${random}`.slice(0, 128);
}

async function apiRequest(path, { method = 'GET', body, idempotent } = {}) {
  const token = await getToken();
  const headers = { Authorization: `Bearer ${token}` };
  if (body) headers['Content-Type'] = 'application/json';
  if (idempotent) headers['Idempotency-Key'] = idempotencyKey(idempotent);

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    const detail = (payload && (payload.detail || payload.title)) || `Request failed (HTTP ${res.status})`;
    throw new Error(detail);
  }
  return payload;
}

// Amounts in `state` are Naira (display units). The API stores money as
// minor units (kobo) per its money-as-integer design — never floats.
export const toMinor = (nairaAmount) => Math.round(nairaAmount * 100);

export const wellipayApi = {
  createInvoice: (body) => apiRequest('/provider/invoices', { method: 'POST', body, idempotent: 'inv' }),
  getInvoice: (invoiceId) => apiRequest(`/provider/invoices/${encodeURIComponent(invoiceId)}`),
  createFamilyFundingRequest: (body) =>
    apiRequest('/provider/family-funding-requests', { method: 'POST', body, idempotent: 'fund' }),
  createEligibilityCheck: (body) =>
    apiRequest('/provider/eligibility-checks', { method: 'POST', body, idempotent: 'elig' }),
  createFinancialConsent: (body) =>
    apiRequest('/provider/financial-consents', { method: 'POST', body, idempotent: 'consent' }),
};
