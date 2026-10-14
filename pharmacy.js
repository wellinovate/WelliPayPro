// Pharmacy workspace: products, inventory, prescriptions and orders with delivery.
// app.js passes in its helpers once, so this file holds no global state of its own.
import { wellipayApi, toMinor, fromMinor } from './api.js';

const CATEGORY_LABEL = { MEDICINE: 'Medicine', CONSUMABLE: 'Medical consumable', DEVICE: 'Medical device' };
const CLASS_LABEL = { OTC: 'Over the counter', PRESCRIPTION_ONLY: 'Prescription only', CONTROLLED: 'Controlled' };
const STOCK_LABEL = { OK: 'In stock', LOW: 'Low', OUT: 'Out of stock' };
const EXPIRY_LABEL = { OK: 'OK', NEAR: 'Near expiry', EXPIRED: 'Expired', NO_EXPIRY: 'No expiry' };
const RX_STATUS_LABEL = { SUBMITTED: 'Waiting', VERIFIED: 'Verified', REJECTED: 'Rejected', CANCELLED: 'Cancelled', COMPLETED: 'Supplied' };
const ORDER_STATUS_LABEL = { AWAITING_DISPENSING: 'Awaiting dispensing', DISPENSED: 'Dispensed', CANCELLED: 'Cancelled' };
const DELIVERY_LABEL = { NOT_APPLICABLE: '—', PENDING: 'Not sent yet', OUT_FOR_DELIVERY: 'Out for delivery', DELIVERED: 'Delivered', FAILED: 'Failed' };
const ADJUST_REASONS = { COUNT_CORRECTION: 'Count correction', DAMAGED: 'Damaged', LOST: 'Lost', FOUND: 'Found', OTHER: 'Other' };
const WRITE_OFF_REASONS = { EXPIRED: 'Expired', DAMAGED: 'Damaged', RECALLED: 'Recalled' };
const MOVEMENT_LABEL = { RECEIPT: 'Received', DISPENSE: 'Dispensed', ADJUSTMENT: 'Adjusted', WRITE_OFF: 'Written off' };

export const PHARMACY_PAGES = ['pharmacy-products', 'pharmacy-inventory', 'pharmacy-prescriptions', 'pharmacy-orders', 'pharmacy-register'];

