# WelliPay Provider Workflow Validation

## Goal

Find workflow friction in the provider console before connecting real patient, payment, or payer data. This is a usability check, not a test of the participant. The app currently uses illustrative demo data and does not process payments.

## Participants and setup

- One finance manager or billing lead
- One front-desk cashier
- 20–25 minutes per session
- Use the app in a desktop browser at `index.html`; use only the supplied sample records
- Ask permission before screen recording or note-taking; do not enter real patient details or financial credentials

## Opening script

“Thanks for helping. We’re testing the software, not you. I’ll give you a few realistic tasks. Please think aloud and do what you would normally do. I may stay quiet while you work, but you can stop or ask a question at any time. This is sample data; no real payments will be made.”

Do not explain where controls are or describe the intended path. If the participant asks what to do, say: “What would you expect to do next?” If they are blocked, let them explain what they expected before offering any help.

## Tasks

### Finance manager

1. “You’re reviewing today’s finances. Find an unmatched payment for ₦85,000 and decide what you would do with it.”
2. “You need to understand what the facility is owed and how old those balances are. Find the information you need for your review.”
3. “A refund and a write-off are waiting for review. Process one the way you would in your role, and show me what tells you the decision was recorded.”
4. “A draft HMO claim is ready for the next step. Find it and continue its workflow.”

### Front-desk cashier

1. “Femi has a ₦58,000 bill and wants his brother to pay. Collect the bill as you normally would.”
2. “Ngozi has Reliance HMO — Gold coverage. Prepare her ₦58,000 bill, get the payer decision, and explain what the patient is being asked to authorize.”
3. “A patient presents a WelliPass. Continue the desk workflow using the pass.”

The HMO decision and payment controls are simulations. Ask the participant to describe what they would need to verify before doing this with a real patient.

## Observer notes

For each task, record:

| Task | Completed without help? | Time | Hesitations / wrong turns | Missing or unclear information | Confidence (1–5) |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

Capture the participant’s exact words where possible. Note what they expected before revealing or explaining any control. Do not treat a feature request as proof of a usability problem; record the underlying need separately.

## Follow-up questions

- “What did you expect to happen there?”
- “Which part took the most effort?”
- “Was anything unclear or missing before you could make that decision?”
- “How would you normally handle this today?”
- “What would make you hesitate to use this with a real payment or patient?”
- “What is the one change that would make this workflow safer or faster?”

## Triage after both sessions

- **Blocker:** participant cannot finish or makes a consequential wrong choice
- **Risk:** participant can continue but lacks information needed to trust the action
- **Friction:** participant finishes but hesitates, backtracks, or asks for help
- **Request:** a capability they need that the prototype does not represent

Prioritize issues seen by both roles or that could cause an incorrect payment, authorization, claim, refund, or reconciliation decision. Keep backend, compliance, and integration requirements in a separate list from interface usability findings.

## Facilitator preflight (not user findings)

Smoke-tested in the demo: HMO authorization → 80/20 split → consent → collection; family request → pending → paid; WelliPass patient switch; draft claim submission; both reconciliation match outcomes; and distinct approval/rejection decisions recorded with actor and time. “Not a match” increments Exceptions and leaves the payment unmatched.

Known prototype limitations: demo state is in-memory and resets on reload; approval decisions are illustrative and are not persisted or connected to real authorization controls. Treat the queue as a UI demo, not an operational approval record. Chat messages are HTML-escaped in this prototype; production implementations should render untrusted user content as text, not concatenate it into HTML. Do not use this prototype to authorize or process real transactions.