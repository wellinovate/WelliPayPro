# Technical Schedule and Ownership Addendum

**Status:** Negotiation draft; not executed and not legal advice
**Applies to:** Technology, API & Payment Infrastructure Integration Agreement
**Related interface draft:** [Patient MobileApp Integration API](mobile-app-integration.md) · [OpenAPI 3.1](mobile-app-integration.openapi.json)

This schedule is intended to replace the incomplete Technical Schedule and system-of-record tables in the Agreement. It makes the intended boundary explicit: WelliPay controls and operates WelliPay financial infrastructure; the Patient MobileApp and Provider SaaS are separate clients. Bracketed values require written agreement before signature. Have Nigerian counsel review this schedule with the main agreement and any data-processing agreement.

## 1. Proposed ownership and system-of-record matrix

“Accountable owner” means the party responsible for the system and its decisions. “System of record” identifies the primary record for the stated domain; it does not displace source evidence held by a third-party processor, bank, payer, or identity provider.

| Domain | Accountable owner | System of record / authoritative evidence | Other party’s role |
| --- | --- | --- | --- |
| WelliPay Core, financial APIs and integration contract | WelliPay | WelliPay-controlled repositories and production services | Technology Partner implements approved clients and reports incompatibilities |
| Patient MobileApp product and operations | [Name legal entity] | Product source repository and application services controlled by [owner] | WelliPay exposes approved financial APIs; ownership of custom paid-for work follows Clause 21 |
| Provider SaaS product and operations | [Name legal entity] | Product source repository and application services controlled by [owner] | WelliPay exposes approved financial APIs; ownership of custom paid-for work follows Clause 21 |
| WelliID issuance and patient identity | [Named Wellinovate identity-service entity] | Designated identity provider / identity registry | Other party consumes opaque identifiers and verified claims only |
| Patient-to-app/provider account links | [Named identity-mapping owner] | Auditable identity-link service, keyed by opaque references | Parties request link/unlink through authenticated flows; neither builds an independent competing identity map |
| Patient authentication | [Named patient IdP owner] | Designated OIDC identity provider | WelliPay and clients validate tokens and enforce local authorization |
| Provider staff authentication and roles | WelliPay, or [named owner if different] | WelliPay Provider identity/role service | Technology Partner integrates; role grants remain controlled by the designated owner |
| Provider invoice financial state | WelliPay | WelliPay invoice and ledger records | Provider SaaS submits invoice commands and displays canonical state |
| Payment orchestration and transaction identity | WelliPay | WelliPay transaction service and ledger | MobileApp and Provider SaaS initiate only through authorized APIs |
| Processor capture, refund, dispute evidence | WelliPay manages the processor relationship | Processor’s signed/verified transaction records | WelliPay ingests, validates and maps evidence into its ledger |
| Bank settlement evidence | WelliPay finance/treasury owner | Bank statement/API and processor settlement reports | Technology Partner supports data export and investigation if contracted |
| Webhook event publication | WelliPay for WelliPay events; processor for processor events to the agreed receiver | WelliPay event/outbox log and processor event records | Technology Partner operates and secures any receiver assigned to it |
| Reconciliation, refunds and chargebacks | WelliPay | WelliPay reconciliation/case records linked to external evidence | Applications submit authorized requests and display resulting status |
| HMO/insurance eligibility and formal authorization | [Named payer integration owner] | Payer response/authorization reference plus WelliPay’s audit record | Parties must label eligibility separately from formal authorization |
| Financial consent | [Named WelliPay/Wellinovate consent-service owner] | Versioned consent record and evidence of authenticated action | Apps present the approved estimate and collect the action; this is not clinical consent |
| Clinical records | WelliRecord / [named clinical-system owner] | Designated clinical system | Financial systems receive minimum necessary data only |

No row marked `[Name ...]` is agreed until a legal entity, service name, and accountable contact are inserted. A party may not make itself the owner solely by operating a client application.

## 2. Identity and account-linking schedule

