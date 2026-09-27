const groups = [
  { name: 'Overview', items: [['dashboard', 'Dashboard', 'grid'], ['hospital-desk', 'Hospital Desk', 'wallet'], ['ai-insights', 'AI Insights', 'spark'], ['notifications', 'Notifications', 'bell']] },
  { name: 'Revenue Cycle', items: [['patients', 'Patients', 'users'], ['invoices', 'Invoices', 'file'], ['payments', 'Payments', 'credit'], ['services-pricing', 'Services & Pricing', 'list']] },
  { name: 'Claims & Payers', items: [['claims', 'Claims', 'claim'], ['hmo-insurance', 'HMO / Insurance', 'shield'], ['authorization', 'Authorization Centre', 'check'], ['family-sponsors', 'Family / Sponsors', 'users'], ['wellipass', 'WelliPass', 'qr'], ['receivables', 'Receivables', 'receipt'], ['reconciliation', 'Reconciliation', 'refresh'], ['settlements', 'Settlements', 'bank'], ['refunds', 'Refunds', 'undo']] },
  { name: 'Growth', items: [['financing', 'Financing', 'trend'], ['payment-plans', 'Payment Plans', 'calendar'], ['referrals', 'Referrals', 'share'], ['partners', 'Providers / Partners', 'link']] },
  { name: 'Operations', items: [['reports', 'Reports', 'chart'], ['branches', 'Branches', 'building'], ['staff', 'Staff', 'users'], ['integrations', 'Integrations', 'plug'], ['api-developers', 'API & Developers', 'code']] },
  { name: 'Account', items: [['subscription', 'Subscription', 'card'], ['audit-log', 'Audit Log', 'clock'], ['support', 'Support', 'help'], ['settings', 'Settings', 'settings']] },
  { name: 'Connected Apps', items: [['mobile-app', 'Mobile App Integration', 'phone']] },
];

const iconPaths = {
  grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  wallet: '<rect x="3" y="5" width="18" height="15"/><path d="M3 9h18M16 14h2"/>', spark: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>',
  bell: '<path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/>', users: '<path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6M23 11h-6"/>',
  file: '<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7"/>', credit: '<rect x="3" y="5" width="18" height="14"/><path d="M3 10h18M7 15h4"/>', list: '<path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  claim: '<path d="M6 3h12v18H6zM9 8h6M9 12h6M9 16h3"/>', shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>', check: '<path d="m5 12 4 4L19 6"/><circle cx="12" cy="12" r="9"/>', qr: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM19 14h2v2h-2zM19 19h2v2h-2zM17 19v2"/>',
  receipt: '<path d="M5 3h14v18l-3-2-4 2-4-2-3 2zM8 8h8M8 12h8M8 16h4"/>', refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9A7 7 0 0 1 18 6l2 2M4 16l2 2a7 7 0 0 0 12.4-3"/>', bank: '<path d="m3 9 9-6 9 6M4 10h16M6 10v8M10 10v8M14 10v8M18 10v8M3 21h18M4 18h16"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-2"/>', trend: '<path d="m3 17 6-6 4 4 8-9M15 6h6v6"/>', calendar: '<rect x="3" y="5" width="18" height="16"/><path d="M16 3v4M8 3v4M3 10h18"/>', share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.7 6.6-4.4m-6.6 7 6.6 4.4"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.1 0l3-3A5 5 0 0 0 13 2.9l-1.7 1.7M14 11a5 5 0 0 0-7.1 0l-3 3A5 5 0 0 0 11 21.1l1.7-1.7"/>', chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>', building: '<path d="M3 21h18M5 21V5l7-3 7 3v16M9 9h.01M15 9h.01M9 13h.01M15 13h.01M10 21v-4h4v4"/>', plug: '<path d="M9 7V3M15 7V3M8 7h8v5a4 4 0 0 1-8 0V7ZM12 16v5"/>',
  code: '<path d="m8 8-5 4 5 4m8-8 5 4-5 4m-3-11-2 14"/>', card: '<rect x="3" y="5" width="18" height="14"/><path d="M3 10h18M7 15h3"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 4.1 1.9c-1.1.9-1.7 1.3-1.7 2.6M12 17h.01"/>', settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.8 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.8-1l-1.7.6-1.4-2.4 1.4-1.1a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.8-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.8 1l1.7-.6 1.4 2.4-1.4 1.1a8 8 0 0 1 0 2Z"/>', phone: '<rect x="6" y="2" width="12" height="20"/><path d="M10 18h4"/>'
};

