# Safe Squad deployment preparation

**This is a preparation guide, not an authorization to launch.** No hosting account or
public deployment is assumed. Do not deploy real student data for a presentation. The
school requires LRN-only student login with no student passwords, PINs, access codes, or
account lockouts; this implementation preserves that requirement. An LRN is not a secret:
anyone who knows or guesses it can impersonate a student, see their results and submit
results. The endpoint can also reveal whether an LRN exists. A public online deployment
with real students remains **blocked** pending the school's explicit security/privacy
policy approval and a safe authentication decision. Do not add a second factor or change
this requirement without school authorization. See [PRODUCTION.md](PRODUCTION.md).

For a school-controlled presentation, use an isolated environment with **synthetic**
accounts and results, school approval, and restricted access; do not present it as a
production-ready service or expose it publicly before the blockers are resolved.

## Recommended architecture

```text
Student/admin browser
        | HTTPS (one school-controlled origin)
        v
School-controlled reverse proxy / gateway
  ├── /api/* ──> private Node.js/Express process (same /api path)
  └── /*     ──> Vite-built dist/ static files
                       API ──> private MySQL, including persistent sessions
```

The proxy terminates HTTPS, serves the frontend and forwards `/api` without stripping that
prefix or changing the browser's `Origin`. The API and MySQL must not be publicly reachable.
Sessions are stored in MySQL, not the application filesystem, so a process restart does not
log out unexpired sessions. The API uses a Secure, HttpOnly, SameSite=Lax cookie. Production
writes require the exact `FRONTEND_ORIGIN` plus a custom header set by the app. Do not split
the frontend and API into unrelated public origins; the cookie and CSRF policy require this
same-origin arrangement.

### Hosting choices (no provider selected)

| Approach | Cost and limitations | Maintenance |
| --- | --- | --- |
| School-owned Linux server with a reverse proxy and MySQL | No provider subscription if hardware exists, but hardware, power, network, domain, certificates, backup and staff time still cost money. A single server is a single failure point. | School IT patches OS, Node and MySQL, renews certificates, monitors, manages backups and restores. |
| Managed app host + managed private MySQL + HTTPS gateway | Usually recurring charges for compute, database, storage, backups and network; free tiers may sleep, expire, omit private networking or lack reliable backups. Verify same-origin routing and MySQL support before selecting. | Provider operates infrastructure; school still owns configuration, secrets, authorization, data, alerts and recovery testing. |
| Virtual private server + managed MySQL | Recurring server and database/network charges; more control but networking and encryption can add cost. Verify private routing or an encrypted tunnel. | School patches and monitors the server/proxy; provider manages database infrastructure, but school verifies backup and restore. |

Compare actual current provider quotations and school procurement requirements before
choosing. Costs vary by region, traffic, retention, uptime and support; these are relative
trade-offs, not price estimates. A static-only host (including a plain GitHub Pages site)
cannot run Express or MySQL; a gateway is still needed for a same-origin API. Sleeping or
ephemeral services must not be treated as durable database storage.

## Requirements and configuration

- Node.js 22.12+ and npm, MySQL 8-compatible service, private networking, backup storage,
  a school-controlled domain and HTTPS certificate, and a managed process supervisor.
- Build machine: install all dependencies with `npm ci`, then `npm run build`. Static
  output is `dist/`. API runs with `npm run server` (or `node server/index.js`), **not**
  Vite's development or preview server. Build on a compatible Node version. A backend-only
  host can install runtime dependencies with `npm ci --omit=dev` after the build is produced.
- Store production environment variables in the platform's secret/config store; never
  commit `.env`, credentials, real student data or backups. Never place secrets in `VITE_*`:
  those variables are included in browser code. Leave `VITE_API_BASE` unset for `/api`.

| Variable | Value / purpose |
| --- | --- |
| `NODE_ENV` | `production` for deployment; enables strict configuration and CSRF checks. |
| `PORT` | Listening port, 1–65535; defaults to 4000. Managed hosts may assign it. |
| `HOST` | Optional bind address; production defaults to `127.0.0.1`. A managed container may require `0.0.0.0`; restrict its network ingress to the gateway. Development defaults to `0.0.0.0`. |
| `FRONTEND_ORIGIN` | Exact HTTPS origin, e.g. `https://school.example`, with no path or trailing slash; use the actual approved domain. |
| `SESSION_COOKIE_SECURE` | Must be `true` in production; terminate HTTPS at the gateway. |
| `SESSION_MINUTES` | Optional sliding expiry, 1–480 minutes, default 120; absolute lifetime is 8 hours. |
| `SESSION_COOKIE_NAME` | Optional cookie name; changing it makes old browser cookies unusable. |
| `DB_HOST`, `DB_PORT`, `DB_NAME` | Explicit private MySQL address, port and database name. |
| `DB_USER`, `DB_PASSWORD` | Dedicated least-privilege runtime account and secret; root and known placeholder passwords are rejected in production. |

