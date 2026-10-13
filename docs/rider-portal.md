# Rider portal: current implementation and launch checklist

## What is implemented

The rider portal currently lives at `/rider` in the customer application's repository and deployment. It uses its own layout and routes, but shares OTP authentication and the server-side application database.

- `/rider` — onboarding landing page.
- `/rider/apply` — India-focused application form for legal name, OTP-verified Indian mobile number, city, state/UT, and vehicle. Motorized vehicles require a registration number; the bicycle option is explicitly pedal-only.
- `/rider/status` — applicant decision and reviewer note.
- `/rider/dashboard` — gated workspace visible only to an approved application. It shows assigned deliveries and manual state transitions, an earnings summary, and in-app updates.
- `/admin/riders` — admin-only queue for pending applications, with approve, correction, and reject decisions; approval remains disabled by default.
- `/admin/rider-deliveries` — admin-only manual dispatch screen for assigning delivery offers to approved riders in Andhra Pradesh or Telangana.
- `/dashboard/rider` — compatibility redirect into the current rider flow.

Application submission is tied to the signed-in account's phone number, after OTP verification. Submissions and resubmissions run in a transaction, store explicit accuracy/eligibility/privacy acknowledgements, and create an event entry. Reviewer decisions are also transactional and recorded with the reviewer account. Admin list/review server functions independently enforce the admin role.

## Activation safety gate

Rider approval is disabled by default. The server accepts an approval only when `RIDER_APPROVALS_ENABLED=true` is set **after** Riderzpro has approved its India policy, configured the authorized review process, and trained reviewers. The reviewer must also attest that the required checks were completed. Do not enable this flag to bypass a missing policy or review process. The UI and database do not accept or store identity documents.

## India policy considerations

There is no basis in the current implementation to claim that one particular identity document or a universal commercial “KYC” flow is mandated for every Riderzpro rider. Legal counsel and operations must define an India-wide baseline and state/vehicle-specific differences before activation.

For motorized vehicles, the Motor Vehicles Act addresses an effective driving licence (sections 3–4), registration (section 39), and third-party insurance (section 146). The Motor Vehicle Aggregator Guidelines, 2025 and each state's implementing rules/licensing position also need counsel review for Riderzpro's precise goods-delivery/platform model; do not assume passenger ride-hailing requirements apply unchanged. The Andhra Pradesh and Telangana transport departments list their state Motor Vehicles Acts and Rules, which should be checked against the operating model. Do not apply motor-vehicle requirements to a pedal-only bicycle without checking whether a powered cycle meets the relevant motor-vehicle definition.

Personal-data collection should be limited to a stated purpose. The privacy notice and consent workflow should be reviewed against the Digital Personal Data Protection Act, 2023 and the phased Digital Personal Data Protection Rules, 2025 before production. The portal records which notice version was acknowledged, but this prototype is not a complete privacy-rights or retention-management system.

Official references:

