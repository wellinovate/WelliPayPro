import sys

with open('app.js', 'r', encoding='utf-8') as f:
    src = f.read()

def do(old, new, label):
    global src
    n = src.count(old)
    if n != 1:
        print(f"FAIL [{label}]: found {n} occurrences (expected 1)")
        sys.exit(1)
    src = src.replace(old, new)
    print(f"OK [{label}]")

do(
"const groups = [",
"""import { wellipayApi, toMinor } from './api.js';

const groups = [""",
"1-import"
)

do(
"""  hmoAmount: 0,
  patientAmount: 0,
  consent: false,
  patient: { name: 'Femi O.', welliId: 'WR-1187-22', hmo: 'Reliance HMO — Gold' },""",
"""  hmoAmount: 0,
  patientAmount: 0,
  consent: false,
  // Real backend record IDs created via the API during this session's demo
  // flows (null until the corresponding API call succeeds). Kept separate
  // from the mock arrays above so a failed API call never corrupts the demo.
  deskInvoiceId: null,
  familyInvoiceId: null,
  familyRequestId: null,
  patient: { name: 'Femi O.', welliId: 'WR-1187-22', hmo: 'Reliance HMO — Gold' },""",
"2-state-fields"
)

do(
"""function resetPayment(clearSponsor=true) {""",
'''/* --- Live API wiring -----------------------------------------------------
 * These flows call the real wellipay-api backend. They run "fire and
 * forget" from inside `dispatch` (the UI already reflects the outcome
 * optimistically, same as the rest of this demo) and report success or
 * failure via a toast, so a network/API problem is visible without
 * blocking the click. `receive-payment`, `approve-hmo` and the incremental
 * "sponsor pays" step stay purely local: the backend has no endpoints yet
 * for collecting payment against an invoice or for per-sponsor settlement,
 * only for creating the funding request itself.
 * ------------------------------------------------------------------------- */

async function ensureDeskInvoice() {
  if (state.deskInvoiceId) return state.deskInvoiceId;
  const created = await wellipayApi.createInvoice({
    providerInvoiceRef: `DESK-${state.patient.welliId}-${Date.now()}`,
    facilityRef: state.branch === 'All branches' ? 'facility-wuse' : `facility-${state.branch.toLowerCase()}`,
    patientRef: state.patient.welliId,
    description: 'Consultation + ECG + Full Blood Count',
    amountMinor: toMinor(58000),
    currency: 'NGN',
  });
  state.deskInvoiceId = created.invoiceId;
  return created.invoiceId;
}

async function syncDeskEligibilityCheck() {
  try {
    await ensureDeskInvoice();
    await wellipayApi.createEligibilityCheck({
      providerRequestRef: `DESK-ELIG-${Date.now()}`,
      facilityRef: state.branch === 'All branches' ? 'facility-wuse' : `facility-${state.branch.toLowerCase()}`,
      patientRef: state.patient.welliId,
      payerRef: state.patient.hmo.split(' — ')[0],
      serviceCodes: ['CONSULT-GEN', 'ECG', 'LAB-FBC'],
      requestedAt: new Date().toISOString(),
      amount: { amountMinor: toMinor(58000), currency: 'NGN' },
    });
    showToast('Synced to WelliPay API', 'Eligibility check recorded on the server.');
  } catch (err) {
    showToast('API Sync Failed', `Eligibility check not recorded: ${err.message}`);
  }
}

async function syncDeskConsent() {
  try {
    const invoiceId = await ensureDeskInvoice();
    await wellipayApi.createFinancialConsent({
      providerConsentRef: `DESK-CONSENT-${Date.now()}`,
      facilityRef: state.branch === 'All branches' ? 'facility-wuse' : `facility-${state.branch.toLowerCase()}`,
      patientRef: state.patient.welliId,
      invoiceId,
      estimateRevision: 'rev-1',
      policyVersion: 'policy-v1',
      acceptedAt: new Date().toISOString(),
      payerSplit: [
        { payerType: 'HMO', amountMinor: toMinor(state.hmoAmount), currency: 'NGN' },
        { payerType: 'PATIENT', amountMinor: toMinor(state.patientAmount), currency: 'NGN' },
      ],
    });
    showToast('Synced to WelliPay API', 'Financial consent recorded on the server.');
  } catch (err) {
    showToast('API Sync Failed', `Consent not recorded: ${err.message}`);
  }
}

async function syncAuthItemEligibilityCheck(item) {
  try {
    await wellipayApi.createEligibilityCheck({
      providerRequestRef: `AUTH-${item.id}-${Date.now()}`,
      facilityRef: 'facility-wuse',
      patientRef: item.patient.replace(/\s+/g, '-').toLowerCase(),
      payerRef: item.hmo,
      serviceCodes: [item.service.replace(/\s+/g, '-').toUpperCase()],
      requestedAt: new Date().toISOString(),
      amount: { amountMinor: toMinor(item.amount), currency: 'NGN' },
    });
    showToast('Synced to WelliPay API', `Eligibility check recorded for ${item.patient}.`);
  } catch (err) {
    showToast('API Sync Failed', `Not recorded: ${err.message}`);
  }
}

async function syncFamilyFundingRequest() {
  try {
    if (!state.familyInvoiceId) {
      const invoice = await wellipayApi.createInvoice({
        providerInvoiceRef: `FAMILY-CHIDI-${Date.now()}`,
        facilityRef: 'facility-maitama',
        patientRef: 'WR-4412-88',
        description: 'Dialysis Cycle & Nephrology Care Plan',
        amountMinor: toMinor(1000000),
        currency: 'NGN',
      });
      state.familyInvoiceId = invoice.invoiceId;
    }
    if (!state.familyRequestId) {
      const request = await wellipayApi.createFamilyFundingRequest({
        providerRequestRef: `FUND-CHIDI-${Date.now()}`,
        invoiceId: state.familyInvoiceId,
        patientRef: 'WR-4412-88',
        facilityRef: 'facility-maitama',
        currency: 'NGN',
        contributions: state.family.map((sponsor) => ({
          sponsorRef: sponsor.name,
          amountMinor: toMinor(sponsor.amount),
        })),
      });
      state.familyRequestId = request.requestId;
      showToast('Synced to WelliPay API', 'Family funding request recorded on the server.');
    }
  } catch (err) {
    showToast('API Sync Failed', `Funding request not recorded: ${err.message}`);
  }
}

function resetPayment(clearSponsor=true) {''',
"3-helpers"
)

