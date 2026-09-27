# Handoff: WelliPay Provider SaaS Console

## Built App
The standalone provider console is implemented in `index.html`, `app.js`, and `app.css`. Open `index.html` directly in a browser; it uses the bundled `_ds/styles.css` tokens and requires no build step or install. The interactive workflows currently use illustrative, in-memory demo data. Production use still needs authenticated APIs, persisted records, and real payment/HMO integrations.

The Patient MobileApp is a separate client product, not part of this provider web app. The **Mobile App Integration** screen represents provider-side connection management and event exchange with that separate app; its sandbox controls are illustrative until backed by an API.

The draft server-to-server contract for invoice publishing, payment events, family funding, eligibility, and financial consent is in [`docs/mobile-app-integration.md`](docs/mobile-app-integration.md) and [`docs/mobile-app-integration.openapi.json`](docs/mobile-app-integration.openapi.json). Confirm the open ownership, identity-linking, payer, and webhook decisions with the MobileApp/backend teams before treating it as production-ready.

## Overview
A provider-facing healthcare billing/payments console (multi-branch hospital tenant "ABC Healthcare"), built for a Finance Manager persona. Covers: dashboard financial command centre, front-desk cashier workflow ("Hospital Desk") with a live family-payment and HMO-authorization demo, HMO pre-authorization workspace, claims lifecycle, receivables/reconciliation, settlements, family/sponsor multi-payer funding, settings, and a mobile "Patient App" preview panel. Most of the app's 24+ nav destinations are lighter illustrative screens; a subset is fully interactive (see Screens below).

## About the Design Files
The bundled file (`WelliPay Provider.dc.html`) is a **design reference** — an interactive HTML/JS prototype built on this tool's own "Design Component" runtime (`support.js`), not production code. It demonstrates intended layout, copy, states, and interaction logic using inline styles and a small custom templating syntax (`{{ }}` holes, `sc-for`/`sc-if` loop/conditional tags). **Do not copy this file's markup or templating syntax into a real codebase.** The task is to recreate the screens and behaviors described below in the target app's actual stack (React/Vue/native/etc., using whatever framework and design-system libraries the codebase already has — or the most appropriate framework choice if this is a fresh build), styled from the design tokens listed here.

## Fidelity
**High-fidelity.** Colors, type, spacing, and component styling are final (drawn from the bound "Modernist" design system — flat, architectural, red-on-white, Archivo typeface, zero corner radius, 2px rules). Copy/sample data is illustrative placeholder content, not final production copy. Recreate pixel-perfectly using the tokens below; treat all names/amounts/patient records as sample data only.

## Screens / Views

### 1. App shell (persistent)
- **Layout**: Fixed-height flex row filling the viewport (`height:100vh; overflow:hidden`). Left sidebar 240px fixed width, `overflow-y:auto`. Right side is a column: a 2px-bordered top bar (~64px) + a scrollable content pane (`flex:1; overflow-y:auto; padding:28px`).
- **Sidebar**: Brand mark (10px red square + "WelliPay" wordmark, "Provider" kicker below), tenant name "ABC Healthcare" + "Multi-branch hospital · 5 branches", then 7 nav groups (Overview, Revenue Cycle, Claims & Payers, Growth, Operations, Account, Preview), each an uppercase 10px label followed by a vertical list of nav links. Active link: red text, light red-tint background, bold.
- **Top bar**: current screen title (left), and on the right: "All branches ▾" text, a "Finance Manager" neutral tag, a 32×32 red-tinted initials avatar ("AO").
- **Nav structure** (id → label), in order:
  - Overview: dashboard / Dashboard, hospital-desk / Hospital Desk, ai-insights / AI Insights, notifications / Notifications
  - Revenue Cycle: patients, invoices, payments, services-pricing
  - Claims & Payers: claims, hmo-insurance, authorization / Authorization Centre, family-sponsors, wellipass, receivables, reconciliation, settlements, refunds
  - Growth: financing, payment-plans, referrals, partners
  - Operations: reports, branches, staff, integrations, api-developers
  - Account: subscription, audit-log, support, settings
  - Preview: patient-app / Patient App

