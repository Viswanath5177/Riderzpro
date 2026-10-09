# Amrutha — Day 1 Rider Panel Audit and Integration Handoff

**Owner:** Amrutha  
**Working branch:** `feature/amrutha-rider`  
**Base:** refreshed `origin/main` at `362f1a1744f2d7f1cd1de657a022a1baac24dce7`  
**Audit date:** 09 October 2026  
**Scope:** Day 1 cross-module workflow audit, integration matrix, gaps and a testable Day 2 integration ticket. This is a repository audit and proposed contract; it does not claim that a backend/API is already implemented.

## Day 1 outcome

The existing website has a technician prototype with an online toggle, job cards, appointment/address details, navigation and customer call links, an active installation checklist and local status updates. Its state is browser-side mock data. The rider portion can begin now: document the user workflow, audit the interfaces and prepare fixtures/acceptance cases. **Amrutha does not need to wait to complete this Day 1 work.** Production/API integration must wait for the order/appointment/job contract, role permissions, status-transition rules and backend endpoint ownership to be agreed with Pushpam, Vamsi and Viswanath.

## Repository evidence inspected

| Area | Current implementation | Day 1 finding |
|---|---|---|
| Rider navigation | `web/js/app.js` exposes Technician tabs for assigned jobs, active work and earnings. | Web prototype exists; mobile client is not present in the inspected tree. |
| Job queue | `web/js/views/technician_view.js` filters orders with the current technician ID **or** any order in an assigned/in-progress status. | The broad status alternatives can show another technician’s job. Production must return only jobs assigned to the authenticated rider. |
| Job summary | Cards read order number, bike, battery, install type, slot, address/service center and customer phone from the local order object. | These fields need one agreed API shape; address and direct contact must be permission-filtered. |
| Customer contact | Queue cards render `tel:${job.customer_phone}` without a local assignment check. The active card does the same. | Contact is exposed to anyone shown a card. Backend authorization and client visibility must both require a current assignment. |
| Vendor handoff | Vendor UI offers order acceptance/rejection and technician assignment; assignment writes a technician ID and status in the in-memory store. | The handoff exists only as local state. No durable assignment, conflict handling or API authorization is present. |
| Rider actions | “Start Job & En Route” sets `technician_on_the_way`; checklist steps update the local order; completion sets `completed`. | No rider accept/decline action exists. `updateOrderStatus` accepts arbitrary status changes without actor or transition validation. |
| Active job selection | Active view chooses the first order in an in-progress status, falling back to `orders[0]`. | It can open a different order than the selected card; the active job must be selected by a specific job/order ID. |
| Persistence | `web/js/state/store.js` mutates browser memory and notifies local views. | No API server/database was found in the current branch tree; all behavior is prototype-only. |

## Rider workflow and state/permission checklist

| Workflow stage | Rider action / view | Required data and checks | Result/event |
|---|---|---|---|
| Dispatch | See available assignment notification/job | Job is assigned to authenticated rider; show only minimum dispatch details. | `technician_assigned` job appears once; duplicate assignment is rejected. |
| Review | Open job and appointment | Order reference, bike and battery, service type, scheduled local time/timezone, duration, service location and needed instructions. | No status change. Address/contact reveal only after an authorized assignment. |
| Respond | Accept or decline with a reason | Assignment still belongs to rider; decline reason required; stale/reassigned job rejected. | `technician_assigned` → `accepted` or `declined`; on decline, notify dispatcher and release/reassign according to agreed rules. |
| Travel | Start route / mark en route | Rider accepted; appointment not cancelled; permitted address access. | `accepted` → `technician_on_the_way`, event timestamp recorded. Live GPS is out of MVP unless separately approved. |
| Install | Work through checklist and report issue | Rider owns job; checklist evidence belongs to this job; invalid/out-of-order operations rejected. | `technician_on_the_way` → `installing`; checklist updates are auditable. |
| Finish | Submit completion evidence | Required checks, evidence and customer sign-off rules agreed; rider still owns job. | `installing` → `completed`; order timeline and customer notification update. |
| Exception | Report blocked/failed/cancelled or customer unavailable | Reason, actor, timestamp; define who can cancel/reopen/reassign. | Exception state follows owner-approved transition matrix; never silently force completion. |

**Transition policy is a proposal for team review, not an implemented state machine.** In the current prototype, `technician_assigned` goes directly to `technician_on_the_way`, then `installing`, then `completed`; there is no `accepted` or `declined` state. Confirm whether to add those states and who can assign/reassign before wiring production actions.

## Cross-module integration matrix

| Producer / owner | Rider consumes | Minimum contract fields | Dependency / decision |
|---|---|---|---|
| Customer checkout — Sathesh | Scheduled order/appointment | `orderId`, `customerId`, `bikeId`, `batteryId`, `appointmentId`, install type, selected slot, location reference, order status | Checkout owns creation; use stable IDs and store UTC time plus timezone for display. |
| Catalog / fitment — Muni, Harshith, Vamsi | Safe work instructions | Battery/product ID, bike make/model/year/variant, verified fitment outcome, compatibility evidence/reviewer, required electrical/physical constraints | Unknown fitment must not be presented to rider/customer as verified compatible. |
| Seller/order acceptance — Vamsi and seller workflow | Dispatch eligibility | Seller/provider ID, order status, stock/readiness state, rejection reason, eligible service offering | Define when an accepted seller order becomes assignable; rider cannot take unready work. |
| Service logistics — Viswanath | Appointment/location | `appointmentId`, start/end, timezone, service mode, service-center ID or address reference, coverage, status | Agree slot capacity, cancellation/reschedule, address access and dispatch window. |
| Backend and authorization — Pushpam, Vamsi | Job list, job detail and mutations | Authenticated actor/rider ID, assignment ID, job/order ID, status, prior/new state, reason, event timestamp | Server is source of truth; enforce ownership and allowed transitions for every request. |
| Rider panel — Amrutha | Displays shared order/job state | `jobId`, `orderId`, `appointmentId`, `assignedRiderId`, safe customer display name, contact permission, location permission, status, event history | Day 1 mapping and acceptance cases prepared here; integrate after contract/permissions are agreed. |
| Customer updates — Sathesh / client owners | Rider status events | Event ID, order/job ID, actor role, previous/new status, reason, UTC timestamp | Customer UI shows permitted progress; reveal rider contact only after assignment, per server policy. |