Invalid production settings cause startup to fail. The Express process does **not** trust
forwarded proxy headers: admin throttling keys on the direct socket address. Behind one proxy,
all admin requests may therefore share one bucket (10 attempts per 15 minutes); use a trusted
gateway with additional distributed admin protections and test shared networks. Never add a
student account lockout. Restrict direct API access, reject unexpected hosts at the gateway,
and strip untrusted forwarded headers. Production API cookies are always Secure; Express does
not rely on `X-Forwarded-Proto` to decide whether to set them.

**MySQL transport:** the current MySQL client does not configure TLS. A private address alone
is not necessarily encrypted; arrange a verified encrypted tunnel/private network, or implement
and independently test verified MySQL TLS before launch. Limit DB access to the API, migration
and backup identities. Use least-privilege users: runtime needs the operations used by the app;
migration needs CREATE/ALTER and schema inspection; backup needs appropriate read privileges.
Do not put migration credentials into the running API service.

## Database preparation and migration

1. Obtain an approved, isolated database and take a verified backup before changing an
   existing one. Never use real records for a demo or test. Ensure a migration account can
   access the target database. Do not drop or recreate an existing database.
2. **New empty database only:** provision a database through the host's control plane, then
   select that database when importing the seed-free `server/schema-empty.sql`. Example on
   Linux (replace the database name and protected option-file path with your own):

   ```sh
   mysql --defaults-extra-file=/secure/migration.cnf safe_squad_demo < server/schema-empty.sql
   ```

   `--defaults-extra-file` must be the first MySQL option; protect that file and never pass a
   password on the command line. This file creates tables if absent; it does not create a
   database or insert demo accounts. It must remain consistent with `schema.sql` (checked by
   `npm run test:deployment`). Provision an admin with `npm run admin:create` in a private
   terminal using migration account credentials, then create only synthetic demo students.
3. **Existing database:** do not run the local demo setup. Back up first, point the migration
   environment `DB_NAME` and `DB_*` at the intended existing database, and run
   `npm run db:migrate` once with appropriate privileges. It adds `is_active` if missing and
   creates `sessions` if missing; it does not delete student or result rows. Re-running it is
   intended to be safe. Verify schema and records in isolated staging first. Roll out only
   after the migration and restore have been verified on the selected MySQL service.
4. `npm run db:setup` is **local demo only**: it hardcodes database `safe_squad`, creates it
   and seeds six synthetic rows. It now refuses production mode or a different `DB_NAME`. It
   is not the production install or migration procedure. Do not run it on a real-data DB.

## Deployment sequence (after approval; do not perform for this task)

1. Record the approved commit and take a tested encrypted backup. Select a hosting approach,
   region and domain, and obtain written school/IT and privacy approval.
2. On Windows development or a build host, run the local checks below and build `dist/`.
   Transfer versioned build artifacts securely. Do not transfer `.env` or `node_modules`.
3. Prepare the private MySQL database as above, apply migrations with the separate migration
   account, and use the runtime account for the API. Confirm the API and MySQL clocks are
   synchronized; session expiry uses the API clock.
4. Install production dependencies on the Linux/managed Node host and inject the production
   variables through a secrets manager. Run `npm run server` under a supervisor configured to
   restart failures, with a shutdown grace period greater than 10 seconds. MySQL is required
   for logins and sessions; the pool has five connections and a bounded queue of 100. Size and
   load-test the deployment before use.
5. Configure HTTPS/DNS and route `https://<approved-domain>/api/*` to the private API, leaving
   the `/api` prefix intact; serve `dist/` for the frontend. Ensure the browser-facing domain
   matches `FRONTEND_ORIGIN`, and the gateway forwards the original `Origin`. Block direct API
   and DB traffic. Configure and test frontend security headers and a suitable Content Security
   Policy at the gateway; API security headers alone do not protect static files. Plan certificate
   renewal and test all subdomains before enabling HSTS `includeSubDomains`.