- [Motor Vehicles Act, 1988 — India Code](https://www.indiacode.nic.in/bitstream/123456789/15390/1/the_motor_vehicles_act%2C_1988.pdf)
- [Motor Vehicle Aggregator Guidelines, 2025 — MoRTH](https://parivahan.gov.in/sites/default/files/NOTIFICATION%26ADVISORY/MV-Aggregators-Guidelines-2025%20-%20English%20and%20Hindi.pdf)
- [Andhra Pradesh Transport Department — Acts and Rules](https://www.aptransport.org/html/actsrules.html)
- [Telangana Transport Department — Acts and Rules](https://transport.telangana.gov.in/html/actsrules.html)
- [Digital Personal Data Protection Rules, 2025 — Gazette of India / MeitY](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf)
- [Code on Social Security, 2020 — Ministry of Labour and Employment](https://labour.gov.in/sites/default/files/ss_code_gazette.pdf)

## Database and current operational scope

- PostgreSQL: apply migrations `001_auth.sql` through `004_rider_operations.sql` in order.
- `npm run db:migrate:postgres` runs those files with a `schema_migrations` checksum ledger, a PostgreSQL advisory lock, and one transaction per migration. It requires `DATABASE_URL`. It refuses to guess the history of a pre-existing database that has `app_users` but no migration ledger. Reconcile such a database with a DBA before running it.
- Local SQLite: `npm run db:migrate:local` applies the local migrations and upgrades the existing application table without deleting application rows.
- Keep `database/*.db` local and uncommitted.

Migration 004 adds in-app notifications, admin-created delivery offers, delivery state events, an earnings ledger, and payout/reconciliation tables. No bank account numbers, identity files, or raw GPS history are stored. Dispatch and delivery progress are manual; the screen is not yet connected to customer checkout, route optimization, proof-of-delivery, or GPS. Earnings amounts are entered by an admin and become ledger entries when marked delivered; a production compensation policy and correction controls are still needed. Payout tables are groundwork only: there is no payout creation, approval, Razorpay API call, webhook, or reconciliation UI yet.

## Production architecture and rollout

The intended shape is a separate rider frontend deployment backed by the same trusted API and PostgreSQL database as the customer app. Riderzpro will operate its own rider dispatch and delivery workflow; no third-party courier network is required. Keep rider approval, job assignment, delivery state, location ingestion, and payout writes server-side; do not put database or provider credentials in `VITE_*` variables or browser code.

```text
riders.<approved-domain> ── rider frontend ──┐
                                              ├── authenticated server/API ── PostgreSQL
customer.<approved-domain> ─ customer app ───┘               │
                                                           ├── private document store (only if policy requires uploads)
                                                           ├── SMS/email provider
                                                           ├── Riderzpro-owned dispatch and delivery services
                                                           ├── maps/routing provider (to be selected)
                                                           └── Razorpay payouts
```

Deployment sequence:

1. Approve an eligibility matrix for statewide coverage in Andhra Pradesh and Telangana, for each state and vehicle class: document/check requirements, reviewer roles, correction/rejection reasons, retention/deletion periods, privacy notice, and appeal/support process. The application currently asks for state and city but that does not define eligibility policy.
2. Choose the hosting/deployment provider and create a rider-specific deployment from this repository. Give it a distinct hostname such as `riders.<approved-domain>` and route that hostname to the rider deployment. Configure independent build, release, rollback, health monitoring, and access to the shared server/API. A second hostname pointed at the current customer deployment is still one deployment.
3. Choose shared API versus same-origin API routing. If the rider frontend calls a different API origin, explicitly allow only the production rider/customer origins, credentials, required methods, and headers. For cookie sessions across subdomains, use HTTPS and configure cookie domain/same-site rules deliberately; the current host-only cookie will not automatically be shared across separate hosts. Prefer a same-origin reverse proxy or a central auth domain over broad cross-origin cookies.
4. Provision a production PostgreSQL database and separate migration-owner and least-privilege application credentials. Back up and verify restore first. For a new empty database, set `DATABASE_URL` in a protected operator environment and run `npm run db:migrate:postgres`; inspect `schema_migrations` and verify OTP tables, rider application tables, indexes, and constraints. Do not run this against an existing schema without reconciling its migration baseline.
5. Configure SMS OTP credentials and sender registration for Indian delivery, production callback/network access, rate limiting, abuse monitoring, and delivery alerts. Verify real delivery with an authorized internal test number before opening signups; never expose OTP or provider secrets to the browser.
6. Only if the approved policy requires documents to be uploaded, configure a private object store with encryption, private-by-default access, short-lived upload/download authorization, strict size/type limits, content scanning, audit events, deletion jobs, and tested backup/retention behavior. Otherwise keep document upload out of the portal; record only the minimum verification outcome and audit evidence the approved policy calls for. No document upload endpoint exists today.
7. Implement external decision notifications with retryable delivery; the portal currently provides in-app updates only. Expand dispatch with customer-order integration, safe offer acceptance/locking, proof-of-delivery, and exception handling. Decide whether location tracking is needed and, if so, approve consent and retention rules before collecting it. Define compensation and correction rules for the earnings ledger. Confirm the exact Razorpay payout product, account configuration, recipient/fund-account flow, dual-approval rules, and webhook/reconciliation process before implementing live payouts.
8. Exercise the full staging flow with synthetic data, including OTP, submit, reviewer correction/review, notices, delivery transitions, location opt-in/off, earnings reconciliation, and Razorpay payout failure/retry. If document upload is policy-required, also test file access, scanning, retention, and deletion. Obtain launch sign-off from policy, security, operations, and support owners.
9. Keep `RIDER_APPROVALS_ENABLED` unset or `false` until steps 1–8 are approved and operational. Then enable it only in the production server environment, and use a restricted reviewer group. A frontend deployment must not control this flag.

## External decisions and credentials still required

- Statewide launch area in Andhra Pradesh and Telangana (as selected; state and vehicle policy is still pending).
- India eligibility and state/vehicle check policy, document list, retention periods, privacy/legal review, and reviewer/appeal process.
- Hosting provider and rider hostname; API origin and session/cookie topology.
- Whether the approved verification policy requires applicants to upload documents. If yes, choose private document storage and configure scanning, retention, deletion, and reviewer access. If no, do not provision document storage for rider KYC uploads.
- Production PostgreSQL URL, migration owner/application credentials, backup/restore plan, and OTP provider credentials.
- Notification and maps/routing providers, if needed, plus commercial terms. Dispatch is Riderzpro-operated; no third-party courier is required. Razorpay is selected, but the payout product/account setup and recipient onboarding, dual-approval, webhook, and reconciliation details remain to be confirmed.

## Remaining work before launch

1. Approve the rider eligibility and verification policy for statewide Andhra Pradesh and Telangana operations, including vehicle-class rules, required checks, applicant outcomes/appeals, reviewer roles, notice language, and retention periods.
2. Decide whether the approved checks require document uploads. If yes, build secure private storage and review; if no, keep upload/storage out of the rider portal and record only policy-approved verification results.
3. Provision production PostgreSQL, reconcile migration history, apply migrations using the guarded runner, configure least-privilege roles, backups and restore, monitoring, and production SMS OTP delivery.
4. Deploy the rider frontend independently with its own hostname and release/rollback/monitoring; choose the shared API/auth routing and configure cookies and allowed origins for the actual domains.
5. Extend the current manual dispatch and delivery flow with order integration, race-safe assignment/acceptance, proof-of-delivery, exception handling, and operational controls. Riderzpro owns dispatch; no outside courier service is required. Add location only if a documented product and privacy need is approved.
6. Add external applicant decision notifications with retry/recovery, correction/resubmission guidance, appeals/support procedures, and reviewer access controls/training. The current notifications are in-app only.
7. Define compensation, then implement the Razorpay payout lifecycle with verified recipient setup, dual approval, idempotency, signed webhook verification, failure/reversal handling, and reconciliation. Razorpay is the chosen provider, but its product and account configuration must be confirmed before live transfers.
8. Run staging sign-off with synthetic data across application, approval, dispatch, privacy/location, notifications, and payout flows. Keep `RIDER_APPROVALS_ENABLED` false until policy, security, operations, and support owners sign off.

The current local development database was migrated additively. Do not commit that database file.
