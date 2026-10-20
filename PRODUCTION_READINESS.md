# MERCI Digital Invitations — Production Readiness & Architecture Assessment

**Target Architecture:** Next.js 15.2.0 (App Router), Prisma ORM, Node.js runtime  
**Current Database:** SQLite (`prisma/dev.db`) in local development  
**Production Recommendation:** Managed PostgreSQL (e.g. Supabase, AWS RDS, Neon, or Railway)

---

## 1. Hosting Environment & Persistence Architecture

### A. SQLite Considerations (Current Local Setup)
- **Strengths:** Zero-configuration, zero-latency local disk read/writes, perfectly suited for rapid local testing and isolated development.
- **Production Limitations:** Serverless platforms (such as Vercel or AWS Lambda) run ephemeral containers where files written to local disk (like `prisma/dev.db`) are wiped on every new serverless instance invocation.
- **Production Recommendation:** For production deployment, configure `provider = "postgresql"` in `prisma/schema.prisma` with a persistent PostgreSQL connection string in `DATABASE_URL`.

### B. Environment Variable Pre-Flight Checklist
Before deploying to production, the following variables must be configured in the host environment (never committed to Git):
1. `DATABASE_URL`: Connection string to persistent PostgreSQL database.
2. `AUTH_SECRET`: Cryptographically strong random string (minimum 32 characters, generated via `openssl rand -base64 33`).
3. `AUTH_URL` / `NEXTAUTH_URL`: Canonical public URL of the production deployment (e.g. `https://merci.ph`).
4. `NEXT_PUBLIC_APP_URL`: Canonical public site URL.
5. `NEXT_PUBLIC_CONTACT_EMAIL`: Verified support email address.
6. `NEXT_PUBLIC_CONTACT_PHONE`: Verified contact telephone number.
7. `RESEND_API_KEY`: API Key for transactional password reset emails (Resend).
8. `PAYMONGO_WEBHOOK_SECRET`: Signing secret for PayMongo webhook signature verification.

---

## 2. Automated Database Migration Script (PostgreSQL / SQLite)
To switch the datasource safely without hand-editing:
- For PostgreSQL: `node scripts/switch-db-provider.js postgresql`
- For SQLite: `node scripts/switch-db-provider.js sqlite`

---

## 2. Backup & Disaster Recovery Strategy

1. **Database Backups:**
   - In production, schedule daily automated snapshots with Point-in-Time Recovery (PITR) enabled.
   - For SQLite development, make a copy of `prisma/dev.db` before executing any Prisma migrations.
2. **Data Export & Portability:**
   - All customer invitations and guest RSVPs can be queried and serialized into JSON or CSV directly from the database or via the `/api/invitations` endpoint.

---

## 3. Monitoring, Telemetry & Logging Safety

- **Redaction of Sensitive Data:** Loggers must never output raw passwords, session cookies, auth tokens, or payment card data.
- **Generic Error Responses:** In production (`NODE_ENV === "production"`), uncaught exceptions return generic `"Internal server error."` HTTP 500 responses, preventing internal stack traces or database schema layouts from leaking to clients.
- **Audit Logs:** The database schema includes an `AuditLog` table designed to track critical administrative state transitions (e.g. order status changes, invitation publication) with actor ID and timestamp.
