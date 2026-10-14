// Mock of wellipay-api for the console tests. Every request is answered here;
// nothing leaves the machine. `routes` maps "METHOD /path" to a function that
// returns [status, body]. Unlisted GETs return an empty list.
const API = 'https://wellipay-api.onrender.com';
const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': '*',
  'access-control-allow-methods': '*',
};

export async function mockApi(page, { level = 'ADMIN', providerType = 'HOSPITAL', routes = {} } = {}) {
  const calls = [];
  await page.route(`${API}/**`, async route => {
    const req = route.request();
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
    const path = new URL(req.url()).pathname;
    const key = `${req.method()} ${path}`;
    const body = req.postData() ? JSON.parse(req.postData()) : undefined;
    calls.push({ key, body });
    const reply = (status, payload) => route.fulfill({
      status, headers: CORS, contentType: 'application/json', body: JSON.stringify(payload),
    });
    if (key === 'POST /staff/login' && !routes[key]) {
      return reply(200, {
        access_token: 't', expires_in: 900,
        staff: { id: 's1', name: 'Ada Obi', email: 'a@b.co', role: 'Staff', accessLevel: level },
        tenant: { name: 'Test Hospital', providerType },
      });
    }
    if (routes[key]) {
      const [status, payload] = routes[key](body, req);
      return reply(status, payload);
    }
    return reply(200, { items: [], total: 0 });
  });
  return calls;
}

export async function signIn(page, email = 'a@b.co', password = 'password') {
  await page.goto('/');
  await page.fill('#login-email', email);
  await page.fill('#login-password', password);
  await page.click('#login-submit');
}

export const patientRecords = {
  items: [{ patientRecordId: 'r0', patientRef: 'P-100000', fullName: 'Blessing Kalu', phone: '08031234567', createdAt: '2026-10-01T00:00:00Z' }],
  total: 1,
};
export const openInvoice = {
  invoiceId: 'i1', providerInvoiceRef: 'INV-7', facilityRef: 'facility-main', patientRef: 'P-100000',
  description: 'Consultation', amountMinor: 550000, paidAmountMinor: 0, status: 'OPEN', createdAt: '2026-10-01T00:00:00Z',
};