### 2. Dashboard (fully built)
Greeting header ("Good afternoon, Adaeze" + date) with a 4-option segmented date filter (Today/Week/Month/Quarter — click state only, doesn't refilter data in this prototype). Then, top to bottom:
- 8 stat tiles in an auto-fit grid (min 190px): Revenue ₦2,450,000, Collected ₦1,950,000, Outstanding ₦500,000, HMO receivables ₦1,200,000, Pending claims ₦750,000, Pending settlements ₦450,000, Patients served 124, Refunds ₦35,000.
- Two side-by-side cards: a 7-day revenue bar chart (CSS bars, heights relative to max) and a payer-mix stacked horizontal bar (Patient/HMO/Insurance/Corporate) with a color-swatch legend.
- Branch revenue: horizontal bar-per-branch (Wuse, Garki, Maitama, Kaduna, Lagos), bar width relative to the branch with the highest revenue (Maitama).
- Two side-by-side cards: "Receivables & ageing" summary (4 numbers: Patient/HMO/Insurance/Financing) with a "View all →" link that navigates to the Receivables screen; "Smart Reconciliation Centre" showing matched/unmatched/exceptions/duplicate counts plus a short unmatched-payments list, each row with a "Match" button that opens a confirmation dialog.
- Two side-by-side cards: "Revenue leakage alerts" (amount + reason + branch tag, 3 sample alerts) and "Claim scrubbing readiness" (3 sample claims, each with a % readiness bar and either issue tags or a "Ready to submit" tag).
- "Approval queue" — a grid-row table (NOT a real `<table>` — the header/rows are CSS-grid `div`s) of pending refunds/write-offs with Approve/Reject buttons per row; clicking either removes that row from the list live.
- "Ask WelliPay" — a small chat panel: message history (assistant messages left-aligned grey bubble, user messages right-aligned red-tint bubble), 4 suggested-question chips, a text input + Ask button. Submitting matches free-text keywords (revenue/claims/reconciliation/receivables/leakage/etc.) to one of ~7 canned responses, else a fallback "I don't have that one yet" message.
- **Reconciliation match dialog** (modal, shared with Reconciliation screen): shows the unmatched amount + source and a suggested invoice match; "Confirm match" removes the item from unmatched and increments the matched counter; "Not a match" closes the dialog and increments an exceptions counter.

### 3. Hospital Desk (fully built — front desk / cashier)
- Header row: "Front desk & cashier" title + 3 buttons (New Patient, Find Patient — decorative/no-op in this prototype; Scan WelliPass — opens the WelliPass modal).
- 4 activity tiles: Patients 87, Bills 74, Collected ₦3.4M, Pending ₦850K.
- "Payment queue" card: 5 rows (John/Mary/Peter/David/Sarah) each with amount and a status tag (Awaiting/HMO/Family/Financing/Partial).
- "Create bill & collect payment" card (max-width 560px):
  - Current patient row (name · WelliID · HMO plan) with a "Change →" link that reopens the WelliPass scan modal.
  - 3 static line items (Consultation ₦15,000, ECG ₦18,000, Lab — Full Blood Count ₦25,000) + a computed Total (₦58,000).
  - "Who is paying?" 5-option segmented control: Patient / Family / HMO / Financing / Mixed. Changing it resets all downstream payment/authorization state.
  - **If Family selected**: sponsor chip picker (Mother/Brother/Sister/Uncle, single-select) → "Send payment request" button (disabled until a sponsor is chosen) → shows an "Awaiting family payment" panel with a 24h-expiry tag and a "Simulate: {sponsor} pays" button → flips to a "Paid by {sponsor}" confirmation with a "Reset demo" button.
  - **If HMO selected AND bill total ≥ ₦50,000** (true for this ₦58,000 sample bill): shows "HMO authorization required" → "Request Authorization" button → "Awaiting HMO decision…" panel with a "Simulate: HMO approves" button → on approval, computes an 80/20 split (HMO covers 80%, patient owes 20%) and shows a **financial consent step** ("Patient reviews & authorizes" button, displaying the HMO/patient split) → after consent, shows a "Collect ₦{patient amount}" button → flips to a paid confirmation stating the split and a "Reset demo" button.
  - **If Patient / Financing / Mixed selected**: a single "Receive payment" button flips straight to a paid confirmation ("Paid by patient" / "Paid via HMO" / "Paid via financing partner" / "Paid — mixed funding").
- **WelliPass scan modal**: a red header block (WELLIPASS kicker, patient name "Ngozi A.", ID "WR-2291-04 · Reliance HMO — Gold"), a 6×6 grid of light/dark squares as an abstract QR-code placeholder (NOT a real scannable code — needs a real QR asset in production), "Scanned at Wuse Front Desk" caption, Cancel/"Continue to Hospital Desk" buttons. Continuing swaps the active patient to Ngozi A. and resets the payment form.

### 4. Authorization Centre (fully built)
- 8 status tiles: Draft 12, Submitted 18, Pending 7, Approved 35, Partially Approved 4, Rejected 3, Expired 2, Appeal 1 — these counts live-update when authorizations are submitted/approved elsewhere (see Authorization Inbox and Hospital Desk).
- Two side-by-side cards: "SLA by HMO" (Reliance HMO 2h14m, Hygeia HMO 7h31m, AXA Mansard 4h02m) and "Coverage & benefit limit" (a progress bar: ₦650,000 used of ₦1,000,000 annual limit, ₦350,000 remaining).
- "Cost estimator" card: a static funding breakdown (Treatment ₦1,200,000 minus HMO/WelliSave/Family/Financing contributions = Patient balance ₦0).
- "Authorization inbox": 3 sample cases (Emeka N./MRI, Blessing K./Surgery Package, Chidi O./Dialysis), each an accordion row — click to expand and reveal a timestamped timeline, an AI "readiness %" bar (only on the Draft case), and a status-appropriate action: Draft → "Submit to HMO"; Submitted/Pending → "Simulate: HMO approves"; Approved → static "Patient notified." note. Submitting/approving appends a timeline entry and moves the global status counts.

### 5. Family / Sponsors (fully built — multi-sponsor demo)
A single ₦1,000,000 "Chidi O. — Treatment plan" bill with 3 sponsor rows (Brother ₦400,000, Sister ₦300,000, Uncle ₦300,000), each with a "Simulate pays" button that marks it paid and shows a "Paid" tag. A progress bar and "Remaining ₦X" update as contributions come in; when remaining hits ₦0 a "Bill fully funded — settled to provider" tag appears. Below that, a static sponsor-directory list (3 illustrative rows).

### 6. Settlements (fully built)
A payout timeline (5 timestamped events, e.g. "SET-1187 — ₦2,100,000 — Flutterwave payout initiated" → "…Completed to GTBank ••4471") and a per-branch settlement table (Branch / Settled / Pending) for all 5 branches.

### 7. Claims (fully built)
4 sample claims, each row showing invoice reference, HMO, amount, and a status tag, with status-appropriate actions: Draft → "Submit claim"; Submitted → "Simulate: approve" / "Simulate: reject" (rejecting shows a red rejection-reason line: "Tariff mismatch — requested amount exceeds contracted tariff."); Rejected → "Resubmit" (clears the reason, returns to Submitted).

### 8. Receivables (fully built)
A single table: rows = Patient/HMO/Insurance/Corporate/Financing, columns = 0–30 / 31–60 / 61–90 / 90+ days, plus a Total column and a bold Total row summed across all payer rows.

### 9. Reconciliation (fully built)
4 summary tiles (Matched/Unmatched/Exceptions/Duplicate — shared state with the Dashboard widget), a fuller unmatched-payments list (same match dialog as the Dashboard), and a "Recently matched" table (Invoice / Amount / Matched via / When).

### 10. Settings (fully built — editable)
A number input for "refund approval threshold" (default ₦100,000) and a button-toggle for "second approval on bank-detail change" (Enabled/Disabled), plus a static supporting-info list (settlement account verified, etc.).

### 11. Patient App preview (fully built — mobile mock)
A 340px-wide flat device frame (no rounded bezel — matches the design system's zero-radius rule) with a 5-tab bottom nav (Home/Pay/Bills/Family/Profile) that swaps the content area:
- Home: greeting, an outstanding-balance card with a "Pay now" button (jumps to Pay tab), a "Request family payment" button (jumps to Family tab).
- Pay: 4 static option rows (Pay a Provider / Pay as a Person / Pay for Someone / Scan QR).
- Bills: 3 sample bills with Pending/Paid tags.
- Family: 3 family-member rows + a static "Request payment from family" button.
- Profile: static name/ID/phone rows.

### 12. Lighter "stub" screens (illustrative only, not deeply built)
AI Insights, Notifications, Patients, Invoices, Payments, Services & Pricing, HMO/Insurance, WelliPass (info page), Refunds, Financing, Payment Plans, Referrals, Providers/Partners, Reports, Branches, Staff, Integrations, API & Developers, Subscription, Audit Log, Support. Each follows one shared template: a kicker + heading + one-line description, 3 stat cards, and a short list of 3–4 sample rows (label / detail / status tag). Treat these as placeholders indicating scope, not final designs — they'll need real design work before build.

## Interactions & Behavior
- All navigation is client-side state (`activeNav` string) — no routing/URLs in this prototype; a real app should give each screen a real route.
- No animations beyond a 200ms fade-in on screen mount (opacity+4px translateY) and native browser transitions on hover states from the design system.
- No loading or error states are modeled anywhere — every action resolves instantly and successfully. A real implementation needs loading/error/empty states for every async action (payments, claim submission, authorization requests, etc.).
- No form validation beyond a disabled-state on "Send payment request" until a sponsor chip is picked.
- Not responsive below ~900px — the sidebar is fixed-width and will crowd a narrow viewport. This is a desktop console; a real build should decide on a tablet/mobile strategy (the brief calls for web-first, with a separate companion app for front-desk/mobile roles).

## State Management
Everything lives in one component's local state (illustrative, not a real architecture):
- `activeNav`: current screen id.
- `dateFilter`: dashboard segmented-control value (display only, no data refetch).
- `unmatched` (array), `matchedCount`, `exceptionsCount`, `duplicateCount`, `modalItemId`: reconciliation state, shared by Dashboard + Reconciliation screens.
- `approvals` (array): dashboard approval queue.
- `copilotMessages` (array), `copilotInput`: Ask WelliPay chat.
- `hospitalDesk`: `{ patient, wellipassOpen, payerChoice, sponsor, paymentStatus, authStage, hmoAmount, patientAmount, consentGiven }`.
- `authCounts` (object of 8 counters), `authItems` (array), `selectedAuthId`: Authorization Centre.
- `claimsItems` (array): Claims screen.
- `familySplit`: `{ total, contributions: [{name, amount, paid}] }`: Family/Sponsors screen.
- `settings`: `{ refundThreshold, secondApprovalEnabled }`.
- `patientTab`: Patient App preview's active tab.

A real implementation should back nearly all of this with server data (patients, invoices, claims, authorizations, settlements) rather than local state — this prototype hard-codes sample records everywhere.

## Design Tokens
From the bound "Modernist" design system (`styles.css`):
- **Colors**: background `#f3f2f2`, surface `#eae9e9`, text `#201e1d`, accent (red) `#ec3013`. Neutral ramp 100→900: `#f8f4f4, #eae7e7, #d7d3d3, #bab6b6, #9b9797, #7d7979, #605d5d, #444141, #2d2b2b`. Accent ramp 100→900: `#fff2ef, #ffe0d9, #ffc4b8, #ff9783, #ff563c, #dd2b0f, #ae1800, #7c1405, #4d170e`. Divider: `color-mix(in srgb, #201e1d 40%, transparent)`.
- **Typography**: both heading and body set in "Archivo" (Google Fonts), heading weight 800. Base body 15px/1.55. Headings h1 42px … h6 13px uppercase tracked.
- **Spacing scale**: 4, 8, 12, 16, 24, 32px.
- **Radius**: 0px everywhere (sharp corners only — this is a deliberate brand rule, do not round anything).
- **Shadows**: sm `0 1px 2px rgba(45,43,43,.14)`, md `0 3px 10px rgba(45,43,43,.16)`, lg `0 12px 32px rgba(45,43,43,.22)`.
- **Components used**: `.btn`/`.btn-primary`/`.btn-secondary`/`.btn-ghost`/`.btn-block`, `.tag`/`.tag-accent`/`.tag-neutral`/`.tag-outline`, `.card`/`.card-kicker`/`.card-title`/`.card-body`/`.card-meta`, `.seg`/`.seg-opt` (segmented control), `.input`/`.field`, `.table`, `.dialog-backdrop`/`.dialog`. Full component reference and rationale is in the design system's `readme.md` (bundled).

## Assets
No photographic or icon assets are used. All visual marks are flat CSS (colored squares/bars/dots) — see the WelliPass "QR" placeholder above (needs a real QR/barcode asset in production) and the chart bars (CSS divs, not SVG/chart-library output — a real build should use a proper charting library for the revenue trend and payer-mix visualizations).

## Files
- `WelliPay Provider.dc.html` — the full prototype (template markup + JS state/logic in one file). This is the primary reference; read the inline `<style>` and the `const Component extends DCLogic` class for exact copy, sample data, and state-transition logic.
- `_ds/` — the bound "Modernist" design system: `styles.css` (all tokens + component CSS, referenced above) and `readme.md` (component usage guide). `_ds_bundle.js` is a runtime helper specific to this tool's preview and is not needed by a real app.
