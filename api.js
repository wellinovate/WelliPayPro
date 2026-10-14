// WelliPay API client — talks to the live wellipay-api backend (Fastify +
// Postgres) instead of the mock arrays in app.js's `state` object.
//
// Every request carries the signed-in staff member's own token from
// POST /staff/login. There is no shared token: the API's
// /public/frontend-token endpoint is off, and without a session a request
// fails and the console shows the login screen.
//
// Override this from index.html before app.js loads if needed:
//   <script>window.WELLIPAY_API_BASE = 'https://your-env.onrender.com';</script>
const API_BASE = window.WELLIPAY_API_BASE || 'https://wellipay-api.onrender.com';

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
    tenant: payload.tenant || null,
  };
  persistStaffSession();
  return staffSession.staff;
}

// The signed-in provider's own name and type, from the login response.
export function getTenant() {
  return staffSession?.tenant || null;
}

// Public calls a provider makes before it has an account. No token.
async function publicRequest(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error((payload && (payload.detail || payload.title)) || `Request failed (HTTP ${res.status})`);
  }
  return payload;
}

export const fetchBanks = () => publicRequest('/onboarding/banks');
export const fetchApplicationTerms = () => publicRequest('/onboarding/terms');
export const submitProviderApplication = (body) => publicRequest('/onboarding/applications', { method: 'POST', body });

export function logoutStaff() {
  staffSession = null;
  persistStaffSession();
}

// Renew a token that is about to expire, so a person who keeps working is not
// signed out. One renewal runs at a time; callers wait for it.
const RENEW_WITHIN_MS = 3 * 60 * 1000;
let renewalInFlight = null;

function renewSession() {
  if (!renewalInFlight) {
    const sent = staffSession;
    renewalInFlight = fetch(`${API_BASE}/staff/refresh`, { method: 'POST', headers: { Authorization: `Bearer ${sent.token}` } })
      .then(async res => {
        const payload = await res.json().catch(() => null);
        // Only apply the result if the same session is still active.
        if (res.ok && payload && payload.access_token && staffSession === sent) {
          staffSession = {
            ...sent,
            token: payload.access_token,
            expiresAt: Date.now() + payload.expires_in * 1000,
            staff: payload.staff || sent.staff,
          };
          persistStaffSession();
        }
      })
      .catch(() => { /* a network failure leaves the current token to run out */ })
      .finally(() => { renewalInFlight = null; });
  }
  return renewalInFlight;
}

async function getActiveToken() {
  if (staffSession) {
    if (staffSession.expiresAt - Date.now() <= RENEW_WITHIN_MS && staffSession.expiresAt - Date.now() > 0) {
      await renewSession();
    }
    if (staffSession && staffSession.expiresAt - Date.now() > 15000) return staffSession.token;
    clearExpiredSession('Your session expired. Please sign in again.');
    throw new Error('Your session expired. Please sign in again.');
  }
  const message = 'Please sign in to continue.';
  if (sessionExpiredHandler) sessionExpiredHandler(message);
  throw new Error(message);
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
  listFamilyFundingRequests: (query) => apiRequest(`/provider/family-funding-requests${toQueryString(query)}`),
  createFamilyFundingRequest: (body) =>
    apiRequest('/provider/family-funding-requests', { method: 'POST', body, idempotent: 'fund' }),
  createEligibilityCheck: (body) =>
    apiRequest('/provider/eligibility-checks', { method: 'POST', body, idempotent: 'elig' }),
  createFinancialConsent: (body) =>
    apiRequest('/provider/financial-consents', { method: 'POST', body, idempotent: 'consent' }),
  listPatientRecords: (query) => apiRequest(`/provider/patient-records${toQueryString(query)}`),
  createPatientRecord: (body) => apiRequest('/provider/patient-records', { method: 'POST', body }),
  listHmoPolicies: (query) => apiRequest(`/provider/hmo-policies${toQueryString(query)}`),
  createHmoPolicy: (body) => apiRequest('/provider/hmo-policies', { method: 'POST', body }),
  listBookings: (query) => apiRequest(`/provider/bookings${toQueryString(query)}`),
  createBooking: (body) => apiRequest('/provider/bookings', { method: 'POST', body }),
  updateBooking: (id, body) => apiRequest(`/provider/bookings/${encodeURIComponent(id)}`, { method: 'PATCH', body }),
  listCorporateAccounts: () => apiRequest('/provider/corporate-accounts'),
  createCorporateAccount: (body) => apiRequest('/provider/corporate-accounts', { method: 'POST', body }),
  updateCorporateAccount: (id, body) => apiRequest(`/provider/corporate-accounts/${encodeURIComponent(id)}`, { method: 'PATCH', body }),
  getCorporateStatement: (id) => apiRequest(`/provider/corporate-accounts/${encodeURIComponent(id)}/statement`),
  listServiceItems: (query) => apiRequest(`/provider/service-items${toQueryString(query)}`),
  createServiceItem: (body) => apiRequest('/provider/service-items', { method: 'POST', body }),
  updateServiceItem: (id, body) => apiRequest(`/provider/service-items/${encodeURIComponent(id)}`, { method: 'PATCH', body }),
  listDiagnosticCatalogue: (query) => apiRequest(`/provider/catalogue/diagnostic-tests${toQueryString(query)}`),
  offerDiagnosticTests: (body) => apiRequest('/provider/catalogue/diagnostic-tests/offers', { method: 'POST', body }),
  listCheckupPackages: () => apiRequest('/provider/checkup-packages'),
  createCheckupPackage: (body) => apiRequest('/provider/checkup-packages', { method: 'POST', body }),
  updateCheckupPackage: (id, body) => apiRequest(`/provider/checkup-packages/${encodeURIComponent(id)}`, { method: 'PATCH', body }),
  listPatients: (query) => apiRequest(`/provider/patients${toQueryString(query)}`),
  listPayments: (query) => apiRequest(`/provider/payments${toQueryString(query)}`),
  listPaystackSettlements: (query) => apiRequest(`/provider/paystack/settlements${toQueryString(query)}`),
  createPaystackCharge: (body) => apiRequest('/provider/paystack/charges', { method: 'POST', body }),
  getPaystackCharge: (reference) => apiRequest(`/provider/paystack/charges/${encodeURIComponent(reference)}`),
  createPayment: (body) => apiRequest('/provider/payments', { method: 'POST', body, idempotent: 'pmt' }),
  listClaims: (query) => apiRequest(`/provider/claims${toQueryString(query)}`),
  createClaim: (body) => apiRequest('/provider/claims', { method: 'POST', body, idempotent: 'claim' }),
  updateClaimStatus: (claimId, body) =>
    apiRequest(`/provider/claims/${encodeURIComponent(claimId)}/status`, { method: 'PATCH', body }),
  createRefund: (body) => apiRequest('/provider/refunds', { method: 'POST', body, idempotent: 'ref' }),
  listRefunds: (query) => apiRequest(`/provider/refunds${toQueryString(query)}`),
  refreshRefundGatewayStatus: (refundId) =>
    apiRequest(`/provider/refunds/${encodeURIComponent(refundId)}/gateway-status`, { method: 'POST' }),
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
  updateStaffAccessLevel: (staffId, body) =>
    apiRequest(`/provider/staff/${encodeURIComponent(staffId)}/access-level`, { method: 'PATCH', body }),
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
