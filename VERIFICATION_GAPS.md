# MERCI — Verification Gaps & Prior Audit Reconciliation

**Audit Date:** October 2026  
**Auditor Scope:** Senior Software Architect, Security Engineer, QA Auditor  
**Workspace:** `C:\Users\Administrator\CodeGPT\merci-clean`  
**Purpose:** Reconcile previous claims with empirical codebase evidence, distinguishing confirmed features, partial implementations, contradicted claims, and unverified areas.

---

## 1. Itemized Reconciliation Matrix

| Domain / Claim | Prior Audit Claim | Empirical Codebase Status | Status Classification | Evidence & Findings |
|---|---|---|---|---|
| **Git Tracking & History** | ".git ignored or clean" | Git repository is not initialized (`fatal: not a git repository`). | **CONTRADICTED** | There is no local `.git` folder in `merci-clean`. While `.gitignore` is correctly written, Git tracking cannot be audited until a repository is initialized. |
| **Row-Level Security (RLS)** | "RLS implemented / supported" | SQLite database (`prisma/dev.db`) is used. Native RLS does not exist in SQLite. | **CONTRADICTED / CORRECTED** | SQLite does not support PostgreSQL kernel-level RLS (`CREATE POLICY ...`). Authorization is strictly enforced at the application/Prisma query layer (`where: { ownerId }`). Genuine DB-level RLS requires a migration to PostgreSQL. |
| **Email Verification & Reset** | "Password reset and email verification complete" | Complete cryptographically secure token lifecycle implemented (`/api/auth/forgot-password` stores SHA-256 tokens in `VerificationToken`, `/api/auth/reset-password` consumes them in a transaction). External SMTP/API delivery provider requires API key. | **VERIFIED IMPLEMENTED / EXT-BLOCKED** | Safe architecture with PII redaction verified by unit test `tests/unit/payment-and-recovery.test.ts`. Live delivery requires `RESEND_API_KEY`. |
| **Login Strategy Compatibility** | "Login functional" | Login previously returned HTTP 500 `UnsupportedStrategy`. Now fixed with `session: { strategy: "jwt" }` and `NextAuthConfig` typing. | **VERIFIED FIXED** | E2E verified in `scripts/verify-auth-e2e.js`: `GET /api/auth/providers` returns 200, credentials login issues session cookie, incorrect password rejected, role preserved. |
| **Server-Side Access Control (RBAC)** | "Protected admin and customer resources" | Enforced on layouts and APIs (`requireAdmin`, `requireOwnership`). | **CONFIRMED** | Verified via `tests/unit/access-control.test.ts` and route code: `/admin`, `/api/admin/inquiries`, and `/api/invitations/[slug]` enforce server-side role and owner checks. |
| **Public RSVP Isolation** | "Private guest data hidden from public view" | `/i/[slug]` public page and `/api/invitations/[slug]` do not expose other guests' RSVPs. | **CONFIRMED** | In `GET /api/invitations/[slug]`, `rsvps` are stripped for unauthenticated or non-owner callers. Guests can only submit their own attendance. |
| **Guest Data Persistence** | "RSVP submissions save to database" | `POST /api/invitations/[slug]/rsvp` saves to Prisma `RSVP` table. | **CONFIRMED** | Verified against schema. Demo slugs return successful mock payload; real slugs insert into `RSVP`. |
| **Storefront & Builder** | "Full storefront, gallery, and interactive builder" | Routes `/`, `/invitations`, `/invitations/[slug]`, `/pricing`, `/create`, `/custom-invitation` exist. | **CONFIRMED** | All 30 Next.js routes compile and render cleanly with responsive layout and live mobile mockup. |
| **Security Headers** | "CSP, X-Frame-Options, X-Content-Type-Options active" | Configured in `next.config.ts`. | **CONFIRMED** | Next.js headers verified. Clickjacking prevention (`DENY`) and strict MIME types (`nosniff`) active. |
| **Asset Copyright** | "All assets 100% original" | SVG vector art and system fonts verified, but business branding requires registration. | **PARTIALLY CONFIRMED** | SVG line art is original and icons are ISC-licensed Lucide icons. However, commercial trademark status for "MERCI" with IPOPHL is pending business registration. |
| **Payment Webhooks & Gateway** | "Payments scaffolded" | Order model has `amountCentavos`, but payment gateway is not integrated. | **PARTIALLY CONFIRMED** | Database schema supports orders and centavos minor units, but live checkout (PayMongo/GCash) is unintegrated and requires owner merchant onboarding. |

---

## 2. Summary of Unresolved Gaps Requiring Owner Action

1. **Email Delivery Provider:** No SMTP or API credentials configured. Password reset links cannot be dispatched to real users.
2. **PostgreSQL Migration for RLS:** SQLite is currently used. If genuine database kernel-level Row-Level Security is desired, the project must be migrated to PostgreSQL.
3. **Payment Processor Onboarding:** Checkout cannot charge cards or e-wallets until merchant onboarding with PayMongo/Maya/GCash is completed.
4. **Legal & Business Registration:** DTI/SEC registration, BIR tax invoicing, and IPOPHL trademarking remain pending.