do(
"""    case 'request-auth': state.authStage='pending';state.authCounts.Submitted++;logAudit('Pre-Auth Submitted', `Hospital Desk requested authorization for ${state.patient.name}`);showToast('Pre-Auth Requested', 'Submitted to HMO clearing portal.');render();break;
    case 'approve-hmo': state.authStage='approved';state.authCounts.Submitted=Math.max(0,state.authCounts.Submitted-1);state.authCounts.Approved++;state.hmoAmount=46400;state.patientAmount=11600;logAudit('HMO Approved Pre-Auth', 'Reliance HMO approved 80% split (₦46,400)');showToast('HMO Approved', '80/20 copay split calculated');render();break;
    case 'consent': state.consent=true;logAudit('Financial Consent Signed', `Patient ${state.patient.name} approved copay estimate`);showToast('Consent Recorded', 'Patient authorized ₦11,600 copay responsibility');render();break;""",
"""    case 'request-auth': state.authStage='pending';state.authCounts.Submitted++;logAudit('Pre-Auth Submitted', `Hospital Desk requested authorization for ${state.patient.name}`);showToast('Pre-Auth Requested', 'Submitted to HMO clearing portal.');render();syncDeskEligibilityCheck();break;
    // No real payer adapter is wired up yet (the eligibility-checks endpoint
    // always comes back PENDING) — the HMO's decision itself stays a local
    // simulation until that adapter exists.
    case 'approve-hmo': state.authStage='approved';state.authCounts.Submitted=Math.max(0,state.authCounts.Submitted-1);state.authCounts.Approved++;state.hmoAmount=46400;state.patientAmount=11600;logAudit('HMO Approved Pre-Auth', 'Reliance HMO approved 80% split (₦46,400)');showToast('HMO Approved', '80/20 copay split calculated');render();break;
    case 'consent': state.consent=true;logAudit('Financial Consent Signed', `Patient ${state.patient.name} approved copay estimate`);showToast('Consent Recorded', 'Patient authorized ₦11,600 copay responsibility');render();syncDeskConsent();break;""",
"4-desk-cases"
)

do(
"""    case 'submit-auth': { const item=state.authItems.find(entry=>entry.id===Number(id));if(item)updateAuthCounts(item,'Submitted');render();break; }""",
"""    case 'submit-auth': { const item=state.authItems.find(entry=>entry.id===Number(id));if(item){updateAuthCounts(item,'Submitted');syncAuthItemEligibilityCheck(item);}render();break; }""",
"5-submit-auth"
)

do(
"""    case 'contribute': {
      const item=state.family.find(entry=>entry.name===target.dataset.name);
      if(item){
        item.paid=true;
        logAudit('Family Pool Payment', `${item.name} contributed ${money(item.amount)}`);
        showToast('Contribution Received', `${item.name} paid ${money(item.amount)}`);
        render();
      }
      break;
    }""",
"""    case 'contribute': {
      const item=state.family.find(entry=>entry.name===target.dataset.name);
      if(item){
        item.paid=true;
        logAudit('Family Pool Payment', `${item.name} contributed ${money(item.amount)}`);
        showToast('Contribution Received', `${item.name} paid ${money(item.amount)}`);
        render();
        // The API only has one call — create the funding request with every
        // sponsor's contribution at once — so the first "Simulate pays"
        // click records the whole request; per-sponsor settlement itself
        // has no backend endpoint yet and stays local.
        syncFamilyFundingRequest();
      }
      break;
    }""",
"6-contribute"
)

do(
"""document.addEventListener('submit', event => {""",
"""document.addEventListener('submit', async event => {""",
"7-async-submit"
)

do(
"""    state.invoiceList.unshift(newInv);
    state.modal = null;
    logAudit('Invoice Created', `${newInv.id} for ${newInv.patient} (${money(totalAmt)})`);
    showToast('Invoice Published', `${newInv.id} created for ${newInv.patient}`);
    render();
  }
  if (event.target.id === 'add-service-form') {""",
"""    state.invoiceList.unshift(newInv);
    state.modal = null;
    logAudit('Invoice Created', `${newInv.id} for ${newInv.patient} (${money(totalAmt)})`);
    showToast('Invoice Published', `${newInv.id} created for ${newInv.patient}`);
    render();
    try {
      const created = await wellipayApi.createInvoice({
        providerInvoiceRef: newInv.id,
        facilityRef: `facility-${newInv.branch.toLowerCase()}`,
        patientRef: pt.id,
        description: srvName,
        amountMinor: toMinor(totalAmt),
        currency: 'NGN',
      });
      newInv.apiInvoiceId = created.invoiceId;
      showToast('Synced to WelliPay API', `${newInv.id} recorded on the server as ${created.invoiceId}.`);
      render();
    } catch (err) {
      showToast('API Sync Failed', `${newInv.id} saved locally only: ${err.message}`);
    }
  }
  if (event.target.id === 'add-service-form') {""",
"8-invoice-submit"
)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(src)

print("DONE — app.js patched successfully")