const stubData = {
  'ai-insights': ['AI Insights', 'Ask WelliPay about revenue, claims and receivables — plain-language answers over your own data.', [['31','Insights this week'],['6','Alerts surfaced'],['1.2s','Avg time to answer']], [['Revenue dipped in Kaduna','−12% vs last month','Investigate'],['HMO tariff below private rate','Reliance HMO — ECG','Review pricing'],['3 claims likely to reject','Missing pre-authorization','Fix before submit']]],
  notifications: ['Notification Centre','One inbox for payment, claim, settlement and system alerts across every branch.', [['14','Unread'],['212','Sent today'],['4','Channels active']], [['Settlement completed — Paystack','₦1,950,000 to GTBank ••4471','Settlement'],['Claim rejected — CLM-5543','AXA Mansard','Claim'],['Failed payment retry succeeded','INV-2033','Payment']]],
  patients: ['Patient Management','Financial patient profiles — WelliID, outstanding bills and payment history.', [['3,204','Active patients'],['₦2.1M','Outstanding balance'],['18 days','Avg balance age']], [['Ngozi A. — WR-2291-04','₦45,000 due','HMO pending'],['Femi O. — WR-1187-22','₦0 due','Settled'],['Blessing K. — WR-3390-11','₦120,000 due','Payment plan']]],
  invoices: ['Digital Invoice Engine','Itemised invoices built automatically from existing charge records.', [['142','Open invoices'],['₦8.4M','Invoiced this month'],['6 days','Avg time to pay']], [['INV-2048 — Femi O.','₦58,000','Part-paid'],['INV-2049 — Blessing K.','₦23,000','Unpaid'],['INV-2050 — Chinwe E.','₦120,000','Paid']]],
  payments: ['Payment Collection','Card, bank transfer, USSD and cash — one reconciliation surface.', [['86','Successful today'],['96.4%','Success rate'],['4','Failed retries queued']], [['Card','₦620,000','44%'],['Bank transfer','₦510,000','36%'],['USSD / Cash','₦280,000','20%']]],
  'services-pricing': ['Service Catalogue & Pricing Engine','Prices, packages and per-payer tariffs for every service.', [['214','Active services'],['38 of 41','HMO tariffs mapped'],['12','Packages']], [['ECG','₦18,000 cash · ₦15,000 HMO A','Cardiology'],['Executive Checkup','₦250,000 package','Bundle'],['Full Blood Count','₦8,500','Lab']]],
  'hmo-insurance': ['HMO / Insurance Directory','Eligibility, benefit, tariff and authorization per plan.', [['9','Contracted HMOs'],['27','Active plans'],['−14%','Avg tariff variance']], [['Reliance HMO — Gold','Consultation covered · Diagnostics 80%','Active'],['Hygeia HMO — Silver','Copay 20%','Active'],['AXA Mansard — Bronze','Pharmacy excluded','Review']]],
  wellipass: ['WelliPass',"The patient's healthcare access and payment-authorization pass — scanned at the front desk to skip manual lookup.", [['62','Scans today'],['2.1 min','Avg desk time saved'],['118','Linked dependants']], [['WelliPass adoption','3,204 of 3,540 active patients','90%'],['Emergency financial authorization','Enabled for 41 patients','Active'],['Child WelliPass (dependant)','Parent as funding authority','118 linked']]],
  refunds: ['Refund Engine','Full, partial and failed-transaction refunds — every one authorized and logged.', [['₦35,000','Refunded this month'],['2','Pending approval'],['4.1 hrs','Avg approval time']], [['REF-881 — Chidi O.','₦120,000','Pending'],['REF-880 — Blessing K.','₦18,500','Approved'],['REF-879 — Tunde A.','₦45,000','Pending']]],
  financing: ['Financing Marketplace','Patients see eligible options from regulated financing partners at checkout.', [['41','Active plans'],['₦4.1M','Financed this month'],['68%','Approval rate']], [['Cataract surgery — Femi O.','₦100,000 over 6 months','Active'],['Dental implant — Ngozi A.','₦180,000 over 12 months','Active'],['Executive checkup — Chinwe E.','₦60,000 over 3 months','Pending approval']]],
  'payment-plans': ['Patient Payment Plans','Installment plans on treatment cost, tracked to the next due date.', [['57','Active plans'],['₦2.3M','Collected this month'],['4','Missed installments']], [['Blessing K. — ₦100,000 × 5','Installment 3 of 5 due Oct 2','On track'],['Emeka N. — ₦75,000 × 3','Installment 2 missed','Overdue']]],
  referrals: ['Referral Network','Patients referred between providers, and the transactions that follow.', [['23','Referrals this month'],['17','Completed'],['3.4 days','Avg time to completion']], [['ABC Clinic → ABC Laboratory','Full blood count','Completed'],['ABC Clinic → Radiant Imaging','MRI — knee','Awaiting payment']]],
  partners: ['Providers & Partners','The network of labs, pharmacies and specialist centres connected to ABC Healthcare.', [['9','Connected partners'],['23','Referrals sent'],['11','Referrals received']], [['ABC Laboratory','Lab services','Connected'],['Radiant Imaging','Diagnostics','Connected'],['CarePlus Pharmacy','Pharmacy','Pending invite']]],
  reports: ['Reports','Revenue, receivables, claims and reconciliation, exportable to CSV.', [['6','Scheduled reports'],['41','Exported this month'],['2 hrs ago','Last export']], [['Monthly revenue report — Sep 2026','CSV · 212 KB','Ready'],['Claim ageing report — Q3','CSV · 88 KB','Ready'],['Branch reconciliation — Sep','Generating','In progress']]],
  branches: ['Branch Management','Five branches, one consolidated view of staff, services and revenue.', [['5','Branches'],['₦19.25M','Consolidated revenue'],['Maitama','Top branch']], [['Wuse','₦5,200,000','12 staff'],['Garki','₦3,400,000','8 staff'],['Maitama','₦7,100,000','15 staff'],['Kaduna','₦1,450,000','6 staff']]],
  staff: ['Staff & Roles','Cashiers, billing officers and finance managers, each with scoped access.', [['46','Active staff'],['5','Roles configured'],['2','Pending invites']], [['Adaeze O.','Finance Manager — Maitama','Active'],['Tunde A.','Cashier — Wuse','Active'],['Ngozi F.','Billing Officer — Garki','Active']]],
  integrations: ['Integrations',"Connect existing EHR, LIS and pharmacy systems to WelliPay's financial layer.", [['3','Connected'],['12','Available'],['4,204 records','Data synced today']], [['WelliRecord','Charges, patients, consent','Connected'],['Termii','SMS payment links','Connected'],['Paystack','Checkout, transfers, webhooks','Connected']]],
  'api-developers': ['API & Developers','Keys, sandbox and webhook logs for facilities that connect their own systems.', [['2','Active API keys'],['18,204','Requests this month'],['99.6%','Webhook success rate']], [['payment.success','webhook','Live'],['claim.approved','webhook','Live'],['Sandbox key — test_wp_...','Created Aug 14','Active']]],
  subscription: ['Subscription','Platform plan, transaction fees and usage for ABC Healthcare.', [['Business','Plan'],['₦85,000','Monthly fee'],['1.4%','Transaction fee']], [['Business plan','5 branches, unlimited staff','Active'],['HMO Claims add-on','₦25,000/mo','Active'],['AI Copilot add-on','₦15,000/mo','Active']]],
  'audit-log': ['Audit Log','Every payment, refund, tariff and bank-detail change — who, what, when.', [['212','Events today'],['3','Sensitive changes'],['7 years','Retention']], [['Adaeze O. approved refund REF-880','₦18,500','09:41'],['Tunde A. issued receipt RCT-9021','₦45,000','09:12'],['System bank-detail change requested','Awaiting second approval','08:55']]],
  support: ['Support Centre','Documentation, chat support and dispute or settlement issue tickets.', [['2','Open tickets'],['18 min','Avg first response'],['4.8/5','Satisfaction']], [['Settlement delay — SET-1189','Awaiting gateway confirmation','Open'],['Payment link not loading','Resolved Sep 24','Closed']]]
};

