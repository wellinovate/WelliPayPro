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

// Per-staff login (POST /staff/login). Once a staff member is signed in,
// every request below carries their own token instead of the shared
// frontend-proxy token above — that's the real identity behind a write, not
// just an app-level identity. The session lives in sessionStorage (not
// localStorage) so it survives a reload but not a closed tab, and it's
// never persisted anywhere else — nothing here stores the password itself.
const STAFF_SESSION_KEY = 'wp-staff-session';

function loadStaffSession() {
  try {
    const raw = sessionStorage.getItem(STAFF_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.token || !parsed.expiresAt || !parsed.staff) return null;
    if (parsed.expiresAt - Date.now() <= 15000) return null;
    return parsed;
  } catch {
    return null;
  }
}

let staffSession = loadStaffSession();
let sessionExpiredHandler = null;

function persistStaffSession() {
  try {
    if (staffSession) sessionStorage.setItem(STAFF_SESSION_KEY, JSON.stringify(staffSession));
    else sessionStorage.removeItem(STAFF_SESSION_KEY);
  } catch {
    // sessionStorage unavailable (private browsing, etc.) — the session
    // just won't survive a reload; login itself still works.
  }
}

function clearExpiredSession(message) {
  staffSession = null;
  persistStaffSession();
  if (sessionExpiredHandler) sessionExpiredHandler(message);
}

// app.js registers a callback here so it can drop back to the login screen
// the moment a session dies, whether that's caught locally (expiresAt has
// passed) or reported by the API itself (a 401 on a request that carried a
// staff token — e.g. the account was deactivated mid-session).
export function onSessionExpired(handler) {
  sessionExpiredHandler = handler;
}

export function getStaffSession() {
  return staffSession;
}

export async function loginStaff(email, password) {
  const res = await fetch(`${API_BASE}/staff/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    const detail = (payload && (payload.detail || payload.title)) || `Login failed (HTTP ${res.status})`;
    throw new Error(detail);
  }
  staffSession = {
    token: payload.access_token,
    expiresAt: Date.now() + payload.expires_in * 1000,
    staff: payload.staff,
  };
  persistStaffSession();
  return staffSession.staff;
}

export function logoutStaff() {
  staffSession = null;
  persistStaffSession();
}

async function getActiveToken() {
  if (staffSession) {
    if (staffSession.expiresAt - Date.now() > 15000) return staffSession.token;
    clearExpiredSession('Your session expired. Please sign in again.');
    throw new Error('Your session expired. Please sign in again.');
  }
  return getToken();
}

function idempotencyKey(prefix) {
  const random = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${random}`.slice(0, 128);
}

async function apiRequest(path, { method = 'GET', body, idempotent } = {}) {
  const usingStaffSession = !!staffSession;
  const token = await getActiveToken();
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
    if (res.status === 401 && usingStaffSession) {
      clearExpiredSession('Your session expired. Please sign in again.');
    }
    const detail = (payload && (payload.detail || payload.title)) || `Request failed (HTTP ${res.status})`;
    throw new Error(detail);
  }
  return payload;
}

// Amounts in `state` are Naira (display units). The API stores money as
// minor units (kobo) per its money-as-integer design — never floats.
export const toMinor = (nairaAmount) => Math.round(nairaAmount * 100);
export const fromMinor = (minorAmount) => Math.round(minorAmount) / 100;

function toQueryString(params) {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  });
  const str = query.toString();
  return str ? `?${str}` : '';
}