export function createPharmacy(ctx) {
  const { state, render, card, tag, pageHeading, metricGrid, escapeHtml: esc, money, showToast } = ctx;
  const m = minor => money(fromMinor(minor));

  const ph = {
    products: [], productsSynced: false, productsError: '',
    filter: { q: '', category: '', cls: '', stock: '' },
    services: [], servicesSynced: false,
    suppliers: [], suppliersSynced: false,
    alerts: null, alertsError: '',
    movements: [],
    prescriptions: [], rxSynced: false, rxError: '', rxStatus: 'SUBMITTED',
    orders: [], ordersSynced: false, ordersError: '', orderStatus: '',
    couriers: [], couriersSynced: false,
    balances: [], register: [], registerSynced: false, registerError: '', regFilter: { productId: '', from: '', to: '' },
  };
  const inflight = {};
  const failed = {};
  let lastPage = '';
  // One request per key at a time. A failure is remembered so the page does not retry in a loop.
  function once(key, fn) {
    if (failed[key]) return null;
    if (!inflight[key]) inflight[key] = fn().catch(() => { failed[key] = true; }).finally(() => { inflight[key] = null; render(); });
    return inflight[key];
  }

  /* Loading */
  const loadProducts = () => once('products', () =>
    wellipayApi.listPharmacyProducts({ includeInactive: 'true' })
      .then(d => { ph.products = d.items; ph.productsSynced = true; ph.productsError = ''; })
      .catch(e => { ph.productsError = `Products not loaded: ${e.message}`; showToast('API Sync Failed', ph.productsError); throw e; }));
  const loadServices = () => once('services', () =>
    wellipayApi.listPharmacyServices().then(d => { ph.services = d.services; ph.servicesSynced = true; }));
  const loadSuppliers = () => once('suppliers', () =>
    wellipayApi.listSuppliers().then(d => { ph.suppliers = d.items; ph.suppliersSynced = true; }));
  const loadAlerts = () => once('alerts', () =>
    wellipayApi.getInventoryAlerts()
      .then(d => { ph.alerts = d; ph.alertsError = ''; })
      .catch(e => { ph.alertsError = `Alerts not loaded: ${e.message}`; throw e; }));
  const loadMovements = () => once('movements', () => wellipayApi.listStockMovements({ limit: 30 }).then(d => { ph.movements = d.items; }));
  const loadPrescriptions = () => once('rx', () =>
    wellipayApi.listPrescriptions({ ...(ph.rxStatus ? { status: ph.rxStatus } : {}), limit: 100 })
      .then(d => { ph.prescriptions = d.items; ph.rxSynced = true; ph.rxError = ''; })
      .catch(e => { ph.rxError = `Prescriptions not loaded: ${e.message}`; showToast('API Sync Failed', ph.rxError); throw e; }));
  const loadOrders = () => once('orders', () =>
    wellipayApi.listPharmacyOrders({ ...(ph.orderStatus ? { status: ph.orderStatus } : {}), limit: 100 })
      .then(d => { ph.orders = d.items; ph.ordersSynced = true; ph.ordersError = ''; })
      .catch(e => { ph.ordersError = `Orders not loaded: ${e.message}`; showToast('API Sync Failed', ph.ordersError); throw e; }));

  const loadCouriers = () => once('couriers', () => wellipayApi.listCouriers().then(d => { ph.couriers = d.items; ph.couriersSynced = true; }));
  const loadRegister = () => once('register', () => Promise.all([
    wellipayApi.getRegisterBalances(),
    wellipayApi.listControlledRegister({ ...regQuery(), limit: 300 }),
  ]).then(([b, r]) => { ph.balances = b.items; ph.register = r.items; ph.registerSynced = true; ph.registerError = ''; })
    .catch(e => { ph.registerError = `Register not loaded: ${e.message}`; showToast('API Sync Failed', ph.registerError); throw e; }));
  const regQuery = () => ({ ...(ph.regFilter.productId ? { productId: ph.regFilter.productId } : {}), ...(ph.regFilter.from ? { from: ph.regFilter.from } : {}), ...(ph.regFilter.to ? { to: ph.regFilter.to } : {}) });

  // Called from render() after the page is drawn.
  function sync(page) {
    if (page !== lastPage) {
      lastPage = page;
      for (const k of Object.keys(failed)) delete failed[k];
      ph.productsError = ''; ph.alertsError = ''; ph.rxError = ''; ph.ordersError = ''; ph.registerError = ''; ph.invoicesTried = false;
    }
    if (page === 'pharmacy-products') {
      if (!ph.productsSynced && !ph.productsError) loadProducts();
      if (!ph.servicesSynced) loadServices();
    }
    if (page === 'pharmacy-inventory') {
      if (!ph.productsSynced && !ph.productsError) loadProducts();
      if (!ph.suppliersSynced) loadSuppliers();
      if (!ph.alerts && !ph.alertsError) { loadAlerts(); loadMovements(); }
    }
    if (page === 'pharmacy-prescriptions') {
      if (!ph.rxSynced && !ph.rxError) loadPrescriptions();
      if (!ph.productsSynced && !ph.productsError) loadProducts();
    }
    if (page === 'pharmacy-register') {
      if (!ph.productsSynced && !ph.productsError) loadProducts();
      if (!ph.registerSynced && !ph.registerError) loadRegister();
    }
    if (page === 'pharmacy-orders') {
      if (!ph.ordersSynced && !ph.ordersError) loadOrders();
      if (!ph.couriersSynced) loadCouriers();
      if (!state.invoicesSynced && !ph.invoicesTried) { ph.invoicesTried = true; ctx.syncInvoices(); }
    }
  }

  const productName = p => p.displayName || p.genericName;
  const patientName = ref => (state.patientList.find(p => p.id === ref) || {}).name || ref;
  const nair = v => (v === '' || v == null ? NaN : Number(v));
  const val = (fd, k) => (fd.get(k) ?? '').toString().trim();
  const opt = (obj, k, v) => { if (v !== '') obj[k] = v; };

  function stockTag(p) {
    const type = p.stockLevel === 'OK' ? 'neutral' : 'accent';
    return tag(`${p.available} · ${STOCK_LABEL[p.stockLevel] || p.stockLevel}`, type);
  }

  /* Products page */
  function filteredProducts() {
    const f = ph.filter;
    const q = f.q.toLowerCase();
    return ph.products.filter(p =>
      (!f.category || p.category === f.category) &&
      (!f.cls || p.dispensingClass === f.cls) &&
      (!f.stock || (f.stock === 'low' ? p.stockLevel === 'LOW' : p.stockLevel === 'OUT')) &&
      (!q || `${p.genericName} ${p.brandName || ''} ${p.sku} ${p.barcode || ''}`.toLowerCase().includes(q)));
  }

  function renderProducts() {
    const rows = filteredProducts();
    const all = ph.products.filter(p => p.active);
    const body = !ph.productsSynced
      ? `<p class="empty-state">${ph.productsError ? esc(ph.productsError) : 'Loading products…'}</p>`
      : rows.length
        ? `<div class="table-wrap"><table class="table">
          <thead><tr><th>Product</th><th>Type</th><th>Dispensing</th><th>Price</th><th>Stock</th><th>Next expiry</th><th></th></tr></thead>
          <tbody>${rows.map(p => `<tr>
            <td><strong>${esc(productName(p))}</strong><br><small style="color:var(--muted)">${esc(p.sku)}${p.nafdacNumber ? ' · NAFDAC ' + esc(p.nafdacNumber) : ''}</small></td>
            <td>${esc(CATEGORY_LABEL[p.category] || p.category)}</td>
            <td>${tag(esc(CLASS_LABEL[p.dispensingClass] || p.dispensingClass), p.dispensingClass === 'OTC' ? 'outline' : 'accent')}</td>
            <td>${m(p.priceMinor)}<br><small style="color:var(--muted)">per ${esc(p.unit)}</small></td>
            <td>${p.active ? stockTag(p) : tag('Off', 'outline')}${p.expiredOnHand ? `<br><small style="color:var(--muted)">${p.expiredOnHand} expired on shelf</small>` : ''}</td>
            <td>${p.nearestExpiry ? esc(p.nearestExpiry) : '—'}</td>
            <td><button class="btn btn-secondary" data-action="ph-edit-product" data-id="${esc(p.productId)}">Edit</button>
                <button class="btn btn-secondary" data-action="ph-batches" data-id="${esc(p.productId)}">Batches</button>
                <button class="btn btn-ghost" data-action="ph-toggle-product" data-id="${esc(p.productId)}">${p.active ? 'Switch off' : 'Switch on'}</button></td>
          </tr>`).join('')}</tbody></table></div>`
        : '<p class="empty-state">No products match. Use Add product to list the first one.</p>';
    const f = ph.filter;
    const sel = (name, opts, cur) => `<select class="input" name="${name}" aria-label="${name}">${opts.map(([v, l]) => `<option value="${v}" ${cur === v ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
    const filters = `<form id="ph-filter-form" class="form-grid" style="grid-template-columns:2fr 1fr 1fr 1fr;gap:8px;margin:0 0 12px">
      <input class="input" name="q" placeholder="Search name, brand, SKU or barcode" value="${esc(f.q)}">
      ${sel('category', [['', 'All types'], ...Object.entries(CATEGORY_LABEL)], f.category)}
      ${sel('cls', [['', 'All dispensing'], ...Object.entries(CLASS_LABEL)], f.cls)}
      ${sel('stock', [['', 'All stock'], ['low', 'Low stock'], ['out', 'Out of stock']], f.stock)}
    </form>`;
    const metrics = ph.productsSynced
      ? [[String(all.length), 'Products', 'Active'], [String(all.filter(p => p.dispensingClass !== 'OTC').length), 'Restricted', 'Rx and controlled'], [String(all.filter(p => p.stockLevel === 'LOW').length), 'Low stock', 'At or below reorder level'], [String(all.filter(p => p.stockLevel === 'OUT').length), 'Out of stock', 'Nothing usable']]
      : [['…', 'Products', 'Loading'], ['…', 'Restricted', 'Loading'], ['…', 'Low stock', 'Loading'], ['…', 'Out of stock', 'Loading']];
    return `<div class="page">
      ${pageHeading('Pharmacy', 'Products', 'Medicines, consumables and devices. Stock comes from the batches you receive.')}
      ${metricGrid(metrics)}
      ${card('<div class="section-heading"><span>Product catalogue</span><button class="btn btn-primary" data-action="ph-new-product">Add product</button></div>', filters + body)}
      ${renderServices()}
    </div>`;
  }

  function renderServices() {
    const body = !ph.servicesSynced
      ? '<p class="empty-state">Loading services…</p>'
      : `<div class="table-wrap"><table class="table"><thead><tr><th>Service</th><th>Time</th><th>Price</th><th>Status</th><th></th></tr></thead><tbody>
        ${ph.services.map(s => `<tr><td><strong>${esc(s.name)}</strong><br><small style="color:var(--muted)">${esc(s.description)}</small></td><td>${esc(s.turnaround)}</td>
          <td>${s.offer ? m(s.offer.unitPriceMinor) : '—'}</td>
          <td>${s.offer ? tag(s.offer.active ? 'Offered' : 'Off', s.offer.active ? 'neutral' : 'outline') : tag('Not offered', 'outline')}</td>
          <td>${s.offer ? `<button class="btn btn-secondary" data-action="ph-service-price" data-id="${esc(s.offer.serviceItemId)}">Change price</button>
            <button class="btn btn-ghost" data-action="ph-service-toggle" data-id="${esc(s.offer.serviceItemId)}">${s.offer.active ? 'Switch off' : 'Switch on'}</button>` : ''}</td></tr>`).join('')}
        </tbody></table></div>`;
    return card('<div class="section-heading"><span>Pharmacy services</span><button class="btn btn-secondary" data-action="ph-offer-services">Offer services</button></div>',
      `<p style="font-size:13px;color:var(--muted);margin:0 0 8px">List only the services you provide. Prices are changed here and show on the Services &amp; Pricing list.</p>${body}`);
  }

  function productModal() {
    const p = state.modal.productId ? ph.products.find(x => x.productId === state.modal.productId) : null;
    const v = k => (p && p[k] != null ? esc(p[k]) : '');
    return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="ph-product-title">
      <h2 id="ph-product-title">${p ? 'Edit product' : 'Add product'}</h2>
      <form id="ph-product-form" class="form-grid" data-id="${p ? esc(p.productId) : ''}">
        <div class="form-grid two-col">
          <div class="form-group"><label>Type *</label><select name="category" ${p ? 'disabled' : ''}>${Object.entries(CATEGORY_LABEL).map(([k, l]) => `<option value="${k}" ${p && p.category === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
          <div class="form-group"><label>Dispensing *</label><select name="dispensingClass">${Object.entries(CLASS_LABEL).map(([k, l]) => `<option value="${k}" ${p && p.dispensingClass === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        </div>
        <div class="form-grid two-col">
          <div class="form-group"><label>Generic name *</label><input class="input" name="genericName" required minlength="2" maxlength="120" value="${v('genericName')}" placeholder="e.g. Amoxicillin"></div>
          <div class="form-group"><label>Brand name</label><input class="input" name="brandName" maxlength="120" value="${v('brandName')}"></div>
        </div>
        <div class="form-grid two-col">
          <div class="form-group"><label>Strength</label><input class="input" name="strength" maxlength="40" value="${v('strength')}" placeholder="e.g. 500mg"></div>
          <div class="form-group"><label>Dosage form</label><input class="input" name="dosageForm" maxlength="40" value="${v('dosageForm')}" placeholder="e.g. Capsule"></div>
        </div>
        <div class="form-grid two-col">
          <div class="form-group"><label>Pack size</label><input class="input" name="packSize" maxlength="60" value="${v('packSize')}" placeholder="e.g. 21 capsules"></div>
          <div class="form-group"><label>Sold per</label><input class="input" name="unit" maxlength="20" value="${p ? v('unit') : 'pack'}"></div>
        </div>
        <div class="form-grid two-col">
          <div class="form-group"><label>Price (₦) *</label><input class="input" type="number" name="price" required min="1" step="any" value="${p ? p.priceMinor / 100 : ''}"></div>
          <div class="form-group"><label>Reorder level</label><input class="input" type="number" name="reorderLevel" min="0" step="1" value="${p ? p.reorderLevel : 0}"></div>
        </div>
        <div class="form-grid two-col">
          <div class="form-group"><label>NAFDAC number</label><input class="input" name="nafdacNumber" maxlength="30" value="${v('nafdacNumber')}"></div>
          <div class="form-group"><label>Barcode</label><input class="input" name="barcode" maxlength="40" value="${v('barcode')}"></div>
        </div>
        <div class="form-group"><label>Manufacturer</label><input class="input" name="manufacturer" maxlength="120" value="${v('manufacturer')}"></div>
        <div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit" id="ph-product-submit">Save</button></div>
      </form></section></div>`;
  }

  async function submitProduct(form) {
    const fd = new FormData(form);
    const id = form.dataset.id;
    const price = nair(val(fd, 'price'));
    if (!(price > 0)) { showToast('Check the price', 'Enter a price above zero.'); return; }
    const body = {
      genericName: val(fd, 'genericName'),
      dispensingClass: val(fd, 'dispensingClass'),
      priceMinor: toMinor(price),
      unit: val(fd, 'unit') || 'pack',
      reorderLevel: Math.max(0, Math.round(Number(val(fd, 'reorderLevel')) || 0)),
    };
    const optional = ['brandName', 'strength', 'dosageForm', 'packSize', 'nafdacNumber', 'barcode', 'manufacturer'];
    if (id) for (const k of optional) body[k] = val(fd, k) || null;
    else { body.category = val(fd, 'category'); for (const k of optional) opt(body, k, val(fd, k)); }
    const btn = document.getElementById('ph-product-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
    try {
      const saved = id ? await wellipayApi.updatePharmacyProduct(id, body) : await wellipayApi.createPharmacyProduct(body);
      ph.products = id ? ph.products.map(p => p.productId === id ? saved : p) : [saved, ...ph.products];
      state.modal = null;
      showToast('Product saved', productName(saved));
      render();
    } catch (err) {
      showToast('Product not saved', err.message);
      if (btn) { btn.disabled = false; btn.textContent = 'Save'; }
    }
  }

  async function toggleProduct(id) {
    const p = ph.products.find(x => x.productId === id);
    if (!p) return;
    try {
      const saved = await wellipayApi.updatePharmacyProduct(id, { active: !p.active });
      ph.products = ph.products.map(x => x.productId === id ? saved : x);
      render();
    } catch (err) { showToast('Product not changed', err.message); }
  }

  function offerModal() {
    const open = ph.services.filter(s => !s.offer);
    return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="ph-offer-title">
      <h2 id="ph-offer-title">Offer pharmacy services</h2>
      <p>Tick the services you provide and set a price for each.</p>
      <form id="ph-offer-form" class="form-grid">
        ${open.length ? open.map(s => `<div class="form-grid two-col" style="align-items:center"><label style="font-size:13px"><input type="checkbox" name="svc" value="${esc(s.code)}"> ${esc(s.name)}</label><input class="input" type="number" min="1" step="any" name="price-${esc(s.code)}" placeholder="Price (₦)" aria-label="Price for ${esc(s.name)}"></div>`).join('') : '<p class="empty-state">Every service is already offered.</p>'}
        <div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button>${open.length ? '<button class="btn btn-primary" type="submit" id="ph-offer-submit">Add services</button>' : ''}</div>
      </form></section></div>`;
  }

  async function submitOffers(form) {
    const fd = new FormData(form);
    const services = [];
    for (const code of fd.getAll('svc')) {
      const price = nair(val(fd, `price-${code}`));
      if (!(price > 0)) { showToast('Check the prices', 'Enter a price for each ticked service.'); return; }
      services.push({ code: String(code), unitPriceMinor: toMinor(price) });
    }
    if (!services.length) { showToast('Nothing ticked', 'Tick at least one service.'); return; }
    const btn = document.getElementById('ph-offer-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
    try {
      const r = await wellipayApi.offerPharmacyServices({ services });
      ph.servicesSynced = false;
      state.priceListSynced = false;
      state.modal = null;
      showToast('Services added', `${r.created.length} added${r.skipped.length ? `, ${r.skipped.length} skipped` : ''}.`);
      render();
    } catch (err) {
      showToast('Services not added', err.message);
      if (btn) { btn.disabled = false; btn.textContent = 'Add services'; }
    }
  }

  /* Batches for one product */
  async function openBatches(id) {
    state.modal = { type: 'ph-batches', productId: id, detail: null };
    render();
    try {
      const d = await wellipayApi.getPharmacyProduct(id);
      if (state.modal && state.modal.type === 'ph-batches' && state.modal.productId === id) { state.modal.detail = d; render(); }
    } catch (err) { showToast('Batches not loaded', err.message); }
  }

  function batchesModal() {
    const d = state.modal.detail;
    const body = !d ? '<p class="empty-state">Loading batches…</p>'
      : d.batches.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Batch</th><th>Expiry</th><th>On hand</th>${d.batches.some(b => b.costMinor !== undefined) ? '<th>Cost each</th>' : ''}<th>Status</th><th></th></tr></thead><tbody>
        ${d.batches.map(b => `<tr><td><strong>${esc(b.batchNo)}</strong><br><small style="color:var(--muted)">Received ${esc(b.receivedAt.slice(0, 10))} · ${b.quantityReceived} in</small></td>
          <td>${b.expiryDate ? esc(b.expiryDate) : '—'}<br>${tag(esc(EXPIRY_LABEL[b.expiryState] || b.expiryState), b.expiryState === 'OK' || b.expiryState === 'NO_EXPIRY' ? 'outline' : 'accent')}</td>
          <td>${b.quantityOnHand}</td>
          ${d.batches.some(x => x.costMinor !== undefined) ? `<td>${b.costMinor !== undefined ? m(b.costMinor) : '—'}</td>` : ''}
          <td>${b.status === 'QUARANTINED' ? tag('Quarantined', 'accent') + (b.quarantineReason ? `<br><small style="color:var(--muted)">${esc(b.quarantineReason)}</small>` : '') : tag('Active', 'neutral')}</td>
          <td>${b.quantityOnHand > 0 ? `<button class="btn btn-secondary" data-action="ph-batch-action" data-kind="adjust" data-id="${esc(b.batchId)}" data-label="${esc(d.displayName || '')} · ${esc(b.batchNo)}" data-onhand="${b.quantityOnHand}">Adjust</button>
            <button class="btn btn-secondary" data-action="ph-batch-action" data-kind="writeoff" data-id="${esc(b.batchId)}" data-label="${esc(d.displayName || '')} · ${esc(b.batchNo)}" data-onhand="${b.quantityOnHand}">Write off</button>` : ''}
            <button class="btn btn-ghost" data-action="ph-batch-action" data-kind="${b.status === 'QUARANTINED' ? 'release' : 'quarantine'}" data-id="${esc(b.batchId)}" data-label="${esc(d.displayName || '')} · ${esc(b.batchNo)}">${b.status === 'QUARANTINED' ? 'Release' : 'Quarantine'}</button></td></tr>`).join('')}
        </tbody></table></div>` : '<p class="empty-state">No stock received yet. Use Receive stock on the Inventory page.</p>';
    return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="ph-batches-title">
      <h2 id="ph-batches-title">${d ? esc(d.displayName || d.genericName) : 'Batches'}</h2>${body}
      <div class="modal-actions"><button class="btn btn-primary" data-action="close-modal">Close</button></div></section></div>`;
  }

  function batchActionModal() {
    const { kind, batchId, label, onhand } = state.modal;
    const title = { adjust: 'Adjust stock', writeoff: 'Write off batch', quarantine: 'Quarantine batch', release: 'Release batch' }[kind];
    let fields = '';
    if (kind === 'adjust') fields = `<div class="form-grid two-col"><div class="form-group"><label>Change (+ or −) *</label><input class="input" type="number" name="delta" required step="1" placeholder="e.g. -3"></div>
      <div class="form-group"><label>Reason *</label><select name="reason">${Object.entries(ADJUST_REASONS).map(([k, l]) => `<option value="${k}">${l}</option>`).join('')}</select></div></div>
      <div class="form-group"><label>Note (needed for "Other")</label><input class="input" name="note" maxlength="240"></div>`;
    if (kind === 'writeoff') fields = `<p>This removes all ${esc(onhand)} units still in the batch.</p><div class="form-group"><label>Reason *</label><select name="reason">${Object.entries(WRITE_OFF_REASONS).map(([k, l]) => `<option value="${k}">${l}</option>`).join('')}</select></div>
      <div class="form-group"><label>Note</label><input class="input" name="note" maxlength="240"></div>`;
    if (kind === 'quarantine') fields = '<div class="form-group"><label>Why *</label><input class="input" name="note" required minlength="3" maxlength="240" placeholder="e.g. Supplier recall notice"></div><p style="font-size:12px;color:var(--muted)">A quarantined batch is not sold or dispensed.</p>';
    if (kind === 'release') fields = '<p>The batch goes back on sale.</p>';
    return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="ph-ba-title">
      <h2 id="ph-ba-title">${title}</h2><p>${esc(label)}</p>
      <form id="ph-batch-action-form" class="form-grid" data-kind="${kind}" data-id="${esc(batchId)}">${fields}
        <div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit" id="ph-ba-submit">Confirm</button></div>
      </form></section></div>`;
  }

  async function submitBatchAction(form) {
    const fd = new FormData(form);
    const kind = form.dataset.kind;
    const id = form.dataset.id;
    const note = val(fd, 'note');
    const btn = document.getElementById('ph-ba-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
    try {
      if (kind === 'adjust') {
        const delta = Math.round(Number(val(fd, 'delta')));
        if (!delta) { showToast('Check the change', 'Enter a number other than zero.'); if (btn) { btn.disabled = false; btn.textContent = 'Confirm'; } return; }
        await wellipayApi.adjustStock({ batchId: id, delta, reason: val(fd, 'reason'), ...(note ? { note } : {}) });
      } else if (kind === 'writeoff') await wellipayApi.writeOffStock({ batchId: id, reason: val(fd, 'reason'), ...(note ? { note } : {}) });
      else await wellipayApi.quarantineBatch(id, { quarantined: kind === 'quarantine', ...(note ? { reason: note } : {}) });
      showToast('Stock updated');
      refreshStock();
      const back = state.modal.productId;
      state.modal = back ? { type: 'ph-batches', productId: back, detail: null } : null;
      if (back) openBatches(back); else render();
    } catch (err) {
      showToast('Stock not changed', err.message);
      if (btn) { btn.disabled = false; btn.textContent = 'Confirm'; }
    }
  }

  function refreshStock() {
    ph.productsSynced = false; ph.alerts = null; ph.alertsError = '';
    loadProducts();
    if (state.active === 'pharmacy-inventory') { loadAlerts(); loadMovements(); }
  }

  /* Inventory page */
  function alertTable(title, rows, cols, empty) {
    return card(`<div class="section-heading"><span>${title}</span></div>`, rows.length
      ? `<div class="table-wrap"><table class="table"><thead><tr>${cols.map(c => `<th>${c[0]}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${cols.map(c => `<td>${c[1](r)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
      : `<p class="empty-state">${empty}</p>`);
  }

  function renderInventory() {
    const a = ph.alerts;
    const metrics = a
      ? [[String(a.summary.lowStock + a.summary.outOfStock), 'Reorder now', 'Low or out'], [String(a.summary.expired), 'Expired on shelf', 'Remove from sale'], [String(a.summary.expiringSoon), `Expiring in ${a.nearExpiryDays} days`, 'Sell or return first'], a.summary.stockValueMinor !== undefined ? [m(a.summary.stockValueMinor), 'Stock at cost', 'Where cost is recorded'] : [String(ph.products.filter(p => p.active).length), 'Active products', 'In the catalogue']]
      : [['…', 'Reorder now', 'Loading'], ['…', 'Expired on shelf', 'Loading'], ['…', 'Expiring soon', 'Loading'], ['…', 'Stock at cost', 'Loading']];
    const nameCol = ['Product', r => `<strong>${esc(r.name)}</strong>`];
    const batchCols = [nameCol, ['Batch', r => esc(r.batchNo)], ['Expiry', r => esc(r.expiryDate || '—')], ['Days', r => (r.daysToExpiry == null ? '—' : r.daysToExpiry < 0 ? `${-r.daysToExpiry} ago` : r.daysToExpiry)], ['On hand', r => r.quantityOnHand], ['Status', r => (r.status === 'QUARANTINED' ? tag('Quarantined', 'accent') : '')],
      ['', r => `<button class="btn btn-secondary" data-action="ph-batch-action" data-kind="writeoff" data-id="${esc(r.batchId)}" data-label="${esc(r.name)} · ${esc(r.batchNo)}" data-onhand="${r.quantityOnHand}">Write off</button>`]];
    const reorder = a ? [...a.outOfStock, ...a.lowStock] : [];
    const sup = ph.suppliersSynced ? ph.suppliers : [];
    return `<div class="page">
      ${pageHeading('Pharmacy', 'Inventory', 'Stock receipts, suppliers, adjustments and expiry. Stock changes only here and when an order is dispensed.')}
      ${a ? '' : `<p class="empty-state">${ph.alertsError ? esc(ph.alertsError) : 'Loading inventory…'}</p>`}
      ${metricGrid(metrics)}
      <div style="margin:0 0 12px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-primary" data-action="ph-receive">Receive stock</button><button class="btn btn-secondary" data-action="ph-new-supplier">Add supplier</button></div>
      ${a ? alertTable('Expired stock', a.expired, batchCols, 'Nothing expired on the shelf.') : ''}
      ${a ? alertTable(`Expiring within ${a.nearExpiryDays} days`, a.expiringSoon, batchCols.slice(0, 5), 'Nothing close to expiry.') : ''}
      ${a ? alertTable('Low and out of stock', reorder, [nameCol, ['On hand', r => r.available], ['Reorder level', r => r.reorderLevel], ['', r => `<button class="btn btn-secondary" data-action="ph-receive" data-id="${esc(r.productId)}">Receive</button>`]], 'Nothing is below its reorder level.') : ''}
      ${card('<div class="section-heading"><span>Suppliers</span></div>', sup.length
        ? `<div class="table-wrap"><table class="table"><thead><tr><th>Supplier</th><th>Contact</th><th>Status</th><th></th></tr></thead><tbody>${sup.map(s => `<tr><td><strong>${esc(s.name)}</strong></td><td>${esc([s.contactName, s.phone, s.email].filter(Boolean).join(' · ') || '—')}</td><td>${tag(s.active ? 'Active' : 'Off', s.active ? 'neutral' : 'outline')}</td><td><button class="btn btn-secondary" data-action="ph-edit-supplier" data-id="${esc(s.supplierId)}">Edit</button></td></tr>`).join('')}</tbody></table></div>`
        : `<p class="empty-state">${ph.suppliersSynced ? 'No suppliers yet.' : 'Loading suppliers…'}</p>`)}
      ${card('<div class="section-heading"><span>Recent stock movements</span></div>', ph.movements.length
        ? `<div class="table-wrap"><table class="table"><thead><tr><th>When</th><th>Product</th><th>Batch</th><th>Type</th><th>Qty</th><th>Who</th></tr></thead><tbody>${ph.movements.map(x => `<tr><td><small>${esc(new Date(x.createdAt).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }))}</small></td><td>${esc(x.productName)}</td><td>${esc(x.batchNo)}</td><td>${esc(MOVEMENT_LABEL[x.kind] || x.kind)}${x.reason ? `<br><small style="color:var(--muted)">${esc(x.reason)}</small>` : ''}</td><td>${x.quantity > 0 ? '+' : ''}${x.quantity}</td><td><small>${esc(x.actor || '—')}</small></td></tr>`).join('')}</tbody></table></div>`
        : '<p class="empty-state">No movements yet.</p>')}
    </div>`;
  }

  function receiveModal() {
    const prods = ph.products.filter(p => p.active);
    const pre = state.modal.productId || '';
    return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="ph-recv-title">
      <h2 id="ph-recv-title">Receive stock</h2>
      <p>Adds a batch to the shelf. Receiving the same batch number and expiry again adds to that batch.</p>
      <form id="ph-receive-form" class="form-grid">
        <div class="form-group"><label>Product *</label><select name="productId" required><option value="">Select a product…</option>${prods.map(p => `<option value="${esc(p.productId)}" ${pre === p.productId ? 'selected' : ''}>${esc(productName(p))}</option>`).join('')}</select></div>
        <div class="form-group"><label>Supplier</label><select name="supplierId"><option value="">None</option>${ph.suppliers.filter(s => s.active).map(s => `<option value="${esc(s.supplierId)}">${esc(s.name)}</option>`).join('')}</select></div>
        <div class="form-grid two-col">
          <div class="form-group"><label>Batch number *</label><input class="input" name="batchNo" required maxlength="60"></div>
          <div class="form-group"><label>Expiry date</label><input class="input" type="date" name="expiryDate"></div>
        </div>
        <div class="form-grid two-col">
          <div class="form-group"><label>Quantity *</label><input class="input" type="number" name="quantity" required min="1" step="1"></div>
          <div class="form-group"><label>Cost per unit (₦)</label><input class="input" type="number" name="cost" min="0" step="any"><small style="color:var(--muted)">Only Admin and Finance can see costs afterwards.</small></div>
        </div>
        <div class="form-group"><label>Note</label><input class="input" name="note" maxlength="240" placeholder="e.g. Invoice number from supplier"></div>
        <div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit" id="ph-recv-submit">Receive</button></div>
      </form></section></div>`;
  }

  async function submitReceipt(form) {
    const fd = new FormData(form);
    const body = { productId: val(fd, 'productId'), batchNo: val(fd, 'batchNo'), quantity: Math.round(Number(val(fd, 'quantity'))) };
    opt(body, 'supplierId', val(fd, 'supplierId'));
    opt(body, 'expiryDate', val(fd, 'expiryDate'));
    opt(body, 'note', val(fd, 'note'));
    const cost = nair(val(fd, 'cost'));
    if (!Number.isNaN(cost)) body.costMinor = toMinor(cost);
    const btn = document.getElementById('ph-recv-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
    try {
      await wellipayApi.receiveStock(body);
      state.modal = null;
      showToast('Stock received', `${body.quantity} units, batch ${body.batchNo}`);
      refreshStock();
      render();
    } catch (err) {
      showToast('Stock not received', err.message);
      if (btn) { btn.disabled = false; btn.textContent = 'Receive'; }
    }
  }

  function supplierModal() {
    const s = state.modal.supplierId ? ph.suppliers.find(x => x.supplierId === state.modal.supplierId) : null;
    const v = k => (s && s[k] ? esc(s[k]) : '');
    return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="ph-sup-title">
      <h2 id="ph-sup-title">${s ? 'Edit supplier' : 'Add supplier'}</h2>
      <form id="ph-supplier-form" class="form-grid" data-id="${s ? esc(s.supplierId) : ''}">
        <div class="form-group"><label>Name *</label><input class="input" name="name" required minlength="1" maxlength="120" value="${v('name')}"></div>
        <div class="form-group"><label>Contact person</label><input class="input" name="contactName" maxlength="120" value="${v('contactName')}"></div>
        <div class="form-grid two-col">
          <div class="form-group"><label>Phone</label><input class="input" name="phone" maxlength="30" value="${v('phone')}"></div>
          <div class="form-group"><label>Email</label><input class="input" type="email" name="email" maxlength="160" value="${v('email')}"></div>
        </div>
        <div class="form-group"><label>Address</label><input class="input" name="address" maxlength="240" value="${v('address')}"></div>
        ${s ? `<label style="font-size:13px"><input type="checkbox" name="active" ${s.active ? 'checked' : ''}> Active</label>` : ''}
        <div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit" id="ph-sup-submit">Save</button></div>
      </form></section></div>`;
  }

  async function submitSupplier(form) {
    const fd = new FormData(form);
    const id = form.dataset.id;
    const keys = ['contactName', 'phone', 'email', 'address'];
    const body = { name: val(fd, 'name') };
    if (id) { for (const k of keys) body[k] = val(fd, k) || null; body.active = fd.get('active') === 'on'; }
    else for (const k of keys) opt(body, k, val(fd, k));
    const btn = document.getElementById('ph-sup-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
    try {
      const saved = id ? await wellipayApi.updateSupplier(id, body) : await wellipayApi.createSupplier(body);
      ph.suppliers = id ? ph.suppliers.map(x => x.supplierId === id ? saved : x) : [...ph.suppliers, saved];
      state.modal = null;
      showToast('Supplier saved', saved.name);
      render();
    } catch (err) {
      showToast('Supplier not saved', err.message);
      if (btn) { btn.disabled = false; btn.textContent = 'Save'; }
    }
  }

  /* Prescriptions */
  function rxSummary(r) { return r.items.map(i => `${esc(i.description)} × ${i.quantity}`).join('<br>'); }

  function renderPrescriptions() {
    const body = !ph.rxSynced
      ? `<p class="empty-state">${ph.rxError ? esc(ph.rxError) : 'Loading prescriptions…'}</p>`
      : ph.prescriptions.length
        ? `<div class="table-wrap"><table class="table"><thead><tr><th>Patient</th><th>Prescriber</th><th>Items</th><th>From</th><th>Status</th><th></th></tr></thead><tbody>
          ${ph.prescriptions.map(r => `<tr>
            <td><strong>${esc(patientName(r.patientRef))}</strong><br><small style="color:var(--muted)">${esc(new Date(r.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }))}${r.refillOfId ? ' · Refill' : ''}</small></td>
            <td>${esc(r.prescriberName || '—')}${r.prescriberLicenceNo ? `<br><small style="color:var(--muted)">${esc(r.prescriberLicenceNo)}</small>` : ''}</td>
            <td>${rxSummary(r)}${r.notes ? `<br><small style="color:var(--muted)">${esc(r.notes)}</small>` : ''}</td>
            <td>${r.source === 'PATIENT' ? 'Patient app' : 'Counter'}</td>
            <td>${tag(esc(RX_STATUS_LABEL[r.status] || r.status), r.status === 'VERIFIED' ? 'neutral' : r.status === 'SUBMITTED' ? 'accent' : 'outline')}${r.status === 'VERIFIED' && r.validUntil ? `<br><small style="color:var(--muted)">To ${esc(r.validUntil.slice(0, 10))} · ${r.refillsAllowed} refills</small>` : ''}${r.status === 'REJECTED' && r.rejectionReason ? `<br><small style="color:var(--muted)">${esc(r.rejectionReason)}</small>` : ''}${r.verifiedBy ? `<br><small style="color:var(--muted)">${esc(r.verifiedBy)}</small>` : ''}</td>
            <td>${(r.images && r.images.length) || r.status === 'SUBMITTED' ? `<button class="btn btn-secondary" data-action="ph-rx-photos" data-id="${esc(r.prescriptionId)}">Photos${r.images && r.images.length ? ` (${r.images.length})` : ''}</button>` : ''}
              ${r.status === 'SUBMITTED' ? `<button class="btn btn-primary" data-action="ph-verify" data-id="${esc(r.prescriptionId)}">Review</button>` : ''}</td>
          </tr>`).join('')}</tbody></table></div>`
        : '<p class="empty-state">No prescriptions with this status.</p>';
    const statuses = [['SUBMITTED', 'Waiting'], ['VERIFIED', 'Verified'], ['COMPLETED', 'Supplied'], ['REJECTED', 'Rejected'], ['CANCELLED', 'Cancelled'], ['', 'All']];
    return `<div class="page">
      ${pageHeading('Pharmacy', 'Prescriptions', 'Only a registered pharmacist can verify a prescription. Prescription-only and controlled medicines are not dispensed without one.')}
      ${card('<div class="section-heading"><span>Prescription queue</span><button class="btn btn-primary" data-action="ph-new-rx">Enter prescription</button></div>',
        `<div class="seg" role="group" aria-label="Status" style="margin:0 0 12px">${statuses.map(([v, l]) => `<label class="seg-opt"><input type="radio" name="ph-rx-status" value="${v}" ${ph.rxStatus === v ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div>${body}`)}
    </div>`;
  }

  function newRxModal() {
    const patients = state.patientList.filter(p => p.id);
    const line = n => `<div class="form-grid" style="grid-template-columns:3fr 1fr 3fr;gap:6px"><input class="input" name="d${n}" maxlength="160" placeholder="Medicine, strength, form" ${n === 0 ? 'required' : ''}><input class="input" type="number" name="q${n}" min="1" step="1" placeholder="Qty"><input class="input" name="r${n}" maxlength="200" placeholder="Directions"></div>`;
    return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="ph-rx-title">
      <h2 id="ph-rx-title">Enter prescription</h2>
      <form id="ph-rx-form" class="form-grid">
        <div class="form-group"><label>Patient *</label><select name="patientRef" required><option value="">Select a patient…</option>${patients.map(p => `<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('')}</select></div>
        <div class="form-grid two-col">
          <div class="form-group"><label>Prescriber *</label><input class="input" name="prescriberName" required maxlength="120"></div>
          <div class="form-group"><label>Prescriber licence number</label><input class="input" name="prescriberLicenceNo" maxlength="40"></div>
        </div>
        <div class="form-group"><label>Date written</label><input class="input" type="date" name="issuedOn"></div>
        <fieldset class="form-group" style="border:1px solid var(--color-divider);padding:10px"><legend style="font-size:12px;padding:0 6px">Items</legend>${[0, 1, 2, 3].map(line).join('')}</fieldset>
        <div class="form-group"><label>Notes</label><input class="input" name="notes" maxlength="500"></div>
        <div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit" id="ph-rx-submit">Save</button></div>
      </form></section></div>`;
  }

  async function submitRx(form) {
    const fd = new FormData(form);
    const items = [];
    for (let n = 0; n < 4; n++) {
      const d = val(fd, `d${n}`);
      if (!d) continue;
      const qty = Math.round(Number(val(fd, `q${n}`)));
      if (!(qty > 0)) { showToast('Check the items', `Enter a quantity for "${d}".`); return; }
      const item = { description: d, quantity: qty };
      opt(item, 'directions', val(fd, `r${n}`));
      items.push(item);
    }
    if (!items.length) { showToast('Check the items', 'Add at least one item.'); return; }
    const body = { patientRef: val(fd, 'patientRef'), prescriberName: val(fd, 'prescriberName'), items };
    opt(body, 'prescriberLicenceNo', val(fd, 'prescriberLicenceNo'));
    opt(body, 'issuedOn', val(fd, 'issuedOn'));
    opt(body, 'notes', val(fd, 'notes'));
    const btn = document.getElementById('ph-rx-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
    try {
      await wellipayApi.createPrescription(body);
      ph.rxStatus = 'SUBMITTED';
      ph.rxSynced = false;
      state.modal = null;
      showToast('Prescription saved', 'It is waiting for a pharmacist.');
      render();
    } catch (err) {
      showToast('Prescription not saved', err.message);
      if (btn) { btn.disabled = false; btn.textContent = 'Save'; }
    }
  }

  function verifyModal() {
    const r = ph.prescriptions.find(x => x.prescriptionId === state.modal.prescriptionId);
    if (!r) return '';
    const prods = ph.products.filter(p => p.active && p.category === 'MEDICINE');
    return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="ph-verify-title">
      <h2 id="ph-verify-title">Review prescription</h2>
      <p>${esc(patientName(r.patientRef))} · ${esc(r.prescriberName || 'Prescriber not named')}${r.prescriberLicenceNo ? ' · ' + esc(r.prescriberLicenceNo) : ''}</p>
      <form id="ph-verify-form" class="form-grid" data-id="${esc(r.prescriptionId)}" data-items="${r.items.map(i => esc(i.itemId)).join(',')}">
        <fieldset class="form-group" style="border:1px solid var(--color-divider);padding:10px"><legend style="font-size:12px;padding:0 6px">Match each item to a product</legend>
          ${r.items.map((i, n) => `<div class="form-grid two-col" style="align-items:center"><div><strong>${esc(i.description)}</strong> × ${i.quantity}${i.directions ? `<br><small style="color:var(--muted)">${esc(i.directions)}</small>` : ''}</div>
            <select name="p${n}" aria-label="Product for ${esc(i.description)}"><option value="">Not supplied</option>${prods.map(p => `<option value="${esc(p.productId)}" ${i.productId === p.productId ? 'selected' : ''}>${esc(productName(p))}${p.dispensingClass !== 'OTC' ? ' (' + esc(CLASS_LABEL[p.dispensingClass]) + ')' : ''}</option>`).join('')}</select></div>`).join('')}
        </fieldset>
        <div class="form-grid two-col">
          <div class="form-group"><label>Valid for (days)</label><input class="input" type="number" name="validDays" min="1" max="180" step="1" value="30"></div>
          <div class="form-group"><label>Refills allowed</label><input class="input" type="number" name="refillsAllowed" min="0" max="5" step="1" value="0"></div>
        </div>
        <p style="font-size:12px;color:var(--muted);margin:0">A controlled medicine is valid for 30 days at most and cannot be refilled.</p>
        <div class="form-group"><label>Reason (needed to reject)</label><input class="input" name="reason" maxlength="240"></div>
        <div class="modal-actions">
          <button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button>
          <button class="btn btn-ghost" type="submit" name="decision" value="REJECT">Reject</button>
          <button class="btn btn-primary" type="submit" name="decision" value="VERIFY">Verify</button>
        </div>
      </form></section></div>`;
  }

  async function submitVerify(form, submitter) {
    const fd = new FormData(form);
    const decision = submitter && submitter.value === 'REJECT' ? 'REJECT' : 'VERIFY';
    const ids = form.dataset.items.split(',');
    const body = { decision };
    if (decision === 'REJECT') {
      const reason = val(fd, 'reason');
      if (reason.length < 3) { showToast('Say why', 'Enter the reason for rejecting.'); return; }
      body.reason = reason;
    } else {
      body.validDays = Math.round(Number(val(fd, 'validDays')) || 30);
      body.refillsAllowed = Math.round(Number(val(fd, 'refillsAllowed')) || 0);
      body.items = ids.map((itemId, n) => ({ itemId, productId: val(fd, `p${n}`) || null }));
    }
    try {
      await wellipayApi.verifyPrescription(form.dataset.id, body);
      state.modal = null;
      ph.rxSynced = false;
      showToast(decision === 'VERIFY' ? 'Prescription verified' : 'Prescription rejected');
      render();
    } catch (err) { showToast('Not recorded', err.message); }
  }

  /* Orders and delivery */
  function renderOrders() {
    const body = !ph.ordersSynced
      ? `<p class="empty-state">${ph.ordersError ? esc(ph.ordersError) : 'Loading orders…'}</p>`
      : ph.orders.length
        ? `<div class="table-wrap"><table class="table"><thead><tr><th>Bill</th><th>Patient</th><th>Payment</th><th>Order</th><th>Delivery</th><th></th></tr></thead><tbody>
          ${ph.orders.map(o => `<tr>
            <td><strong>${esc(o.invoiceRef || o.invoiceId)}</strong><br><small style="color:var(--muted)">${o.lines.map(l => esc(l.description) + ' × ' + l.quantity).join(', ')}</small></td>
            <td>${esc(patientName(o.patientRef))}</td>
            <td>${tag(o.paymentStatus === 'PAID' ? 'Paid' : esc((o.paymentStatus || 'Unknown').replace(/_/g, ' ').toLowerCase()), o.paymentStatus === 'PAID' ? 'neutral' : 'accent')}${o.paymentOverrideReason ? `<br><small style="color:var(--muted)">Released: ${esc(o.paymentOverrideReason)}</small>` : ''}</td>
            <td>${tag(esc(o.status === 'AWAITING_DISPENSING' && o.readyAt ? 'Ready' : (ORDER_STATUS_LABEL[o.status] || o.status)), o.status === 'DISPENSED' ? 'neutral' : o.status === 'CANCELLED' ? 'outline' : 'accent')}<br><small style="color:var(--muted)">${o.fulfilment === 'DELIVERY' ? 'Delivery' : 'Pickup'}${o.dispensedBy ? ' · ' + esc(o.dispensedBy) : ''}</small></td>
            <td>${o.fulfilment === 'DELIVERY' ? esc(DELIVERY_LABEL[o.deliveryStatus] || o.deliveryStatus) + (o.courierName ? `<br><small style="color:var(--muted)">${esc(o.courierName)}${o.trackingRef ? ' · ' + esc(o.trackingRef) : ''}</small>` : '') + (o.deliveryStatus === 'FAILED' && o.failureReason ? `<br><small style="color:var(--muted)">${esc(o.failureReason)}</small>` : '') : '—'}</td>
            <td><button class="btn btn-secondary" data-action="ph-order-detail" data-id="${esc(o.orderId)}">Details</button>
              ${o.status === 'AWAITING_DISPENSING' && !o.readyAt ? `<button class="btn btn-secondary" data-action="ph-ready" data-id="${esc(o.orderId)}">Mark ready</button>` : ''}
              ${o.status === 'AWAITING_DISPENSING' ? `<button class="btn btn-primary" data-action="ph-dispense" data-id="${esc(o.orderId)}">Dispense</button><button class="btn btn-ghost" data-action="ph-cancel-order" data-id="${esc(o.orderId)}">Cancel</button>` : ''}
              ${o.status === 'DISPENSED' && o.fulfilment === 'DELIVERY' && o.deliveryStatus !== 'DELIVERED' ? `<button class="btn btn-primary" data-action="ph-delivery" data-id="${esc(o.orderId)}">Delivery</button>` : ''}</td>
          </tr>`).join('')}</tbody></table></div>`
        : '<p class="empty-state">No orders. Create a bill with products, then use New order.</p>';
    const statuses = [['', 'All'], ['AWAITING_DISPENSING', 'Awaiting dispensing'], ['DISPENSED', 'Dispensed'], ['CANCELLED', 'Cancelled']];
    return `<div class="page">
      ${pageHeading('Pharmacy', 'Orders and delivery', 'A paid bill is not proof that goods were handed over. Dispensing takes stock off the shelf and records the batch, the pharmacist and who received it.')}
      ${card('<div class="section-heading"><span>Orders</span><button class="btn btn-primary" data-action="ph-new-order">New order</button></div>',
        `<div class="seg" role="group" aria-label="Order status" style="margin:0 0 12px">${statuses.map(([v, l]) => `<label class="seg-opt"><input type="radio" name="ph-order-status" value="${v}" ${ph.orderStatus === v ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div>${body}`)}
      ${couriersCard()}
    </div>`;
  }

  function newOrderModal() {
    const taken = new Set(ph.orders.map(o => o.invoiceId));
    const invoices = state.invoiceList.filter(i => i.live && i.invoiceId && i.status !== 'Cancelled' && !taken.has(i.invoiceId));
    return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="ph-order-title">
      <h2 id="ph-order-title">New order</h2>
      <p>Starts an order from a bill that has pharmacy products on it.</p>
      <form id="ph-order-form" class="form-grid">
        <div class="form-group"><label>Bill *</label><select name="invoiceId" required><option value="">Select a bill…</option>${invoices.map(i => `<option value="${esc(i.invoiceId)}">${esc(i.id)} — ${esc(i.patient)} (${esc(i.status)})</option>`).join('')}</select></div>
        <div class="form-group"><label>Prescription</label><select name="prescriptionId" id="ph-order-rx"><option value="">None (over-the-counter items only)</option>${ph.verifiedRx.map(r => `<option value="${esc(r.prescriptionId)}">${esc(patientName(r.patientRef))} — ${esc(r.items.map(i => i.description).join(', ').slice(0, 70))}</option>`).join('')}</select></div>
        <div class="form-group"><label>Fulfilment *</label><select name="fulfilment"><option value="PICKUP">Pickup</option><option value="DELIVERY">Delivery</option></select></div>
        <div class="form-grid two-col">
          <div class="form-group"><label>Delivery address</label><input class="input" name="deliveryAddress" maxlength="300"></div>
          <div class="form-group"><label>Delivery phone</label><input class="input" name="deliveryPhone" maxlength="30"></div>
        </div>
        <p style="font-size:12px;color:var(--muted);margin:0">A delivery needs an address and phone. Add a "Home delivery" line to the bill to charge the fee.</p>
        <div class="form-group"><label>Notes</label><input class="input" name="notes" maxlength="300"></div>
        <div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit" id="ph-order-submit">Create order</button></div>
      </form></section></div>`;
  }
  ph.verifiedRx = [];

  async function openNewOrder() {
    state.modal = { type: 'ph-new-order' };
    render();
    try {
      const d = await wellipayApi.listPrescriptions({ status: 'VERIFIED', limit: 100 });
      ph.verifiedRx = d.items;
      if (state.modal && state.modal.type === 'ph-new-order') render();
    } catch (err) { showToast('Prescriptions not loaded', err.message); }
  }

  async function submitOrder(form) {
    const fd = new FormData(form);
    const body = { invoiceId: val(fd, 'invoiceId'), fulfilment: val(fd, 'fulfilment') };
    opt(body, 'prescriptionId', val(fd, 'prescriptionId'));
    opt(body, 'deliveryAddress', val(fd, 'deliveryAddress'));
    opt(body, 'deliveryPhone', val(fd, 'deliveryPhone'));
    opt(body, 'notes', val(fd, 'notes'));
    if (body.fulfilment === 'DELIVERY' && !(body.deliveryAddress && body.deliveryPhone)) { showToast('Check the delivery', 'A delivery needs an address and a phone number.'); return; }
    const btn = document.getElementById('ph-order-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
    try {
      await wellipayApi.createPharmacyOrder(body);
      ph.ordersSynced = false;
      state.modal = null;
      showToast('Order created', 'It is waiting to be dispensed.');
      render();
    } catch (err) {
      showToast('Order not created', err.message);
      if (btn) { btn.disabled = false; btn.textContent = 'Create order'; }
    }
  }

  const findOrder = id => ph.orders.find(o => o.orderId === id);

  function dispenseModal() {
    const o = findOrder(state.modal.orderId);
    if (!o) return '';
    const unpaid = o.paymentStatus !== 'PAID';
    return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="ph-disp-title">
      <h2 id="ph-disp-title">Dispense order</h2>
      <p>${o.lines.map(l => esc(l.description) + ' × ' + l.quantity).join('<br>')}</p>
      <p style="font-size:13px">Stock is taken from the earliest-expiring usable batches. Prescription-only and controlled items need a verified prescription and a signed-in pharmacist.</p>
      <form id="ph-dispense-form" class="form-grid" data-id="${esc(o.orderId)}">
        ${o.fulfilment === 'PICKUP' ? '<div class="form-group"><label>Collected by *</label><input class="input" name="handedToName" required minlength="2" maxlength="120" placeholder="Name of the person collecting"></div><div class="form-group"><label>Collector ID</label><input class="input" name="collectorId" maxlength="60" placeholder="e.g. NIN 1234. Needed for controlled medicines."></div>' : '<p style="font-size:13px">This is a delivery. Record the handover on the Delivery step.</p>'}
        ${unpaid ? `<div class="form-group"><label>The bill is ${esc((o.paymentStatus || 'not paid').replace(/_/g, ' ').toLowerCase())}. Release without full payment?</label><input class="input" name="overridePaymentReason" maxlength="240" placeholder="Reason (Billing, Finance or Admin only). Leave blank to require payment."></div>` : ''}
        <div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit" id="ph-disp-submit">Dispense</button></div>
      </form></section></div>`;
  }

  async function submitDispense(form) {
    const fd = new FormData(form);
    const body = {};
    opt(body, 'handedToName', val(fd, 'handedToName'));
    opt(body, 'collectorId', val(fd, 'collectorId'));
    opt(body, 'overridePaymentReason', val(fd, 'overridePaymentReason'));
    const btn = document.getElementById('ph-disp-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Dispensing…'; }
    try {
      await wellipayApi.dispenseOrder(form.dataset.id, body);
      ph.ordersSynced = false; ph.productsSynced = false; ph.alerts = null; ph.alertsError = '';
      state.modal = null;
      showToast('Order dispensed', 'Stock has been taken off the shelf.');
      render();
    } catch (err) {
      showToast('Not dispensed', err.message);
      if (btn) { btn.disabled = false; btn.textContent = 'Dispense'; }
    }
  }

  function cancelOrderModal() {
    const o = findOrder(state.modal.orderId);
    if (!o) return '';
    return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="ph-cancel-title">
      <h2 id="ph-cancel-title">Cancel order</h2><p>${esc(o.invoiceRef || o.invoiceId)} has not been dispensed. No stock changes.</p>
      <form id="ph-cancel-form" class="form-grid" data-id="${esc(o.orderId)}">
        <div class="form-group"><label>Why *</label><input class="input" name="reason" required minlength="3" maxlength="240"></div>
        <div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Keep order</button><button class="btn btn-primary" type="submit" id="ph-cancel-submit">Cancel order</button></div>
      </form></section></div>`;
  }

  async function submitCancelOrder(form) {
    const reason = val(new FormData(form), 'reason');
    try {
      await wellipayApi.cancelPharmacyOrder(form.dataset.id, { reason });
      ph.ordersSynced = false;
      state.modal = null;
      showToast('Order cancelled');
      render();
    } catch (err) { showToast('Not cancelled', err.message); }
  }

  function deliveryModal() {
    const o = findOrder(state.modal.orderId);
    if (!o) return '';
    const s = o.deliveryStatus;
    const actions = [];
    if (s === 'PENDING' || s === 'FAILED') actions.push(['dispatch', 'Send out for delivery']);
    if (s === 'OUT_FOR_DELIVERY') actions.push(['deliver', 'Confirm delivered'], ['fail', 'Record a failed delivery']);
    const act = state.modal.action || (actions[0] && actions[0][0]);
    return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="ph-del-title">
      <h2 id="ph-del-title">Delivery</h2>
      <p>${esc(o.deliveryAddress || '')}<br>${esc(o.deliveryPhone || '')}<br>Fee ${m(o.deliveryFeeMinor)} · Status: ${esc(DELIVERY_LABEL[s] || s)}</p>
      <form id="ph-delivery-form" class="form-grid" data-id="${esc(o.orderId)}">
        <div class="form-group"><label>Step</label><select name="action" id="ph-del-action">${actions.map(([v, l]) => `<option value="${v}" ${act === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        ${act === 'dispatch' ? `<div class="form-group"><label>Courier</label><select name="courierId"><option value="">Other rider (type a name)</option>${ph.couriers.filter(c => c.active).map(c => `<option value="${esc(c.courierId)}">${esc(c.name)}</option>`).join('')}</select></div>
          <div class="form-group"><label>Rider's name (if not listed)</label><input class="input" name="courierName" maxlength="120"></div>
          <div class="form-group"><label>Tracking number</label><input class="input" name="trackingRef" maxlength="80"></div>` : ''}
        ${act === 'deliver' ? `<div class="form-group"><label>Received by *</label><input class="input" name="recipientName" required minlength="2" maxlength="120"></div>
          <div class="form-group"><label>Patient's 6-digit code</label><input class="input" name="proofCode" inputmode="numeric" pattern="\\d{6}" maxlength="6" placeholder="Shown in the patient app"></div>
          <div class="form-group"><label>No code? How was the recipient confirmed?</label><input class="input" name="note" maxlength="300" placeholder="e.g. Checked ID card"></div>` : ''}
        ${act === 'fail' ? '<div class="form-group"><label>What went wrong *</label><input class="input" name="reason" required minlength="3" maxlength="240"></div>' : ''}
        <div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Close</button>${act ? '<button class="btn btn-primary" type="submit" id="ph-del-submit">Save</button>' : ''}</div>
      </form></section></div>`;
  }

  async function submitDelivery(form) {
    const fd = new FormData(form);
    const body = { action: val(fd, 'action') };
    for (const k of ['courierId', 'courierName', 'trackingRef', 'recipientName', 'proofCode', 'note', 'reason']) opt(body, k, val(fd, k));
    const btn = document.getElementById('ph-del-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
    try {
      await wellipayApi.updateDelivery(form.dataset.id, body);
      ph.ordersSynced = false;
      state.modal = null;
      showToast('Delivery updated');
      render();
    } catch (err) {
      showToast('Delivery not updated', err.message);
      if (btn) { btn.disabled = false; btn.textContent = 'Save'; }
    }
  }

  async function openOrderDetail(id) {
    state.modal = { type: 'ph-order-detail', orderId: id, detail: null };
    render();
    try {
      const d = await wellipayApi.getPharmacyOrder(id);
      if (state.modal && state.modal.type === 'ph-order-detail' && state.modal.orderId === id) { state.modal.detail = d; render(); }
    } catch (err) { showToast('Order not loaded', err.message); }
  }

  function orderDetailModal() {
    const d = state.modal.detail;
    const body = !d ? '<p class="empty-state">Loading…</p>' : `
      <p>${esc(patientName(d.patientRef))} · ${esc(ORDER_STATUS_LABEL[d.status] || d.status)} · ${d.fulfilment === 'DELIVERY' ? 'Delivery' : 'Pickup'}</p>
      ${d.status === 'DISPENSED' && d.dispensedAt ? `<p style="font-size:13px">Dispensed ${esc(new Date(d.dispensedAt).toLocaleString('en-NG'))} by ${esc(d.dispensedBy || 'unknown')}${d.handedToName ? `. Collected by ${esc(d.handedToName)}` : ''}.</p>` : ''}
      ${d.fulfilment === 'DELIVERY' && d.proofCode && d.deliveryStatus !== 'DELIVERED' ? `<p style="font-size:13px">Proof code: <strong>${esc(d.proofCode)}</strong> (read back only to the patient)</p>` : ''}
      ${d.deliveryStatus === 'DELIVERED' && d.deliveredAt ? `<p style="font-size:13px">Delivered ${esc(new Date(d.deliveredAt).toLocaleString('en-NG'))} to ${esc(d.deliveredToName || '—')}${d.deliveryNote ? '. ' + esc(d.deliveryNote) : ''}</p>` : ''}
      ${d.cancelReason ? `<p style="font-size:13px">Cancelled: ${esc(d.cancelReason)}</p>` : ''}
      <div class="table-wrap"><table class="table"><thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead><tbody>${d.lines.map(l => `<tr><td>${esc(l.description)}</td><td>${l.dispensed}/${l.quantity}</td><td>${m(l.unitPriceMinor)}</td></tr>`).join('')}</tbody></table></div>
      ${d.batches.length ? `<h3 style="font-size:14px;margin:12px 0 4px">Batches used</h3><div class="table-wrap"><table class="table"><thead><tr><th>Item</th><th>Batch</th><th>Expiry</th><th>Qty</th></tr></thead><tbody>${d.batches.map(b => `<tr><td>${esc(b.description)}</td><td>${esc(b.batchNo || '—')}</td><td>${esc(b.expiryDate || '—')}</td><td>${b.quantity}</td></tr>`).join('')}</tbody></table></div>` : ''}`;
    return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="ph-detail-title">
      <h2 id="ph-detail-title">Order details</h2>${body}<div class="modal-actions"><button class="btn btn-primary" data-action="close-modal">Close</button></div></section></div>`;
  }

  /* Pharmacist licence on the staff page */
  function pharmacistModal() {
    const s = state.liveStaff.find(x => x.staffId === state.modal.staffId);
    if (!s) return '';
    return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="ph-pharm-title">
      <h2 id="ph-pharm-title">Pharmacist licence</h2>
      <p>${esc(s.name)}. Only staff with a licence number can verify prescriptions and dispense prescription-only or controlled medicines. Clear the field to remove it.</p>
      <form id="ph-pharmacist-form" class="form-grid" data-id="${esc(s.staffId)}">
        <div class="form-group"><label>PCN licence number</label><input class="input" name="licenceNo" maxlength="40" value="${esc(s.pharmacistLicenceNo || '')}"></div>
        <div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit" id="ph-pharm-submit">Save</button></div>
      </form></section></div>`;
  }

  async function submitPharmacist(form) {
    const licence = val(new FormData(form), 'licenceNo');
    if (licence && licence.length < 3) { showToast('Check the number', 'A licence number has at least 3 characters.'); return; }
    try {
      const r = await wellipayApi.setPharmacistLicence(form.dataset.id, { licenceNo: licence || null });
      state.liveStaff = state.liveStaff.map(s => s.staffId === form.dataset.id ? { ...s, pharmacistLicenceNo: r.pharmacistLicenceNo, isPharmacist: r.isPharmacist } : s);
      state.modal = null;
      showToast('Saved', licence ? 'Marked as a pharmacist.' : 'Pharmacist licence removed.');
      render();
    } catch (err) { showToast('Not saved', err.message); }
  }


  /* Service price (the pharmacy page and Services & Pricing show the same record) */
  function servicePriceModal() {
    const s = ph.services.find(x => x.offer && x.offer.serviceItemId === state.modal.itemId);
    if (!s) return '';
    return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="ph-sp-title">
      <h2 id="ph-sp-title">Change price</h2><p>${esc(s.name)}. Bills already created keep their old price.</p>
      <form id="ph-service-price-form" class="form-grid" data-id="${esc(s.offer.serviceItemId)}">
        <div class="form-group"><label>Price (₦) *</label><input class="input" type="number" name="price" required min="1" step="any" value="${s.offer.unitPriceMinor / 100}"></div>
        <div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit" id="ph-sp-submit">Save</button></div>
      </form></section></div>`;
  }

  async function submitServicePrice(form) {
    const price = nair(val(new FormData(form), 'price'));
    if (!(price > 0)) { showToast('Check the price', 'Enter a price above zero.'); return; }
    try {
      await wellipayApi.updateServiceItem(form.dataset.id, { unitPriceMinor: toMinor(price) });
      ph.servicesSynced = false; state.priceListSynced = false; state.modal = null;
      showToast('Price saved');
      render();
    } catch (err) { showToast('Price not saved', err.message); }
  }

  async function toggleService(id) {
    const s = ph.services.find(x => x.offer && x.offer.serviceItemId === id);
    if (!s) return;
    try {
      await wellipayApi.updateServiceItem(id, { active: !s.offer.active });
      ph.servicesSynced = false; state.priceListSynced = false;
      render();
    } catch (err) { showToast('Service not changed', err.message); }
  }

  /* Ready for pickup */
  async function markReady(id) {
    try {
      await wellipayApi.markOrderReady(id);
      ph.ordersSynced = false;
      showToast('Marked ready', 'A pickup patient gets a text message if SMS is set up.');
      render();
    } catch (err) { showToast('Not marked ready', err.message); }
  }

  /* Couriers */
  function couriersCard() {
    const rows = ph.couriers;
    return card('<div class="section-heading"><span>Couriers</span><button class="btn btn-secondary" data-action="ph-new-courier">Add courier</button></div>',
      rows.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Courier</th><th>Type</th><th>Tracking link</th><th>Status</th><th></th></tr></thead><tbody>
        ${rows.map(c => `<tr><td><strong>${esc(c.name)}</strong>${c.phone ? `<br><small style="color:var(--muted)">${esc(c.phone)}</small>` : ''}</td>
          <td>${c.kind === 'PARTNER' ? 'Delivery partner' : 'Own rider'}${c.kind === 'PARTNER' ? `<br><small style="color:var(--muted)">${c.hasWebhookSecret ? 'Reports by webhook' : 'No secret'}</small>` : ''}</td>
          <td><small>${esc(c.trackingUrlTemplate || '—')}</small></td>
          <td>${tag(c.active ? 'Active' : 'Off', c.active ? 'neutral' : 'outline')}</td>
          <td><button class="btn btn-secondary" data-action="ph-edit-courier" data-id="${esc(c.courierId)}">Edit</button>
            ${c.kind === 'PARTNER' ? `<button class="btn btn-ghost" data-action="ph-rotate-secret" data-id="${esc(c.courierId)}">New secret</button>` : ''}</td></tr>`).join('')}
        </tbody></table></div>` : `<p class="empty-state">${ph.couriersSynced ? 'No couriers yet. Add your riders or a delivery partner.' : 'Loading couriers…'}</p>`);
  }

  function courierModal() {
    const c = state.modal.courierId ? ph.couriers.find(x => x.courierId === state.modal.courierId) : null;
    return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="ph-courier-title">
      <h2 id="ph-courier-title">${c ? 'Edit courier' : 'Add courier'}</h2>
      <form id="ph-courier-form" class="form-grid" data-id="${c ? esc(c.courierId) : ''}">
        <div class="form-group"><label>Name *</label><input class="input" name="name" required minlength="2" maxlength="120" value="${c ? esc(c.name) : ''}"></div>
        ${c ? '' : '<div class="form-group"><label>Type</label><select name="kind"><option value="OWN_RIDER">Own rider (staff update the status)</option><option value="PARTNER">Delivery partner (reports by webhook)</option></select></div>'}
        <div class="form-group"><label>Phone</label><input class="input" name="phone" maxlength="30" value="${c && c.phone ? esc(c.phone) : ''}"></div>
        <div class="form-group"><label>Tracking link</label><input class="input" name="trackingUrlTemplate" maxlength="300" value="${c && c.trackingUrlTemplate ? esc(c.trackingUrlTemplate) : ''}" placeholder="https://courier.example/track/{ref}"><small style="color:var(--muted)">Optional. {ref} is replaced with the tracking number.</small></div>
        ${c ? `<label style="font-size:13px"><input type="checkbox" name="active" ${c.active ? 'checked' : ''}> Active</label>` : ''}
        <div class="modal-actions"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit" id="ph-courier-submit">Save</button></div>
      </form></section></div>`;
  }

  async function submitCourier(form) {
    const fd = new FormData(form);
    const id = form.dataset.id;
    const body = { name: val(fd, 'name') };
    if (id) { body.phone = val(fd, 'phone') || null; body.trackingUrlTemplate = val(fd, 'trackingUrlTemplate') || null; body.active = fd.get('active') === 'on'; }
    else { body.kind = val(fd, 'kind') || 'OWN_RIDER'; opt(body, 'phone', val(fd, 'phone')); opt(body, 'trackingUrlTemplate', val(fd, 'trackingUrlTemplate')); }
    try {
      const saved = id ? await wellipayApi.updateCourier(id, body) : await wellipayApi.createCourier(body);
      ph.couriers = id ? ph.couriers.map(c => c.courierId === id ? saved : c) : [...ph.couriers, saved];
      state.modal = saved.webhookSecret ? { type: 'ph-courier-secret', name: saved.name, courierId: saved.courierId, secret: saved.webhookSecret } : null;
      showToast('Courier saved', saved.name);
      render();
    } catch (err) { showToast('Courier not saved', err.message); }
  }

  async function rotateSecret(id) {
    if (!window.confirm('Make a new secret? The partner must start using it, and the old one stops working now.')) return;
    try {
      const saved = await wellipayApi.rotateCourierSecret(id);
      state.modal = { type: 'ph-courier-secret', name: saved.name, courierId: id, secret: saved.webhookSecret };
      render();
    } catch (err) { showToast('Secret not changed', err.message); }
  }

  function courierSecretModal() {
    const { name, courierId, secret } = state.modal;
    const base = (typeof window !== 'undefined' && window.WELLIPAY_API_BASE) || 'https://wellipay-api.onrender.com';
    return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="ph-secret-title">
      <h2 id="ph-secret-title">Webhook details for ${esc(name)}</h2>
      <p>Copy the secret now. It is not shown again.</p>
      <div class="form-group"><label>Secret</label><input class="input" readonly value="${esc(secret)}" onfocus="this.select()"></div>
      <div class="form-group"><label>Webhook address</label><input class="input" readonly value="${esc(base)}/webhooks/courier/${esc(courierId)}" onfocus="this.select()"></div>
      <p style="font-size:12px;color:var(--muted)">The partner sends a POST with headers x-wellipay-timestamp (seconds) and x-wellipay-signature: sha256= plus the HMAC-SHA256 of "timestamp.body" using this secret. Body: trackingRef, status (OUT_FOR_DELIVERY, DELIVERED or FAILED), and for DELIVERED the patient's proofCode and recipientName.</p>
      <div class="modal-actions"><button class="btn btn-primary" data-action="close-modal">I have copied it</button></div></section></div>`;
  }

  /* Prescription photos */
  const PHOTO_MAX_SIDE = 1800;

  // Shrinks a phone photo to a JPEG well under the 4 MB limit, then returns its base64 text.
  async function photoToBase64(file) {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, PHOTO_MAX_SIDE / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.82));
    if (!blob) throw new Error('The photo could not be read.');
    const dataUrl = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => rej(new Error('The photo could not be read.')); r.readAsDataURL(blob); });
    return String(dataUrl).split(',')[1];
  }

  async function openPhotos(id) {
    const rx = ph.prescriptions.find(x => x.prescriptionId === id);
    if (!rx) return;
    state.modal = { type: 'ph-rx-photos', prescriptionId: id, urls: [], loading: true };
    render();
    try {
      const blobs = await Promise.all((rx.images || []).map(i => wellipayApi.downloadPrescriptionPhoto(id, i.imageId)));
      if (state.modal && state.modal.type === 'ph-rx-photos' && state.modal.prescriptionId === id) {
        state.modal.urls = blobs.map(b => URL.createObjectURL(b));
        state.modal.loading = false;
        render();
      }
    } catch (err) {
      if (state.modal && state.modal.type === 'ph-rx-photos') { state.modal.loading = false; render(); }
      showToast('Photos not loaded', err.message);
    }
  }

  function photosModal() {
    const rx = ph.prescriptions.find(x => x.prescriptionId === state.modal.prescriptionId);
    if (!rx) return '';
    const n = (rx.images || []).length;
    return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="ph-photos-title">
      <h2 id="ph-photos-title">Prescription photos</h2>
      <p>${esc(patientName(rx.patientRef))} · ${esc(rx.prescriberName || '')}. Check the photo against the items typed in before you verify.</p>
      ${state.modal.loading ? '<p class="empty-state">Loading photos…</p>' : state.modal.urls.length ? `<div style="display:grid;gap:8px">${state.modal.urls.map(u => `<a href="${u}" target="_blank" rel="noopener"><img src="${u}" alt="Prescription photo" style="width:100%;border:1px solid var(--color-divider)"></a>`).join('')}</div>` : '<p class="empty-state">No photos on this prescription.</p>'}
      ${rx.status === 'SUBMITTED' && n < 3 ? `<div class="form-group" style="margin-top:12px"><label>Add a photo (${3 - n} left)</label><input type="file" id="ph-photo-input" accept="image/jpeg,image/png,image/webp" data-id="${esc(rx.prescriptionId)}"></div>` : ''}
      <div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Close</button>${rx.status === 'SUBMITTED' ? `<button class="btn btn-primary" data-action="ph-verify" data-id="${esc(rx.prescriptionId)}">Review</button>` : ''}</div></section></div>`;
  }

  async function uploadPhoto(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    const id = input.dataset.id;
    input.disabled = true;
    try {
      const dataBase64 = await photoToBase64(file);
      await wellipayApi.uploadPrescriptionPhoto(id, { contentType: 'image/jpeg', dataBase64 });
      ph.rxSynced = false;
      showToast('Photo added');
      await loadPrescriptions();
      openPhotos(id);
    } catch (err) {
      showToast('Photo not added', err.message);
      input.disabled = false;
    }
  }

  /* Controlled-drug register */
  const KIND_TEXT = { RECEIPT: 'Received', DISPENSE: 'Dispensed', ADJUSTMENT: 'Adjusted', WRITE_OFF: 'Written off' };

  function renderRegister() {
    const controlled = ph.products.filter(p => p.dispensingClass === 'CONTROLLED');
    const f = ph.regFilter;
    const bal = ph.registerSynced
      ? (ph.balances.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Medicine</th><th>Register balance</th><th>On the shelf</th><th>Check</th></tr></thead><tbody>
        ${ph.balances.map(b => `<tr><td><strong>${esc(b.name)}</strong></td><td>${b.registerBalance === undefined ? '—' : b.registerBalance}</td><td>${b.onHand}</td><td>${b.matches ? tag('Matches', 'neutral') : tag('Does not match', 'accent')}</td></tr>`).join('')}</tbody></table></div>` : '<p class="empty-state">No controlled medicines are listed. Set a product\'s dispensing to Controlled to track it here.</p>')
      : `<p class="empty-state">${ph.registerError ? esc(ph.registerError) : 'Loading register…'}</p>`;
    const rows = ph.register.length
      ? `<div class="table-wrap"><table class="table"><thead><tr><th>When</th><th>Medicine</th><th>Batch</th><th>Entry</th><th>Qty</th><th>Balance</th><th>Patient and prescriber</th><th>Recorded by</th></tr></thead><tbody>
        ${ph.register.map(e => `<tr><td><small>${esc(new Date(e.createdAt).toLocaleString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }))}</small></td>
          <td>${esc(e.productName)}</td><td>${esc(e.batchNo)}</td>
          <td>${esc(KIND_TEXT[e.kind] || e.kind)}${e.reason ? `<br><small style="color:var(--muted)">${esc(e.reason)}</small>` : ''}${e.supplierName ? `<br><small style="color:var(--muted)">From ${esc(e.supplierName)}</small>` : ''}</td>
          <td>${e.quantity > 0 ? '+' : ''}${e.quantity}</td><td>${e.balanceAfter}</td>
          <td>${e.patientName || e.patientRef ? esc(e.patientName || e.patientRef) : '—'}${e.prescriberName ? `<br><small style="color:var(--muted)">${esc(e.prescriberName)}${e.prescriberLicenceNo ? ' · ' + esc(e.prescriberLicenceNo) : ''}</small>` : ''}${e.recipientName ? `<br><small style="color:var(--muted)">Received by ${esc(e.recipientName)}${e.recipientId ? ' · ' + esc(e.recipientId) : ''}</small>` : ''}</td>
          <td><small>${esc(e.actor)}</small></td></tr>`).join('')}</tbody></table></div>`
      : `<p class="empty-state">${ph.registerSynced ? 'No entries for this filter.' : ''}</p>`;
    return `<div class="page">
      ${pageHeading('Pharmacy', 'Controlled-drug register', 'Every receipt, supply, adjustment and write-off of a controlled medicine, with the balance after. Entries cannot be edited or deleted.')}
      ${card('<div class="section-heading"><span>Balances</span></div>', bal)}
      ${card('<div class="section-heading"><span>Entries</span><button class="btn btn-secondary" data-action="ph-register-csv">Download CSV</button></div>',
        `<form id="ph-register-filter" class="form-grid" style="grid-template-columns:2fr 1fr 1fr;gap:8px;margin:0 0 12px">
          <select class="input" name="productId" aria-label="Medicine"><option value="">All controlled medicines</option>${controlled.map(p => `<option value="${esc(p.productId)}" ${f.productId === p.productId ? 'selected' : ''}>${esc(productName(p))}</option>`).join('')}</select>
          <input class="input" type="date" name="from" value="${esc(f.from)}" aria-label="From">
          <input class="input" type="date" name="to" value="${esc(f.to)}" aria-label="To">
        </form>${rows}`)}
    </div>`;
  }

  async function downloadRegisterCsv() {
    try {
      const blob = await wellipayApi.downloadRegisterCsv({ ...(ph.regFilter.productId ? { productId: ph.regFilter.productId } : {}), ...(ph.regFilter.from ? { from: ph.regFilter.from } : {}), ...(ph.regFilter.to ? { to: ph.regFilter.to } : {}), limit: 2000 });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'controlled-drug-register.csv';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (err) { showToast('Download failed', err.message); }
  }

  /* Hooks used by app.js */
  const pages = {
    'pharmacy-products': renderProducts,
    'pharmacy-inventory': renderInventory,
    'pharmacy-prescriptions': renderPrescriptions,
    'pharmacy-orders': renderOrders,
    'pharmacy-register': renderRegister,
  };

  const modals = {
    'ph-product': productModal, 'ph-offer': offerModal, 'ph-batches': batchesModal, 'ph-batch-action': batchActionModal,
    'ph-receive': receiveModal, 'ph-supplier': supplierModal, 'ph-new-rx': newRxModal, 'ph-verify': verifyModal,
    'ph-new-order': newOrderModal, 'ph-dispense': dispenseModal, 'ph-cancel-order': cancelOrderModal, 'ph-delivery': deliveryModal,
    'ph-order-detail': orderDetailModal, 'ph-pharmacist': pharmacistModal,
    'ph-service-price': servicePriceModal, 'ph-courier': courierModal, 'ph-courier-secret': courierSecretModal, 'ph-rx-photos': photosModal,
  };

  function modalHtml() {
    const fn = state.modal && modals[state.modal.type];
    return fn ? fn() : null;
  }

  function handleAction(action, target) {
    const id = target.dataset.id;
    const open = modal => { state.modal = modal; render(); };
    switch (action) {
      case 'ph-new-product': open({ type: 'ph-product', productId: '' }); return true;
      case 'ph-edit-product': open({ type: 'ph-product', productId: id }); return true;
      case 'ph-toggle-product': toggleProduct(id); return true;
      case 'ph-offer-services': open({ type: 'ph-offer' }); return true;
      case 'ph-batches': openBatches(id); return true;
      case 'ph-batch-action': open({ type: 'ph-batch-action', kind: target.dataset.kind, batchId: id, label: target.dataset.label, onhand: target.dataset.onhand, productId: state.modal && state.modal.productId }); return true;
      case 'ph-receive': open({ type: 'ph-receive', productId: id || '' }); return true;
      case 'ph-new-supplier': open({ type: 'ph-supplier', supplierId: '' }); return true;
      case 'ph-edit-supplier': open({ type: 'ph-supplier', supplierId: id }); return true;
      case 'ph-new-rx': open({ type: 'ph-new-rx' }); return true;
      case 'ph-verify': open({ type: 'ph-verify', prescriptionId: id }); return true;
      case 'ph-new-order': openNewOrder(); return true;
      case 'ph-dispense': open({ type: 'ph-dispense', orderId: id }); return true;
      case 'ph-cancel-order': open({ type: 'ph-cancel-order', orderId: id }); return true;
      case 'ph-delivery': open({ type: 'ph-delivery', orderId: id }); return true;
      case 'ph-order-detail': openOrderDetail(id); return true;
      case 'ph-pharmacist': open({ type: 'ph-pharmacist', staffId: id }); return true;
      case 'ph-service-price': open({ type: 'ph-service-price', itemId: id }); return true;
      case 'ph-service-toggle': toggleService(id); return true;
      case 'ph-ready': markReady(id); return true;
      case 'ph-new-courier': open({ type: 'ph-courier', courierId: '' }); return true;
      case 'ph-edit-courier': open({ type: 'ph-courier', courierId: id }); return true;
      case 'ph-rotate-secret': rotateSecret(id); return true;
      case 'ph-rx-photos': openPhotos(id); return true;
      case 'ph-register-csv': downloadRegisterCsv(); return true;
      default: return false;
    }
  }

  // Returns true when the submit belonged to the pharmacy workspace.
  function handleSubmit(event) {
    const form = event.target;
    const map = {
      'ph-product-form': submitProduct, 'ph-offer-form': submitOffers, 'ph-batch-action-form': submitBatchAction,
      'ph-receive-form': submitReceipt, 'ph-supplier-form': submitSupplier, 'ph-rx-form': submitRx,
      'ph-order-form': submitOrder, 'ph-dispense-form': submitDispense, 'ph-cancel-form': submitCancelOrder,
      'ph-delivery-form': submitDelivery, 'ph-pharmacist-form': submitPharmacist,
      'ph-service-price-form': submitServicePrice, 'ph-courier-form': submitCourier,
    };
    if (form.id === 'ph-verify-form') { event.preventDefault(); submitVerify(form, event.submitter); return true; }
    if (form.id === 'ph-filter-form' || form.id === 'ph-register-filter') { event.preventDefault(); return true; }
    const fn = map[form.id];
    if (!fn) return false;
    event.preventDefault();
    fn(form);
    return true;
  }

  // Filters and the delivery step selector change what is on screen without a submit.
  function handleChange(event) {
    const t = event.target;
    if (t.closest && t.closest('#ph-filter-form')) {
      // The search box is handled on input. A change event also fires on blur and would re-render mid-removal.
      if (t.name === 'q' && event.type === 'change') return true;
      const fd = new FormData(t.closest('form'));
      ph.filter = { q: val(fd, 'q'), category: val(fd, 'category'), cls: val(fd, 'cls'), stock: val(fd, 'stock') };
      render();
      const q = document.querySelector('#ph-filter-form input[name="q"]');
      if (q && t.name === 'q') { q.focus(); q.setSelectionRange(q.value.length, q.value.length); }
      return true;
    }
    if (t.id === 'ph-photo-input') { uploadPhoto(t); return true; }
    if (t.closest && t.closest('#ph-register-filter')) {
      const fd = new FormData(t.closest('form'));
      ph.regFilter = { productId: val(fd, 'productId'), from: val(fd, 'from'), to: val(fd, 'to') };
      ph.registerSynced = false;
      render();
      return true;
    }
    if (t.name === 'ph-rx-status') { ph.rxStatus = t.value; ph.rxSynced = false; render(); return true; }
    if (t.name === 'ph-order-status') { ph.orderStatus = t.value; ph.ordersSynced = false; render(); return true; }
    if (t.id === 'ph-del-action' && state.modal && state.modal.type === 'ph-delivery') { state.modal.action = t.value; render(); return true; }
    return false;
  }

  return { pages, sync, modalHtml, handleAction, handleSubmit, handleChange, handleInput: e => (e.target.closest && e.target.closest('#ph-filter-form') ? handleChange(e) : false) };
}