6. In restricted staging, check the health endpoints below, then use synthetic accounts to
   verify login, a game result, admin management, reports/export, logout and session restoration
   after an API restart. Check a student cannot open admin APIs, and verify Secure/HttpOnly/
   SameSite cookies and CSRF in an actual HTTPS browser. Inspect logs and response bodies for
   personal data or secrets. Confirm backup restore, monitoring, and rollback before approval.

## Health and troubleshooting

- `GET /api/health` is **liveness**: it returns HTTP 200 even when the database is down;
  inspect `database` for connected/unavailable. Do not use status 200 alone as readiness.
- `GET /api/ready` returns 200 only when database queries for the required tables/columns
  succeed; it returns 503 otherwise. It selects no rows and does not disclose DB details. It
  does **not** prove writes, indexes, backup health, proxy routing or a full end-to-end flow.
  Use it for readiness checks, and `/api/health` for liveness to avoid restart loops during a DB
  outage. Do not send a session cookie with probes.
- 503 readiness: check private network, database availability, credentials, permissions and
  migrations. Do not reveal connection errors to public clients; inspect protected server logs.
- Production exits immediately: validate `NODE_ENV`, non-root DB credentials, `PORT`, HTTPS
  `FRONTEND_ORIGIN` and `SESSION_COOKIE_SECURE=true`; check protected logs, not chat/screenshots.
- Login loops or 403 on writes: verify HTTPS, one origin, proxy path/Origin forwarding, browser
  cookies, and frontend's custom header. A Secure cookie is not sent over plain HTTP.
- Admin 429: the direct proxy address may share a limiter bucket; wait for `Retry-After` and
  review gateway configuration. Student login has no account-based lockout or rate limit.
- 404 or blank frontend: serve `dist/` at the intended location; proxy `/api` separately.
  Browser hash routes do not require server-side route rewrites. Never serve source or `.env`.

## Backups, recovery and rollback

Follow the detailed [backup and restoration procedure](PRODUCTION.md#backups-restore-and-retention):
use encrypted, access-controlled, off-site backups, protected MySQL option files and separate
keys; exclude `sessions` to avoid restoring live tokens. Practice restores to an isolated new
database and confirm results using synthetic fixtures. Record recovery time and point objectives.
For a failed release, stop routing traffic to the new app and restore the previous versioned
frontend/API artifacts and configuration. Do not roll back schema or overwrite the live DB
without an approved, tested plan; verify the previous app is schema-compatible. If restoring a
database is required, restore to an isolated target, verify it, obtain approval and perform a
controlled cutover. The restored sessions table must be empty, requiring fresh logins.

## Privacy and operations

School leadership and data-protection officers must approve the use, access roles, lawful basis,
retention/deletion schedule, backup retention and incident plan before real data is used. No
retention duration is assumed here. Use invented names/LRNs for demos; never copy live records
into staging. Limit admin accounts and exports to authorized staff, encrypt backups and transport,
and control who can reach the database. Monitor service health, backup/restore success, capacity,
admin abuse and security events without logging LRNs, tokens or passwords. Assign an incident
owner, escalation path, containment steps and notification obligations; rehearse these processes.

## Local verification (Windows PowerShell; synthetic data only)

```powershell
# From the repository root. Install Node 22.12+ and MySQL separately.
npm ci
npm run typecheck
npm run build
npm run test:security
npm run test:management
npm run test:reports
npm run test:deployment
# Optional real local MySQL demo ONLY: use a new isolated safe_squad database.
Copy-Item .env.example .env
# Edit .env locally with your synthetic/demo MySQL credentials; never commit it.
npm run db:setup
npm run db:migrate
npm run admin:create
# Terminal 1:
npm run dev:server
# Terminal 2:
npm run dev
```

Visit `http://localhost:5173`, and check `http://localhost:4000/api/health` and
`http://localhost:4000/api/ready`. The six sample LRNs in `schema.sql` are synthetic.
On Linux/macOS use `cp .env.example .env` instead of `Copy-Item`. The automated integration
tests use fake DB adapters; the restart test uses a file-backed fake, not MySQL. Windows may
require Developer Mode or permission to create directory symlinks for those tests. These checks
do not prove actual MySQL migration, production hosting, TLS, browser behavior or security.
