# Backend handoff notes (no endpoints assumed)

Do not wire guessed URLs. Ask the backend developer to supply the actual API contract and then map each UI action to an approved endpoint.

| Feature | Contract needed | Notes |
|---|---|---|
| Admin auth | login, current session/profile, logout, password reset | Server validates credentials and role; protect every endpoint |
| Dashboard | summary metrics, time-series analytics, recent activity | Define timezone, currency and metric definitions |
| Users | list, detail, status update, notes | Pagination, search and role-specific PII visibility |
| Staff | list, invite, role update, revoke access | Strong authorization and audit events |
| Finance | ledger, deposits, refunds, adjustments, reconciliation | Idempotency, approvals, append-only ledger and explicit status transitions |
| Services | service catalog, enable/disable, product mappings | Backend validates service/provider combinations |
| Orders | list, detail, retry eligibility, cancel/refund where supported | Retry must be safe and idempotent |
| Providers | provider list, health, mapping, credential update | Secrets remain server-side; redact logs |
| Pricing | product cost and selling price, preview, publish | Server validates margin, currency and effective time |
| Support | ticket list/detail, reply, assignment, status update | Permission checks for customer data |
| Marketing | drafts, scheduled campaigns, delivery status | Rate limits, consent rules and provider delivery outcomes |
| Reports | filtered report data and authorized exports | Limit access to sensitive exports |
| Audit | events list/detail, security alerts | Server-generated audit events; do not trust browser submissions |
| Settings | read/update allowed configuration | Validate keys and permissions server-side |

Expected response shape, error shape, pagination conventions, CSRF/CORS requirements, and session mechanism should be documented by the backend developer before wiring.
