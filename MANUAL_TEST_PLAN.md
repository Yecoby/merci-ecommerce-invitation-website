# MERCI Digital Invitations — Repeatable End-to-End Manual Test Plan

**Scope:** Step-by-step verification procedures for manual validation of platform features, security boundaries, and user journeys.

---

## 1. Test Suite: Authentication & Session Integrity

### Test Case AUTH-01: Customer Registration & Password Rules
- **Steps:**
  1. Navigate to `http://localhost:3000/register`.
  2. Attempt registration with a weak password (e.g. `weakpass`).
  3. Verify validation error prompts for uppercase, lowercase, and numbers.
  4. Submit valid credentials (`Mateo Valenzuela`, `mateo@example.ph`, `Password1234!`).
  5. Confirm redirection to `/login` or account area.

### Test Case AUTH-02: User Account Isolation (Horizontal Privilege Check)
- **Steps:**
  1. Register User A (`userA@example.ph`) and create an invitation draft. Note its public slug.
  2. Sign out and sign in as User B (`userB@example.ph`).
  3. Send a `PATCH /api/invitations/[slug]` request targeting User A's slug using User B's session cookie.
  4. **Expected Result:** Server returns `403 Forbidden` (`"Forbidden: You do not own this invitation"`).

---

## 2. Test Suite: Administrator Privilege Enforcement

### Test Case ADMIN-01: Anonymous Access to Admin Area
- **Steps:**
  1. Open an incognito browser window (unauthenticated).
  2. Navigate directly to `http://localhost:3000/admin`.
  3. **Expected Result:** Server immediately redirects to `/login`.

### Test Case ADMIN-02: Customer Role Access to Admin Area
- **Steps:**
  1. Sign in as a regular customer with `role = "CUSTOMER"`.
  2. Attempt to navigate to `http://localhost:3000/admin`.
  3. **Expected Result:** Server immediately intercepts and redirects to `/account`.
  4. Attempt a `GET /api/admin/inquiries` request.
  5. **Expected Result:** Server returns `403 Forbidden` (`"Access denied."`).

---

## 3. Test Suite: Invitation Creation, Preview & Live RSVP

### Test Case INV-01: Interactive Invitation Builder
- **Steps:**
  1. Navigate to `/create`.
  2. Select the "Serenade" wedding template.
  3. Proceed to Step 2, modify host names and ceremony time.
  4. Observe that the right-hand live mobile mockup updates in real time without page reload.
  5. Click "Full Demo" to test full viewport rendering at `/i/demo-serenade-wedding`.

### Test Case RSVP-01: Guest RSVP Submission
- **Steps:**
  1. Navigate to `/i/demo-serenade-wedding#rsvp-section`.
  2. Select "Joyfully Accept", enter guest name `Sofia Andres`, email `sofia@andres.ph`, party count `2`, and meal notes `Vegetarian`.
  3. Click "Submit Response".
  4. **Expected Result:** Form replaces inputs with a confirmation card: "Thank you, Sofia Andres! Your response has been warmly received."

---

## 4. Test Suite: Concierge Inquiry & Anti-Spam Verification

### Test Case INQ-01: Custom Proposal Submission
- **Steps:**
  1. Navigate to `/custom-invitation`.
  2. Fill in customer name, email, event date, and select desired features.
  3. Acknowledge privacy notice and click "Submit Custom Request".
  4. Verify success screen appears with confirmation reference.
  5. Sign in as an administrator and navigate to `/admin`.
  6. Verify the new inquiry appears in the "Recent Bespoke Inquiries" table.


### Test Case AUTH-03: Login & Session Cookie Verification
- **Steps:**
  1. Navigate to `http://localhost:3000/login`.
  2. Enter valid registered email `testcustomer@merci.ph` with an incorrect password.
  3. Verify error message: "The email or password you entered is incorrect."
  4. Enter correct password `Password123!` and submit.
  5. Confirm redirection to `/account` and presence of `authjs.session-token` cookie.
  6. Refresh the page or navigate to another page; verify user remains authenticated.

---

## 5. Test Suite: Host RSVP Management Portal

### Test Case RSVP-02: Private Host Guest List Verification
- **Steps:**
  1. Sign in as the host account that created the invitation.
  2. Navigate to `/account` and click "View RSVPs" on the invitation card (e.g. `/account/invitations/[slug]/rsvps`).
  3. Confirm the table displays guest name, attendance status, party headcount, dietary restrictions/allergies, and message.
  4. In an incognito tab or logged in as a different customer, navigate directly to `/account/invitations/[slug]/rsvps`.
  5. **Expected Result:** Server immediately intercepts and redirects away from the page, preventing unauthorized viewing of private guest contact information and dietary records.