### Proposed rider API boundary for contract discussion

These are interface proposals only; no endpoint is confirmed to exist.

| Operation | Proposed request/response | Authorization / behavior |
|---|---|---|
| List my jobs | `GET /rider/jobs?status=...` → paginated job summaries | Derive rider identity from auth; never accept an arbitrary rider ID as proof of access. |
| Read one job | `GET /rider/jobs/{jobId}` → job, appointment and allowed location/contact projection | Verify current assignment; mask contact/location until policy allows. |
| Accept assignment | `POST /rider/jobs/{jobId}/accept` | Compare-and-set assignment/status; idempotent retry; reject stale or reassigned jobs. |
| Decline assignment | `POST /rider/jobs/{jobId}/decline` with `{reason}` | Require reason; emit dispatch event; server releases/reassigns only per agreed policy. |
| Update job status | `PATCH /rider/jobs/{jobId}/status` with `{status, reason, idempotencyKey}` | Enforce role, ownership and transition graph; persist actor and UTC event. |
| Update checklist/evidence | `PATCH /rider/jobs/{jobId}/checklist` or agreed evidence endpoint | Verify assignment and checklist schema; record evidence metadata and audit actor. |

## Day 1 completion checklist

- [x] Audited rider/technician UI, mock store, vendor dispatch handoff and customer tracking references in the current base.
- [x] Mapped assignment, review, accept/decline, travel, install, completion and exception stages.
- [x] Listed current implementation gaps and cross-module field/owner dependencies.
- [x] Prepared proposed API boundaries and permission expectations for contract review.
- [x] Wrote a Day 2 integration ticket with observable acceptance criteria below.
- [ ] Team confirmation: status vocabulary, decline/reassignment policy, appointment fields/timezone, contact/location reveal policy, endpoint owner/version.

## Independent rider-panel changes made on this branch

After recording the audit, this branch also applies the safe UI/store corrections that do not need a shared server contract:

- The demo rider queue now includes only jobs whose `technician_id` matches the signed-in demo rider, and only while the job is assigned or in progress. Status alone can no longer pull another rider's job into this rider's queue.
- The active checklist is tied to the job selected from that rider's queue. Checklist updates and completion resolve the selected, owned active job instead of falling back to the first order in the entire store.
- Starting an en-route job checks that it is still assigned to this rider and still in the assigned state. Opening an active job checks ownership too.
- The local completion action requires an installing job and all six checklist values to be explicitly complete.
- Missing checklist data now starts with every step incomplete, so the UI cannot imply that unrecorded checks were already performed.
- Service-center cards now show the service-center address when it is available, alongside the center name.
- The en-route confirmation now makes clear that only demo status changes are recorded; live GPS broadcasting is not implemented.

These are client-side demo safeguards, not a substitute for backend authorization, persisted state, race-safe assignment, or approved production status rules. The existing vendor/store helpers can still set statuses without validating an actor; production enforcement remains a backend dependency.

## Day 2 integration ticket — Rider assignment and job detail contract

**Owner:** Amrutha (rider UI and acceptance cases); Pushpam/Vamsi (API, persistence and authorization); Viswanath (appointment/service rules); Sathesh (order handoff); adjacent reviewer to be named at kickoff.

**Goal:** connect the rider panel to an agreed job/appointment contract while retaining the local fixture adapter for development. Do not start production mutations until API and transition decisions are recorded.

**Acceptance criteria:**

1. Rider job list includes only jobs assigned to the authenticated rider; another rider cannot read them by changing a client-supplied ID.
2. Job detail shows order reference, bike/battery, service type, appointment time with timezone, and the correct service location for home visit or center service.
3. Customer address and direct contact are omitted/disabled until the server says the assignment is authorized; access is denied after reassignment/cancellation.
4. Accept/decline controls appear only for a pending assignment; decline requires a reason and produces a dispatcher-visible event.
5. En-route, installing and completion actions follow the approved transition graph; stale, duplicate and out-of-order requests return a recoverable error without corrupting the job.
6. Each persisted status event records actor, prior/new state, reason and UTC time; the customer sees only approved timeline updates.
7. Loading, empty, unavailable, unauthorized, stale-assignment, offline/retry and successful states are covered by test cases on the rider web surface; API tests belong to the backend owner.
8. The pull request includes API contract/version, fixture updates, screenshots or demo steps, test evidence and a reviewer from an adjacent module.

**Blocked production work:** endpoint payloads, database writes, permission enforcement and state mutation integration await the shared API/auth/status decision. Independent UI audit, workflow mapping, mock contract/fixtures and acceptance-case drafting can proceed immediately.

## Branch and handoff notes

- This work is on the personal branch `feature/amrutha-rider`, created from the refreshed `origin/main` (`362f1a1`).
- Keep the branch personal to Amrutha; commit rider-panel work here and submit a pull request to the agreed integration branch after the team contract review.
- No other contributor’s branch or files were merged or edited for this Day 1 deliverable.
