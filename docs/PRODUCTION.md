# Production security and deployment readiness

## Stop: school policy and launch blockers

**Do not publicly deploy with LRN-only login.** An LRN identifies a student but does not
prove identity. Anyone who knows or guesses one can impersonate the student, view and
submit their results; the 404 response also permits roster enumeration. The school has
explicitly required LRN-only login and no account lockouts: this is a known school-approved
risk for the current design, **not an approval for public deployment**. No student password,
PIN, access code or student login rate limit has been added. Propose an individually issued
access code or PIN per student, distributed privately and recoverable through an authorised
school process, for explicit school approval. Do not implement it without that approval.

Other launch blockers: validate the migration, queries, restart/failover and restoration
against the actual MySQL service; perform browser/HTTPS and security testing; obtain school
privacy/retention and incident-response approval; configure independent gateway controls,
reliable backups and monitored alerts; perform a data protection assessment for minors under
the Philippine Data Privacy Act. Do not use real student data in test environments.

## Audit findings (before Phase 5A)

| Severity | Finding and treatment |
| --- | --- |
| Critical | LRN-only impersonation and enumeration. Preserved by school requirement; public launch blocked pending approval of stronger individual authentication. |
| High | Sessions lived in process RAM and were lost on restart; production cookies could be insecure. Replaced with persistent hashed-token sessions and mandatory production Secure cookies. |
| High | No login throttling made admin password guessing and resource exhaustion easier. Added per-source admin throttling; distributed gateway controls are still required. Student accounts are never throttled or locked by this application. |
| High | Cookie-authenticated writes relied on SameSite alone. Production requires an exact Origin and custom request header, rejecting cross-origin/simple form writes including login CSRF. |
| Medium | Production defaulted to local/root DB settings and leaked database details and student identifiers through logs. Production now requires explicit config and suppresses public DB detail and personal request logging. |
| Medium | CSV exports include personal data, exports are unbounded in memory, and backups/retention were undefined. CSV neutralization remains; establish controlled export, retention and backup processes below. |
| Medium | Existing UI uses `innerHTML` for generated art. Student/admin values in management and reports are rendered with text nodes, but any future use of user-controlled HTML is an XSS risk. Independently audit all UI sinks and apply a tested frontend CSP at the proxy. |
| Medium | Admin password creation previously echoed typed passwords; interactive entry now hides input. Command-line password arguments can still leak through shell history and process lists: use the interactive command in a private terminal. |

The server continues to validate routes and use parameterized SQL for values. Admin/report
endpoints use server-side `requireAdmin`. Frontend guards are not security boundaries.
No claim of a comprehensive penetration test is made.

## Architecture and configuration

Recommended: a school-controlled HTTPS reverse proxy serves the built static frontend and
forwards `/api` to the Node/Express process on a private interface; MySQL is private and
never directly internet-accessible. Keep all browser traffic at **one HTTPS origin** so the
SameSite cookie and CSRF check work. Configure proxy firewall rules to prevent direct access
to the API and database. Use a private encrypted DB network or verified MySQL TLS; the
current app does not configure MySQL TLS, so verified TLS or equivalent network encryption
must be provided and tested before deployment. Protect database credentials and backups in
a secret manager, with separate least-privilege runtime and migration users.

Production environment (injected securely, never committed):

* `NODE_ENV=production` and `PORT` (API listens on all interfaces; firewall it).
* `FRONTEND_ORIGIN=https://school.example` — exact scheme/host/port, no path/trailing slash.
* `SESSION_COOKIE_SECURE=true`; HTTPS is terminated by the trusted proxy. `SESSION_MINUTES`
  defaults to 120, allowed 1–480; sliding expiry has an 8-hour absolute maximum.
* Explicit `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` (non-root), `DB_PASSWORD`.
  `SESSION_COOKIE_NAME` is optional; changing it invalidates browser cookies.
* Keep the frontend API base relative (`/api`); do not put database credentials or secrets
  in `VITE_*` variables. `npm run build` produces `dist/` for the proxy/static host.

Production exits on missing required values, placeholder DB password, root DB user, invalid
port/origin, or insecure cookie configuration. No permissive CORS headers are sent. Production
mutating requests must contain the exact configured `Origin` and `X-Safe-Squad-Request: 1`;
the frontend sends that header. Configure the proxy to reject unexpected Host headers and
strip client-supplied forwarding headers. Do not expose a dev server or Vite preview publicly.
The proxy should enforce TLS, HSTS and an independently tested frontend CSP, anti-clickjacking,
no-sniff and no-referrer headers; the API supplies its own restrictive headers.

Apply `npm run db:migrate` with the migration account after a backup and before starting this
version. It retains existing students/results, adds `is_active` if absent, and creates
`sessions` if absent. Fresh installs get both through `db:setup`; the setup SQL uses the
`safe_squad` database and includes sample students, so review/remove sample data and do not
run that seeding script against production. Sessions contain only a token hash and minimal
identity data, expire after inactivity or 8 hours, and expired rows are cleaned hourly.
Existing in-memory sessions cannot migrate and users must log in once after this upgrade.

The admin rate limiter is per **direct socket address**, in-process and resets on restart;
when behind a proxy all requests may share its address. Configure a trusted gateway with
privacy-preserving, distributed admin rate limiting and alerting, and carefully test shared
school networks. Do not rate-limit or lock out student accounts. Admin passwords use scrypt,
but the synchronous hash verification can still be abused to exhaust CPU; size capacity,
protect the gateway, and consider asynchronous bounded verification before launch.

## Backups, restore and retention

1. School owner approves retention durations, access roles, export handling and deletion
   requests; no retention period has been assumed in code. Restrict database access, encrypt
   at rest and in transit, audit access, avoid logs containing LRNs/names, and minimise exports.
2. Take regular encrypted, access-controlled, off-site backups and monitor failures. A
   dedicated backup account needs only appropriate read/backup privileges. Supply credentials
   via a protected MySQL option file or secrets manager, never command-line passwords.
   Example (replace placeholders locally; `age` is an external encryption tool):

   ```sh
   mysqldump --defaults-extra-file=/secure/backup.cnf --single-transaction \
     --ignore-table=safe_squad.sessions safe_squad | age -r "$BACKUP_RECIPIENT" > backup.sql.age
   ```

   Verify command success using shell `pipefail`, encrypt keys separately, restrict permissions,
   and test the pipeline in your actual environment. Sessions are deliberately excluded so
   restore does not revive old tokens. Keep backup and key retention aligned to school policy.
3. Restore **first to a new, isolated database**, not over live data: decrypt into a secure
   temporary stream and import with a protected option file, e.g. `age -d -i /secure/key.txt
   backup.sql.age | mysql --defaults-extra-file=/secure/restore.cnf safe_squad_restore`.
   Run migrations against that database using `DB_NAME=safe_squad_restore`, verify row counts,
   sample records and results with synthetic fixtures, and test application access. Arrange
   approved cutover and rollback; the restored session table must be empty so everyone logs in
   again. Never overwrite live data without a tested, authorised recovery plan.
4. Periodically perform restore drills, check backup integrity, access logs and encryption keys;
   document recovery time and data-loss targets. Follow a documented incident procedure.

## Test boundaries

`npm run test:management`, `npm run test:reports` and `npm run test:security` run real Express
routes against fake databases. The security test uses a file-backed fake session store across
API process restarts and inspects production response headers over HTTP; it does **not** test
MySQL, HTTPS transport, real browser cookie enforcement, proxy configuration or multi-instance
production rate limiting. Validate all of those in isolated staging before any launch.