const money = value => '₦' + Math.round(value).toLocaleString('en-US');
const labels = Object.fromEntries(groups.flatMap(group => group.items.map(([id, label]) => [id, label])));
const state = {
  active: location.hash.slice(1) || 'dashboard', filter: 'Month', branch: 'All branches',
  unmatched: [{id:1, amount:85000, source:'Paystack transfer', suggestion:'Invoice #INV-2048 — Femi O.', date:'Sep 24'}, {id:2, amount:23500, source:'Bank transfer — GTBank', suggestion:'Invoice #INV-2061 — Blessing K.', date:'Sep 25'}, {id:3, amount:12000, source:'USSD payment', suggestion:'Invoice #INV-2077 — Chinwe E.', date:'Sep 26'}],
  matched:1248, exceptions:8, duplicates:3, modal:null, approvals:[{id:1,type:'Refund',amount:45000,requester:'Tunde A. (Cashier)',reason:'Duplicate payment'},{id:2,type:'Write-off',amount:18500,requester:'Ngozi F. (Billing)',reason:'HMO short-pay'},{id:3,type:'Refund',amount:120000,requester:'Chidi O. (Cashier)',reason:'Cancelled service'}],
  messages:[{role:'assistant',text:'Ask me about revenue, claims, reconciliation, or receivables.'}], payer:'patient', sponsor:'', payment:'idle', authStage:'idle', hmoAmount:0, patientAmount:0, consent:false, patient:{name:'Femi O.',welliId:'WR-1187-22',hmo:'Reliance HMO — Gold'},
  claims:[{id:1,ref:'INV-2049 — Blessing K.',hmo:'Hygeia HMO',amount:23000,status:'Draft'},{id:2,ref:'INV-2050 — Chinwe E.',hmo:'Reliance HMO',amount:120000,status:'Submitted'},{id:3,ref:'INV-2048 — Femi O.',hmo:'AXA Mansard',amount:58000,status:'Rejected',reason:'Missing pre-authorization reference.'},{id:4,ref:'INV-2044 — Tunde A.',hmo:'Reliance HMO',amount:45000,status:'Approved'}],
  family:[{name:'Brother',amount:400000,paid:false},{name:'Sister',amount:300000,paid:false},{name:'Uncle',amount:300000,paid:false}], authCounts:{Draft:12,Submitted:18,Pending:7,Approved:35,'Partially Approved':4,Rejected:3,Expired:2,Appeal:1},
  authItems:[{id:1,patient:'Emeka N.',service:'MRI — Knee',hmo:'Reliance HMO',amount:180000,status:'Draft',readiness:92,timeline:[['09:02','Doctor requested MRI'],['09:04','Eligibility verified — active, Gold plan']]},{id:2,patient:'Blessing K.',service:'Surgery Package',hmo:'Hygeia HMO',amount:500000,status:'Submitted',timeline:[['08:10','Surgery Package requested'],['08:12','Eligibility verified'],['08:15','Submitted to Hygeia HMO']]},{id:3,patient:'Chidi O.',service:'Dialysis',hmo:'AXA Mansard',amount:120000,status:'Pending',timeline:[['07:40','Dialysis requested'],['07:42','Eligibility verified'],['07:45','Submitted to AXA Mansard'],['10:31','AXA Mansard requested documentation']]}], selectedAuth:null,
  settings:{threshold:100000,secondApproval:true},
  mobileApp:{lastSync:'2 min ago',syncCount:4204,notice:'',features:{billPayments:true,billHistory:true,familyFunding:true,welliPass:true},events:[['09:41','payment.received','₦45,000 · INV-2033 · Demo event'],['09:28','family.requested','Ngozi A. → Mum · Demo event'],['09:12','patient.registered','WR-3390-11 · Demo event']]}
};

const content = document.querySelector('#content');
const nav = document.querySelector('#navigation');
const modalRoot = document.querySelector('#modal-root');

