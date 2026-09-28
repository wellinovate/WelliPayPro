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

const money = value => '₦' + Math.round(value).toLocaleString('en-US');
const labels = Object.fromEntries(groups.flatMap(group => group.items.map(([id, label]) => [id, label])));

const state = {
  active: location.hash.slice(1) || 'dashboard',
  filter: 'Month',
  branch: 'All branches',
  unmatched: [
    { id: 1, amount: 85000, source: 'Paystack transfer', suggestion: 'Invoice #INV-2048 — Femi O.', date: 'Sep 24' },
    { id: 2, amount: 23500, source: 'Bank transfer — GTBank', suggestion: 'Invoice #INV-2061 — Blessing K.', date: 'Sep 25' },
    { id: 3, amount: 12000, source: 'USSD payment', suggestion: 'Invoice #INV-2077 — Chinwe E.', date: 'Sep 26' }
  ],
  matched: 1248,
  exceptions: 8,
  duplicates: 3,
  modal: null,
  approvals: [
    { id: 1, type: 'Refund', amount: 45000, requester: 'Tunde A. (Cashier)', reason: 'Duplicate payment' },
    { id: 2, type: 'Write-off', amount: 18500, requester: 'Ngozi F. (Billing)', reason: 'HMO short-pay' },
    { id: 3, type: 'Refund', amount: 120000, requester: 'Chidi O. (Cashier)', reason: 'Cancelled service' }
  ],
  approvalHistory: [],
  messages: [{ role: 'assistant', text: 'Ask me about revenue, claims, reconciliation, or receivables.' }],
  payer: 'patient',
  sponsor: '',
  payment: 'idle',
  authStage: 'idle',
  hmoAmount: 0,
  patientAmount: 0,
  consent: false,
  patient: { name: 'Femi O.', welliId: 'WR-1187-22', hmo: 'Reliance HMO — Gold' },
  claims: [
    { id: 1, ref: 'INV-2049 — Blessing K.', hmo: 'Hygeia HMO', amount: 23000, status: 'Draft' },
    { id: 2, ref: 'INV-2050 — Chinwe E.', hmo: 'Reliance HMO', amount: 120000, status: 'Submitted' },
    { id: 3, ref: 'INV-2048 — Femi O.', hmo: 'AXA Mansard', amount: 58000, status: 'Rejected', reason: 'Missing pre-authorization reference.' },
    { id: 4, ref: 'INV-2044 — Tunde A.', hmo: 'Reliance HMO', amount: 45000, status: 'Approved' }
  ],
  family: [
    { name: 'Brother', amount: 400000, paid: false },
    { name: 'Sister', amount: 300000, paid: false },
    { name: 'Uncle', amount: 300000, paid: false }
  ],
  authCounts: { Draft: 12, Submitted: 18, Pending: 7, Approved: 35, 'Partially Approved': 4, Rejected: 3, Expired: 2, Appeal: 1 },
  authItems: [
    { id: 1, patient: 'Emeka N.', service: 'MRI — Knee', hmo: 'Reliance HMO', amount: 180000, status: 'Draft', readiness: 92, timeline: [['09:02', 'Doctor requested MRI'], ['09:04', 'Eligibility verified — active, Gold plan']] },
    { id: 2, patient: 'Blessing K.', service: 'Surgery Package', hmo: 'Hygeia HMO', amount: 500000, status: 'Submitted', timeline: [['08:10', 'Surgery Package requested'], ['08:12', 'Eligibility verified'], ['08:15', 'Submitted to Hygeia HMO']] },
    { id: 3, patient: 'Chidi O.', service: 'Dialysis', hmo: 'AXA Mansard', amount: 120000, status: 'Pending', timeline: [['07:40', 'Dialysis requested'], ['07:42', 'Eligibility verified'], ['07:45', 'Submitted to AXA Mansard'], ['10:31', 'AXA Mansard requested documentation']] }
  ],
  selectedAuth: null,
  settings: { threshold: 100000, secondApproval: true },
  mobileApp: {
    lastSync: '2 min ago',
    syncCount: 4204,
    notice: '',
    features: { billPayments: true, billHistory: true, familyFunding: true, welliPass: true },
    events: [
      ['09:41', 'payment.received', '₦45,000 · INV-2033 · Demo event'],
      ['09:28', 'family.requested', 'Ngozi A. → Mum · Demo event'],
      ['09:12', 'patient.registered', 'WR-3390-11 · Demo event']
    ]
  },

  /* Enhanced SaaS State */
  patientFilter: 'All',
  patientSearch: '',
  patientList: [
    { id: 'WR-1187-22', name: 'Femi Okafor', phone: '+234 803 123 4567', branch: 'Wuse', hmo: 'Reliance HMO', plan: 'Gold', balance: 0, status: 'Settled', wellipass: true, sponsors: ['Brother (UK)'], lastVisit: 'Sep 27, 2026' },
    { id: 'WR-2291-04', name: 'Ngozi Adeleke', phone: '+234 802 987 6543', branch: 'Maitama', hmo: 'Reliance HMO', plan: 'Gold', balance: 45000, status: 'HMO Pending', wellipass: true, sponsors: ['Mother'], lastVisit: 'Sep 27, 2026' },
    { id: 'WR-3390-11', name: 'Blessing Kalu', phone: '+234 814 555 8899', branch: 'Garki', hmo: 'Hygeia HMO', plan: 'Silver', balance: 120000, status: 'Payment Plan', wellipass: true, sponsors: ['Daughter'], lastVisit: 'Sep 25, 2026' },
    { id: 'WR-4412-88', name: 'Chidi Okonkwo', phone: '+234 701 444 3322', branch: 'Maitama', hmo: 'AXA Mansard', plan: 'Bronze', balance: 300000, status: 'Family Pool', wellipass: false, sponsors: ['Brother', 'Sister', 'Uncle'], lastVisit: 'Sep 24, 2026' },
    { id: 'WR-5519-02', name: 'Chinwe Eze', phone: '+234 805 777 1122', branch: 'Lagos', hmo: 'Leadway Health', plan: 'Platinum', balance: 0, status: 'Settled', wellipass: true, sponsors: [], lastVisit: 'Sep 22, 2026' },
    { id: 'WR-6623-74', name: 'Tunde Adeleke', phone: '+234 809 333 4455', branch: 'Wuse', hmo: 'Self-Pay', plan: 'Cash', balance: 0, status: 'Settled', wellipass: true, sponsors: [], lastVisit: 'Sep 20, 2026' },
    { id: 'WR-7711-33', name: 'Emeka Nwosu', phone: '+234 803 888 9911', branch: 'Kaduna', hmo: 'Reliance HMO', plan: 'Silver', balance: 180000, status: 'Pre-Auth Draft', wellipass: true, sponsors: ['Brother'], lastVisit: 'Sep 27, 2026' }
  ],

  invoiceFilter: 'All',
  invoiceSearch: '',
  invoiceList: [
    { id: 'INV-2048', patient: 'Femi Okafor', patientId: 'WR-1187-22', branch: 'Wuse', amount: 58000, paid: 58000, status: 'Paid', date: '2026-09-27', items: [{ desc: 'Consultation', amt: 15000 }, { desc: 'ECG', amt: 18000 }, { desc: 'Full Blood Count', amt: 25000 }], payer: 'Family (Brother)' },
    { id: 'INV-2049', patient: 'Blessing Kalu', patientId: 'WR-3390-11', branch: 'Garki', amount: 23000, paid: 0, status: 'Unpaid', date: '2026-09-26', items: [{ desc: 'Specialist Consultation', amt: 23000 }], payer: 'Hygeia HMO (Claim Submitted)' },
    { id: 'INV-2050', patient: 'Chinwe Eze', patientId: 'WR-5519-02', branch: 'Lagos', amount: 120000, paid: 120000, status: 'Paid', date: '2026-09-25', items: [{ desc: 'Executive Health Screening Package', amt: 120000 }], payer: 'Card (Paystack)' },
    { id: 'INV-2051', patient: 'Ngozi Adeleke', patientId: 'WR-2291-04', branch: 'Maitama', amount: 58000, paid: 46400, status: 'Part-paid', date: '2026-09-27', items: [{ desc: 'Consultation', amt: 15000 }, { desc: 'ECG', amt: 18000 }, { desc: 'Lab FBC', amt: 25000 }], payer: 'HMO 80% (₦46,400) · Patient 20% (₦11,600)' },
    { id: 'INV-2052', patient: 'Chidi Okonkwo', patientId: 'WR-4412-88', branch: 'Maitama', amount: 1000000, paid: 700000, status: 'Part-paid', date: '2026-09-24', items: [{ desc: 'Dialysis Cycle & Nephrology Care Plan', amt: 1000000 }], payer: 'Multi-Sponsor Family Pool' },
    { id: 'INV-2053', patient: 'Emeka Nwosu', patientId: 'WR-7711-33', branch: 'Kaduna', amount: 180000, paid: 0, status: 'Draft', date: '2026-09-27', items: [{ desc: 'MRI — Knee Scan with Contrast', amt: 180000 }], payer: 'Reliance HMO (Pre-Auth Draft)' }
  ],

  paymentFilter: 'All',
  paymentList: [
    { id: 'TX-9041', ref: 'pstk_tr_8829104', channel: 'Card (Paystack)', patient: 'Chinwe Eze', inv: 'INV-2050', amount: 120000, time: '11:15 AM', status: 'Success', branch: 'Lagos' },
    { id: 'TX-9040', ref: 'gtb_nip_992140', channel: 'Bank Transfer (NIP)', patient: 'Femi Okafor', inv: 'INV-2048', amount: 58000, time: '10:48 AM', status: 'Success', branch: 'Wuse' },
    { id: 'TX-9039', ref: 'hmo_dir_77410', channel: 'HMO Direct', patient: 'Ngozi Adeleke', inv: 'INV-2051', amount: 46400, time: '10:14 AM', status: 'Success', branch: 'Maitama' },
    { id: 'TX-9038', ref: 'flw_qr_33019', channel: 'WelliPass / USSD', patient: 'Tunde Adeleke', inv: 'INV-2044', amount: 45000, time: '09:30 AM', status: 'Success', branch: 'Wuse' },
    { id: 'TX-9037', ref: 'pos_cash_1092', channel: 'Cash / POS', patient: 'Ibrahim S.', inv: 'INV-2042', amount: 18500, time: '09:05 AM', status: 'Success', branch: 'Garki' },
    { id: 'TX-9036', ref: 'pstk_fl_22091', channel: 'Card (Paystack)', patient: 'Chidi Okonkwo', inv: 'INV-2052', amount: 300000, time: 'Yesterday', status: 'Success', branch: 'Maitama' }
  ],

  serviceFilter: 'All',
  serviceSearch: '',
  servicesList: [
    { id: 'SRV-01', name: 'General Practitioner Consultation', cat: 'Consultation', cash: 15000, reliance: 12500, hygeia: 12000, axa: 13000 },
    { id: 'SRV-02', name: 'Specialist Physician Consultation', cat: 'Consultation', cash: 25000, reliance: 22000, hygeia: 20000, axa: 21500 },
    { id: 'SRV-03', name: 'Electrocardiogram (ECG)', cat: 'Cardiology', cash: 18000, reliance: 15000, hygeia: 14000, axa: 14500 },
    { id: 'SRV-04', name: 'Echocardiogram (2D Echo)', cat: 'Cardiology', cash: 45000, reliance: 38000, hygeia: 36000, axa: 38000 },
    { id: 'SRV-05', name: 'Full Blood Count (FBC + ESR)', cat: 'Lab', cash: 8500, reliance: 7200, hygeia: 7000, axa: 7500 },
    { id: 'SRV-06', name: 'Lipid Profile & Liver Enzymes', cat: 'Lab', cash: 16500, reliance: 14000, hygeia: 13500, axa: 14000 },
    { id: 'SRV-07', name: 'MRI Scan — Knee / Joint', cat: 'Diagnostics', cash: 180000, reliance: 155000, hygeia: 150000, axa: 152000 },
    { id: 'SRV-08', name: 'CT Scan — Brain (Plain & Contrast)', cat: 'Diagnostics', cash: 95000, reliance: 82000, hygeia: 80000, axa: 83000 },
    { id: 'SRV-09', name: 'Haemodialysis Session', cat: 'Specialist', cash: 45000, reliance: 40000, hygeia: 38000, axa: 39000 },
    { id: 'SRV-10', name: 'Executive Wellness Comprehensive Package', cat: 'Packages', cash: 250000, reliance: 215000, hygeia: 210000, axa: 220000 }
  ],

  hmoList: [
    { name: 'Reliance HMO', tier: 'Tier 1 Partner', plans: ['Gold', 'Silver', 'Bronze'], preAuthMin: 50000, copay: '20% Diagnostics', sla: '2h 14m', portal: 'Live API', claimsDue: 1200000, status: 'Active' },
    { name: 'Hygeia HMO', tier: 'Tier 1 Partner', plans: ['Comprehensive', 'Classic', 'Silver'], preAuthMin: 40000, copay: '20% Pharmacy', sla: '7h 31m', portal: 'EDI Batch', claimsDue: 900000, status: 'Active' },
    { name: 'AXA Mansard Health', tier: 'Contracted', plans: ['Platinum', 'Gold', 'Bronze'], preAuthMin: 50000, copay: '15% Specialist', sla: '4h 02m', portal: 'Provider Connect', claimsDue: 650000, status: 'Active' },
    { name: 'Leadway Health', tier: 'Contracted', plans: ['Executive', 'Standard'], preAuthMin: 60000, copay: '10% Labs', sla: '3h 45m', portal: 'Live API', claimsDue: 450000, status: 'Active' },
    { name: 'Avon HMO', tier: 'Contracted', plans: ['Life Plus', 'Care', 'Access'], preAuthMin: 45000, copay: '25% Non-formulary', sla: '5h 10m', portal: 'Web Portal', claimsDue: 320000, status: 'Active' }
  ],

  refundList: [
    { id: 'REF-882', inv: 'INV-2048', patient: 'Femi O.', amount: 45000, requester: 'Tunde A. (Cashier)', reason: 'Duplicate POS swipe', date: 'Today, 09:41', status: 'Pending FM Approval', dualApproval: false },
    { id: 'REF-881', inv: 'INV-2035', patient: 'Chidi O.', amount: 120000, requester: 'Chidi O. (Cashier)', reason: 'Cancelled surgical booking', date: 'Today, 08:30', status: 'Pending Director Approval', dualApproval: true },
    { id: 'REF-880', inv: 'INV-2022', patient: 'Blessing K.', amount: 18500, requester: 'Ngozi F. (Billing)', reason: 'HMO tariff retrospective adjustment', date: 'Sep 26', status: 'Approved', dualApproval: false },
    { id: 'REF-879', inv: 'INV-2019', patient: 'Tunde A.', amount: 35000, requester: 'Tunde A. (Cashier)', reason: 'Overpayment via transfer', date: 'Sep 25', status: 'Settled', dualApproval: false }
  ],

  paymentPlanList: [
    { id: 'PLN-101', patient: 'Blessing Kalu', total: 500000, paid: 300000, installments: '3 of 5', monthly: 100000, nextDue: 'Oct 02, 2026', status: 'On track', branch: 'Garki' },
    { id: 'PLN-102', patient: 'Emeka Nwosu', total: 225000, paid: 75000, installments: '1 of 3', monthly: 75000, nextDue: 'Sep 20, 2026', status: 'Overdue', branch: 'Kaduna' },
    { id: 'PLN-103', patient: 'Chidi Okonkwo', total: 600000, paid: 400000, installments: '4 of 6', monthly: 100000, nextDue: 'Oct 15, 2026', status: 'On track', branch: 'Maitama' },
    { id: 'PLN-104', patient: 'Ngozi Adeleke', total: 180000, paid: 60000, installments: '2 of 6', monthly: 30000, nextDue: 'Oct 05, 2026', status: 'On track', branch: 'Maitama' }
  ],

  staffList: [
    { name: 'Adaeze Okafor', role: 'Finance Manager', branch: 'Consolidated (All)', email: 'a.okafor@abchealth.ng', status: 'Active', lastActive: 'Just now' },
    { name: 'Tunde Adeleke', role: 'Front-Desk Cashier', branch: 'Wuse Branch', email: 't.adeleke@abchealth.ng', status: 'Active', lastActive: '8m ago' },
    { name: 'Ngozi Fashola', role: 'Billing Officer', branch: 'Garki Branch', email: 'n.fashola@abchealth.ng', status: 'Active', lastActive: '14m ago' },
    { name: 'Dr. Chidi Obi', role: 'Medical Director', branch: 'Maitama Branch', email: 'c.obi@abchealth.ng', status: 'Active', lastActive: '1h ago' },
    { name: 'Fatima Garba', role: 'Billing Officer', branch: 'Kaduna Branch', email: 'f.garba@abchealth.ng', status: 'Active', lastActive: '3h ago' },
    { name: 'Babajide Cole', role: 'Cashier / Desk Lead', branch: 'Lagos Branch', email: 'b.cole@abchealth.ng', status: 'Active', lastActive: '22m ago' }
  ],

  auditLog: [
    { id: 101, action: 'Refund Approved', detail: 'REF-880 · ₦18,500 for Blessing K.', actor: 'Adaeze O. (FM)', time: '09:41 AM', branch: 'Maitama' },
    { id: 102, action: 'Receipt Issued', detail: 'RCT-9021 · ₦45,000 via WelliPass', actor: 'Tunde A. (Cashier)', time: '09:12 AM', branch: 'Wuse' },
    { id: 103, action: 'Pre-Auth Request', detail: 'AUTH-3301 · ₦180,000 MRI Knee to Reliance HMO', actor: 'Ngozi F. (Billing)', time: '09:02 AM', branch: 'Maitama' },
    { id: 104, action: 'Reconciliation Match', detail: 'Paystack transfer ₦85,000 matched to INV-2048', actor: 'Adaeze O. (FM)', time: '08:47 AM', branch: 'Wuse' },
    { id: 105, action: 'Settings Updated', detail: 'Refund threshold maintained at ₦100,000', actor: 'Adaeze O. (FM)', time: '08:15 AM', branch: 'Consolidated' }
  ],

  notificationsList: [
    { id: 1, title: 'Settlement Payout Completed', detail: 'Paystack transferred ₦1,950,000 into GTBank ••4471', time: '12m ago', type: 'Settlement', read: false },
    { id: 2, title: 'HMO Claim Under-Tariff Warning', detail: 'Reliance HMO submitted at −14% below private cardiology rate', time: '45m ago', type: 'Claim', read: false },
    { id: 3, title: 'High-Value Refund Pending Approval', detail: 'REF-881 for ₦120,000 exceeds ₦100k threshold — dual approval needed', time: '1h ago', type: 'Refund', read: false },
    { id: 4, title: 'Unmatched Inbound Transfer', detail: 'GTBank ₦23,500 received without patient reference', time: '2h ago', type: 'Reconciliation', read: false },
    { id: 5, title: 'Failed Payment Retry Succeeded', detail: 'INV-2033 ₦45,000 automatically collected on 2nd retry', time: '3h ago', type: 'Payment', read: true }
  ]
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
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character])); }
function dataRow(title, detail, status, type='neutral', action='') { return `<div class="data-row"><div class="data-primary"><strong>${title}</strong><span>${detail}</span></div>${action || tag(status,type)}</div>`; }
function metricGrid(items, className='stats-grid') { return `<div class="grid ${className}">${items.map(item => stat(item[0],item[1],item[2])).join('')}</div>`; }

