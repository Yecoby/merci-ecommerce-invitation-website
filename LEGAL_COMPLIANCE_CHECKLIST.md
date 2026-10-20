# MERCI Digital Invitations — Philippine Legal & Regulatory Compliance Checklist

**Scope:** Analysis of Philippine Statutes and Regulatory Requirements applicable to an online digital invitation website and custom design service.  
**Disclaimer:** This technical audit checklist is prepared for architectural, privacy, and regulatory diligence. It does not constitute formal legal counsel. Formal advice from a member of the Integrated Bar of the Philippines (IBP) and a Certified Public Accountant (CPA) is recommended prior to commercial launch.

---

## 1. Compliance Assessment Matrix

| Statute / Regulation | Official Authority | Relevancy & Requirement | Current System Status | Required Business Owner Action | Advisory Need |
|---|---|---|---|---|---|
| **Republic Act No. 10173** (Data Privacy Act of 2012) | National Privacy Commission (NPC) | Regulates collection and processing of personal data (hosts, guests, dietary details). Requires privacy notice, security safeguards, and breach reporting mechanisms. | **Implemented in Code**: Transparent Privacy Policy, role-based access isolation, consent checkboxes, voluntary dietary fields. | Appoint a formal Data Protection Officer (DPO) and register the data processing system with the NPC if thresholds (250+ employees or 1,000+ sensitive records) are met. | **Legal Review Recommended** |
| **Republic Act No. 11967** (Internet Transactions Act of 2023) & Joint Admin Order 24-01 | Department of Trade and Industry (DTI) - E-Commerce Bureau | Establishes a code of conduct for digital platforms and online merchants. Mandates clear disclosure of business identity, contact details, pricing, refund terms, and fair consumer treatment. | **Implemented in Code**: Transparent pricing in PHP (₱), clear package inclusions, visible draft refund and cancellation policies, contact channels. | Register business on the DTI Online Business Trustmark Portal / Philippine E-Commerce Registry when commercial transactions open. | **Owner Action Required** |
| **Republic Act No. 7394** (Consumer Act of the Philippines) | DTI & Relevant Agencies | Prohibits deceptive sales acts, requires transparent price tags (Philippine Peso), and fair warranties for services rendered. | **Implemented in Code**: Explicit notice that all fees are quoted in PHP (₱) without hidden add-ons. No fake discount counters or fabricated testimonials. | Review package descriptions with customer service to ensure realistic fulfillment turnaround commitments. | **Owner Review Required** |
| **Republic Act No. 8293** (Intellectual Property Code of the Philippines) | Intellectual Property Office of the Philippines (IPOPHL) | Protects original digital artworks, typography licenses, and software code; prohibits trademark infringement. | **Implemented in Code**: 100% original SVG artwork (quatrefoil logo, botanical floral accents, constellation ornaments) authored in-house; system serif font stack. | Apply for trademark registration for the "MERCI" brand name and logo mark with the IPOPHL. | **IP Attorney Recommended** |
| **Republic Act No. 8792** (Electronic Commerce Act of 2000) | Department of Information and Communications Technology (DICT) | Recognizes the validity of electronic contracts, digital signatures, and electronic communications for online transactions. | **Implemented in Code**: Digital terms acceptance, electronic order references (e.g. `MERCI-2027-0104`), affirmative click-through consent. | Maintain server transaction audit logs for orders and quotation agreements. | Compliant in Architecture |
| **National Internal Revenue Code (NIRC)** & BIR Revenue Regulations | Bureau of Internal Revenue (BIR) | Mandates registration of online businesses, issuance of official invoices/receipts, and collection/remittance of applicable taxes (VAT / Percentage Tax). | **Platform Scaffolded**: Database models integer minor units in centavos (`amountCentavos`), currency stored as `PHP`. | Register business with BIR (Form 1901 for sole proprietors or 1903 for corporations), obtain BIR Certificate of Registration (COR), and secure Authority to Print (ATP) invoices or register an Electronic Invoicing System (EIS). | **CPA / Tax Accountant Required** |
| **Local Government Code of 1991** (RA 7160) | Local Government Unit (LGU) | Requirement to secure Mayor's Permit / Business Permit in the municipality or city where the business operates. | **Pending Business Registration**: Server currently runs in local development workspace. | Secure Barangay Clearance, DTI Business Name Registration (or SEC Articles of Incorporation), and City/Municipal Business Permit prior to accepting public payments. | **Owner Action Required** |
| **Children's Online Safety Considerations** | NPC Guidance on Processing Children's Personal Data | Birthday and baptism invitations may involve celebrants or guests who are minors. Requires parental/guardian consent and strict minimization of child data. | **Implemented in Code**: Baptism templates collect only celebrant first names and general ceremony location; no birth certificates, national IDs, or child photos are publicly exposed by default. | Ensure terms clearly mandate that hosts creating invitations for minors must be the legal parent or guardian. | **Legal Review Recommended** |

---

## 2. Launch Blocker Checklist for Business Owner

Prior to accepting real monetary payments from the public, the owner must complete:
1. [ ] **DTI Business Name Registration** or **SEC Corporate Registration**.
2. [ ] **BIR Certificate of Registration (COR)** with assigned Tax Identification Number (TIN).
3. [ ] **Local Mayor's Business Permit** and Barangay Clearance.
4. [ ] **Payment Gateway Onboarding** (e.g., PayMongo, Maya Business, or GCash merchant account with signed Merchant Agreement).
5. [ ] **Final Legal Review** of the Terms of Service, Privacy Policy, and Refund Policy.