function icon(name) { return `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || ''}</svg>`; }
function renderNav() {
  nav.innerHTML = groups.map(group => `<div class="nav-group"><div class="nav-label">${group.name}</div>${group.items.map(([id,label,iconName]) => `<a class="nav-link" href="#${id}" ${state.active === id ? 'aria-current="page"' : ''}><span class="nav-icon">${icon(iconName)}</span><span>${label}</span></a>`).join('')}</div>`).join('');
}
function card(kicker, body, className='') { return `<section class="card elev-sm ${className}"><div class="card-kicker">${kicker}</div>${body}</section>`; }
function stat(value, label, kicker='') { return `<section class="card elev-sm stat-card"><span class="card-kicker">${kicker || label}</span><strong class="stat-value">${value}</strong><span class="stat-label">${label}</span></section>`; }
function pageHeading(kicker, title, sub='') { return `<header class="page-heading"><div>${kicker ? `<span class="eyebrow">${kicker}</span>` : ''}<h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div></header>`; }
function tag(label, type='neutral') { return `<span class="tag tag-${type}">${label}</span>`; }
function dataRow(title, detail, status, type='neutral', action='') { return `<div class="data-row"><div class="data-primary"><strong>${title}</strong><span>${detail}</span></div>${action || tag(status,type)}</div>`; }
function metricGrid(items, className='stats-grid') { return `<div class="grid ${className}">${items.map(item => stat(item[0],item[1],item[2])).join('')}</div>`; }
function renderDashboard() {
  const tiles = [['₦2,450,000','This period','Revenue'],['₦1,950,000','This period','Collected'],['₦500,000','This period','Outstanding'],['₦1,200,000','Owed to facility','HMO receivables'],['₦750,000','Awaiting HMO decision','Pending claims'],['₦450,000','In gateway pipeline','Pending settlements'],['124','This period','Patients served'],['₦35,000','This period','Refunds']];
  const trend = [1.8,2.1,1.6,2.4,2.0,2.6,2.45];
  const trendMax = Math.max(...trend);
  const branches = [['Wuse',5200000],['Garki',3400000],['Maitama',7100000],['Kaduna',1450000],['Lagos',2100000]];
  const branchMax = Math.max(...branches.map(row=>row[1]));
  const unmatchedMarkup = state.unmatched.length ? state.unmatched.slice(0,3).map(item=>`<div class="data-row"><div class="data-primary"><strong>${money(item.amount)} · ${item.source}</strong><span>${item.suggestion}</span></div><button class="btn btn-secondary" data-action="open-match" data-id="${item.id}">Match</button></div>`).join('') : '<p class="empty-state">Nothing unmatched right now.</p>';
  const approvalRows = state.approvals.length ? `<div class="table-wrap"><table class="table approval-table"><thead><tr><th>Type</th><th>Amount</th><th>Requester</th><th>Reason</th><th>Decision</th></tr></thead><tbody>${state.approvals.map(item=>`<tr><td>${item.type}</td><td>${money(item.amount)}</td><td>${item.requester}</td><td>${item.reason}</td><td><button class="btn btn-secondary" data-action="approval" data-id="${item.id}">Reject</button> <button class="btn btn-primary" data-action="approval" data-id="${item.id}">Approve</button></td></tr>`).join('')}</tbody></table></div>` : '<p class="empty-state">Queue is clear — nothing pending approval.</p>';
  const messages = state.messages.map(item=>`<div class="chat-line ${item.role}"><div class="chat-bubble">${item.text}</div></div>`).join('');
  return `<div class="page">
    <div class="page-heading"><div><h1>Good afternoon, Adaeze</h1><p>Sunday, September 27, 2026 · ABC Healthcare, consolidated</p></div><div class="seg" role="group" aria-label="Date range">${['Today','Week','Month','Quarter'].map(value=>`<label class="seg-opt"><input type="radio" name="filter" value="${value}" ${state.filter===value?'checked':''}><span>${value}</span></label>`).join('')}</div></div>
    ${metricGrid(tiles)}
    <div class="grid two-col">
      ${card('Revenue trend · last 7 days',`<div class="chart-summary"><strong>₦2.45M</strong><span>+8.4% vs last week</span></div><div class="chart">${trend.map((value,i)=>`<div class="chart-column"><div class="chart-bar" style="height:${Math.round(value/trendMax*100)}%"></div><span>${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span></div>`).join('')}</div>`,'trend-card')}
      ${card('Payer mix · this month', `<div class="mix-bar"><span style="width:40%;background:var(--color-neutral-300)"></span><span style="width:45%;background:var(--color-accent-500)"></span><span style="width:10%;background:var(--color-accent-800)"></span><span style="width:5%;background:var(--color-neutral-600)"></span></div><div class="mix-legend"><span class="legend-item"><i class="swatch" style="background:var(--color-neutral-300)"></i>Patient 40%</span><span class="legend-item"><i class="swatch" style="background:var(--color-accent-500)"></i>HMO 45%</span><span class="legend-item"><i class="swatch" style="background:var(--color-accent-800)"></i>Insurance 10%</span><span class="legend-item"><i class="swatch" style="background:var(--color-neutral-600)"></i>Corporate 5%</span></div><div class="chart-summary"><strong>₦6.2M</strong><span>collected by payer</span></div>`, 'mix-card')}
    </div>
    ${card('Branch revenue',`<div class="branch-list">${branches.map(([name,amount])=>`<div class="branch-row"><strong>${name}</strong><div class="branch-track"><div class="branch-fill" style="width:${Math.round(amount/branchMax*100)}%"></div></div><span class="branch-amount">${money(amount)}</span></div>`).join('')}</div>`)}
    <div class="grid two-col">
      ${card('<div class="section-heading"><span>Receivables & ageing</span><a href="#receivables">View all →</a></div>','<div class="mini-metrics"><div class="mini-metric"><strong>₦450K</strong><span>Patient</span></div><div class="mini-metric"><strong>₦3.2M</strong><span>HMO</span></div><div class="mini-metric"><strong>₦800K</strong><span>Insurance</span></div><div class="mini-metric"><strong>₦400K</strong><span>Financing</span></div></div>')}
      ${card('<div class="section-heading"><span>Smart Reconciliation Centre</span><a href="#reconciliation">Open workspace →</a></div>',`<div class="mini-metrics"><div class="mini-metric"><strong>${state.matched.toLocaleString()}</strong><span>Matched</span></div><div class="mini-metric"><strong style="color:var(--color-accent-700)">${state.unmatched.length}</strong><span>Unmatched</span></div><div class="mini-metric"><strong>${state.exceptions}</strong><span>Exceptions</span></div><div class="mini-metric"><strong>${state.duplicates}</strong><span>Duplicate</span></div></div><div class="row-list">${unmatchedMarkup}</div>`)}
    </div>
    <div class="grid two-col">
      ${card('Revenue leakage alerts',`<div class="row-list">${[['₦185,000','14 completed services have no corresponding invoice.','Maitama'],['₦62,000','3 HMO-eligible services were billed as self-pay.','Wuse'],['₦41,000','Duplicate discount applied on 6 invoices.','Garki']].map(([amount,reason,branch])=>`<div class="data-row"><div class="data-primary"><strong class="alert-amount">${amount}</strong><span>${reason}</span></div>${tag(branch,'accent')}</div>`).join('')}</div>`)}
      ${card('Claim scrubbing readiness',`<div class="row-list">${[['CLM-5544','Reliance HMO',87,['Missing pre-auth ref']],['CLM-5545','Hygeia HMO',62,['Tariff mismatch','Expired eligibility']],['CLM-5546','AXA Mansard',95,[]]].map(([id,hmo,pct,issues])=>`<div class="data-row"><div class="data-primary"><strong>${id} · ${hmo}</strong><div class="readiness"><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div><strong>${pct}%</strong></div><div class="issue-tags">${issues.length?issues.map(issue=>tag(issue,'outline')).join(''):tag('Ready to submit')}</div></div></div>`).join('')}</div>`)}
    </div>
    ${card('Approval queue · refunds & write-offs',approvalRows)}
    ${card('Ask WelliPay',`<div class="chat-log" id="chat-log">${messages}</div><div class="chips">${['Which HMO owes us the most?','Show unpaid invoices over 30 days','Which claims are likely to be rejected?','What payments haven’t been reconciled?'].map(text=>`<button class="chip-button" data-action="ask-suggestion" data-text="${text}">${text}</button>`).join('')}</div><form class="chat-form" id="chat-form"><input class="input" name="question" placeholder="Ask about revenue, claims, receivables…" aria-label="Ask WelliPay a question" required><button class="btn btn-primary" type="submit">Ask</button></form>`)}
  </div>`;
}

