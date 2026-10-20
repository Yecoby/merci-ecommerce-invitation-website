# MERCI Digital Invitations — Privacy Data Map & Processing Lifecycle

**Reference:** Philippine Data Privacy Act of 2012 (Republic Act No. 10173) & National Privacy Commission (NPC) Guidelines  
**Classification:** Confidential Platform Documentation

---

## 1. Data Inventory & Categories of Personal Data

| Category | Specific Data Elements | Source | Purpose of Processing | Lawful Basis | Storage Location | Retention Schedule |
|---|---|---|---|---|---|---|
| **Host Account Data** | Full Name, Email Address, Hashed Password (bcrypt), Contact Phone, Preferred Channel | Customer Registration & Account Profile Form | Authentication, service provisioning, customer support, order management | Contractual Necessity (Art. 12(b)) | `User`, `Account`, `CustomerProfile` tables in Prisma database | Active account duration + 2 years post-inactivity |
| **Event Narrative Data** | Celebrant/Couple Names, Event Dates, Venue Name & Address, Love Story narrative, Dress Code, Ceremony Schedule | Host Input in Builder / Custom Inquiry Form | Rendering the public digital invitation website | Consent & Contractual Performance (Art. 12(a)(b)) | `EventData`, `Invitation` tables in database | Duration of active hosting package (12–24 months) or until host deletion |
| **Guest RSVP Data** | Guest Name, Email Address, Attendance Status (Attending / Declined), Party Size, Attendee Names, Meal Choices, Dietary Restrictions/Allergies, Congratulatory Message | Public Guest Submission at `/i/[slug]` | Event headcount compilation, catering coordination for the host | Legitimate Interest / Consent of Host & Guest | `RSVP` table in database | Duration of event hosting + 90 days post-event archival |
| **Inquiry & Concierge Data** | Customer Name, Email, Phone, Event Type, Target Date, Budget Range, Desired Design Features, Custom Notes | Inquiry Form (`/custom-invitation`) & Contact Form (`/contact`) | Proposal estimation, concierge consultation, quotation preparation | Pre-contractual diligence requested by data subject (Art. 12(b)) | `Inquiry` table in database | 12 months from submission if not converted to active order |
| **Operational & Session Data** | Session Token, IP address (in server logs), user agent, timestamp | Browser HTTP Request Headers & Auth.js cookies | Session continuity, fraud detection, rate limiting, security monitoring | Legitimate Interest & Technical Security (Art. 12(f)) | `Session` table (database) & ephemeral server console | Session lifetime (max 30 days) |

---

## 2. Sensitive Personal Information (SPI) Consideration

- **Dietary Restrictions & Allergies:** In the RSVP form, guests may optionally disclose health-related dietary requirements (e.g., severe peanut allergy, diabetic meal) or religious dietary restrictions (e.g., Halal, Kosher).
- **NPC Compliance Measure:** These fields are strictly voluntary, processed exclusively for the purpose of communicating dietary headcounts to the host's caterer, and are never shared with marketing partners or third-party advertisers.

---

## 3. Data Access & Boundary Isolation

1. **Public Invitation Viewers:** Can view only the host's public event details (names, venue, date, timeline, attire). Viewers cannot view other guests' RSVP details, dietary allergies, or contact information.
2. **Authenticated Hosts:** Can access only their own invitations and associated guest RSVP lists through `/account`. Cross-account queries are blocked server-side.
3. **Platform Administrators:** Access is restricted to authorized personnel with the `ADMIN` role for customer support, custom design fulfillment, and platform monitoring.

---

## 4. Rights of Data Subjects (DPA Art. 16)

MERCI upholds all rights under the Data Privacy Act:
- **Right to be Informed:** Detailed in `/legal/privacy` and `/legal/cookies`.
- **Right to Access & Rectify:** Hosts can update event information in the builder and account profile.
- **Right to Erasure / Blocking:** Hosts can request full deletion of their invitation and guest data by contacting `hello@merci-invitations.ph`.
- **Right to Data Portability:** Host dashboard supports exporting guest RSVP lists.