export const wellipayApi = {
  createInvoice: (body) => apiRequest('/provider/invoices', { method: 'POST', body, idempotent: 'inv' }),
  getInvoice: (invoiceId) => apiRequest(`/provider/invoices/${encodeURIComponent(invoiceId)}`),
  listInvoices: (query) => apiRequest(`/provider/invoices${toQueryString(query)}`),
  createFamilyFundingRequest: (body) =>
    apiRequest('/provider/family-funding-requests', { method: 'POST', body, idempotent: 'fund' }),
  createEligibilityCheck: (body) =>
    apiRequest('/provider/eligibility-checks', { method: 'POST', body, idempotent: 'elig' }),
  createFinancialConsent: (body) =>
    apiRequest('/provider/financial-consents', { method: 'POST', body, idempotent: 'consent' }),
  listPatients: (query) => apiRequest(`/provider/patients${toQueryString(query)}`),
  listPayments: (query) => apiRequest(`/provider/payments${toQueryString(query)}`),
  createPayment: (body) => apiRequest('/provider/payments', { method: 'POST', body, idempotent: 'pmt' }),
  listClaims: (query) => apiRequest(`/provider/claims${toQueryString(query)}`),
  createClaim: (body) => apiRequest('/provider/claims', { method: 'POST', body, idempotent: 'claim' }),
  updateClaimStatus: (claimId, body) =>
    apiRequest(`/provider/claims/${encodeURIComponent(claimId)}/status`, { method: 'PATCH', body }),
  createRefund: (body) => apiRequest('/provider/refunds', { method: 'POST', body, idempotent: 'ref' }),
  listRefunds: (query) => apiRequest(`/provider/refunds${toQueryString(query)}`),
  decideRefund: (refundId, body) =>
    apiRequest(`/provider/refunds/${encodeURIComponent(refundId)}/decision`, { method: 'PATCH', body }),
  listUnmatchedTransactions: (query) => apiRequest(`/provider/unmatched-transactions${toQueryString(query)}`),
  matchUnmatchedTransaction: (transactionId, body) =>
    apiRequest(`/provider/unmatched-transactions/${encodeURIComponent(transactionId)}/match`, { method: 'POST', body }),
  flagUnmatchedTransactionException: (transactionId, body) =>
    apiRequest(`/provider/unmatched-transactions/${encodeURIComponent(transactionId)}/exception`, { method: 'POST', body }),
  createStaff: (body) => apiRequest('/provider/staff', { method: 'POST', body, idempotent: 'staff' }),
  listStaff: (query) => apiRequest(`/provider/staff${toQueryString(query)}`),
  updateStaffStatus: (staffId, body) =>
    apiRequest(`/provider/staff/${encodeURIComponent(staffId)}/status`, { method: 'PATCH', body }),
  setStaffPassword: (staffId, body) =>
    apiRequest(`/provider/staff/${encodeURIComponent(staffId)}/password`, { method: 'PATCH', body }),
  createPaymentPlan: (body) => apiRequest('/provider/payment-plans', { method: 'POST', body, idempotent: 'plan' }),
  listPaymentPlans: (query) => apiRequest(`/provider/payment-plans${toQueryString(query)}`),
  payPlanInstallment: (planId, seq, body) =>
    apiRequest(`/provider/payment-plans/${encodeURIComponent(planId)}/installments/${seq}/pay`, { method: 'POST', body }),
  createSettlement: (body) => apiRequest('/provider/settlements', { method: 'POST', body, idempotent: 'settle' }),
  listSettlements: (query) => apiRequest(`/provider/settlements${toQueryString(query)}`),
  confirmSettlement: (settlementId) =>
    apiRequest(`/provider/settlements/${encodeURIComponent(settlementId)}/confirm`, { method: 'PATCH' }),
  listEvents: (query) => apiRequest(`/provider/events${toQueryString(query)}`),
  createFinancingRecord: (body) => apiRequest('/provider/financing-records', { method: 'POST', body, idempotent: 'fin' }),
  listFinancingRecords: (query) => apiRequest(`/provider/financing-records${toQueryString(query)}`),
  createPartner: (body) => apiRequest('/provider/partners', { method: 'POST', body, idempotent: 'ptr' }),
  listPartners: (query) => apiRequest(`/provider/partners${toQueryString(query)}`),
  createReferral: (body) => apiRequest('/provider/referrals', { method: 'POST', body, idempotent: 'refl' }),
  listReferrals: (query) => apiRequest(`/provider/referrals${toQueryString(query)}`),
  completeReferral: (referralId) =>
    apiRequest(`/provider/referrals/${encodeURIComponent(referralId)}/status`, { method: 'PATCH', body: { status: 'COMPLETED' } }),
  listEligibilityChecks: (query) => apiRequest(`/provider/eligibility-checks${toQueryString(query)}`),
  listFinancialConsents: (query) => apiRequest(`/provider/financial-consents${toQueryString(query)}`),
};