function renderDesk() {
  const total=58000, isHmo=state.payer==='hmo', isFamily=state.payer==='family', needsAuth=isHmo&&total>=50000;
  let flow='';
  if(isFamily&&state.payment==='idle') flow=`<p>Choose who to request payment from:</p><div class="sponsor-choices">${['Mother','Brother','Sister','Uncle'].map(name=>`<button class="sponsor-choice ${state.sponsor===name?'selected':''}" data-action="choose-sponsor" data-name="${name}">${name}</button>`).join('')}</div><button class="btn btn-primary" data-action="family-request" ${state.sponsor?'':'disabled'}>Send payment request</button>`;
  else if(isFamily&&state.payment==='pending') flow=`<div class="section-heading"><strong>Awaiting family payment</strong>${tag('Expires in 24h','outline')}</div><p>${money(total)} requested from <strong>${state.sponsor}</strong></p><button class="btn btn-secondary" data-action="family-paid">Simulate: ${state.sponsor} pays</button>`;
  else if(isFamily&&state.payment==='paid') flow=`<div class="section-heading"><strong>Paid by ${state.sponsor}</strong>${tag('Receipt sent')}</div><button class="btn btn-ghost" data-action="reset-payment">Reset demo</button>`;
  else if(needsAuth&&state.authStage==='idle') flow=`<div class="section-heading"><strong>HMO authorization required</strong><button class="btn btn-primary" data-action="request-auth">Request authorization</button></div>`;
  else if(needsAuth&&state.authStage==='pending') flow=`<strong>Awaiting HMO decision…</strong><button class="btn btn-secondary" data-action="approve-hmo">Simulate: HMO approves</button>`;
  else if(needsAuth&&state.authStage==='approved'&&!state.consent) flow=`<strong>Financial consent</strong><div class="data-row"><span>HMO covers</span><strong>${money(state.hmoAmount)}</strong></div><div class="data-row"><span>Patient responsibility</span><strong>${money(state.patientAmount)}</strong></div><p>Patient reviews the estimated cost and payer contribution before proceeding.</p><button class="btn btn-primary" data-action="consent">Patient reviews & authorizes</button>`;
  else if(needsAuth&&state.authStage==='approved'&&state.consent&&state.payment==='idle') flow=`<div class="data-row"><span>HMO covers</span><strong>${money(state.hmoAmount)}</strong></div><div class="data-row"><span>Patient owes</span><strong>${money(state.patientAmount)}</strong></div>${tag('Consent recorded')}<button class="btn btn-primary" data-action="receive-payment">Collect ${money(state.patientAmount)}</button>`;
  else if(state.payment==='paid') flow=`<div class="section-heading"><strong>${needsAuth?`Paid by patient — ${money(state.patientAmount)} (HMO covered ${money(state.hmoAmount)})`:({patient:'Paid by patient',financing:'Paid via financing partner',mixed:'Paid — mixed funding'}[state.payer]||'Paid')}</strong>${tag('Receipt sent')}</div><button class="btn btn-ghost" data-action="reset-payment">Reset demo</button>`;
  else flow='<button class="btn btn-primary" data-action="receive-payment">Receive payment</button>';
  const activity=[['87','Patients'],['74','Bills'],['₦3.4M','Collected'],['₦850K','Pending']];
  return `<div class="page"><div class="page-heading"><div><span class="eyebrow">Hospital Desk</span><h2>Front desk & cashier</h2><p>Manage today’s patient billing and collections.</p></div><div class="toolbar"><button class="btn btn-secondary" data-action="new-patient">New Patient</button><button class="btn btn-secondary" data-action="find-patient">Find Patient</button><button class="btn btn-primary" data-action="open-wellipass">Scan WelliPass</button></div></div>
    ${metricGrid(activity.map(([value,label])=>[value,label,label]),'grid activity-grid')}
    <div class="desk-layout"><div class="desk-stack">${card('Payment queue',`<div class="row-list">${[['John',50000,'Awaiting','outline'],['Mary',120000,'HMO','outline'],['Peter',80000,'Family','accent'],['David',200000,'Financing','outline'],['Sarah',30000,'Partial','neutral']].map(([name,amount,status,type])=>`<div class="queue-row"><strong>${name}</strong><span>${money(amount)}</span>${tag(status,type)}</div>`).join('')}</div>`)}${card('Recent activity',`${dataRow('Receipt RCT-9021','Tunde A. · Wuse · 09:12','Paid')}${dataRow('HMO request sent','Reliance Gold · 09:04','Pending','outline')}${dataRow('Family payment received','Peter · 08:51','Settled')}`)}</div>
    <section class="card elev-sm bill-card"><span class="card-kicker">Create bill & collect payment</span><div class="patient-summary"><div><strong>${state.patient.name} · ${state.patient.welliId}</strong><span>${state.patient.hmo}</span></div><button class="btn btn-ghost" data-action="open-wellipass">Change →</button></div><div class="row-list">${[['Consultation',15000],['ECG',18000],['Lab — Full Blood Count',25000]].map(([name,amount])=>`<div class="data-row"><span>${name}</span><strong>${money(amount)}</strong></div>`).join('')}<div class="data-row"><strong>Total</strong><strong>${money(total)}</strong></div></div><div class="payer-group"><span class="card-kicker">Who is paying?</span><div class="seg">${[['patient','Patient'],['family','Family'],['hmo','HMO'],['financing','Financing'],['mixed','Mixed']].map(([id,label])=>`<label class="seg-opt"><input type="radio" name="payer" value="${id}" ${state.payer===id?'checked':''}><span>${label}</span></label>`).join('')}</div></div><div class="workflow-panel ${state.payment==='paid'?'neutral':''}">${flow}</div></section></div>
  </div>`;
}

function renderAuthorization() {
  const counts=Object.entries(state.authCounts).map(([label,value])=>`<section class="card elev-sm auth-count"><span class="stat-value">${value}</span><span class="stat-label">${label}</span></section>`).join('');
  const authItems=state.authItems.map(item=>`<div class="auth-item"><div class="auth-head" data-action="toggle-auth" data-id="${item.id}"><div class="data-primary"><strong>${item.patient} · ${item.service}</strong><span>${item.hmo} · ${money(item.amount)}</span></div>${tag(item.status,item.status==='Approved'?'neutral':item.status==='Rejected'?'accent':'outline')}</div>${state.selectedAuth===item.id?`<div class="auth-detail">${item.readiness?`<div class="readiness"><span class="card-kicker">Readiness</span><div class="progress-track"><div class="progress-fill" style="width:${item.readiness}%"></div></div><strong>${item.readiness}%</strong></div>`:''}${item.timeline.map(([time,text])=>`<div class="timeline-line"><time>${time}</time><span>${text}</span></div>`).join('')}<div class="toolbar">${item.status==='Draft'?`<button class="btn btn-primary" data-action="submit-auth" data-id="${item.id}">Submit to HMO</button>`:''}${['Submitted','Pending'].includes(item.status)?`<button class="btn btn-secondary" data-action="approve-auth" data-id="${item.id}">Simulate: HMO approves</button>`:''}${item.status==='Approved'?'<span class="stat-label">Patient notified.</span>':''}</div></div>`:''}</div>`).join('');
  return `<div class="page">${pageHeading('Authorization Centre','Pre-authorization & eligibility','Track payer decisions, service readiness and member benefit limits.')}
    <div class="grid auth-count-grid">${counts}</div><div class="grid two-col">${card('SLA by HMO · average response time',`${dataRow('Reliance HMO','','2h 14m')}${dataRow('Hygeia HMO','','7h 31m')}${dataRow('AXA Mansard','','4h 02m')}`)}${card('Coverage & benefit limit · sample patient',`<div class="section-heading"><span>Annual limit</span><strong>₦1,000,000</strong></div><div class="progress-track"><div class="progress-fill" style="width:65%"></div></div><div class="progress-meta"><span>Used ₦650,000</span><span>Remaining ₦350,000</span></div>`)}</div>
    ${card('Cost estimator · sample treatment plan',`${[['Treatment','₦1,200,000'],['HMO coverage','−₦600,000'],['WelliSave','−₦150,000'],['Family','−₦200,000'],['Financing','−₦250,000']].map(([label,value])=>`<div class="data-row"><span>${label}</span><strong>${value}</strong></div>`).join('')}<div class="data-row"><strong>Patient balance</strong><strong>₦0</strong></div>`,'funding-card')}
    ${card('Authorization inbox',authItems)}
  </div>`;
}