1. **Identifier issuer:** WelliID is issued and lifecycle-managed by **[identity owner legal entity/service]**. WelliID is the ecosystem identifier; each consuming service uses its own opaque, non-reassignable local reference. Phone number and email are contact attributes, not primary merge keys.
2. **Mapping:** the identity owner operates the authoritative WelliID ↔ Patient Account ↔ provider-patient reference mapping service. The service returns only the minimum claims needed for the requested workflow. A caller cannot choose or override the tenant from a request body.
3. **Link proofing:** linking requires an authenticated patient action or a documented assisted-verification procedure approved by WelliPay and the identity owner. Matching phone/email alone does not authorize an account link or merge.
4. **Duplicates and merges:** suspend conflicting links; verify identity using the agreed proofing process; require approval by **[role/team]**; preserve all old references as aliases; retain transaction history and an immutable audit record. Merges must be reversible where technically and legally feasible.
5. **Dependants and delegates:** record the relationship and authority scope separately from the patient identity. A payer/sponsor receives only the financial request and information required to pay; sponsorship does not grant clinical-record access.
6. **Unlinking and deletion:** identity unlinking revokes future access and tokens but does not delete legally retained financial records. Define deletion, retention and subject-rights handling in the Data Processing Agreement and retention schedule.
7. **Service levels:** identity-link, unlink, correction and suspected-takeover requests are acknowledged within **[X business hours]** and resolved/escalated within **[Y business days]**.

## 3. Authentication and authorization schedule

- **Patient sessions:** the named patient Identity Provider **[name]** authenticates MobileApp users using OIDC Authorization Code + PKCE. Mobile clients contain no client secret. Token issuer, audience, signing-key discovery/rotation, MFA policy, refresh-token rotation, session revocation and account recovery are defined by that IdP owner.
- **Provider sessions:** WelliPay Provider authentication and staff-role policy are operated by **[WelliPay or named owner]**. Provider tenant, branch, role and permission claims are issued only by that owner.
- **Service-to-service:** WelliPay backend services use OAuth 2.0 client credentials or mutually authenticated workload identity, with separate credentials per environment and tenant boundary. Define token endpoint **[URL]**, issuer/audience **[values]**, scopes **[scope list]**, maximum token lifetime **[minutes]**, key rotation **[period]**, and revocation contact **[on-call]**.
- **Authorization:** the service receiving a request checks tenant, facility/branch, resource ownership, purpose and scope on every request. Authentication alone never grants access. Client-submitted `tenantRef` is not authority.
- **Change control:** no party may unilaterally change issuer, audience, signing algorithm, required claims, scopes, token lifetime or redirect/callback trust configuration used by the other party, except for an urgent security action. Emergency changes require immediate incident notice, a compatibility/recovery plan, and post-incident review within **[X business days]**.
- **Audit:** log principal/service identity, tenant, action, resource reference, authorization outcome, correlation ID and timestamp. Do not log bearer tokens or unnecessary patient/clinical payloads.

## 4. Payment authority and state model

### 4.1 Authority boundary

WelliPay is accountable for payment orchestration and the WelliPay Ledger. The ledger is the canonical WelliPay application record of the transaction, allocations and current status. The processor is authoritative evidence of processor-side authorization/capture/refund/chargeback events; the bank is authoritative evidence of funds actually settled to or from the designated account. WelliPay must reconcile these records and investigate conflicts; the ledger must not be used to erase or silently override source evidence.

Processor: **[legal name, product, acquiring/settlement arrangement]**
Processor contracting/merchant-account owner: **[WelliPay legal entity]**
Processor webhook receiver: **[WelliPay service and environment]**
Settlement account owner and change approvers: **[legal entity / role pair]**

Only WelliPay’s server-side orchestration creates the WelliPay transaction ID and payment intent. Clients may request initiation and display returned state, but a client redirect, SDK result, screenshot or MobileApp assertion is not proof of success. The transaction ID remains immutable and is correlated with processor, invoice, funding-request and settlement references.

### 4.2 Separate resource lifecycles

**Payment transaction:** `CREATED → INITIATED → PENDING → PROCESSING → SUCCEEDED | FAILED | CANCELLED | EXPIRED`. A successful transaction may later have a `DISPUTED` or `CHARGEBACK` case. Refunds are separate linked records (`REQUESTED → SUBMITTED → PENDING → SUCCEEDED | FAILED | CANCELLED`) and support partial amounts. Do not rewrite a successful payment into `REFUNDED`; retain the original capture and append refund events.

**Invoice:** `DRAFT → OPEN → PARTIALLY_PAID → PAID`; separately may become `CANCELLED` or `VOIDED` subject to rules. Invoice balance is derived from immutable line/adjustment and allocation records. An invoice is `PAID` only when eligible successful allocations equal the amount due; a processor pending state does not count as paid.

**Settlement batch:** `EXPECTED → PROCESSING → SETTLED | FAILED | DISPUTED`, with statement/report references and gross, fee, reserve and net amounts. Settlement is not a payment-success state.

**Reconciliation item:** `UNMATCHED → MATCHED | EXCEPTION`; a match must preserve the source records and actor/rule, timestamp, and evidence. Reconciliation does not alter a processor result.

**Family contribution:** each contribution has its own transaction and refund lifecycle. The request is `OPEN → PARTIALLY_FUNDED → FUNDED`, or `CANCELLED | EXPIRED`; funded total may never exceed the authorized request/invoice amount without a separately approved adjustment.

