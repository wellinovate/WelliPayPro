# Patient MobileApp Integration Contract

**Status:** Draft for Provider SaaS and Patient MobileApp team review  
**Contract:** [`openapi.json`](openapi.json), OpenAPI 3.1  
**Scope:** Provider backend ↔ WelliPay integration service ↔ separate Patient MobileApp

The Provider SaaS remains a staff-facing web product. The Patient MobileApp is a separate patient-facing client. This contract describes the backend exchange between them; it does not embed the mobile app in the SaaS or make the browser console a trusted integration client.

## MVP flows

1. **Publish a bill:** the provider backend creates an invoice using its opaque patient reference. The integration service resolves a linked MobileApp account and makes the bill available there. The provider can fetch the current invoice state.
2. **Return payment state:** payment and family-contribution events are delivered to the provider's registered webhook URL. The provider verifies the signature, deduplicates by event ID, and updates its invoice ledger. A payment processor remains responsible for collecting funds; card and bank credentials must not pass through this API.
3. **Request family funding:** the provider creates a request for one or more sponsor contributions. The MobileApp presents the request to the patient/sponsor. Contribution status returns as webhook events.
4. **Check eligibility:** the provider requests a coverage decision for a service and receives an eligibility reference, decision, covered amount, and patient responsibility. This is not a payment authorization unless the payer explicitly confirms that in its own contract.
5. **Record financial consent:** the provider records the patient's consent to the displayed estimate and payer split, identified by an opaque subject reference and policy version. Do not treat this record as clinical consent.

## Trust and data rules

- Provider API calls are server-to-server over TLS using short-lived OAuth 2.0 client-credentials tokens. The browser app must never hold a client secret or call privileged endpoints directly.
- The integration service derives tenant identity from the authenticated credential. Facility/branch references are checked against that tenant; a caller-supplied tenant ID is never authoritative.
- Required scopes: `mobile.integration.read` for reads and event subscription configuration; `mobile.integration.write` for invoice, family funding, eligibility, and consent writes. Split these further if deployment roles need narrower access.
- Use opaque `patientRef`, `sponsorRef`, and `facilityRef` values. Avoid names, phone numbers, dates of birth, diagnoses, and other unnecessary personal or clinical data in integration payloads and logs.
- Amounts are integer minor units (`amountMinor`) with an ISO currency. For NGN, `5,800,000` means ₦58,000. Never use floating-point amounts.
- Every write requires an `Idempotency-Key`. Reusing a key with a different request body returns `409 Conflict`. Event consumers deduplicate using `eventId`.
- Webhook delivery uses HMAC-SHA256 over the exact raw request body with a timestamped signature header. Reject stale timestamps, compare signatures in constant time, and deduplicate event IDs. Retry transient non-2xx deliveries with bounded exponential backoff; dead-letter after the agreed retry window.
- Payment state is authoritative only after a verified payment-processor callback. MobileApp UI state or a client-submitted “paid” flag is not proof of settlement.
- Do not put access tokens, secrets, full webhook payloads containing personal data, or payment credentials in application logs.

## Resources and lifecycle

- **Invoice:** `DRAFT → OPEN → PARTIALLY_PAID → PAID`; may become `CANCELLED` before payment. Corrections after publication should use a new revision or cancellation plus replacement, not silently mutate a paid invoice.
- **Family funding request:** `OPEN → PARTIALLY_FUNDED → FUNDED`; may become `CANCELLED` or `EXPIRED`. Each contribution has its own payment status and processor reference.
- **Eligibility result:** `ELIGIBLE`, `PARTIALLY_ELIGIBLE`, `INELIGIBLE`, or `PENDING`; include a short reason code, validity time, covered amount, and patient responsibility where available.
- **Consent record:** `RECORDED` or `REVOKED`, with timestamps, policy version, estimate reference, and auditable actor context. The provider backend must enforce the local policy for whether consent is required.
- **Integration event:** immutable event ID, type, occurrence time, tenant reference, resource reference, and event-specific data. Consumers must tolerate duplicate and out-of-order deliveries and fetch the latest resource when order matters.

## Error handling

Errors use `application/problem+json` (RFC 9457). Clients should retry network errors, `408`, `429`, and `5xx` with backoff while preserving the idempotency key. Do not automatically retry validation, authorization, or conflict responses. Honor `Retry-After` when provided.

## Decisions to confirm before implementation

- Which system owns the integration gateway and publishes this API: WelliPay platform, Provider backend, or a shared integration service?
- What stable, opaque patient and sponsor references are shared, and how is account linking/revocation performed?
- Is invoice delivery push-only, pull-only, or both? What are supported expiry and correction rules?
- Which payment processor is authoritative, which statuses are sent, and what event retry/retention SLA is required?
- Which HMO/insurance source can provide eligibility, and does any response represent a formal pre-authorization?
- What evidence and retention period are required for financial consent in each operating jurisdiction?
- What are the production hosts, token issuer/audience, scopes, webhook signing-key rotation procedure, and support contacts?

## Acceptance checks

- Creating the same invoice twice with the same idempotency key produces one resource and one mobile delivery.
- A payment cannot be recorded as successful from a MobileApp client assertion alone; only a verified processor event updates it.
- A webhook with an invalid signature, stale timestamp, or duplicate event is rejected or safely ignored according to the agreed response policy.
- A credential scoped to one tenant cannot read or mutate another tenant's resources, even if a foreign `facilityRef` is supplied.
- Family contributions reconcile individually and aggregate correctly to the invoice without exceeding the requested total.
- Consent records identify the estimate revision and displayed payer split that the patient accepted.
- No card/bank credentials or unnecessary patient/clinical data appear in API payloads, browser storage, or logs.