function renderClaims() {
  return `<div class="page">${pageHeading('HMO Claims','Submission, tracking & resubmission','A live claim queue for ABC Healthcare’s payer submissions.')}${card('Claim lifecycle',state.claims.map(item=>`<div class="auth-item"><div class="auth-head"><div class="data-primary"><strong>${item.ref}</strong><span>${item.hmo} · ${money(item.amount)}</span></div>${tag(item.status,item.status==='Approved'?'neutral':item.status==='Rejected'?'accent':'outline')}</div>${item.reason?`<p class="claim-reason">${item.reason}</p>`:''}<div class="toolbar">${item.status==='Draft'?`<button class="btn btn-primary" data-action="claim-submit" data-id="${item.id}">Submit claim</button>`:''}${item.status==='Submitted'?`<button class="btn btn-secondary" data-action="claim-approve" data-id="${item.id}">Simulate: approve</button><button class="btn btn-secondary" data-action="claim-reject" data-id="${item.id}">Simulate: reject</button>`:''}${item.status==='Rejected'?`<button class="btn btn-primary" data-action="claim-resubmit" data-id="${item.id}">Resubmit</button>`:''}</div></div>`).join(''))}</div>`;
}

function renderFamily() {
  const total=1000000, funded=state.family.filter(item=>item.paid).reduce((sum,item)=>sum+item.amount,0), remaining=total-funded;
  return `<div class="page">${pageHeading('Family / Sponsors','Multi-sponsor funding','Coordinate contributions toward a single treatment invoice.')}${card('<div class="section-heading"><span>Chidi O. — Treatment plan</span><strong>${money(total)}</strong></div>',`${state.family.map(item=>`<div class="split-row"><span>${item.name}</span><strong>${money(item.amount)}</strong>${item.paid?tag('Paid'): `<button class="btn btn-secondary" data-action="contribute" data-name="${item.name}">Simulate pays</button>`}</div>`).join('')}<div class="progress-track"><div class="progress-fill" style="width:${funded/total*100}%"></div></div><div class="progress-meta"><span>Funded ${money(funded)}</span><span>Remaining ${money(remaining)}</span></div>${remaining===0?tag('Bill fully funded — settled to provider'):''}`,'funding-card')}${card('Sponsor directory',`${dataRow('Femi O. — Invoice INV-2048','Sponsor: Brother (UK) — ₦58,000','Paid')}${dataRow('Blessing K. — Invoice INV-2061','Sponsor: Daughter — ₦23,500','Awaiting payment','outline')}${dataRow('Chidi O. — Treatment plan','3 sponsors — ₦1,000,000 total','Partially funded','outline')}`)}</div>`;
}

function renderSettlements() {
  const events=[['08:30','SET-1187 — ₦2,100,000 — Flutterwave payout initiated'],['08:34','SET-1187 — Completed to GTBank ••4471'],['09:02','SET-1188 — ₦1,950,000 — Paystack payout initiated'],['09:10','SET-1188 — Completed to GTBank ••4471'],['—','SET-1189 — ₦450,000 — Pending (Paystack processing)']];
  const rows=[['Wuse',1240000,120000],['Garki',780000,0],['Maitama',1650000,210000],['Kaduna',310000,60000],['Lagos',420000,60000]];
  return `<div class="page">${pageHeading('Settlements','Gateway payouts & branch settlement','Follow gateway payout status and branch-level settlement totals.')}${card('Payout timeline',events.map(([time,text])=>`<div class="timeline-line"><time>${time}</time><span>${text}</span></div>`).join(''))}${card('Per-branch settlement',`<div class="table-wrap"><table class="table"><thead><tr><th>Branch</th><th>Settled</th><th>Pending</th></tr></thead><tbody>${rows.map(([branch,settled,pending])=>`<tr><td><strong>${branch}</strong></td><td>${money(settled)}</td><td>${money(pending)}</td></tr>`).join('')}</tbody></table></div>`)}</div>`;
}

function renderReceivables() {
  const rows=[['Patient',200000,120000,80000,50000],['HMO',1200000,900000,700000,400000],['Insurance',350000,250000,150000,50000],['Corporate',120000,80000,30000,20000],['Financing',200000,120000,60000,20000]];
  const cols=[1,2,3,4], totals=cols.map(index=>rows.reduce((sum,row)=>sum+row[index],0));
  return `<div class="page">${pageHeading('Accounts Receivable','Receivables & ageing','Outstanding balances by payer and days since invoice.')}${card('Ageing by payer',`<div class="table-wrap"><table class="table"><thead><tr><th>Payer</th><th>0–30 days</th><th>31–60 days</th><th>61–90 days</th><th>90+ days</th><th>Total</th></tr></thead><tbody>${rows.map(row=>`<tr><td><strong>${row[0]}</strong></td>${row.slice(1).map(value=>`<td>${money(value)}</td>`).join('')}<td><strong>${money(row.slice(1).reduce((sum,val)=>sum+val,0))}</strong></td></tr>`).join('')}<tr><td><strong>Total</strong></td>${totals.map(value=>`<td><strong>${money(value)}</strong></td>`).join('')}<td><strong>${money(totals.reduce((sum,val)=>sum+val,0))}</strong></td></tr></tbody></table></div>`)}</div>`;
}

function renderReconciliation() {
  const summaries=[[state.matched.toLocaleString(),'Matched'],[state.unmatched.length,'Unmatched'],[state.exceptions,'Exceptions'],[state.duplicates,'Duplicate']];
  const unmatched=state.unmatched.length?state.unmatched.map(item=>`<div class="data-row"><div class="data-primary"><strong>${money(item.amount)} · ${item.source} · ${item.date}</strong><span>Suggested: ${item.suggestion}</span></div><button class="btn btn-secondary" data-action="open-match" data-id="${item.id}">Review match</button></div>`).join(''):'<p class="empty-state">Nothing unmatched right now.</p>';
  return `<div class="page">${pageHeading('Smart Reconciliation Centre','Reconciliation workspace','Review gateway transfers, resolve exceptions and confirm invoice matches.')}${metricGrid(summaries.map(([value,label])=>[value,label,label]),'grid activity-grid')}${card('Unmatched payments',unmatched)}${card('Recently matched',`<div class="table-wrap"><table class="table"><thead><tr><th>Invoice</th><th>Amount</th><th>Matched via</th><th>When</th></tr></thead><tbody><tr><td>INV-2040</td><td>₦45,000</td><td>Auto — reference match</td><td>09:02</td></tr><tr><td>INV-2041</td><td>₦18,000</td><td>Manual — Adaeze O.</td><td>08:47</td></tr><tr><td>INV-2039</td><td>₦120,000</td><td>Auto — reference match</td><td>08:30</td></tr></tbody></table></div>`)}</div>`;
}