All transitions, including late/out-of-order events, are applied idempotently. Define transition authority and correction approval in WelliPay’s ledger policy. Publish versioned event schemas for `payment.*`, `refund.*`, `dispute.*`, `settlement.*`, `reconciliation.*`, `invoice.*`, `family.contribution.*`, `eligibility.*` and `consent.*`.

### 4.3 Refund, dispute and reconciliation ownership

WelliPay approves and initiates refunds under its documented approval policy; the processor executes processor refunds; WelliPay records processor confirmation and updates the linked invoice allocation. WelliPay owns processor disputes/chargebacks, evidence submission, deadlines and financial accounting. Provider staff may supply service/invoice evidence. Technology Partner provides contracted technical assistance but may not submit evidence or concede liability without written delegated authority.

WelliPay owns daily processor-to-ledger and processor/bank-to-settlement reconciliation. Unmatched or financially material exceptions are assigned to **[role]**, acknowledged within **[X]**, and escalated after **[Y]**. Define materiality threshold, evidence retention, close calendar and adjustment approvals in the Finance Operations Schedule.

## 5. API and webhook operating schedule

- WelliPay owns and versions WelliPay financial APIs, schemas, authoritative documentation and production gateway configuration. The Technology Partner owns only specifically enumerated application APIs and may not present them as authoritative WelliPay financial APIs.
- API base URLs: sandbox **[URL]**, production **[URL]**. Token issuer/audience and scopes: **[values]**. Rate limits and support contacts: **[values]**.
- Breaking changes require **[90] days’** notice, a supported overlap/deprecation period of **[180] days**, migration documentation and sandbox testing. Security emergencies may be immediate with immediate notice and a documented compatibility/recovery plan.
- Every mutating request carries an idempotency key. Define key scope, storage period **[at least X days]**, replay response, and conflict behavior. Every event has immutable `eventId`, resource reference, schema version, occurrence time and correlation ID.
- Webhook signature: HMAC-SHA256 over `timestamp + "." + exact raw body`, constant-time verification, maximum clock skew **[5 minutes]**, endpoint-specific secret, rotation overlap **[period]**. TLS is mandatory. Reject or safely deduplicate replayed event IDs.
- Retry policy: retry network errors, `408`, `429`, and `5xx` with exponential backoff for **[72 hours]**, honoring `Retry-After`; then dead-letter and alert **[on-call team]**. Receiver acknowledges only after durable enqueue, not after downstream business processing. Provide event replay tooling and audit history for **[retention period]**.
- Clients tolerate duplicate and out-of-order events, fetch current resource state when needed, and never infer a state transition from event arrival order alone.

## 6. Security, privacy and operations schedule

Complete these values in a signed security and data-processing schedule:

| Control | Required agreement |
| --- | --- |
| Data roles | Controller/processor and independent-controller roles per processing purpose; identify each legal entity |
| Data inventory | Payload fields, purposes, lawful basis, data-subject categories, locations and subprocessors |
| Retention/deletion | Per-data-class retention periods, legal hold, backups, deletion evidence and subject-request workflow |
| Incident notice | Initial notice within **[24 hours]** of discovery for a suspected security incident affecting shared data/systems; rolling updates and final report timeline **[X days]** |
| Availability | Monthly SLO **[99.9%]** excluding agreed maintenance; define measurement and service credits/remedy |
| Incident response | P1 acknowledgement **[15 minutes]**, updates every **[30 minutes]**, workaround/recovery target **[X hours]** |
| Recovery | RPO **[15 minutes]**, RTO **[4 hours]**; test at least **[annually]** and share summary |
| Privileged access | MFA, named accounts, least privilege, access review **[quarterly]**, prompt offboarding/revocation |
| Audit rights | Evidence review **[annually]** and after material incidents; protect other customers’ confidential information |
| Subprocessors | Advance notice **[30 days]**, objection/termination mechanism, flow-down obligations and current register |
| Support | Named 24/7 financial-incident channel, escalation tree, owner and backup per party |

Targets in square brackets are proposed starting points for negotiation, not agreed service commitments.

## 7. IP, repositories and continuity schedule

