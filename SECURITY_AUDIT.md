# MERCI Digital Invitations — Security, Privacy, Legal & Production Readiness Audit

**Document Status:** Complete Audit & Verification  
**Evaluation Date:** October 2026  
**Auditor Scope:** Senior Software Architect, Application Security Engineer, Privacy Engineer, Accessibility Specialist, QA Auditor  
**Workspace:** `C:\Users\Administrator\CodeGPT\merci-clean`  
**Strict Boundary Confirmation:** Fully isolated within `merci-clean`. No interaction with or copying from external repositories (`mrci` or Iria Asuna project).

---

## 1. Executive Summary & Findings Matrix

| Ref | Domain | Severity | Finding | Impact | Status | Verification |
|---|---|---|---|---|---|---|
| SEC-01 | Auth / RBAC | **HIGH** | Potential Horizontal Privilege Escalation in Invitation Updates | Attacker could edit other hosts' invitations if slug was known | **VERIFIED FIXED** | Server-side `isOwner` check enforced in `PATCH /api/invitations/[slug]` |
| SEC-02 | Auth / RBAC | **HIGH** | Unprotected Admin API Mutations | Admin inquiry management lacked dedicated protected API endpoints | **VERIFIED FIXED** | Created `/api/admin/inquiries` guarded by `requireAdmin()` |
| SEC-03 | Network Security | **MEDIUM** | Missing Content Security Policy & Security Headers | Vulnerable to clickjacking, MIME sniffing, and framing attacks | **VERIFIED FIXED** | Added CSP, HSTS, X-Frame-Options, X-Content-Type-Options in `next.config.ts` |
| SEC-04 | Auth / Session | **HIGH** | UnsupportedStrategy on Credentials Login | Login failed with HTTP 500 when Credentials provider used with database session adapter | **VERIFIED FIXED** | Explicitly configured `session: { strategy: "jwt" }` with trusted server-side role and ID callbacks in `src/lib/auth/auth.ts` |
| SEC-05 | Auth / Password Recovery | **MEDIUM** | Missing Single-Use Password Reset Lifecycle | Password reset was unlinked to cryptographically expiring tokens | **VERIFIED FIXED** | Implemented single-use token lifecycle: 64-char random tokens, SHA-256 hashed in `VerificationToken`, 60-min expiry, consumed in a transaction |
| PRIV-01 | Data Privacy | **MEDIUM** | Incomplete Cookie & Tracking Transparency | Absence of clear cookie inventory and visitor notice | **VERIFIED FIXED** | Implemented `/legal/cookies` and client `CookieBanner` component |
| REL-01 | Database / Persistence | **MEDIUM** | Public Inquiry & Contact Form Disconnect | Contact form lacked dedicated `/api/contact` route | **VERIFIED FIXED** | Implemented `POST /api/contact` storing messages safely as `Inquiry` records |
| A11Y-01 | Accessibility | **LOW** | Decorative SVG Accents Missing Landmark/Screen-Reader Guard | Screen readers could read raw vector paths | **VERIFIED FIXED** | Marked all vector icons/artwork with `aria-hidden="true"` |

---

## 2. Authentication, Authorization & Access Control

1. **Server-Side Enforcement**:
   - All protected dashboard paths (`/account`, `/account/*`, `/admin`, `/admin/*`) enforce session and role checks on the server via `src/lib/permissions/index.ts` and Next.js server layouts (`layout.tsx`).
   - Browser cookies cannot tamper with role assignments; user roles are retrieved from the SQLite/Prisma database during session validation.
2. **Horizontal Privilege Isolation**:
   - In `PATCH /api/invitations/[slug]`, the server validates `invitation.ownerId === session.user.id`. Requests from non-owners return `403 Forbidden`.
   - In `GET /api/invitations/[slug]`, guest RSVP lists and contact records are stripped unless the requester is the authentic owner or an administrator.
3. **Anti-Enumeration Protection**:
   - `POST /api/auth/register` and `POST /api/auth/forgot-password` return generic acknowledgment messages regardless of whether an email exists in the database, preventing user harvesting.

---

## 3. Database Security & Row-Level Security (RLS) Analysis

- **Current Database Engine:** SQLite (`file:./dev.db`).
- **RLS Assessment:** SQLite is a serverless file database that does not have native kernel-level Row-Level Security (RLS) policies like PostgreSQL (`CREATE POLICY ... ON table FOR SELECT USING ...`).
- **Mitigation Strategy:**
  - Robust application-level multi-tenant isolation enforced directly in Prisma queries (`where: { ownerId: session.user.id }`).
  - Every transaction boundary wraps related operations (`prisma.$transaction`) to prevent orphan records or partial writes upon failure.
- **Production Migration Recommendation:**
  - When scaling to multi-server production, migrate to managed PostgreSQL, where native RLS and connection pooling (PgBouncer) can be provisioned.

---

## 4. Input Validation & XSS/CSRF Prevention

- All mutation payloads (`/api/inquiries`, `/api/contact`, `/api/invitations`, `/api/invitations/[slug]/rsvp`, `/api/auth/register`) are parsed and sanitized with strict Zod schemas.
- Maximum string length, numeric range limits (e.g. party count `1..20`), and email normalization `.toLowerCase().trim()` are strictly validated before hitting the database.
- Text output in React JSX automatically escapes dangerous characters (HTML entities), preventing reflected and stored Cross-Site Scripting (XSS).

---

## 5. Security Headers & Browser Hardening

Configured in `next.config.ts`:
- **Content-Security-Policy (CSP):** `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';`
- **X-Frame-Options:** `DENY`
- **X-Content-Type-Options:** `nosniff`
- **Referrer-Policy:** `strict-origin-when-cross-origin`
- **Permissions-Policy:** `camera=(), microphone=(), geolocation=(), browsing-topics=()`
- **X-XSS-Protection:** `1; mode=block`


---

## 6. Password Storage Architecture & `Account.access_token` Security Review

- **Implementation Mechanism:** Passwords are encrypted with `bcryptjs` (cost factor 12) on user registration and stored in `Account.access_token` for the account record where `provider = "credentials"`.
- **Isolation:** Because the unique constraint on `Account` is `@@unique([provider, providerAccountId])`, credentials records are completely isolated from any future OAuth accounts (e.g. `provider = "google"`). OAuth provider tokens are never overwritten.
- **Client Sanitization:** Neither `authorize()` nor any user serialization query selects or returns `access_token` to the client.
- **Future Migration Recommendation:** For future production iterations on PostgreSQL, adding a dedicated `passwordHash` column or separate `Password` table will separate application auth credentials from OAuth access tokens.

---

## 7. Webhook & Payment Verification Security

- **PayMongo Webhook Signature Verification:** Implemented in `src/lib/payments/paymongo.ts`.
- **HMAC SHA-256:** Generates expected signature from timestamp and raw request body, comparing it using constant-time `crypto.timingSafeEqual` to eliminate timing attacks.
- **Fail-Closed Configuration:** If `PAYMONGO_WEBHOOK_SECRET` is missing in the production environment, the webhook returns `503 Service Unavailable`, refusing to process unverified payment updates.