function renderSettings() {
  const thresholdCard = card('Refund approval threshold', `<div class="field"><label for="refund-threshold">Amount above which refunds need Finance Manager + Owner approval</label><input class="input" id="refund-threshold" type="number" min="0" step="5000" value="${state.settings.threshold}"></div>`);
  const approvalCard = card(`<div class="section-heading"><span>Second approval on bank-detail change</span><button class="btn btn-secondary" data-action="toggle-setting">${state.settings.secondApproval ? 'Enabled' : 'Disabled'}</button></div>`, `<p>When enabled, a change to the settlement bank account needs a second approver before it takes effect.</p>`);
  const controlsCard = card('Organization controls', `${dataRow('Settlement account', 'GTBank ••4471', 'Verified')}${dataRow('Refund approval limit', `> ${money(state.settings.threshold)} needs 2 approvers`, 'Configured', 'outline')}${dataRow('Bank-detail change', 'Requires second approval', state.settings.secondApproval ? 'Enabled' : 'Disabled', 'outline')}`);
  return `<div class="page settings-narrow">${pageHeading('Settings', 'Approval rules & organization', 'Set controls for refunds and sensitive account changes.')}${thresholdCard}${approvalCard}${controlsCard}</div>`;
}

function renderMobileIntegration() {
  const app=state.mobileApp;
  const features=[['billPayments','Patient bill payments','Patients can pay ABC Healthcare invoices from the separate app.'],['billHistory','Bill history','Patients can view current and past facility bills.'],['familyFunding','Family funding','Patients can request contributions from linked sponsors.'],['welliPass','WelliPass access','Patients can present a WelliPass at the hospital desk.']];
  const featureMarkup=features.map(([id,label,description])=>`<label class="integration-feature"><span><strong>${label}</strong><small>${description}</small></span><input type="checkbox" data-mobile-feature="${id}" ${app.features[id]?'checked':''} aria-label="${label}"></label>`).join('');
  const eventMarkup=app.events.map(([time,name,detail])=>`<div class="data-row"><div class="data-primary"><strong>${name}</strong><span>${detail}</span></div><time class="event-time">${time}</time></div>`).join('');
  return `<div class="page">${pageHeading('Connected Apps','Patient Mobile App','Configure how ABC Healthcare connects with the separate WelliPay patient app. Patients use the MobileApp on their own devices; this console manages the provider connection.')}
    <div class="grid stats-grid">${stat('3,204','Linked patient profiles','Mobile accounts')}${stat('1','Connected app','Client')}${stat(app.syncCount.toLocaleString(),'Records synced','Data exchange')}${stat('Sandbox','Demo environment','Connection mode')}</div>
    <div class="grid two-col">
      ${card('Provider connection',`<div class="connection-status"><div><strong>Demo connection active</strong><span>Sample connector · no live patient data or transactions</span></div>${tag('Sandbox','outline')}</div><div class="integration-details"><div><span>Facility</span><strong>ABC Healthcare</strong></div><div><span>Connection ID</span><strong>CONN-ABC-001</strong></div><div><span>Last sync</span><strong>${app.lastSync}</strong></div><div><span>Sync status</span><strong>Ready</strong></div></div><div class="toolbar"><button class="btn btn-primary" data-action="sync-mobile">Sync demo data</button><button class="btn btn-secondary" data-action="test-mobile-connection">Test connection</button></div>${app.notice?`<p class="integration-notice" role="status">${app.notice}</p>`:''}`)}
      ${card('Patient app capabilities',`<div class="integration-features">${featureMarkup}</div>`)}
    </div>
    ${card('<div class="section-heading"><span>Mobile app events</span><button class="btn btn-secondary" data-action="simulate-mobile-event">Simulate incoming event</button></div>',`<p class="integration-caption">Sample events received from the separate patient app. In production, these arrive through the connected API. <a href="docs/mobile-app-integration.md" target="_blank" rel="noreferrer">Review API contract →</a></p><div class="row-list">${eventMarkup}</div>`)}
  </div>`;
}

function renderStub() {
  const data=stubData[state.active] || ['Workspace','Operational workspace for ABC Healthcare.',[['—','Records'],['—','This month'],['—','Needs attention']],[['No sample records','Workspace is ready for configuration','Review']]];
  const [kicker,blurb,stats,rows]=data;
  return `<div class="page">${pageHeading(kicker,labels[state.active]||'Workspace',blurb)}${metricGrid(stats.map(([value,label])=>[value,label,label]))}${card('Latest activity',rows.map(([title,detail,status],index)=>dataRow(title,detail,status,index===1?'outline':'neutral')).join(''))}</div>`;
}

function render() {
  if (!labels[state.active]) state.active='dashboard';
  renderNav();
  document.querySelector('#page-title').textContent=labels[state.active];
  const views={dashboard:renderDashboard,'hospital-desk':renderDesk,authorization:renderAuthorization,claims:renderClaims,'family-sponsors':renderFamily,settlements:renderSettlements,receivables:renderReceivables,reconciliation:renderReconciliation,settings:renderSettings,'mobile-app':renderMobileIntegration};
  content.innerHTML=(views[state.active]||renderStub)();
  modalRoot.innerHTML=renderModal();
  content.focus({preventScroll:true});
}

function renderModal() {
  if (!state.modal) return '';
  if (state.modal.type==='match') {
    const item=state.unmatched.find(entry=>entry.id===state.modal.id);
    if (!item) return '';
    return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><h2 id="modal-title">Confirm match</h2><p>An unmatched payment of <strong>${money(item.amount)}</strong> via ${item.source} looks like it belongs to:</p><p class="patient-summary"><strong>${item.suggestion}</strong></p><div class="modal-actions"><button class="btn btn-secondary" data-action="reject-match">Not a match</button><button class="btn btn-primary" data-action="confirm-match">Confirm match</button></div></section></div>`;
  }
  if (state.modal.type==='wellipass') {
    const pattern=[1,0,1,1,0,1,0,1,0,0,1,0,1,1,1,0,1,1,0,0,1,1,0,0,1,0,0,1,1,1,0,1,1,0,0,1];
    return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="wellipass-head"><span class="eyebrow" style="color:white">WELLIPASS</span><strong id="modal-title">Ngozi A.</strong><span>WR-2291-04 · Reliance HMO — Gold</span></div><div class="qr-grid" aria-label="Illustrative QR placeholder">${pattern.map(value=>`<span class="${value?'dark':''}"></span>`).join('')}</div><p style="text-align:center">Scanned at Wuse Front Desk</p><div class="modal-actions"><button class="btn btn-secondary" data-action="close-modal">Cancel</button><button class="btn btn-primary" data-action="scan-continue">Continue to Hospital Desk</button></div></section></div>`;
  }
  return '';
}