1. Each party lists its pre-existing materials and third-party/open-source dependencies in **[IP inventory attachment]**. Those remain with their existing owner, subject to licences expressly granted for operating the deliverable.
2. Custom software specifically commissioned and paid for by WelliPay is assigned to WelliPay on creation to the extent legally permitted, with further assurances and employee/contractor assignments. Where assignment is unavailable, grant WelliPay a perpetual, irrevocable, worldwide, transferable, sublicensable, royalty-free licence to use, host, modify, maintain and transition it. Identify any exceptions before work begins.
3. WelliPay-controlled repositories, cloud organizations, domains, production accounts, signing identities, CI/CD, backups and observability for WelliPay Core and ledger systems must be under WelliPay organizational ownership. No personal account is the sole administrator or recovery path.
4. Technology Partner retains generic tools not incorporating WelliPay confidential information or WelliPay-specific business logic. Third-party components must be disclosed with licence, support and vulnerability status.
5. On termination or request following material service failure, provide current source for WelliPay-owned/commissioned deliverables, build/deploy/runbooks, schemas, infrastructure-as-code, dependency and secrets-rotation inventory, backups/exports, open issues and transition support for **[60 days]** at **[rate/fee]**. Credentials are rotated/transferred through an agreed secure process; secrets are not emailed or placed in source control.

## 8. Change governance

Each system owner may change its own implementation. Mutual approval is required only for a proposed change that alters a published interface, data contract, authentication trust, transaction semantics, or service dependency relied on by the other party. Approval shall not be unreasonably withheld or delayed. The proposing party provides impact analysis, sandbox access, migration plan, rollback plan and notice under Section 5. WelliPay retains authority to secure, suspend or modify WelliPay-owned financial infrastructure; affected parties receive prompt notice and a post-change review. No party may use this process to block an urgent security response.

Architecture decisions are recorded in a shared decision log with date, decision owner, approvers, affected API/version, risk and review date. Named technical owners:

| Role | WelliPay | Technology Partner |
| --- | --- | --- |
| Executive sponsor | [name/contact] | [name/contact] |
| Technical owner | [name/contact] | [name/contact] |
| Security incident contact (24/7) | [channel/contact] | [channel/contact] |
| Finance/settlement owner | [name/contact] | [name/contact or N/A] |
| Identity owner | [name/contact or designated third party] | [name/contact or N/A] |

## 9. Acceptance and launch gates

Production launch is blocked until both parties sign off on all items below:

- Named legal entities and operators for WelliPay Core, Provider SaaS, Patient MobileApp, identity service and API gateway.
- Patient link/unlink, duplicate, dependant/delegate, takeover and recovery tests passed in sandbox.
- OAuth issuer/audience/scopes, key rotation/revocation, tenant isolation and privileged-access tests passed.
- Named processor and merchant/settlement arrangement; verified processor webhooks; capture/refund/dispute test cases passed.
- Payment, invoice, refund, settlement and reconciliation state models approved by Finance and Engineering; duplicates/out-of-order/late events tested.
- Family allocations cannot exceed invoice/request amount; multi-payer rounding and reversal cases tested.
- Webhook retries, signature failure, replay protection, event replay, dead-letter alerting and operational ownership tested.
- Consent record identifies the exact estimate revision, displayed payer split, authenticated actor/delegate, wording/policy version and timestamp; legal retention approved.
- DPA, data inventory, subprocessors, retention, incident timeline, SLA, DR objectives, audit rights and exit procedure completed.
- Repository, cloud, deployment, monitoring, backup and break-glass access are controlled by the designated organizational owner.

## 10. Decisions required before signature

| Decision | Proposed default | Final value / approver |
| --- | --- | --- |
| Technology Partner legal entity | No assumption | [legal name, jurisdiction, registration] |
| API gateway/integration operator | WelliPay operates WelliPay financial API gateway | [entity/service; WelliPay approver] |
| Patient identity provider and WelliID issuer | Named Wellinovate identity service | [entity/service; identity owner] |
| Account-link mapping owner | Same identity service unless separately designated | [entity/service; identity owner] |
| Patient authentication protocol | OIDC Authorization Code + PKCE | [IdP and security approver] |
| Provider authentication/role owner | WelliPay Provider IAM | [confirm or replace; WelliPay approver] |
| Payment processor | WelliPay-selected and contracted processor | [processor/legal entity; WelliPay finance approver] |
| Processor webhook receiver | WelliPay production payment service | [service/owner; WelliPay security approver] |
| Merchant and settlement account owner | WelliPay legal entity | [legal entity/account control and dual approvers] |
| Eligibility versus formal authorization sources | Separate payer-specific contracts | [payer/source; clinical-financial approver] |
| Financial consent service and retention | WelliPay/Wellinovate-designated service | [owner, legal basis, period; privacy approver] |
| SLA, retry and event retention targets | See Sections 5–6 proposed values | [final values; both operational owners] |
| Custom IP and transition terms | Assignment/licence model in Section 7 | [exceptions, fees and counsel approval] |

Do not sign with these rows blank if they affect the parties’ control, financial authority, patient identity or ability to operate and transition the systems.