function showToast(title, message = '') {
  const root = document.querySelector('#toast-root');
  if (!root) return;
  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `<div><strong>${escapeHtml(title)}</strong>${message ? `<span>${escapeHtml(message)}</span>` : ''}</div><button style="background:transparent;border:0;color:#fff;cursor:pointer;font-size:16px;padding:2px 6px;" aria-label="Dismiss">&times;</button>`;
  toast.querySelector('button').onclick = () => toast.remove();
  root.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3800);
}

function logAudit(action, detail, actor = 'Adaeze O. (Finance Manager)') {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  state.auditLog.unshift({ id: Date.now(), action, detail, actor, time, branch: state.branch === 'All branches' ? 'Consolidated' : state.branch });
}

function downloadCsv(filename, rows) {
  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Report Exported', `${filename} generated successfully.`);
}

function renderBranchBanner() {
  if (state.branch === 'All branches') return '';
  return `<div class="branch-banner"><span>Viewing filtered financial records for <strong>${state.branch} Branch</strong></span><a data-action="reset-branch">Show consolidated (all branches)</a></div>`;
}

/* 1. Dashboard */
function renderDashboard() {
  const tiles = [['₦2,450,000','This period','Revenue'],['₦1,950,000','This period','Collected'],['₦500,000','This period','Outstanding'],['₦1,200,000','Owed to facility','HMO receivables'],['₦750,000','Awaiting HMO decision','Pending claims'],['₦450,000','In gateway pipeline','Pending settlements'],['124','This period','Patients served'],['₦35,000','This period','Refunds']];
  const trend = [1.8,2.1,1.6,2.4,2.0,2.6,2.45];
  const trendMax = Math.max(...trend);
  const branches = [['Wuse',5200000],['Garki',3400000],['Maitama',7100000],['Kaduna',1450000],['Lagos',2100000]];
  const branchMax = Math.max(...branches.map(row=>row[1]));
  const unmatchedMarkup = state.unmatched.length ? state.unmatched.slice(0,3).map(item=>`<div class="data-row"><div class="data-primary"><strong>${money(item.amount)} · ${item.source}</strong><span>${item.suggestion}</span></div><button class="btn btn-secondary" data-action="open-match" data-id="${item.id}">Match</button></div>`).join('') : '<p class="empty-state">Nothing unmatched right now.</p>';
  const approvalRows = `${state.approvals.length ? `<div class="table-wrap"><table class="table approval-table"><thead><tr><th>Type</th><th>Amount</th><th>Requester</th><th>Reason</th><th>Decision</th></tr></thead><tbody>${state.approvals.map(item=>`<tr><td>${item.type}</td><td>${money(item.amount)}</td><td>${item.requester}</td><td>${item.reason}</td><td><button class="btn btn-secondary" data-action="approval" data-decision="Rejected" data-id="${item.id}">Reject</button> <button class="btn btn-primary" data-action="approval" data-decision="Approved" data-id="${item.id}">Approve</button></td></tr>`).join('')}</tbody></table></div>` : '<p class="empty-state">Queue is clear — nothing pending approval.</p>'}${state.approvalHistory.length ? `<div class="approval-history"><span class="card-kicker">Recent decisions</span>${state.approvalHistory.slice(0,5).map(item=>`<div class="data-row"><div class="data-primary"><strong>${item.decision} ${item.type.toLowerCase()} · ${money(item.amount)}</strong><span>${item.requester} · ${item.reason} · ${item.actor} · ${item.time}</span></div>${tag(item.decision,item.decision==='Approved'?'neutral':'accent')}</div>`).join('')}</div>` : ''}`;
  const messages = state.messages.map(item=>`<div class="chat-line ${item.role}"><div class="chat-bubble">${escapeHtml(item.text)}</div></div>`).join('');
  return `<div class="page">
    ${renderBranchBanner()}
    <div class="page-heading"><div><h1>Good afternoon, Adaeze</h1><p>Sunday, September 27, 2026 · ABC Healthcare, ${state.branch === 'All branches' ? 'consolidated (5 branches)' : state.branch + ' Branch'}</p></div><div class="seg" role="group" aria-label="Date range">${['Today','Week','Month','Quarter'].map(value=>`<label class="seg-opt"><input type="radio" name="filter" value="${value}" ${state.filter===value?'checked':''}><span>${value}</span></label>`).join('')}</div></div>
    ${metricGrid(tiles)}
    <div class="grid two-col">
      ${card('Revenue trend · last 7 days',`<div class="chart-summary" style="margin-bottom:12px;"><strong>₦2.45M</strong><span>+8.4% vs last week</span></div><div style="height:160px;position:relative"><canvas id="revenueTrendChart"></canvas></div>`,'trend-card')}
      ${card('Payer mix · this month', `<div class="chart-summary" style="margin-bottom:12px;"><strong>₦6.2M</strong><span>collected by payer</span></div><div style="height:160px;position:relative"><canvas id="payerMixChart"></canvas></div>`, 'mix-card')}
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

/* 2. Hospital Desk */
function renderDesk() {
  const total=58000, isHmo=state.payer==='hmo', isFamily=state.payer==='family', needsAuth=isHmo&&total>=50000;
  let flow='';
  if(isFamily&&state.payment==='idle') flow=`<p>Choose who to request payment from:</p><div class="sponsor-choices">${['Mother','Brother','Sister','Uncle'].map(name=>`<button class="sponsor-choice ${state.sponsor===name?'selected':''}" data-action="choose-sponsor" data-name="${name}">${name}</button>`).join('')}</div><button class="btn btn-primary" data-action="family-request" ${state.sponsor?'':'disabled'}>Send payment request</button>`;
  else if(isFamily&&state.payment==='pending') flow=`<div class="section-heading"><strong>Awaiting family payment</strong>${tag('Expires in 24h','outline')}</div><p>${money(total)} requested from <strong>${state.sponsor}</strong></p><button class="btn btn-secondary" data-action="family-paid">Simulate: ${state.sponsor} pays</button>`;
  else if(isFamily&&state.payment==='paid') flow=`<div class="section-heading"><strong>Paid by ${state.sponsor}</strong>${tag('Receipt sent')}</div><div class="toolbar"><button class="btn btn-secondary" data-action="view-desk-receipt">View Receipt</button><button class="btn btn-ghost" data-action="reset-payment">Reset demo</button></div>`;
  else if(needsAuth&&state.authStage==='idle') flow=`<div class="section-heading"><strong>HMO authorization required</strong><button class="btn btn-primary" data-action="request-auth">Request authorization</button></div>`;
  else if(needsAuth&&state.authStage==='pending') flow=`<strong>Awaiting HMO decision…</strong><button class="btn btn-secondary" data-action="approve-hmo">Simulate: HMO approves</button>`;
  else if(needsAuth&&state.authStage==='approved'&&!state.consent) flow=`<strong>Financial consent</strong><div class="data-row"><span>HMO covers</span><strong>${money(state.hmoAmount)}</strong></div><div class="data-row"><span>Patient responsibility</span><strong>${money(state.patientAmount)}</strong></div><p>Patient reviews the estimated cost and payer contribution before proceeding.</p><button class="btn btn-primary" data-action="consent">Patient reviews & authorizes</button>`;
  else if(needsAuth&&state.authStage==='approved'&&state.consent&&state.payment==='idle') flow=`<div class="data-row"><span>HMO covers</span><strong>${money(state.hmoAmount)}</strong></div><div class="data-row"><span>Patient owes</span><strong>${money(state.patientAmount)}</strong></div>${tag('Consent recorded')}<button class="btn btn-primary" data-action="receive-payment">Collect ${money(state.patientAmount)}</button>`;
  else if(state.payment==='paid') flow=`<div class="section-heading"><strong>${needsAuth?`Paid by patient — ${money(state.patientAmount)} (HMO covered ${money(state.hmoAmount)})`:({patient:'Paid by patient',financing:'Paid via financing partner',mixed:'Paid — mixed funding'}[state.payer]||'Paid')}</strong>${tag('Receipt sent')}</div><div class="toolbar"><button class="btn btn-secondary" data-action="view-desk-receipt">View Receipt</button><button class="btn btn-ghost" data-action="reset-payment">Reset demo</button></div>`;
  else flow='<button class="btn btn-primary" data-action="receive-payment">Receive payment</button>';
  const activity=[['87','Patients'],['74','Bills'],['₦3.4M','Collected'],['₦850K','Pending']];
  return `<div class="page">
    ${renderBranchBanner()}
    <div class="page-heading"><div><span class="eyebrow">Hospital Desk</span><h2>Front desk & cashier</h2><p>Manage today’s patient billing, insurance eligibility and point-of-sale collections.</p></div><div class="toolbar"><button class="btn btn-secondary" data-action="open-new-patient">New Patient</button><button class="btn btn-secondary" data-action="open-find-patient">Find Patient</button><button class="btn btn-primary" data-action="open-wellipass">Scan WelliPass</button></div></div>
    ${metricGrid(activity.map(([value,label])=>[value,label,label]),'grid activity-grid')}
    <div class="desk-layout"><div class="desk-stack">${card('Payment queue',`<div class="row-list">${[['John',50000,'Awaiting','outline'],['Mary',120000,'HMO','outline'],['Peter',80000,'Family','accent'],['David',200000,'Financing','outline'],['Sarah',30000,'Partial','neutral']].map(([name,amount,status,type])=>`<div class="queue-row"><strong>${name}</strong><span>${money(amount)}</span>${tag(status,type)}</div>`).join('')}</div>`)}${card('Recent activity',`${dataRow('Receipt RCT-9021','Tunde A. · Wuse · 09:12','Paid')}${dataRow('HMO request sent','Reliance Gold · 09:04','Pending','outline')}${dataRow('Family payment received','Peter · 08:51','Settled')}`)}</div>
    <section class="card elev-sm bill-card"><span class="card-kicker">Create bill & collect payment</span><div class="patient-summary"><div><strong>${state.patient.name} · ${state.patient.welliId}</strong><span>${state.patient.hmo}</span></div><button class="btn btn-ghost" data-action="open-find-patient">Change →</button></div><div class="row-list">${[['Consultation',15000],['ECG',18000],['Lab — Full Blood Count',25000]].map(([name,amount])=>`<div class="data-row"><span>${name}</span><strong>${money(amount)}</strong></div>`).join('')}<div class="data-row"><strong>Total</strong><strong>${money(total)}</strong></div></div><div class="payer-group"><span class="card-kicker">Who is paying?</span><div class="seg">${[['patient','Patient'],['family','Family'],['hmo','HMO'],['financing','Financing'],['mixed','Mixed']].map(([id,label])=>`<label class="seg-opt"><input type="radio" name="payer" value="${id}" ${state.payer===id?'checked':''}><span>${label}</span></label>`).join('')}</div></div><div class="workflow-panel ${state.payment==='paid'?'neutral':''}">${flow}</div></section></div>
  </div>`;
}

/* 3. Patients */
function renderPatients() {
  const filtered = state.patientList.filter(p => {
    const matchesFilter = state.patientFilter === 'All' ||
      (state.patientFilter === 'HMO' && p.hmo !== 'Self-Pay') ||
      (state.patientFilter === 'Self-Pay' && p.hmo === 'Self-Pay') ||
      (state.patientFilter === 'Family' && p.sponsors.length > 0) ||
      (state.patientFilter === 'With Balance' && p.balance > 0);
    const matchesSearch = !state.patientSearch || p.name.toLowerCase().includes(state.patientSearch.toLowerCase()) || p.id.toLowerCase().includes(state.patientSearch.toLowerCase());
    const matchesBranch = state.branch === 'All branches' || p.branch === state.branch;
    return matchesFilter && matchesSearch && matchesBranch;
  });

  return `<div class="page">
    ${renderBranchBanner()}
    ${pageHeading('Revenue Cycle', 'Patient Financial Management', 'Patient profiles, WelliID verification, outstanding balances and family sponsor links.')}
    ${metricGrid([['3,204','Active Patients','Enrolled'],['₦2.1M','Total Balance Due','Receivables'],['18 days','Avg Age of Balance','Turnaround'],['94%','WelliPass Adoption','Digital Pass']])}
    ${card('<div class="section-heading"><span>Patient Directory</span><div class="toolbar"><button class="btn btn-primary" data-action="open-new-patient">Register Patient</button><button class="btn btn-secondary" data-action="export-patients">Export CSV</button></div></div>', `
      <div class="filter-bar">
        <div class="filter-group">
          ${['All','HMO','Self-Pay','Family','With Balance'].map(f => `<button class="filter-btn ${state.patientFilter === f ? 'active' : ''}" data-action="filter-patients" data-filter="${f}">${f}</button>`).join('')}
        </div>
        <div class="search-box">
          <input class="input" placeholder="Search by name or WelliID…" value="${state.patientSearch}" data-action="search-patients" aria-label="Search patients">
        </div>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Patient & WelliID</th><th>HMO & Plan</th><th>Branch</th><th>Balance Due</th><th>Sponsors</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${filtered.map(p => `
              <tr>
                <td><strong>${p.name}</strong><br><small style="color:var(--muted)">${p.id} · ${p.phone}</small></td>
                <td>${p.hmo} <small style="color:var(--muted)">(${p.plan})</small></td>
                <td>${p.branch}</td>
                <td><strong>${money(p.balance)}</strong></td>
                <td>${p.sponsors.length ? p.sponsors.join(', ') : '—'}</td>
                <td>${tag(p.status, p.balance > 0 ? 'accent' : 'neutral')}</td>
                <td>
                  <button class="btn btn-secondary" data-action="bill-patient" data-id="${p.id}" style="font-size:11px;padding:4px 8px;">Bill at Desk</button>
                  <button class="btn btn-ghost" data-action="view-patient" data-id="${p.id}" style="font-size:11px;padding:4px 8px;">Profile</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `)}
  </div>`;
}

/* 4. Invoices */
function renderInvoices() {
  const filtered = state.invoiceList.filter(inv => {
    const matchesFilter = state.invoiceFilter === 'All' || inv.status.toLowerCase() === state.invoiceFilter.toLowerCase();
    const matchesSearch = !state.invoiceSearch || inv.id.toLowerCase().includes(state.invoiceSearch.toLowerCase()) || inv.patient.toLowerCase().includes(state.invoiceSearch.toLowerCase());
    const matchesBranch = state.branch === 'All branches' || inv.branch === state.branch;
    return matchesFilter && matchesSearch && matchesBranch;
  });

  return `<div class="page">
    ${renderBranchBanner()}
    ${pageHeading('Revenue Cycle', 'Digital Invoice Engine', 'Itemised billing, multi-payer split tracking, payment status and SMS dispatch.')}
    ${metricGrid([['142','Open Invoices','Ledger'],['₦8.4M','Invoiced This Month','Billed'],['6 days','Avg Time to Pay','Collection'],['96.2%','Collection Rate','Settled']])}
    ${card('<div class="section-heading"><span>Invoice Ledger</span><div class="toolbar"><button class="btn btn-primary" data-action="open-create-invoice">Create Invoice</button><button class="btn btn-secondary" data-action="export-invoices-pdf">Export PDF</button><button class="btn btn-secondary" data-action="export-invoices">Export CSV</button></div></div>', `
      <div class="filter-bar">
        <div class="filter-group">
          ${['All','Unpaid','Part-paid','Paid','Draft'].map(f => `<button class="filter-btn ${state.invoiceFilter === f ? 'active' : ''}" data-action="filter-invoices" data-filter="${f}">${f}</button>`).join('')}
        </div>
        <div class="search-box">
          <input class="input" placeholder="Search invoice # or patient…" value="${state.invoiceSearch}" data-action="search-invoices" aria-label="Search invoices">
        </div>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Invoice #</th><th>Patient</th><th>Date</th><th>Amount</th><th>Paid</th><th>Balance</th><th>Payer Details</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${filtered.map(inv => `
              <tr>
                <td><strong>${inv.id}</strong></td>
                <td>${inv.patient}<br><small style="color:var(--muted)">${inv.patientId} · ${inv.branch}</small></td>
                <td>${inv.date}</td>
                <td><strong>${money(inv.amount)}</strong></td>
                <td>${money(inv.paid)}</td>
                <td><strong style="color:${inv.amount - inv.paid > 0 ? 'var(--color-accent-700)' : 'inherit'}">${money(inv.amount - inv.paid)}</strong></td>
                <td><small>${inv.payer}</small></td>
                <td>${tag(inv.status, inv.status === 'Paid' ? 'neutral' : inv.status === 'Unpaid' ? 'accent' : 'outline')}</td>
                <td>
                  <button class="btn btn-secondary" data-action="view-invoice-modal" data-id="${inv.id}" style="font-size:11px;padding:4px 8px;">View Receipt</button>
                  <button class="btn btn-ghost" data-action="send-invoice-sms" data-id="${inv.id}" style="font-size:11px;padding:4px 8px;">Send SMS</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `)}
  </div>`;
}

/* 5. Payments */
function renderPayments() {
  const filtered = state.paymentList.filter(pmt => {
    const matchesFilter = state.paymentFilter === 'All' || pmt.channel.toLowerCase().includes(state.paymentFilter.toLowerCase());
    const matchesBranch = state.branch === 'All branches' || pmt.branch === state.branch;
    return matchesFilter && matchesBranch;
  });

  return `<div class="page">
    ${renderBranchBanner()}
    ${pageHeading('Revenue Cycle', 'Payment Collection & Journal', 'Card, bank transfer, USSD, HMO direct settlements and cash collection records.')}
    ${metricGrid([['₦3.4M','Collected Today','Real-Time'],['86','Successful Transactions','Count'],['96.4%','Gateway Success Rate','Performance'],['4','Queued Retries','Processing']])}
    ${card('<div class="section-heading"><span>Transaction Journal</span><button class="btn btn-secondary" data-action="export-payments">Export CSV</button></div>', `
      <div class="filter-bar">
        <div class="filter-group">
          ${['All','Card','Bank Transfer','HMO Direct','USSD','Cash'].map(f => `<button class="filter-btn ${state.paymentFilter === f ? 'active' : ''}" data-action="filter-payments" data-filter="${f}">${f}</button>`).join('')}
        </div>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Reference</th><th>Channel</th><th>Patient & Invoice</th><th>Branch</th><th>Amount</th><th>Time</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${filtered.map(p => `
              <tr>
                <td><strong>${p.id}</strong><br><small style="color:var(--muted)">${p.ref}</small></td>
                <td>${p.channel}</td>
                <td>${p.patient}<br><small style="color:var(--muted)">${p.inv}</small></td>
                <td>${p.branch}</td>
                <td><strong>${money(p.amount)}</strong></td>
                <td>${p.time}</td>
                <td>${tag(p.status, 'neutral')}</td>
                <td><button class="btn btn-secondary" data-action="view-payment-receipt" data-id="${p.id}" style="font-size:11px;padding:4px 8px;">Receipt</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `)}
  </div>`;
}

/* 6. Services & Pricing */
function renderServicesPricing() {
  const filtered = state.servicesList.filter(s => {
    const matchesFilter = state.serviceFilter === 'All' || s.cat.toLowerCase() === state.serviceFilter.toLowerCase();
    const matchesSearch = !state.serviceSearch || s.name.toLowerCase().includes(state.serviceSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return `<div class="page">
    ${renderBranchBanner()}
    ${pageHeading('Revenue Cycle', 'Service Catalogue & Pricing Engine', 'Manage hospital tariffs, package bundles and per-HMO contracted reimbursement rates.')}
    ${metricGrid([['214','Active Services','Catalog'],['38 of 41','HMO Tariffs Mapped','Coverage'],['12','Care Packages','Bundles'],['−14%','Avg HMO Tariff Variance','Margin Risk']])}
    ${card('<div class="section-heading"><span>Service Tariff Master</span><button class="btn btn-primary" data-action="open-add-service">Add Service / Tariff</button></div>', `
      <div class="filter-bar">
        <div class="filter-group">
          ${['All','Consultation','Cardiology','Diagnostics','Lab','Packages'].map(f => `<button class="filter-btn ${state.serviceFilter === f ? 'active' : ''}" data-action="filter-services" data-filter="${f}">${f}</button>`).join('')}
        </div>
        <div class="search-box">
          <input class="input" placeholder="Search service…" value="${state.serviceSearch}" data-action="search-services" aria-label="Search service">
        </div>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Service Name</th><th>Category</th><th>Standard Cash Tariff</th><th>Reliance HMO</th><th>Hygeia HMO</th><th>AXA Mansard</th><th>Avg Variance</th></tr></thead>
          <tbody>
            ${filtered.map(s => {
              const avgHmo = (s.reliance + s.hygeia + s.axa) / 3;
              const variancePct = Math.round(((avgHmo - s.cash) / s.cash) * 100);
              const varianceClass = variancePct < 0 ? 'variance-neg' : variancePct > 0 ? 'variance-pos' : 'variance-par';
              return `
                <tr>
                  <td><strong>${s.name}</strong><br><small style="color:var(--muted)">${s.id}</small></td>
                  <td>${tag(s.cat, 'outline')}</td>
                  <td><strong>${money(s.cash)}</strong></td>
                  <td>${money(s.reliance)}</td>
                  <td>${money(s.hygeia)}</td>
                  <td>${money(s.axa)}</td>
                  <td><span class="${varianceClass}">${variancePct > 0 ? '+' : ''}${variancePct}% vs Cash</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `)}
  </div>`;
}

/* 7. Claims */
function renderClaims() {
  return `<div class="page">
    ${renderBranchBanner()}
    ${pageHeading('HMO Claims','Submission, tracking & resubmission','A live claim queue for ABC Healthcare’s payer submissions.')}
    ${card('Claim lifecycle',state.claims.map(item=>`<div class="auth-item"><div class="auth-head"><div class="data-primary"><strong>${item.ref}</strong><span>${item.hmo} · ${money(item.amount)}</span></div>${tag(item.status,item.status==='Approved'?'neutral':item.status==='Rejected'?'accent':'outline')}</div>${item.reason?`<p class="claim-reason" style="color:var(--color-accent-700);margin:6px 0;"><strong>Rejection reason:</strong> ${item.reason}</p>`:''}<div class="toolbar" style="margin-top:8px;">${item.status==='Draft'?`<button class="btn btn-primary" data-action="claim-submit" data-id="${item.id}">Submit claim</button>`:''}${item.status==='Submitted'?`<button class="btn btn-secondary" data-action="claim-approve" data-id="${item.id}">Simulate: approve</button><button class="btn btn-secondary" data-action="claim-reject" data-id="${item.id}">Simulate: reject</button>`:''}${item.status==='Rejected'?`<button class="btn btn-primary" data-action="claim-resubmit" data-id="${item.id}">Resubmit claim</button>`:''}</div></div>`).join(''))}
  </div>`;
}

/* 8. HMO / Insurance Directory */
function renderHmoInsurance() {
  return `<div class="page">
    ${renderBranchBanner()}
    ${pageHeading('Claims & Payers', 'HMO / Insurance Directory', 'Contracted HMO profiles, eligibility verification criteria, benefit caps and SLA performance.')}
    ${metricGrid([['9','Contracted HMOs','Active'],['27','Active Insurance Plans','Policies'],['4.2 hrs','Avg Pre-Auth SLA','Turnaround'],['₦3.52M','Outstanding HMO Debts','Receivables']])}
    <div class="grid two-col">
      ${state.hmoList.map(hmo => card(`<strong>${hmo.name}</strong> · ${hmo.tier}`, `
        <div class="row-list">
          <div class="data-row"><span>Supported Plans</span><strong>${hmo.plans.join(', ')}</strong></div>
          <div class="data-row"><span>Pre-Auth Threshold</span><strong>${money(hmo.preAuthMin)}+</strong></div>
          <div class="data-row"><span>Standard Copay Rule</span><strong>${hmo.copay}</strong></div>
          <div class="data-row"><span>Average Response SLA</span><strong>${hmo.sla}</strong></div>
          <div class="data-row"><span>Claims Receivable</span><strong style="color:var(--color-accent-700)">${money(hmo.claimsDue)}</strong></div>
          <div class="data-row"><span>Integration Endpoint</span>${tag(hmo.portal, 'neutral')}</div>
        </div>
        <div class="toolbar" style="margin-top:12px;">
          <button class="btn btn-secondary" data-action="verify-hmo-eligibility" data-hmo="${hmo.name}">Verify Eligibility</button>
          <a class="btn btn-ghost" href="#claims">View Claims (${hmo.name.split(' ')[0]})</a>
        </div>
      `)).join('')}
    </div>
  </div>`;
}

/* 9. Authorization Centre */
function renderAuthorization() {
  const counts=Object.entries(state.authCounts).map(([label,value])=>`<section class="card elev-sm auth-count"><span class="stat-value">${value}</span><span class="stat-label">${label}</span></section>`).join('');
  const authItems=state.authItems.map(item=>`<div class="auth-item"><div class="auth-head" data-action="toggle-auth" data-id="${item.id}"><div class="data-primary"><strong>${item.patient} · ${item.service}</strong><span>${item.hmo} · ${money(item.amount)}</span></div>${tag(item.status,item.status==='Approved'?'neutral':item.status==='Rejected'?'accent':'outline')}</div>${state.selectedAuth===item.id?`<div class="auth-detail">${item.readiness?`<div class="readiness"><span class="card-kicker">Readiness</span><div class="progress-track"><div class="progress-fill" style="width:${item.readiness}%"></div></div><strong>${item.readiness}%</strong></div>`:''}${item.timeline.map(([time,text])=>`<div class="timeline-line"><time>${time}</time><span>${text}</span></div>`).join('')}<div class="toolbar">${item.status==='Draft'?`<button class="btn btn-primary" data-action="submit-auth" data-id="${item.id}">Submit to HMO</button>`:''}${['Submitted','Pending'].includes(item.status)?`<button class="btn btn-secondary" data-action="approve-auth" data-id="${item.id}">Simulate: HMO approves</button>`:''}${item.status==='Approved'?'<span class="stat-label">Patient notified.</span>':''}</div></div>`:''}</div>`).join('');
  return `<div class="page">
    ${renderBranchBanner()}
    ${pageHeading('Authorization Centre','Pre-authorization & eligibility','Track payer decisions, service readiness and member benefit limits.')}
    <div class="grid auth-count-grid">${counts}</div><div class="grid two-col">${card('SLA by HMO · average response time',`${dataRow('Reliance HMO','','2h 14m')}${dataRow('Hygeia HMO','','7h 31m')}${dataRow('AXA Mansard','','4h 02m')}`)}${card('Coverage & benefit limit · sample patient',`<div class="section-heading"><span>Annual limit</span><strong>₦1,000,000</strong></div><div class="progress-track"><div class="progress-fill" style="width:65%"></div></div><div class="progress-meta"><span>Used ₦650,000</span><span>Remaining ₦350,000</span></div>`)}</div>
    ${card('Cost estimator · sample treatment plan',`${[['Treatment','₦1,200,000'],['HMO coverage','−₦600,000'],['WelliSave','−₦150,000'],['Family','−₦200,000'],['Financing','−₦250,000']].map(([label,value])=>`<div class="data-row"><span>${label}</span><strong>${value}</strong></div>`).join('')}<div class="data-row"><strong>Patient balance</strong><strong>₦0</strong></div>`,'funding-card')}
    ${card('Authorization inbox',authItems)}
  </div>`;
}

/* 10. Family / Sponsors */
function renderFamily() {
  const total = 1000000;
  const funded = state.family.filter(item => item.paid).reduce((sum, item) => sum + item.amount, 0);
  const remaining = total - funded;
  return `<div class="page">
    ${renderBranchBanner()}
    ${pageHeading('Family / Sponsors','Multi-sponsor funding','Coordinate contributions toward a single treatment invoice.')}
    ${card(`<div class="section-heading"><span>Chidi O. — Treatment plan</span><strong>${money(total)}</strong></div>`,`${state.family.map(item=>`<div class="split-row"><span>${item.name}</span><strong>${money(item.amount)}</strong>${item.paid?tag('Paid'): `<button class="btn btn-secondary" data-action="contribute" data-name="${item.name}">Simulate pays</button>`}</div>`).join('')}<div class="progress-track"><div class="progress-fill" style="width:${funded/total*100}%"></div></div><div class="progress-meta"><span>Funded ${money(funded)}</span><span>Remaining ${money(remaining)}</span></div>${remaining===0?tag('Bill fully funded — settled to provider'):''}`,'funding-card')}
    ${card('Sponsor directory',`${dataRow('Femi O. — Invoice INV-2048','Sponsor: Brother (UK) — ₦58,000','Paid')}${dataRow('Blessing K. — Invoice INV-2061','Sponsor: Daughter — ₦23,500','Awaiting payment','outline')}${dataRow('Chidi O. — Treatment plan','3 sponsors — ₦1,000,000 total','Partially funded','outline')}`)}
  </div>`;
}

/* 11. WelliPass */
function renderWelliPass() {
  return `<div class="page">
    ${renderBranchBanner()}
    ${pageHeading('Claims & Payers', 'WelliPass Access Control', 'Patient identification, instant biometric/QR desk access and pre-authorized financial consent.')}
    ${metricGrid([['62','Scans Today','Front Desk'],['2.1 min','Desk Time Saved','Efficiency'],['118','Linked Dependants','Family Access'],['90%','Patient Adoption','Coverage']])}
    <div class="grid two-col">
      ${card('Active WelliPass Sample — Ngozi Adeleke', `
        <div class="wellipass-head">
          <span class="eyebrow" style="color:white">WELLIPASS · VERIFIED</span>
          <strong>Ngozi Adeleke</strong>
          <span>WR-2291-04 · Reliance HMO — Gold</span>
        </div>
        <div class="qr-grid" aria-label="Illustrative QR placeholder">
          ${[1,0,1,1,0,1,0,1,0,0,1,0,1,1,1,0,1,1,0,0,1,1,0,0,1,0,0,1,1,1,0,1,1,0,0,1].map(v => `<span class="${v?'dark':''}"></span>`).join('')}
        </div>
        <div class="row-list">
          <div class="data-row"><span>Pass Status</span>${tag('Active & Valid', 'neutral')}</div>
          <div class="data-row"><span>Emergency Financial Consent</span><strong>Enabled (up to ₦100,000)</strong></div>
          <div class="data-row"><span>Linked Dependants</span><strong>2 children linked (Parent authority)</strong></div>
        </div>
        <div class="toolbar" style="margin-top:12px;">
          <button class="btn btn-primary" data-action="scan-continue">Load at Cashier Desk</button>
        </div>
      `)}
      ${card('WelliPass Front-Desk Statistics', `
        <div class="row-list">
          <div class="data-row"><span>Wuse Branch Scans</span><strong>28 scans today</strong></div>
          <div class="data-row"><span>Maitama Branch Scans</span><strong>22 scans today</strong></div>
          <div class="data-row"><span>Garki Branch Scans</span><strong>12 scans today</strong></div>
          <div class="data-row"><span>Average Lookup Latency</span><strong>1.2 seconds</strong></div>
          <div class="data-row"><span>Emergency Overrides Triggered</span><strong>0 today</strong></div>
        </div>
      `)}
    </div>
  </div>`;
}

/* 12. Receivables */
function renderReceivables() {
  const rows=[['Patient',200000,120000,80000,50000],['HMO',1200000,900000,700000,400000],['Insurance',350000,250000,150000,50000],['Corporate',120000,80000,30000,20000],['Financing',200000,120000,60000,20000]];
  const cols=[1,2,3,4], totals=cols.map(index=>rows.reduce((sum,row)=>sum+row[index],0));
  return `<div class="page">
    ${renderBranchBanner()}
    ${pageHeading('Accounts Receivable','Receivables & ageing','Outstanding balances by payer and days since invoice.')}
    ${card('<div class="section-heading"><span>Ageing by Payer</span><button class="btn btn-secondary" data-action="export-receivables">Export Ageing CSV</button></div>',`<div class="table-wrap"><table class="table"><thead><tr><th>Payer</th><th>0–30 days</th><th>31–60 days</th><th>61–90 days</th><th>90+ days</th><th>Total</th></tr></thead><tbody>${rows.map(row=>`<tr><td><strong>${row[0]}</strong></td>${row.slice(1).map(value=>`<td>${money(value)}</td>`).join('')}<td><strong>${money(row.slice(1).reduce((sum,val)=>sum+val,0))}</strong></td></tr>`).join('')}<tr><td><strong>Total</strong></td>${totals.map(value=>`<td><strong>${money(value)}</strong></td>`).join('')}<td><strong>${money(totals.reduce((sum,val)=>sum+val,0))}</strong></td></tr></tbody></table></div>`)}
  </div>`;
}

/* 13. Reconciliation */
function renderReconciliation() {
  const summaries=[[state.matched.toLocaleString(),'Matched'],[state.unmatched.length,'Unmatched'],[state.exceptions,'Exceptions'],[state.duplicates,'Duplicate']];
  const unmatched=state.unmatched.length?state.unmatched.map(item=>`<div class="data-row"><div class="data-primary"><strong>${money(item.amount)} · ${item.source} · ${item.date}</strong><span>Suggested: ${item.suggestion}</span></div><button class="btn btn-secondary" data-action="open-match" data-id="${item.id}">Review match</button></div>`).join(''):'<p class="empty-state">Nothing unmatched right now.</p>';
  return `<div class="page">
    ${renderBranchBanner()}
    ${pageHeading('Smart Reconciliation Centre','Reconciliation workspace','Review gateway transfers, resolve exceptions and confirm invoice matches.')}
    ${metricGrid(summaries.map(([value,label])=>[value,label,label]),'grid activity-grid')}
    ${card('Unmatched payments',unmatched)}
    ${card('Recently matched',`<div class="table-wrap"><table class="table"><thead><tr><th>Invoice</th><th>Amount</th><th>Matched via</th><th>When</th></tr></thead><tbody><tr><td>INV-2040</td><td>₦45,000</td><td>Auto — reference match</td><td>09:02</td></tr><tr><td>INV-2041</td><td>₦18,000</td><td>Manual — Adaeze O.</td><td>08:47</td></tr><tr><td>INV-2039</td><td>₦120,000</td><td>Auto — reference match</td><td>08:30</td></tr></tbody></table></div>`)}
  </div>`;
}

/* 14. Settlements */
function renderSettlements() {
  const events=[['08:30','SET-1187 — ₦2,100,000 — Flutterwave payout initiated'],['08:34','SET-1187 — Completed to GTBank ••4471'],['09:02','SET-1188 — ₦1,950,000 — Paystack payout initiated'],['09:10','SET-1188 — Completed to GTBank ••4471'],['—','SET-1189 — ₦450,000 — Pending (Paystack processing)']];
  const rows=[['Wuse',1240000,120000],['Garki',780000,0],['Maitama',1650000,210000],['Kaduna',310000,60000],['Lagos',420000,60000]];
  return `<div class="page">
    ${renderBranchBanner()}
    ${pageHeading('Settlements','Gateway payouts & branch settlement','Follow gateway payout status and branch-level settlement totals.')}
    ${card('Payout timeline',events.map(([time,text])=>`<div class="timeline-line"><time>${time}</time><span>${text}</span></div>`).join(''))}
    ${card('<div class="section-heading"><span>Per-branch settlement</span><button class="btn btn-secondary" data-action="export-settlements">Export CSV</button></div>',`<div class="table-wrap"><table class="table"><thead><tr><th>Branch</th><th>Settled</th><th>Pending</th></tr></thead><tbody>${rows.map(([branch,settled,pending])=>`<tr><td><strong>${branch}</strong></td><td>${money(settled)}</td><td>${money(pending)}</td></tr>`).join('')}</tbody></table></div>`)}
  </div>`;
}

/* 15. Refunds Engine */
function renderRefunds() {
  return `<div class="page">
    ${renderBranchBanner()}
    ${pageHeading('Claims & Payers', 'Refund Engine', 'Full, partial and disputed payment refunds with enforced dual-approval controls.')}
    ${metricGrid([['₦35,000','Refunded This Month','Settled'],[String(state.refundList.filter(r=>r.status.includes('Pending')).length),'Pending Approval','Queue'],['4.1 hrs','Avg Approval Time','SLA'],[money(state.settings.threshold),'Dual Approval Threshold','Security Rule']])}
    ${card('Dual Approval Policy', `
      <p style="margin:0;font-size:12px;">Refund requests exceeding <strong>${money(state.settings.threshold)}</strong> require dual-key verification from both the <strong>Finance Manager</strong> and the <strong>Medical Director</strong> before bank reversal release.</p>
    `)}
    ${card('<div class="section-heading"><span>Refund Requests Queue</span><button class="btn btn-primary" data-action="open-request-refund">Request Refund</button></div>', `
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Refund ID</th><th>Invoice & Patient</th><th>Amount</th><th>Requester</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${state.refundList.map(r => `
              <tr>
                <td><strong>${r.id}</strong></td>
                <td>${r.patient}<br><small style="color:var(--muted)">${r.inv}</small></td>
                <td><strong>${money(r.amount)}</strong></td>
                <td>${r.requester}</td>
                <td>${r.reason}</td>
                <td>${tag(r.status, r.status === 'Approved' || r.status === 'Settled' ? 'neutral' : 'accent')}</td>
                <td>
                  ${r.status.includes('Pending') ? `
                    <button class="btn btn-secondary" data-action="approve-refund-item" data-id="${r.id}" style="font-size:11px;padding:4px 8px;">Approve</button>
                    <button class="btn btn-ghost" data-action="reject-refund-item" data-id="${r.id}" style="font-size:11px;padding:4px 8px;">Reject</button>
                  ` : tag('Recorded', 'outline')}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `)}
  </div>`;
}

/* 16. Financing */
function renderFinancing() {
  return `<div class="page">
    ${renderBranchBanner()}
    ${pageHeading('Growth', 'Healthcare Financing Marketplace', 'Patients access point-of-care credit from regulated lending partners at zero facility risk.')}
    ${metricGrid([['41','Active Patient Plans','Financed'],['₦4.1M','Disbursed to Facility','Capital'],['68%','Patient Approval Rate','Underwriting'],['0%','Provider Bad Debt','Guaranteed']])}
    ${card('Integrated Financing Partners', `
      <div class="grid three-col">
        <div class="stat-card" style="border:1px solid var(--color-divider);padding:14px;"><strong>CareCred Nigeria</strong><span>Terms: 3 - 12 Months<br>Max: ₦2,000,000<br>Status: Active</span></div>
        <div class="stat-card" style="border:1px solid var(--color-divider);padding:14px;"><strong>HealthPay Africa</strong><span>Terms: 1 - 6 Months<br>Max: ₦500,000<br>Status: Active</span></div>
        <div class="stat-card" style="border:1px solid var(--color-divider);padding:14px;"><strong>Sycamore Credit</strong><span>Terms: 3 - 24 Months<br>Max: ₦5,000,000<br>Status: Active</span></div>
      </div>
    `)}
    ${card('Active Financed Treatments', `
      <div class="row-list">
        ${dataRow('Cataract surgery — Femi O.', '₦100,000 over 6 months via CareCred · Settled upfront to hospital', 'Active')}
        ${dataRow('Dental implant — Ngozi A.', '₦180,000 over 12 months via Sycamore Credit · Settled upfront to hospital', 'Active')}
        ${dataRow('Executive checkup — Chinwe E.', '₦60,000 over 3 months via HealthPay · Awaiting patient KYC', 'Pending KYC', 'outline')}
      </div>
    `)}
  </div>`;
}

/* 17. Payment Plans */
function renderPaymentPlans() {
  return `<div class="page">
    ${renderBranchBanner()}
    ${pageHeading('Growth', 'Patient Installment Plans', 'Manage internal hospital payment arrangements and track upcoming collection dates.')}
    ${metricGrid([['57','Active Installment Plans','Active'],['₦2.3M','Collected This Month','Revenue'],['4','Missed Installments','Follow-Up'],['₦850K','Pipeline Remaining','Receivable']])}
    ${card('Installment Schedule Tracker', `
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Plan ID & Patient</th><th>Total Cost</th><th>Paid to Date</th><th>Progress</th><th>Monthly Installment</th><th>Next Due Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${state.paymentPlanList.map(plan => {
              const pct = Math.round((plan.paid / plan.total) * 100);
              return `
                <tr>
                  <td><strong>${plan.patient}</strong><br><small style="color:var(--muted)">${plan.id} · ${plan.branch}</small></td>
                  <td>${money(plan.total)}</td>
                  <td><strong>${money(plan.paid)}</strong></td>
                  <td>
                    <div style="display:flex;align-items:center;gap:6px;">
                      <div class="progress-track" style="width:60px;"><div class="progress-fill" style="width:${pct}%"></div></div>
                      <small>${plan.installments} (${pct}%)</small>
                    </div>
                  </td>
                  <td>${money(plan.monthly)}</td>
                  <td>${plan.nextDue}</td>
                  <td>${tag(plan.status, plan.status === 'On track' ? 'neutral' : 'accent')}</td>
                  <td>
                    <button class="btn btn-secondary" data-action="remind-plan-sms" data-id="${plan.id}" style="font-size:11px;padding:4px 8px;">Send SMS</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `)}
  </div>`;
}

/* 18. Reports */
function renderReports() {
  return `<div class="page">
    ${renderBranchBanner()}
    ${pageHeading('Operations', 'Reports & Financial Statements', 'Automated revenue, claims scrubbing, debt ageing and branch reconciliation exports.')}
    ${metricGrid([['6','Scheduled Reports','Active'],['41','Generated This Month','Downloads'],['2 hrs ago','Last Data Refresh','Sync'],['CSV / PDF','Supported Formats','Standards']])}
    <div class="grid two-col">
      ${card('Monthly Revenue Statement', `
        <div style="height:140px;position:relative;margin-bottom:12px;"><canvas id="reportRevenueChart"></canvas></div>
        <p>Comprehensive transaction journal detailing cash, card, HMO copays and sponsor funding across all branches for Sep 2026.</p>
        <div class="toolbar" style="margin-top:12px;">
          <button class="btn btn-primary" data-action="export-revenue-report-pdf">Download PDF</button>
          <button class="btn btn-secondary" data-action="export-revenue-report">Download CSV (Revenue)</button>
        </div>
      `)}
      ${card('HMO Claims Ageing & Scrubbing Audit', `
        <div style="height:140px;position:relative;margin-bottom:12px;"><canvas id="reportClaimsChart"></canvas></div>
        <p>Breakdown of outstanding claims by HMO, ageing bracket, and pre-submission error flags.</p>
        <div class="toolbar" style="margin-top:12px;">
          <button class="btn btn-primary" data-action="export-claims-report-pdf">Download PDF</button>
          <button class="btn btn-secondary" data-action="export-claims-report">Download CSV (Claims)</button>
        </div>
      `)}
      ${card('Branch Reconciliation Ledger', `
        <div style="height:140px;position:relative;margin-bottom:12px;"><canvas id="reportReconChart"></canvas></div>
        <p>Detailed breakdown of bank settlements, Paystack payouts and outstanding batch deposits by branch.</p>
        <div class="toolbar" style="margin-top:12px;">
          <button class="btn btn-primary" data-action="export-recon-report-pdf">Download PDF</button>
          <button class="btn btn-secondary" data-action="export-recon-report">Download CSV (Reconciliation)</button>
        </div>
      `)}
      ${card('Revenue Leakage Audit Report', `
        <div style="height:140px;position:relative;margin-bottom:12px;"><canvas id="reportLeakageChart"></canvas></div>
        <p>Identifies diagnostic services rendered without matching invoices, duplicate discounts, and untariffed items.</p>
        <div class="toolbar" style="margin-top:12px;">
          <button class="btn btn-primary" data-action="export-leakage-report-pdf">Download PDF</button>
          <button class="btn btn-secondary" data-action="export-leakage-report">Download CSV (Leakage)</button>
        </div>
      `)}
    </div>
  </div>`;
}

/* 19. Branches */
function renderBranches() {
  const branches = [
    { name: 'Wuse Branch', rev: 5200000, staff: 12, desks: 3, beds: '82%', lead: 'Tunde Adeleke (Desk Lead)' },
    { name: 'Garki Branch', rev: 3400000, staff: 8, desks: 2, beds: '74%', lead: 'Ngozi Fashola (Billing Lead)' },
    { name: 'Maitama Branch', rev: 7100000, staff: 15, desks: 4, beds: '91%', lead: 'Dr. Chidi Obi (Medical Director)' },
    { name: 'Kaduna Branch', rev: 1450000, staff: 6, desks: 2, beds: '58%', lead: 'Fatima Garba (Billing Lead)' },
    { name: 'Lagos Branch', rev: 2100000, staff: 8, desks: 2, beds: '65%', lead: 'Babajide Cole (Desk Lead)' }
  ];
  return `<div class="page">
    ${renderBranchBanner()}
    ${pageHeading('Operations', 'Branch Management', 'Consolidated monitoring and operational metrics across ABC Healthcare’s 5 locations.')}
    ${metricGrid([['5','Active Branches','Network'],['₦19.25M','Consolidated Revenue','Month'],['Maitama','Top Performing Branch','Leader'],['46','Total Deployed Staff','Personnel']])}
    ${card('Branch Operational Matrix', `
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Branch</th><th>Branch Lead</th><th>Staff</th><th>Active Cashier Desks</th><th>Bed Occupancy</th><th>Revenue This Month</th><th>Action</th></tr></thead>
          <tbody>
            ${branches.map(b => `
              <tr>
                <td><strong>${b.name}</strong></td>
                <td>${b.lead}</td>
                <td>${b.staff}</td>
                <td>${b.desks} desks</td>
                <td>${b.beds}</td>
                <td><strong>${money(b.rev)}</strong></td>
                <td>
                  <button class="btn btn-secondary" data-action="switch-branch-quick" data-name="${b.name.replace(' Branch', '')}" style="font-size:11px;padding:4px 8px;">Filter to Branch</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `)}
  </div>`;
}

/* 20. Staff & Roles */
function renderStaff() {
  return `<div class="page">
    ${renderBranchBanner()}
    ${pageHeading('Operations', 'Staff & Role-Based Access', 'Configure permissions, cashier shift limits and audit roles for clinical & billing personnel.')}
    ${metricGrid([['46','Active Staff Members','Roster'],['5','Role Levels Configured','Security'],['2','Pending Invitations','Onboarding'],['100%','Audit Logging Active','Compliance']])}
    ${card('<div class="section-heading"><span>Staff Directory</span><button class="btn btn-primary" data-action="open-invite-staff">Invite Staff Member</button></div>', `
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Name & Email</th><th>Role</th><th>Branch Scoping</th><th>Status</th><th>Last Active</th></tr></thead>
          <tbody>
            ${state.staffList.map(s => `
              <tr>
                <td><strong>${s.name}</strong><br><small style="color:var(--muted)">${s.email}</small></td>
                <td>${tag(s.role, 'outline')}</td>
                <td>${s.branch}</td>
                <td>${tag(s.status, 'neutral')}</td>
                <td><small>${s.lastActive}</small></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `)}
  </div>`;
}

/* 21. Audit Log */
function renderAuditLog() {
  return `<div class="page">
    ${renderBranchBanner()}
    ${pageHeading('Account', 'Immutable Audit Log', 'Real-time chronological record of every financial approval, tariff modification and patient transaction.')}
    ${metricGrid([['212','Events Logged Today','Stream'],['3','Sensitive Admin Approvals','Audited'],['7 Years','Statutory Data Retention','Compliant'],['Tamper-Evident','Cryptographic Ledger','Security']])}
    ${card('Audit Event Stream', `
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Action</th><th>Details</th><th>Actor</th><th>Branch</th><th>Time</th></tr></thead>
          <tbody>
            ${state.auditLog.map(ev => `
              <tr>
                <td><strong>${ev.action}</strong></td>
                <td>${ev.detail}</td>
                <td>${ev.actor}</td>
                <td>${ev.branch}</td>
                <td><small>${ev.time}</small></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `)}
  </div>`;
}

/* 22. Notifications */
function renderNotifications() {
  return `<div class="page">
    ${renderBranchBanner()}
    ${pageHeading('Overview', 'Notification Centre', 'Centralized alerts for gateway payouts, claim rejections, pre-auth approvals and system events.')}
    ${metricGrid([['14','Unread Alerts','Inbox'],['212','Sent Today Across Channels','Volume'],['4','Connected Alert Channels','Integration'],['Instant','Real-Time Push','Delivery']])}
    ${card('<div class="section-heading"><span>Alert Stream</span><button class="btn btn-secondary" data-action="mark-all-read">Mark All as Read</button></div>', `
      <div class="row-list">
        ${state.notificationsList.map(n => `
          <div class="data-row" style="background:${n.read ? 'transparent' : 'var(--color-accent-100)'};padding:12px;margin-bottom:6px;">
            <div class="data-primary">
              <strong style="color:${n.read ? 'inherit' : 'var(--color-accent-800)'}">${n.title}</strong>
              <span>${n.detail}</span>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
              <small style="color:var(--muted)">${n.time}</small>
              ${tag(n.type, n.read ? 'outline' : 'accent')}
            </div>
          </div>
        `).join('')}
      </div>
    `)}
  </div>`;
}

/* 23. AI Insights */
function renderAiInsights() {
  return `<div class="page">
    ${renderBranchBanner()}
    ${pageHeading('Overview', 'AI Insights & Financial Intelligence', 'Real-time machine analysis of tariff variances, claim rejection risks and branch collection trends.')}
    ${metricGrid([['94 / 100','Financial Health Score','Strong'],['₦185,000','Detected Revenue Leakage','Actionable'],['3','Claims at Risk of Denial','Warning'],['+8.4%','Projected Growth','Next Month']])}
    <div class="grid two-col">
      ${card('Smart Recommendations', `
        <div class="row-list">
          <div class="data-row">
            <div class="data-primary">
              <strong>Kaduna Branch Revenue Dip (−12%)</strong>
              <span>Fewer diagnostic bookings. Reallocate mobile radiology assets to improve turnaround.</span>
            </div>
            <button class="btn btn-secondary" data-action="investigate-ai" data-topic="Kaduna" style="font-size:11px;padding:4px 8px;">Investigate</button>
          </div>
          <div class="data-row">
            <div class="data-primary">
              <strong>Reliance HMO Tariff Below Private Benchmark</strong>
              <span>ECG contracted at ₦15,000 vs ₦18,000 cash cost. Request contract tariff review.</span>
            </div>
            <button class="btn btn-secondary" data-action="investigate-ai" data-topic="HMO Tariff" style="font-size:11px;padding:4px 8px;">Review Tariff</button>
          </div>
          <div class="data-row">
            <div class="data-primary">
              <strong>3 Claims Missing Pre-Authorization References</strong>
              <span>CLM-5544, CLM-5545 likely to reject. Flagged before clearing house submission.</span>
            </div>
            <a class="btn btn-secondary" href="#claims" style="font-size:11px;padding:4px 8px;">Scrub Claims</a>
          </div>
        </div>
      `)}
      ${card('Payer Payout & Risk Scorecard', `
        <div class="row-list">
          <div class="data-row"><span>Reliance HMO</span><strong>Avg 2.2 days to settle · 2.1% rejection rate</strong></div>
          <div class="data-row"><span>Hygeia HMO</span><strong>Avg 7.5 days to settle · 8.4% rejection rate</strong></div>
          <div class="data-row"><span>AXA Mansard</span><strong>Avg 4.0 days to settle · 3.2% rejection rate</strong></div>
          <div class="data-row"><span>Leadway Health</span><strong>Avg 3.8 days to settle · 1.9% rejection rate</strong></div>
        </div>
      `)}
    </div>
  </div>`;
}

/* 24. Settings */
function renderSettings() {
  const thresholdCard = card('Refund approval threshold', `<div class="field"><label for="refund-threshold">Amount above which refunds need Finance Manager + Owner approval</label><input class="input" id="refund-threshold" type="number" min="0" step="5000" value="${state.settings.threshold}"></div>`);
  const approvalCard = card(`<div class="section-heading"><span>Second approval on bank-detail change</span><button class="btn btn-secondary" data-action="toggle-setting">${state.settings.secondApproval ? 'Enabled' : 'Disabled'}</button></div>`, `<p>When enabled, a change to the settlement bank account needs a second approver before it takes effect.</p>`);
  const controlsCard = card('Organization controls', `${dataRow('Settlement account', 'GTBank ••4471', 'Verified')}${dataRow('Refund approval limit', `> ${money(state.settings.threshold)} needs 2 approvers`, 'Configured', 'outline')}${dataRow('Bank-detail change', 'Requires second approval', state.settings.secondApproval ? 'Enabled' : 'Disabled', 'outline')}`);
  return `<div class="page settings-narrow">${renderBranchBanner()}${pageHeading('Settings', 'Approval rules & organization', 'Set controls for refunds and sensitive account changes.')}${thresholdCard}${approvalCard}${controlsCard}</div>`;
}

/* 25. Mobile App Integration */
function renderMobileIntegration() {
  const app=state.mobileApp;
  const features=[['billPayments','Patient bill payments','Patients can pay ABC Healthcare invoices from the separate app.'],['billHistory','Bill history','Patients can view current and past facility bills.'],['familyFunding','Family funding','Patients can request contributions from linked sponsors.'],['welliPass','WelliPass access','Patients can present a WelliPass at the hospital desk.']];
  const featureMarkup=features.map(([id,label,description])=>`<label class="integration-feature"><span><strong>${label}</strong><small>${description}</small></span><input type="checkbox" data-mobile-feature="${id}" ${app.features[id]?'checked':''} aria-label="${label}"></label>`).join('');
  const eventMarkup=app.events.map(([time,name,detail])=>`<div class="data-row"><div class="data-primary"><strong>${name}</strong><span>${detail}</span></div><time class="event-time">${time}</time></div>`).join('');
  return `<div class="page">${renderBranchBanner()}${pageHeading('Connected Apps','Patient Mobile App','Configure how ABC Healthcare connects with the separate WelliPay patient app. Patients use the MobileApp on their own devices; this console manages the provider connection.')}
    <div class="grid stats-grid">${stat('3,204','Linked patient profiles','Mobile accounts')}${stat('1','Connected app','Client')}${stat(app.syncCount.toLocaleString(),'Records synced','Data exchange')}${stat('Sandbox','Demo environment','Connection mode')}</div>
    <div class="grid two-col">
      ${card('Provider connection',`<div class="connection-status"><div><strong>Demo connection active</strong><span>Sample connector · no live patient data or transactions</span></div>${tag('Sandbox','outline')}</div><div class="integration-details"><div><span>Facility</span><strong>ABC Healthcare</strong></div><div><span>Connection ID</span><strong>CONN-ABC-001</strong></div><div><span>Last sync</span><strong>${app.lastSync}</strong></div><div><span>Sync status</span><strong>Ready</strong></div></div><div class="toolbar"><button class="btn btn-primary" data-action="sync-mobile">Sync demo data</button><button class="btn btn-secondary" data-action="test-mobile-connection">Test connection</button></div>${app.notice?`<p class="integration-notice" role="status">${app.notice}</p>`:''}`)}
      ${card('Patient app capabilities',`<div class="integration-features">${featureMarkup}</div>`)}
    </div>
    ${card('<div class="section-heading"><span>Mobile app events</span><button class="btn btn-secondary" data-action="simulate-mobile-event">Simulate incoming event</button></div>',`<p class="integration-caption">Sample events received from the separate patient app. In production, these arrive through the connected API. <a href="docs/mobile-app-integration.md" target="_blank" rel="noreferrer">Review API contract →</a></p><div class="row-list">${eventMarkup}</div>`)}
  </div>`;
}

/* 26. Remaining Connected Screens */
function renderStub() {
  const stubData = {
    referrals: ['Referral Network','Track patients referred between providers and secondary diagnostic revenues.',[['23','Referrals This Month'],['17','Completed'],['3.4 days','Avg Turnaround']], [['ABC Clinic → ABC Laboratory','Full Blood Count','Completed'],['ABC Clinic → Radiant Imaging','MRI — Knee Scan','Awaiting Payment'],['ABC Clinic → CarePlus Pharmacy','Prescription Dispensary','Completed']]],
    partners: ['Diagnostic & Specialist Partners','Partner laboratories, pharmacies and diagnostic centres connected to WelliPay.',[['9','Connected Partners'],['23','Referrals Sent'],['11','Referrals Received']], [['ABC Laboratory','Laboratory Services','Connected'],['Radiant Imaging','Radiology & Diagnostics','Connected'],['Synlab Nigeria','Pathology Services','Connected']]],
    integrations: ['Integrations & EHR Connectors','Synchronize patient charts, charge slips and payments with hospital systems.',[['3','Connected Gateways'],['12','EHR Connectors Available'],['4,204','Records Synced Today']], [['WelliRecord EHR','Patient Records & Vitals','Connected'],['Paystack Payment Gateway','Virtual Accounts & Cards','Live'],['Termii SMS Gateway','Billing SMS Alerts','Connected']]],
    'api-developers': ['API & Developer Sandbox','Manage OAuth2 client credentials, webhook subscriptions and API keys.',[['2','Active API Keys'],['18,204','API Requests This Month'],['99.6%','Webhook Delivery Rate']], [['payment.success','Webhook Listener','200 OK'],['claim.adjudicated','Webhook Listener','200 OK'],['Client Key: wp_live_...','Production API Key','Active']]],
    subscription: ['Subscription & SaaS Plan','Manage ABC Healthcare’s SaaS tier, branches and add-on subscriptions.',[['Business Tier','Current Plan'],['₦85,000','Monthly Platform Fee'],['1.4%','Capped Transaction Fee']], [['Multi-Branch Add-on (5 branches)','Included in Business','Active'],['AI Financial Copilot Add-on','₦15,000 / month','Active'],['HMO Electronic Claims Gateway','₦25,000 / month','Active']]],
    support: ['Provider Support & SLA Desk','Priority support tickets, disputes resolution and dedicated account team.',[['0','Open Critical Disputes'],['18 min','Avg Support Response'],['4.8 / 5','Customer Satisfaction']], [['SET-1189 Bank Processing Verification','Paystack settlement delay enquiry','Resolved'],['WelliPass Desk Scanner Setup','Terminal configuration check','Resolved']]]
  };
  const data = stubData[state.active] || ['Workspace','Operational workspace for ABC Healthcare.',[['—','Records'],['—','This month'],['—','Needs attention']],[['No sample records','Workspace is ready for configuration','Review']]];
  const [kicker,blurb,stats,rows]=data;
  return `<div class="page">${renderBranchBanner()}${pageHeading(kicker,labels[state.active]||'Workspace',blurb)}${metricGrid(stats.map(([value,label])=>[value,label,label]))}${card('Latest activity',rows.map(([title,detail,status],index)=>dataRow(title,detail,status,index===1?'outline':'neutral')).join(''))}</div>`;
}

let chartInstances = [];

function initializeCharts() {
  if (chartInstances.length) {
    chartInstances.forEach(c => c.destroy());
    chartInstances = [];
  }

  const revenueCanvas = document.getElementById('revenueTrendChart');
  const mixCanvas = document.getElementById('payerMixChart');

  if (revenueCanvas && window.Chart) {
    chartInstances.push(new Chart(revenueCanvas, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Revenue (M)',
          data: [1.8, 2.1, 1.6, 2.4, 2.0, 2.6, 2.45],
          backgroundColor: '#ec3013',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, display: false },
          x: { grid: { display: false } }
        },
        plugins: {
          legend: { display: false }
        }
      }
    }));
  }

  if (mixCanvas && window.Chart) {
    chartInstances.push(new Chart(mixCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Patient', 'HMO', 'Insurance', 'Corporate'],
        datasets: [{
          data: [40, 45, 10, 5],
          backgroundColor: ['#d4d4d4', '#ec3013', '#7d190a', '#525252'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 12, font: { family: 'Archivo' } } }
        }
      }
    }));
  }

  // Reports Charts
  const repRev = document.getElementById('reportRevenueChart');
  if (repRev && window.Chart) {
    chartInstances.push(new Chart(repRev, {
      type: 'line',
      data: { labels: ['W1', 'W2', 'W3', 'W4'], datasets: [{ label: 'Revenue', data: [1.2, 1.8, 1.5, 2.4], borderColor: '#ec3013', tension: 0.3 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    }));
  }
  
  const repClaims = document.getElementById('reportClaimsChart');
  if (repClaims && window.Chart) {
    chartInstances.push(new Chart(repClaims, {
      type: 'bar',
      data: { labels: ['Reliance', 'Hygeia', 'AXA'], datasets: [{ label: 'Outstanding', data: [850, 420, 310], backgroundColor: '#525252' }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    }));
  }
}

function render() {
  if (!labels[state.active]) state.active = 'dashboard';
  renderNav();
  document.querySelector('#page-title').textContent = labels[state.active];
  const branchSelect = document.querySelector('#branch-select');
  if (branchSelect && branchSelect.value !== state.branch) branchSelect.value = state.branch;

  const views = {
    dashboard: renderDashboard,
    'hospital-desk': renderDesk,
    patients: renderPatients,
    invoices: renderInvoices,
    payments: renderPayments,
    'services-pricing': renderServicesPricing,
    claims: renderClaims,
    'hmo-insurance': renderHmoInsurance,
    authorization: renderAuthorization,
    'family-sponsors': renderFamily,
    wellipass: renderWelliPass,
    receivables: renderReceivables,
    reconciliation: renderReconciliation,
    settlements: renderSettlements,
    refunds: renderRefunds,
    financing: renderFinancing,
    'payment-plans': renderPaymentPlans,
    reports: renderReports,
    branches: renderBranches,
    staff: renderStaff,
    'audit-log': renderAuditLog,
    notifications: renderNotifications,
    'ai-insights': renderAiInsights,
    settings: renderSettings,
    'mobile-app': renderMobileIntegration
  };
  content.innerHTML = (views[state.active] || renderStub)();
  modalRoot.innerHTML = renderModal();
  content.focus({ preventScroll: true });

  if (state.active === 'dashboard' || state.active === 'reports') {
    setTimeout(() => initializeCharts(), 0);
  }
  
  if (state.modal && state.modal.type === 'wellipass') {
    setTimeout(() => initializeScanner(), 100);
  } else {
    stopScanner();
  }
}

let html5QrcodeScanner = null;

function initializeScanner() {
  if (window.Html5QrcodeScanner && !html5QrcodeScanner) {
    html5QrcodeScanner = new window.Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );
    html5QrcodeScanner.render(
      (decodedText) => {
        showToast('WelliPass Scanned', `Successfully read patient QR code: ${decodedText}`);
        stopScanner();
        document.querySelector('[data-action="scan-continue"]')?.click();
      },
      (error) => { /* ignore */ }
    );
  }
}

function stopScanner() {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear().catch(err => console.error("Failed to clear scanner", err));
    html5QrcodeScanner = null;
  }
}

/* Modals */
function renderModal() {
  if (!state.modal) return '';

  if (state.modal.type === 'match') {
    const item = state.unmatched.find(entry => entry.id === state.modal.id);
    if (!item) return '';
    return `<div class="modal-backdrop" data-action="dismiss-modal"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><h2 id="modal-title">Confirm match</h2><p>An unmatched payment of <strong>${money(item.amount)}</strong> via ${item.source} looks like it belongs to:</p><p class="patient-summary"><strong>${item.suggestion}</strong></p><div class="modal-actions"><button class="btn btn-secondary" data-action="reject-match">Not a match</button><button class="btn btn-primary" data-action="confirm-match">Confirm match</button></div></section></div>`;
  }

  if (state.modal.type === 'wellipass') {
    return `<div class="modal-backdrop" data-action="dismiss-modal">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="wellipass-head">
          <span class="eyebrow" style="color:white">WELLIPASS SCANNER</span>
          <strong id="modal-title">Patient Check-in</strong>
          <span>Point camera at the patient's WelliPass QR code</span>
        </div>
        <div id="qr-reader" style="width:100%; border-radius: 8px; overflow: hidden; margin: 16px 0; background: #000;"></div>
        <div class="modal-actions">
          <button class="btn btn-secondary" data-action="close-modal">Cancel</button>
          <button class="btn btn-primary" data-action="scan-continue">Simulate Scan (Demo)</button>
        </div>
      </section>
    </div>`;
  }

  if (state.modal.type === 'new-patient') {
    return `<div class="modal-backdrop" data-action="dismiss-modal">
      <section class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="new-pt-title">
        <h2 id="new-pt-title">Register New Patient</h2>
        <p>Register a patient profile, assign primary branch, and link HMO coverage or WelliPass.</p>
        <form id="new-patient-form" class="form-grid">
          <div class="form-grid two-col">
            <div class="form-group"><label>Full Name *</label><input class="input" name="name" required placeholder="e.g. Amina Bello"></div>
            <div class="form-group"><label>Phone Number *</label><input class="input" name="phone" required placeholder="e.g. +234 803 000 0000"></div>
          </div>
          <div class="form-grid two-col">
            <div class="form-group"><label>Primary Hospital Branch</label>
              <select name="branch">
                <option value="Wuse">Wuse</option><option value="Maitama">Maitama</option><option value="Garki">Garki</option><option value="Kaduna">Kaduna</option><option value="Lagos">Lagos</option>
              </select>
            </div>
            <div class="form-group"><label>Payment / Payer Type</label>
              <select name="payerType">
                <option value="HMO">HMO Insured</option><option value="Self-Pay">Self-Pay / Cash</option><option value="Family">Family Sponsored</option>
              </select>
            </div>
          </div>
          <div class="form-grid two-col">
            <div class="form-group"><label>HMO Provider (if applicable)</label>
              <select name="hmo">
                <option value="Reliance HMO — Gold">Reliance HMO — Gold</option>
                <option value="Hygeia HMO — Silver">Hygeia HMO — Silver</option>
                <option value="AXA Mansard — Bronze">AXA Mansard — Bronze</option>
                <option value="Leadway Health — Platinum">Leadway Health — Platinum</option>
                <option value="Self-Pay">None (Self-Pay)</option>
              </select>
            </div>
            <div class="form-group"><label>Issue WelliPass?</label>
              <select name="issuePass"><option value="yes">Yes — Generate WelliID & QR Pass</option><option value="no">No — Standard Physical File</option></select>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button>
            <button class="btn btn-primary" type="submit">Create Patient Profile</button>
          </div>
        </form>
      </section>
    </div>`;
  }

  if (state.modal.type === 'find-patient') {
    const list = state.patientList;
    return `<div class="modal-backdrop" data-action="dismiss-modal">
      <section class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="find-pt-title">
        <h2 id="find-pt-title">Find Patient for Hospital Desk</h2>
        <p>Select a patient to populate the front-desk cashier billing desk.</p>
        <div class="search-box" style="margin-bottom:12px;">
          <input class="input" id="find-pt-input" placeholder="Type name or WelliID to search…" style="width:100%;">
        </div>
        <div class="table-wrap" style="max-height:280px;overflow-y:auto;">
          <table class="table" id="find-pt-table">
            <thead><tr><th>Patient</th><th>WelliID</th><th>HMO Plan</th><th>Branch</th><th>Action</th></tr></thead>
            <tbody>
              ${list.map(p => `
                <tr>
                  <td><strong>${p.name}</strong></td>
                  <td>${p.id}</td>
                  <td>${p.hmo}</td>
                  <td>${p.branch}</td>
                  <td><button class="btn btn-primary" data-action="select-desk-patient" data-id="${p.id}" style="font-size:11px;padding:3px 7px;">Select</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" data-action="close-modal">Close</button>
          <button class="btn btn-ghost" data-action="open-new-patient">Register New Instead</button>
        </div>
      </section>
    </div>`;
  }

  if (state.modal.type === 'create-invoice') {
    return `<div class="modal-backdrop" data-action="dismiss-modal">
      <section class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="create-inv-title">
        <h2 id="create-inv-title">Create Digital Invoice</h2>
        <p>Generate an itemised invoice for facility charges.</p>
        <form id="create-invoice-form" class="form-grid">
          <div class="form-grid two-col">
            <div class="form-group"><label>Patient *</label>
              <select name="patientId" required>
                ${state.patientList.map(p => `<option value="${p.id}">${p.name} (${p.id} · ${p.branch})</option>`).join('')}
              </select>
            </div>
            <div class="form-group"><label>Branch</label>
              <select name="branch">
                <option value="Wuse">Wuse</option><option value="Maitama">Maitama</option><option value="Garki">Garki</option><option value="Kaduna">Kaduna</option><option value="Lagos">Lagos</option>
              </select>
            </div>
          </div>
          <div class="form-group"><label>Primary Service Item</label>
            <select name="serviceItem" id="inv-service-picker">
              ${state.servicesList.map(s => `<option value="${s.cash}" data-name="${s.name}">${s.name} — ${money(s.cash)}</option>`).join('')}
            </select>
          </div>
          <div class="form-grid two-col">
            <div class="form-group"><label>Additional Fee / Lab (Optional)</label>
              <input class="input" type="number" name="extraFee" placeholder="0" min="0">
            </div>
            <div class="form-group"><label>Payer Arrangement</label>
              <select name="payerDetail">
                <option value="Patient Direct Self-Pay">Patient Direct Self-Pay</option>
                <option value="HMO Insurance Copay Split">HMO Insurance Copay Split</option>
                <option value="Family Sponsor Request">Family Sponsor Request</option>
                <option value="Partner Financing">Partner Financing</option>
              </select>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button>
            <button class="btn btn-primary" type="submit">Publish & Issue Invoice</button>
          </div>
        </form>
      </section>
    </div>`;
  }

  if (state.modal.type === 'receipt') {
    const inv = state.modal.invoice || state.invoiceList[0];
    return `<div class="modal-backdrop" data-action="dismiss-modal">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="receipt-title">
        <div class="receipt-paper">
          <div class="receipt-header">
            <h3>ABC HEALTHCARE NIGERIA</h3>
            <p style="margin:2px 0;font-size:10px;">Consolidated Hospital Operations · Nigeria</p>
            <p style="margin:2px 0;font-size:10px;">Branch: ${inv.branch || 'Wuse'} · Tel: +234 9 291 0000</p>
          </div>
          <div class="receipt-row"><span>Receipt / Invoice:</span><strong>${inv.id}</strong></div>
          <div class="receipt-row"><span>Date:</span><span>${inv.date || 'Sep 27, 2026'}</span></div>
          <div class="receipt-row"><span>Patient:</span><strong>${inv.patient}</strong></div>
          <div class="receipt-row"><span>WelliID:</span><span>${inv.patientId || 'WR-1187-22'}</span></div>
          <div style="border-top:1px dashed #bbb;margin:8px 0;padding-top:6px;">
            ${(inv.items || [{ desc: 'General Consultation & Diagnostics', amt: inv.amount }]).map(it => `
              <div class="receipt-row"><span>${it.desc}</span><strong>${money(it.amt)}</strong></div>
            `).join('')}
          </div>
          <div class="receipt-total receipt-row">
            <span>TOTAL AMOUNT:</span>
            <span>${money(inv.amount)}</span>
          </div>
          <div class="receipt-row"><span>Paid to Date:</span><strong>${money(inv.paid)}</strong></div>
          <div class="receipt-row"><span>Balance Due:</span><strong style="color:var(--color-accent)">${money(inv.amount - inv.paid)}</strong></div>
          <div class="receipt-row" style="margin-top:6px;"><span>Payer:</span><span>${inv.payer || 'Patient / Sponsor'}</span></div>
          <div class="receipt-row"><span>Status:</span><span><strong>${inv.status}</strong></span></div>
          <p style="text-align:center;font-size:10px;margin-top:12px;color:#555;">Thank you for trusting ABC Healthcare.<br>Powered by WelliPay Provider SaaS</p>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" data-action="close-modal">Close</button>
          <button class="btn btn-primary" data-action="export-receipt-pdf">Download PDF Receipt</button>
          <button class="btn btn-secondary" onclick="window.print()">Print</button>
        </div>
      </section>
    </div>`;
  }

  if (state.modal.type === 'patient-profile') {
    const p = state.patientList.find(pt => pt.id === state.modal.id) || state.patientList[0];
    return `<div class="modal-backdrop" data-action="dismiss-modal">
      <section class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="pt-prof-title">
        <h2 id="pt-prof-title">${p.name}</h2>
        <p>Patient Profile & Healthcare Billing History</p>
        <div class="row-list" style="margin-bottom:14px;">
          <div class="data-row"><span>WelliID</span><strong>${p.id}</strong></div>
          <div class="data-row"><span>Phone</span><strong>${p.phone}</strong></div>
          <div class="data-row"><span>Registered Branch</span><strong>${p.branch}</strong></div>
          <div class="data-row"><span>HMO Plan</span><strong>${p.hmo} (${p.plan})</strong></div>
          <div class="data-row"><span>Outstanding Balance</span><strong style="color:${p.balance > 0 ? 'var(--color-accent)' : 'inherit'}">${money(p.balance)}</strong></div>
          <div class="data-row"><span>Linked Sponsors</span><strong>${p.sponsors.length ? p.sponsors.join(', ') : 'None configured'}</strong></div>
          <div class="data-row"><span>WelliPass Status</span>${tag(p.wellipass ? 'Active Digital Pass' : 'Not Issued', p.wellipass ? 'neutral' : 'outline')}</div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" data-action="close-modal">Close</button>
          <button class="btn btn-primary" data-action="bill-patient" data-id="${p.id}">Load into Hospital Desk</button>
        </div>
      </section>
    </div>`;
  }

  if (state.modal.type === 'add-service') {
    return `<div class="modal-backdrop" data-action="dismiss-modal">
      <section class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="add-srv-title">
        <h2 id="add-srv-title">Add Service & Set Contracted Tariffs</h2>
        <p>Define service code, baseline cash price and negotiated HMO reimbursement rates.</p>
        <form id="add-service-form" class="form-grid">
          <div class="form-grid two-col">
            <div class="form-group"><label>Service Name *</label><input class="input" name="name" required placeholder="e.g. Ultrasound Pelvis"></div>
            <div class="form-group"><label>Category *</label>
              <select name="cat">
                <option value="Diagnostics">Diagnostics</option><option value="Cardiology">Cardiology</option><option value="Consultation">Consultation</option><option value="Surgery">Surgery</option><option value="Lab">Lab</option><option value="Packages">Packages</option>
              </select>
            </div>
          </div>
          <div class="form-grid two-col">
            <div class="form-group"><label>Standard Cash Tariff (₦) *</label><input class="input" type="number" name="cash" required min="0" placeholder="25000"></div>
            <div class="form-group"><label>Reliance HMO Contracted Rate (₦)</label><input class="input" type="number" name="reliance" min="0" placeholder="21000"></div>
          </div>
          <div class="form-grid two-col">
            <div class="form-group"><label>Hygeia HMO Contracted Rate (₦)</label><input class="input" type="number" name="hygeia" min="0" placeholder="20000"></div>
            <div class="form-group"><label>AXA Mansard Contracted Rate (₦)</label><input class="input" type="number" name="axa" min="0" placeholder="21500"></div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button>
            <button class="btn btn-primary" type="submit">Save Service to Catalogue</button>
          </div>
        </form>
      </section>
    </div>`;
  }

  if (state.modal.type === 'request-refund') {
    return `<div class="modal-backdrop" data-action="dismiss-modal">
      <section class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="req-ref-title">
        <h2 id="req-ref-title">Initiate Payment Refund</h2>
        <p>Refunds above ${money(state.settings.threshold)} will automatically trigger a dual-approval rule.</p>
        <form id="request-refund-form" class="form-grid">
          <div class="form-group"><label>Select Invoice / Patient *</label>
            <select name="inv" required>
              ${state.invoiceList.filter(i=>i.paid>0).map(i => `<option value="${i.id}">${i.id} — ${i.patient} (Paid ${money(i.paid)})</option>`).join('')}
            </select>
          </div>
          <div class="form-grid two-col">
            <div class="form-group"><label>Refund Amount (₦) *</label><input class="input" type="number" name="amount" required min="1000" placeholder="45000"></div>
            <div class="form-group"><label>Reason for Refund *</label>
              <select name="reason">
                <option value="Duplicate payment swipe">Duplicate payment swipe</option>
                <option value="Cancelled clinical service">Cancelled clinical service</option>
                <option value="HMO retrospective approval">HMO retrospective approval</option>
                <option value="Billing discrepancy">Billing discrepancy</option>
              </select>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button>
            <button class="btn btn-primary" type="submit">Submit for Approval</button>
          </div>
        </form>
      </section>
    </div>`;
  }

  if (state.modal.type === 'invite-staff') {
    return `<div class="modal-backdrop" data-action="dismiss-modal">
      <section class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="inv-staff-title">
        <h2 id="inv-staff-title">Invite New Staff Member</h2>
        <p>Create credentials and grant role-based financial permissions.</p>
        <form id="invite-staff-form" class="form-grid">
          <div class="form-grid two-col">
            <div class="form-group"><label>Full Name *</label><input class="input" name="name" required placeholder="e.g. Samuel Okafor"></div>
            <div class="form-group"><label>Official Email *</label><input class="input" type="email" name="email" required placeholder="s.okafor@abchealth.ng"></div>
          </div>
          <div class="form-grid two-col">
            <div class="form-group"><label>Assigned Role *</label>
              <select name="role">
                <option value="Front-Desk Cashier">Front-Desk Cashier</option>
                <option value="Billing Officer">Billing Officer</option>
                <option value="Finance Manager">Finance Manager</option>
                <option value="Internal Auditor">Internal Auditor</option>
              </select>
            </div>
            <div class="form-group"><label>Assigned Branch *</label>
              <select name="branch">
                <option value="Wuse Branch">Wuse Branch</option><option value="Maitama Branch">Maitama Branch</option><option value="Garki Branch">Garki Branch</option><option value="Kaduna Branch">Kaduna Branch</option><option value="Lagos Branch">Lagos Branch</option><option value="Consolidated (All)">Consolidated (All)</option>
              </select>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button>
            <button class="btn btn-primary" type="submit">Send Invitation Link</button>
          </div>
        </form>
      </section>
    </div>`;
  }

  return '';
}

function ask(question) {
  const text=question.toLowerCase();
  let reply="I don't have that specific record yet — try asking about revenue, claims, reconciliation, or receivables.";
  if(text.includes('hmo')&&(text.includes('owe')||text.includes('most'))) reply='Reliance HMO owes the most: ₦1.2M across 34 unpaid claims, averaging 52 days outstanding. Hygeia owes ₦900,000.';
  else if(text.includes('unpaid')||text.includes('30 days')||text.includes('overdue')) reply='18 invoices are over 30 days old, totaling ₦610,000. Wuse branch accounts for about 40% of that balance.';
  else if(text.includes('reject')) reply='3 claims are flagged likely-to-reject: missing pre-authorization (2) and an HMO tariff mismatch (1).';
  else if(text.includes('reconcil')||text.includes('unmatched')) reply=`${state.unmatched.length} payments are unmatched right now, totaling ${money(state.unmatched.reduce((sum,item)=>sum+item.amount,0))} — mostly bank transfers missing an invoice reference.`;
  else if(text.includes('revenue')&&(text.includes('branch')||text.includes('lower')||text.includes('fall')||text.includes('why'))) reply='Kaduna branch revenue is down 12% this month, driven by fewer diagnostic bookings compared to last quarter.';
  else if(text.includes('leak')) reply='Estimated leakage this month: ₦185,000, mostly from completed services performed without a matching invoice at Maitama.';
  else if(text.includes('highest')||text.includes('best')||(text.includes('service')&&text.includes('revenue'))) reply='Executive Wellness checkup packages (₦250k) and MRI Scans (₦180k) generate the highest revenue per procedure this quarter.';
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
  logAudit(`Pre-Auth ${next}`, `${item.service} for ${item.patient} (${item.hmo})`);
  showToast(`Pre-Authorization ${next}`, `${item.service} — ${item.patient}`);
}

function updateClaim(id, status) {
  const item = state.claims.find(entry => entry.id === id);
  if (item) {
    item.status = status;
    item.reason = '';
    logAudit(`Claim ${status}`, `${item.ref} · ${item.hmo} (${money(item.amount)})`);
    showToast(`Claim ${status}`, `${item.ref} updated.`);
  }
  render();
}

function resetPayment(clearSponsor=true) {
  state.payment='idle';
  state.authStage='idle';
  state.hmoAmount=0;
  state.patientAmount=0;
  state.consent=false;
  if(clearSponsor) state.sponsor='';
}

function dispatch(action, target, domEvent) {
  const id = Number(target.dataset.id) || target.dataset.id;
  switch(action) {
    case 'toggle-menu': document.querySelector('#sidebar').classList.add('is-open');document.querySelector('#scrim').classList.add('is-open');break;
    case 'close-menu': document.querySelector('#sidebar').classList.remove('is-open');document.querySelector('#scrim').classList.remove('is-open');break;
    case 'reset-branch': state.branch='All branches';render();break;

    /* Reconciliation */
    case 'open-match': state.modal={type:'match',id:Number(id)};render();break;
    case 'confirm-match': {
      state.unmatched=state.unmatched.filter(item=>item.id!==state.modal.id);
      state.matched++;
      state.modal=null;
      logAudit('Reconciliation Match', `Matched item #${id}`);
      showToast('Payment Matched', 'Payment reconciled to customer invoice.');
      render();
      break;
    }
    case 'reject-match': {
      state.exceptions++;
      state.modal=null;
      logAudit('Reconciliation Exception', `Item #${id} flagged as non-matching`);
      showToast('Exception Flagged', 'Item remains unmatched and logged in exceptions.');
      render();
      break;
    }
    case 'dismiss-modal': if(target===domEvent?.target){state.modal=null;render();}break;
    case 'close-modal': state.modal=null;render();break;

    /* Dashboard Approvals */
    case 'approval': {
      const numId = Number(id);
      const index=state.approvals.findIndex(item=>item.id===numId);
      if(index!==-1){
        const [item]=state.approvals.splice(index,1);
        const decision = target.dataset.decision;
        state.approvalHistory.unshift({...item,decision,actor:'Adaeze O.',time:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})});
        logAudit(`Approval: ${decision}`, `${item.type} of ${money(item.amount)} for ${item.requester}`);
        showToast(`${item.type} ${decision}`, `${money(item.amount)} decision recorded.`);
      }
      render();
      break;
    }
    case 'ask-suggestion': ask(target.dataset.text);break;

    /* WelliPass & Desk */
    case 'open-wellipass': state.modal={type:'wellipass'};render();break;
    case 'scan-continue': {
      state.modal=null;
      state.patient={name:'Ngozi Adeleke',welliId:'WR-2291-04',hmo:'Reliance HMO — Gold'};
      state.payer='patient';
      resetPayment(false);
      state.active='hospital-desk';
      location.hash=state.active;
      logAudit('WelliPass Scanned', 'Ngozi Adeleke (WR-2291-04) checked in at desk');
      showToast('WelliPass Verified', 'Ngozi Adeleke loaded into Cashier Desk');
      render();
      break;
    }
    case 'open-find-patient': state.modal={type:'find-patient'};render();break;
    case 'select-desk-patient': {
      const pt = state.patientList.find(p => p.id === id);
      if (pt) {
        state.patient = { name: pt.name, welliId: pt.id, hmo: `${pt.hmo} — ${pt.plan}` };
        state.payer = pt.hmo === 'Self-Pay' ? 'patient' : 'hmo';
        resetPayment(false);
        state.modal = null;
        logAudit('Patient Loaded', `${pt.name} selected at Hospital Desk`);
        showToast('Patient Selected', `${pt.name} loaded into Cashier Desk`);
        render();
      }
      break;
    }
    case 'open-new-patient': state.modal={type:'new-patient'};render();break;
    case 'bill-patient': {
      const pt = state.patientList.find(p => p.id === id);
      if (pt) {
        state.patient = { name: pt.name, welliId: pt.id, hmo: `${pt.hmo} — ${pt.plan}` };
        state.payer = pt.hmo === 'Self-Pay' ? 'patient' : 'hmo';
        resetPayment(false);
        state.modal = null;
        state.active = 'hospital-desk';
        location.hash = 'hospital-desk';
        logAudit('Patient Billed', `${pt.name} transferred to Hospital Desk`);
        showToast('Desk Loaded', `${pt.name} ready for billing`);
        render();
      }
      break;
    }
    case 'view-patient': state.modal={type:'patient-profile', id};render();break;
    case 'view-desk-receipt': {
      const deskInv = { id: 'RCT-' + Math.floor(1000 + Math.random() * 9000), patient: state.patient.name, patientId: state.patient.welliId, branch: state.branch === 'All branches' ? 'Wuse' : state.branch, amount: 58000, paid: 58000, status: 'Paid in Full', date: 'Sep 27, 2026', payer: state.payer === 'hmo' ? `HMO 80% (₦46,400) · Patient (₦11,600)` : `Paid via ${state.payer}` };
      state.modal = { type: 'receipt', invoice: deskInv };
      render();
      break;
    }

    /* Desk flow actions */
    case 'choose-sponsor': state.sponsor=target.dataset.name;render();break;
    case 'family-request': state.payment='pending';showToast('Payment Request Sent', `Request dispatched to ${state.sponsor} via WelliPay`);render();break;
    case 'family-paid': state.payment='paid';logAudit('Family Contribution Paid', `${money(58000)} paid by ${state.sponsor}`);showToast('Payment Received', `Paid by ${state.sponsor}`);render();break;
    case 'reset-payment': resetPayment();render();break;
    case 'receive-payment': state.payment='paid';logAudit('Payment Collected', `Cashier desk collected ₦58,000 for ${state.patient.name}`);showToast('Payment Collected', 'Receipt generated successfully.');render();break;
    case 'request-auth': state.authStage='pending';state.authCounts.Submitted++;logAudit('Pre-Auth Submitted', `Hospital Desk requested authorization for ${state.patient.name}`);showToast('Pre-Auth Requested', 'Submitted to HMO clearing portal.');render();break;
    case 'approve-hmo': state.authStage='approved';state.authCounts.Submitted=Math.max(0,state.authCounts.Submitted-1);state.authCounts.Approved++;state.hmoAmount=46400;state.patientAmount=11600;logAudit('HMO Approved Pre-Auth', 'Reliance HMO approved 80% split (₦46,400)');showToast('HMO Approved', '80/20 copay split calculated');render();break;
    case 'consent': state.consent=true;logAudit('Financial Consent Signed', `Patient ${state.patient.name} approved copay estimate`);showToast('Consent Recorded', 'Patient authorized ₦11,600 copay responsibility');render();break;

    /* Pre-Auth & Claims */
    case 'toggle-auth': state.selectedAuth=state.selectedAuth===Number(id)?null:Number(id);render();break;
    case 'submit-auth': { const item=state.authItems.find(entry=>entry.id===Number(id));if(item)updateAuthCounts(item,'Submitted');render();break; }
    case 'approve-auth': { const item=state.authItems.find(entry=>entry.id===Number(id));if(item)updateAuthCounts(item,'Approved');render();break; }
    case 'claim-submit': updateClaim(Number(id),'Submitted');break;
    case 'claim-approve': updateClaim(Number(id),'Approved');break;
    case 'claim-reject': {
      const item=state.claims.find(entry=>entry.id===Number(id));
      if (item) {
        item.status='Rejected';
        item.reason='Tariff mismatch — requested amount exceeds contracted tariff.';
        logAudit('Claim Rejected', `${item.ref} rejected by ${item.hmo}`);
        showToast('Claim Rejected', 'Reason: Tariff mismatch');
        render();
      }
      break;
    }
    case 'claim-resubmit': {
      const item=state.claims.find(entry=>entry.id===Number(id));
      if (item) {
        item.status='Submitted';
        item.reason='';
        logAudit('Claim Resubmitted', `${item.ref} corrected and resubmitted`);
        showToast('Claim Resubmitted', 'Sent to clearing house');
        render();
      }
      break;
    }
    case 'contribute': {
      const item=state.family.find(entry=>entry.name===target.dataset.name);
      if(item){
        item.paid=true;
        logAudit('Family Pool Payment', `${item.name} contributed ${money(item.amount)}`);
        showToast('Contribution Received', `${item.name} paid ${money(item.amount)}`);
        render();
      }
      break;
    }

    /* Invoices */
    case 'open-create-invoice': state.modal={type:'create-invoice'};render();break;
    case 'filter-invoices': state.invoiceFilter=target.dataset.filter;render();break;
    case 'search-invoices': state.invoiceSearch=target.value;render();break;
    case 'view-invoice-modal': {
      const inv = state.invoiceList.find(i=>i.id===id);
      if (inv) { state.modal = { type: 'receipt', invoice: inv }; render(); }
      break;
    }
    case 'send-invoice-sms': {
      showToast('SMS Dispatched', `Digital payment link sent via Termii SMS gateway`);
      logAudit('SMS Link Sent', `Invoice ${id} payment link sent to patient`);
      break;
    }

    /* Patients */
    case 'filter-patients': state.patientFilter=target.dataset.filter;render();break;
    case 'search-patients': state.patientSearch=target.value;render();break;

    /* Payments */
    case 'filter-payments': state.paymentFilter=target.dataset.filter;render();break;
    case 'view-payment-receipt': {
      const p = state.paymentList.find(item=>item.id===id);
      if (p) {
        state.modal = { type: 'receipt', invoice: { id: p.id, patient: p.patient, patientId: 'Patient Ref', branch: p.branch, amount: p.amount, paid: p.amount, status: 'Payment Successful', date: 'Sep 27, 2026', payer: p.channel, items: [{ desc: `Settlement for Invoice ${p.inv}`, amt: p.amount }] } };
        render();
      }
      break;
    }

    /* Services & Pricing */
    case 'filter-services': state.serviceFilter=target.dataset.filter;render();break;
    case 'search-services': state.serviceSearch=target.value;render();break;
    case 'open-add-service': state.modal={type:'add-service'};render();break;

    /* Refunds */
    case 'open-request-refund': state.modal={type:'request-refund'};render();break;
    case 'approve-refund-item': {
      const r = state.refundList.find(rf => rf.id === id);
      if (r) {
        r.status = 'Approved';
        logAudit('Refund Approved', `${r.id} for ${r.patient} (${money(r.amount)})`);
        showToast('Refund Approved', `${r.id} scheduled for bank reversal.`);
        render();
      }
      break;
    }
    case 'reject-refund-item': {
      const r = state.refundList.find(rf => rf.id === id);
      if (r) {
        r.status = 'Rejected';
        logAudit('Refund Rejected', `${r.id} rejected by Finance Manager`);
        showToast('Refund Rejected', `${r.id} removed from payout queue.`);
        render();
      }
      break;
    }

    /* Payment Plans */
    case 'remind-plan-sms': {
      showToast('SMS Reminder Sent', `Installment notice sent to patient phone`);
      logAudit('Installment Reminder', `Sent SMS for Plan ${id}`);
      break;
    }

    /* Branches */
    case 'switch-branch-quick': {
      state.branch = target.dataset.name;
      logAudit('Branch Switched', `Console filtered to ${state.branch}`);
      showToast(`Branch: ${state.branch}`, 'Active data context updated');
      render();
      break;
    }

    /* Staff */
    case 'open-invite-staff': state.modal={type:'invite-staff'};render();break;

    /* Notifications */
    case 'mark-all-read': {
      state.notificationsList.forEach(n => n.read = true);
      showToast('Inbox Cleared', 'All notifications marked as read.');
      render();
      break;
    }

    /* AI Insights */
    case 'investigate-ai': {
      showToast('AI Audit Run', `Diagnostic report generated for ${target.dataset.topic}`);
      break;
    }

    /* CSV Exports */
    case 'export-patients': {
      downloadCsv('patients_ledger_abc_healthcare.csv', [
        ['WelliID', 'Name', 'Phone', 'Branch', 'HMO', 'Plan', 'Balance Due', 'Status'],
        ...state.patientList.map(p => [p.id, p.name, p.phone, p.branch, p.hmo, p.plan, p.balance, p.status])
      ]);
      break;
    }
    case 'export-invoices': {
      downloadCsv('invoices_ledger_abc_healthcare.csv', [
        ['Invoice #', 'Patient', 'Patient ID', 'Branch', 'Amount', 'Paid', 'Due', 'Status', 'Date'],
        ...state.invoiceList.map(i => [i.id, i.patient, i.patientId, i.branch, i.amount, i.paid, i.amount - i.paid, i.status, i.date])
      ]);
      break;
    }
    case 'export-payments': {
      downloadCsv('payments_journal_abc_healthcare.csv', [
        ['Tx ID', 'Reference', 'Channel', 'Patient', 'Invoice', 'Amount', 'Time', 'Branch', 'Status'],
        ...state.paymentList.map(p => [p.id, p.ref, p.channel, p.patient, p.inv, p.amount, p.time, p.branch, p.status])
      ]);
      break;
    }
    case 'export-receivables': {
      downloadCsv('receivables_ageing_report.csv', [
        ['Payer', '0-30 Days', '31-60 Days', '61-90 Days', '90+ Days'],
        ['Patient', 200000, 120000, 80000, 50000],
        ['HMO', 1200000, 900000, 700000, 400000],
        ['Insurance', 350000, 250000, 150000, 50000],
        ['Corporate', 120000, 80000, 30000, 20000],
        ['Financing', 200000, 120000, 60000, 20000]
      ]);
      break;
    }
    case 'export-settlements': {
      downloadCsv('branch_settlements_statement.csv', [
        ['Branch', 'Settled Amount', 'Pending Amount'],
        ['Wuse', 1240000, 120000],
        ['Garki', 780000, 0],
        ['Maitama', 1650000, 210000],
        ['Kaduna', 310000, 60000],
        ['Lagos', 420000, 60000]
      ]);
      break;
    }
    case 'export-revenue-report': {
      downloadCsv('monthly_revenue_report_sep2026.csv', [
        ['Branch', 'Self-Pay Revenue', 'HMO Revenue', 'Financing', 'Total Collected'],
        ['Wuse', 2100000, 2800000, 300000, 5200000],
        ['Garki', 1200000, 1800000, 400000, 3400000],
        ['Maitama', 2900000, 3700000, 500000, 7100000],
        ['Kaduna', 600000, 750000, 100000, 1450000],
        ['Lagos', 900000, 1050000, 150000, 2100000]
      ]);
      break;
    }
    case 'export-claims-report': {
      downloadCsv('hmo_claims_scrubbing_report.csv', [
        ['Claim ID', 'HMO', 'Amount', 'Status', 'Readiness %', 'Issues Flagged'],
        ['CLM-5544', 'Reliance HMO', 180000, 'Draft', '87%', 'Missing pre-auth ref'],
        ['CLM-5545', 'Hygeia HMO', 500000, 'Submitted', '62%', 'Tariff mismatch; Expired eligibility'],
        ['CLM-5546', 'AXA Mansard', 120000, 'Submitted', '95%', 'None — Ready to settle']
      ]);
      break;
    }
    case 'export-recon-report': {
      downloadCsv('branch_reconciliation_statement.csv', [
        ['Invoice Ref', 'Amount', 'Reconciliation Mode', 'Status', 'Timestamp'],
        ['INV-2040', 45000, 'Auto reference match', 'Matched', '09:02'],
        ['INV-2041', 18000, 'Manual match by Adaeze O.', 'Matched', '08:47'],
        ['INV-2039', 120000, 'Auto reference match', 'Matched', '08:30']
      ]);
      break;
    }
    case 'export-leakage-report': {
      downloadCsv('revenue_leakage_audit.csv', [
        ['Branch', 'Detected Leakage', 'Root Cause Diagnosis', 'Recommended Provider Action'],
        ['Maitama', '₦185,000', '14 completed services without invoice created', 'Automate clinical order auto-billing'],
        ['Wuse', '₦62,000', '3 HMO-eligible services billed as self-pay', 'Enforce WelliPass eligibility check at desk'],
        ['Garki', '₦41,000', 'Duplicate discount applied on 6 bills', 'Restrict discount override permission']
      ]);
      break;
    }

    /* PDF Exports */
    case 'export-receipt-pdf': {
      const element = document.querySelector('.receipt-paper');
      if (element && window.html2pdf) {
        showToast('Exporting PDF...', 'Generating receipt document.');
        const opt = {
          margin: 10,
          filename: `Receipt_${state.modal.invoice ? state.modal.invoice.id : Date.now()}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        window.html2pdf().set(opt).from(element).save().then(() => {
          logAudit('Receipt Exported', 'PDF receipt generated and downloaded');
        });
      } else {
         window.print();
      }
      break;
    }
    case 'export-invoices-pdf':
    case 'export-revenue-report-pdf':
    case 'export-claims-report-pdf':
    case 'export-recon-report-pdf':
    case 'export-leakage-report-pdf': {
      // Export the current page content as PDF
      const element = document.querySelector('.content');
      if (element && window.html2pdf) {
        showToast('Exporting PDF...', 'Generating report document.');
        const opt = {
          margin: 10,
          filename: `${action.replace('-pdf', '')}_${Date.now()}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        window.html2pdf().set(opt).from(element).save().then(() => {
          logAudit('Report Exported', `PDF document ${opt.filename} generated`);
        });
      }
      break;
    }

    /* Settings & Integrations */
    case 'toggle-setting': state.settings.secondApproval=!state.settings.secondApproval;logAudit('Settings Changed', `Second approval on bank details set to ${state.settings.secondApproval}`);render();break;
    case 'sync-mobile': state.mobileApp.lastSync='Just now';state.mobileApp.syncCount+=12;state.mobileApp.notice='Demo sync complete. 12 sample records exchanged.';showToast('Data Synced', '12 records synchronized with Patient App');render();break;
    case 'test-mobile-connection': state.mobileApp.notice='Connection test passed in sandbox.';showToast('Connection Verified', 'Gateway ping: 200 OK (38ms)');render();break;
    case 'simulate-mobile-event': state.mobileApp.events.unshift(['Just now','bill.viewed','WR-2291-04 · Sample event']);state.mobileApp.notice='Sample event received from the patient app.';showToast('Inbound Event', 'bill.viewed received from Ngozi A.');render();break;
    case 'verify-hmo-eligibility': {
      showToast('Eligibility Query Sent', `Checked active status for ${target.dataset.hmo}`);
      break;
    }
  }
}

/* Event listeners */
document.addEventListener('click', event => {
  const target = event.target.closest('[data-action]');
  if (target) { dispatch(target.dataset.action, target, event); return; }
  if (event.target.closest('.nav-link')) dispatch('close-menu', event.target);
});

document.addEventListener('input', event => {
  if (event.target.id === 'refund-threshold') {
    state.settings.threshold = Math.max(0, Number(event.target.value) || 0);
  }
  if (event.target.dataset.action === 'search-patients') {
    state.patientSearch = event.target.value;
    render();
  }
  if (event.target.dataset.action === 'search-invoices') {
    state.invoiceSearch = event.target.value;
    render();
  }
  if (event.target.dataset.action === 'search-services') {
    state.serviceSearch = event.target.value;
    render();
  }
  if (event.target.id === 'find-pt-input') {
    const term = event.target.value.toLowerCase();
    const rows = document.querySelectorAll('#find-pt-table tbody tr');
    rows.forEach(tr => {
      const text = tr.textContent.toLowerCase();
      tr.style.display = text.includes(term) ? '' : 'none';
    });
  }
});

document.addEventListener('change', event => {
  if (event.target.name === 'filter') { state.filter = event.target.value; render(); }
  if (event.target.name === 'payer') { state.payer = event.target.value; resetPayment(); render(); }
  if (event.target.id === 'refund-threshold') { state.settings.threshold = Math.max(0, Number(event.target.value) || 0); }
  if (event.target.id === 'branch-select') {
    state.branch = event.target.value;
    logAudit('Branch Filter Changed', `Console scoped to ${state.branch}`);
    showToast(`Branch Filter: ${state.branch}`, 'Active view updated');
    render();
  }
  if (event.target.dataset.mobileFeature) {
    state.mobileApp.features[event.target.dataset.mobileFeature] = event.target.checked;
    logAudit('Feature Flag Toggled', `${event.target.dataset.mobileFeature} set to ${event.target.checked}`);
  }
});

document.addEventListener('submit', event => {
  if (event.target.id === 'chat-form') {
    event.preventDefault();
    const question = new FormData(event.target).get('question')?.toString().trim();
    if (question) ask(question);
  }
  if (event.target.id === 'new-patient-form') {
    event.preventDefault();
    const fd = new FormData(event.target);
    const newPt = {
      id: 'WR-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(10 + Math.random() * 90),
      name: fd.get('name').toString(),
      phone: fd.get('phone').toString(),
      branch: fd.get('branch').toString(),
      hmo: fd.get('hmo').toString().split(' — ')[0],
      plan: fd.get('hmo').toString().split(' — ')[1] || 'Standard',
      balance: 0,
      status: 'Active',
      wellipass: fd.get('issuePass') === 'yes',
      sponsors: fd.get('payerType') === 'Family' ? ['Family Sponsor'] : [],
      lastVisit: 'Today'
    };
    state.patientList.unshift(newPt);
    state.patient = { name: newPt.name, welliId: newPt.id, hmo: `${newPt.hmo} — ${newPt.plan}` };
    state.payer = newPt.hmo === 'Self-Pay' ? 'patient' : 'hmo';
    resetPayment(false);
    state.modal = null;
    logAudit('Patient Registered', `${newPt.name} (${newPt.id}) enrolled in ${newPt.branch}`);
    showToast('Patient Registered', `${newPt.name} enrolled and loaded into Hospital Desk.`);
    render();
  }
  if (event.target.id === 'create-invoice-form') {
    event.preventDefault();
    const fd = new FormData(event.target);
    const pt = state.patientList.find(p => p.id === fd.get('patientId')) || state.patientList[0];
    const srvSelect = document.querySelector('#inv-service-picker');
    const srvName = srvSelect.selectedOptions[0]?.dataset.name || 'Clinical Care';
    const srvAmt = Number(fd.get('serviceItem')) || 25000;
    const extra = Number(fd.get('extraFee')) || 0;
    const totalAmt = srvAmt + extra;
    const newInv = {
      id: 'INV-' + Math.floor(2100 + Math.random() * 900),
      patient: pt.name,
      patientId: pt.id,
      branch: fd.get('branch').toString(),
      amount: totalAmt,
      paid: 0,
      status: 'Unpaid',
      date: new Date().toISOString().slice(0, 10),
      items: [{ desc: srvName, amt: srvAmt }, ...(extra ? [{ desc: 'Supplemental Diagnostics / Labs', amt: extra }] : [])],
      payer: fd.get('payerDetail').toString()
    };
    state.invoiceList.unshift(newInv);
    state.modal = null;
    logAudit('Invoice Created', `${newInv.id} for ${newInv.patient} (${money(totalAmt)})`);
    showToast('Invoice Published', `${newInv.id} created for ${newInv.patient}`);
    render();
  }
  if (event.target.id === 'add-service-form') {
    event.preventDefault();
    const fd = new FormData(event.target);
    const newSrv = {
      id: 'SRV-' + Math.floor(10 + Math.random() * 90),
      name: fd.get('name').toString(),
      cat: fd.get('cat').toString(),
      cash: Number(fd.get('cash')) || 20000,
      reliance: Number(fd.get('reliance')) || (Number(fd.get('cash')) * 0.85),
      hygeia: Number(fd.get('hygeia')) || (Number(fd.get('cash')) * 0.82),
      axa: Number(fd.get('axa')) || (Number(fd.get('cash')) * 0.86)
    };
    state.servicesList.unshift(newSrv);
    state.modal = null;
    logAudit('Service Added', `${newSrv.name} (${money(newSrv.cash)}) added to catalogue`);
    showToast('Service Saved', `${newSrv.name} added to service master.`);
    render();
  }
  if (event.target.id === 'request-refund-form') {
    event.preventDefault();
    const fd = new FormData(event.target);
    const invId = fd.get('inv').toString();
    const inv = state.invoiceList.find(i => i.id === invId) || state.invoiceList[0];
    const amt = Number(fd.get('amount')) || 10000;
    const isDual = amt > state.settings.threshold;
    const newRef = {
      id: 'REF-' + Math.floor(890 + Math.random() * 99),
      inv: inv.id,
      patient: inv.patient,
      amount: amt,
      requester: 'Adaeze O. (Finance Manager)',
      reason: fd.get('reason').toString(),
      date: 'Today, Just now',
      status: isDual ? 'Pending Director Approval' : 'Pending FM Approval',
      dualApproval: isDual
    };
    state.refundList.unshift(newRef);
    state.approvals.unshift({ id: Date.now(), type: 'Refund', amount: amt, requester: 'Adaeze O. (FM)', reason: newRef.reason });
    state.modal = null;
    logAudit('Refund Requested', `${newRef.id} for ${money(amt)} (${newRef.reason})`);
    showToast('Refund Queued', `${newRef.id} submitted for approval.`);
    render();
  }
  if (event.target.id === 'invite-staff-form') {
    event.preventDefault();
    const fd = new FormData(event.target);
    const newMember = {
      name: fd.get('name').toString(),
      role: fd.get('role').toString(),
      branch: fd.get('branch').toString(),
      email: fd.get('email').toString(),
      status: 'Active',
      lastActive: 'Just invited'
    };
    state.staffList.unshift(newMember);
    state.modal = null;
    logAudit('Staff Invited', `${newMember.name} invited as ${newMember.role}`);
    showToast('Staff Invited', `Credentials link emailed to ${newMember.email}`);
    render();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && state.modal) { state.modal = null; render(); }
  if (event.key === 'Escape') dispatch('close-menu', document.querySelector('#scrim'));
});

window.addEventListener('hashchange', () => {
  state.active = location.hash.slice(1) || 'dashboard';
  render();
  dispatch('close-menu', document.querySelector('#scrim'));
});

render();