function ask(question) {
  const text=question.toLowerCase();
  let reply="I don't have that one yet — try asking about revenue, claims, reconciliation, or receivables.";
  if(text.includes('hmo')&&(text.includes('owe')||text.includes('most'))) reply='Reliance HMO owes the most: ₦1.2M across 34 unpaid claims, averaging 52 days outstanding.';
  else if(text.includes('unpaid')||text.includes('30 days')||text.includes('overdue')) reply='18 invoices are over 30 days old, totaling ₦610,000. Wuse branch accounts for about 40% of that.';
  else if(text.includes('reject')) reply='3 claims are flagged likely-to-reject: missing pre-authorization (2) and a tariff mismatch (1).';
  else if(text.includes('reconcil')||text.includes('unmatched')) reply=`${state.unmatched.length} payments are unmatched right now, totaling ${money(state.unmatched.reduce((sum,item)=>sum+item.amount,0))} — mostly transfers without an invoice reference.`;
  else if(text.includes('revenue')&&(text.includes('branch')||text.includes('lower')||text.includes('fall')||text.includes('why'))) reply='Kaduna branch revenue is down 12% this month, driven by fewer diagnostic bookings.';
  else if(text.includes('leak')) reply='Estimated leakage this month: ₦185,000, mostly from services performed without a matching invoice at Maitama.';
  else if(text.includes('highest')||text.includes('best')||(text.includes('service')&&text.includes('revenue'))) reply='Executive Checkup packages and ECG generate the highest revenue per service this quarter.';
  state.messages.push({role:'user',text:question},{role:'assistant',text:reply});
  render();
  document.querySelector('#chat-log')?.scrollTo(0,99999);
}

function updateAuthCounts(item, next) {
  if (item.status===next) return;
  state.authCounts[item.status]=Math.max(0,state.authCounts[item.status]-1);
  state.authCounts[next]=(state.authCounts[next]||0)+1;
  item.status=next;
  item.timeline.push(['Just now',next==='Submitted'?`Submitted to ${item.hmo}`:`Approved by ${item.hmo}`]);
}

function dispatch(action, target, domEvent) {
  const id=Number(target.dataset.id);
  switch(action) {
    case 'toggle-menu': document.querySelector('#sidebar').classList.add('is-open');document.querySelector('#scrim').classList.add('is-open');break;
    case 'close-menu': document.querySelector('#sidebar').classList.remove('is-open');document.querySelector('#scrim').classList.remove('is-open');break;
    case 'open-match': state.modal={type:'match',id};render();break;
    case 'confirm-match': state.unmatched=state.unmatched.filter(item=>item.id!==state.modal.id);state.matched++;state.modal=null;render();break;
    case 'reject-match': state.exceptions++;state.modal=null;render();break;
    case 'dismiss-modal': if(target===domEvent?.target){state.modal=null;render();}break;
    case 'close-modal': state.modal=null;render();break;
    case 'approval': state.approvals=state.approvals.filter(item=>item.id!==id);render();break;
    case 'ask-suggestion': ask(target.dataset.text);break;
    case 'open-wellipass': state.modal={type:'wellipass'};render();break;
    case 'scan-continue': state.modal=null;state.patient={name:'Ngozi A.',welliId:'WR-2291-04',hmo:'Reliance HMO — Gold'};state.payer='patient';resetPayment(false);state.active='hospital-desk';location.hash=state.active;render();break;
    case 'choose-sponsor': state.sponsor=target.dataset.name;render();break;
    case 'family-request': state.payment='pending';render();break;
    case 'family-paid': state.payment='paid';render();break;
    case 'reset-payment': resetPayment();render();break;
    case 'receive-payment': state.payment='paid';render();break;
    case 'request-auth': state.authStage='pending';state.authCounts.Submitted++;render();break;
    case 'approve-hmo': state.authStage='approved';state.authCounts.Submitted=Math.max(0,state.authCounts.Submitted-1);state.authCounts.Approved++;state.hmoAmount=46400;state.patientAmount=11600;render();break;
    case 'consent': state.consent=true;render();break;
    case 'toggle-auth': state.selectedAuth=state.selectedAuth===id?null:id;render();break;
    case 'submit-auth': { const item=state.authItems.find(entry=>entry.id===id);if(item)updateAuthCounts(item,'Submitted');render();break; }
    case 'approve-auth': { const item=state.authItems.find(entry=>entry.id===id);if(item)updateAuthCounts(item,'Approved');render();break; }
    case 'claim-submit': updateClaim(id,'Submitted');break;
    case 'claim-approve': updateClaim(id,'Approved');break;
    case 'claim-reject': {const item=state.claims.find(entry=>entry.id===id);item.status='Rejected';item.reason='Tariff mismatch — requested amount exceeds contracted tariff.';render();break;}
    case 'claim-resubmit': {const item=state.claims.find(entry=>entry.id===id);item.status='Submitted';item.reason='';render();break;}
    case 'contribute': {const item=state.family.find(entry=>entry.name===target.dataset.name);if(item)item.paid=true;render();break;}
    case 'toggle-setting': state.settings.secondApproval=!state.settings.secondApproval;render();break;
    case 'sync-mobile': state.mobileApp.lastSync='Just now';state.mobileApp.syncCount+=12;state.mobileApp.notice='Demo sync complete. 12 sample records exchanged.';render();break;
    case 'test-mobile-connection': state.mobileApp.notice='Connection test passed in sandbox.';render();break;
    case 'simulate-mobile-event': state.mobileApp.events.unshift(['Just now','bill.viewed','WR-2291-04 · Sample event']);state.mobileApp.notice='Sample event received from the patient app.';render();break;
    case 'new-patient': alert('Patient creation will connect to your patient registry.');break;
    case 'find-patient': alert('Patient lookup will connect to your patient registry.');break;
  }
}
function resetPayment(clearSponsor=true) { state.payment='idle';state.authStage='idle';state.hmoAmount=0;state.patientAmount=0;state.consent=false;if(clearSponsor)state.sponsor=''; }
function updateClaim(id,status) { const item=state.claims.find(entry=>entry.id===id);if(item){item.status=status;item.reason='';}render(); }

document.addEventListener('click', event=>{
  const target=event.target.closest('[data-action]');
  if(target){dispatch(target.dataset.action,target,event);return;}
  if(event.target.closest('.nav-link')) dispatch('close-menu',event.target);
});
document.addEventListener('change', event=>{
  if(event.target.name==='filter'){state.filter=event.target.value;render();}
  if(event.target.name==='payer'){state.payer=event.target.value;resetPayment();render();}
  if(event.target.id==='refund-threshold'){state.settings.threshold=Math.max(0,Number(event.target.value)||0);}
  if(event.target.id==='branch-select'){state.branch=event.target.value;}
  if(event.target.dataset.mobileFeature){state.mobileApp.features[event.target.dataset.mobileFeature]=event.target.checked;}
});
document.addEventListener('input',event=>{if(event.target.id==='refund-threshold')state.settings.threshold=Math.max(0,Number(event.target.value)||0);});
document.addEventListener('submit',event=>{
  if(event.target.id==='chat-form'){event.preventDefault();const question=new FormData(event.target).get('question')?.toString().trim();if(question)ask(question);}
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&state.modal){state.modal=null;render();}if(event.key==='Escape')dispatch('close-menu',document.querySelector('#scrim'));});
window.addEventListener('hashchange',()=>{state.active=location.hash.slice(1)||'dashboard';render();dispatch('close-menu',document.querySelector('#scrim'));});
render();