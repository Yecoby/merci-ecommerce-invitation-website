# MERCI — Digital Invitations & Client Portal

MERCI is a digital invitation platform designed to make event invitation management more elegant and organized. It combines customizable digital invitations, guest RSVP management, and a dedicated client portal for managing the invitation production process.

## Features

### Digital Invitations
- Dedicated public invitation pages
- Interactive invitation cover and envelope animations
- Live event countdown
- Calendar event download (`.ics`)
- RSVP submission and guest response tracking

### Client Portal
- Secure order access using an order code and customer email
- Guided event briefing with saved progress
- Invitation draft preview for desktop and mobile
- Structured revision requests and draft approval
- Production roadmap and order status tracking

### Guest Management
- RSVP directory with search and status filters
- Confirmed guest and party headcount tracking
- Dietary requirements and allergy information
- Authenticated CSV guest-list export
- Seating planner with table capacities and guest assignments

### Administration
- Order management and status updates
- Client access-code issuance and recovery
- Briefing and revision tracking
- Invitation publishing
- Role-based administrative access

## Technology Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Next.js App Router and API routes
- **Database:** Prisma ORM with SQLite for local development
- **Authentication:** Auth.js / NextAuth
- **Security:** Password hashing, protected sessions, access controls, and rate limiting
- **Testing:** Vitest, TypeScript checks, and end-to-end verification scripts

## Getting Started

### Prerequisites

- Node.js compatible with the project's Next.js version
- npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/Yecoby/merci-ecommerce-invitation-website.git
cd merci-ecommerce-invitation-website
```

Install dependencies:

```bash
npm install
```

Configure your environment variables using the project's environment example file, if available. Do not commit real credentials or secret keys.

Generate the Prisma client and prepare the local database using the project's configured Prisma scripts. If necessary, inspect `package.json` and `prisma/schema.prisma` for the exact commands and database configuration.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

Run the project's available checks:

```bash
npm test
npm run typecheck
npm run build
```

An end-to-end verification script may also be available under `scripts/`. Check the repository for its exact name and setup requirements.

## Production Considerations

Before deploying MERCI for real customers:

- Configure a persistent production database, such as managed PostgreSQL.
- Configure a real email delivery provider.
- Complete PayMongo checkout integration and verify payment webhooks server-side before marking orders as paid.
- Set production secrets through the hosting provider's environment-variable settings.
- Verify authentication, tenant isolation, backups, and deployment behavior in the production environment.
- Review privacy, terms, refund policies, and applicable business requirements.

SQLite is intended for local development in this setup; a local SQLite file should not be relied upon for persistent storage in an ephemeral serverless deployment.

## Security

- Never commit `.env` files, API keys, passwords, or production secrets.
- Do not commit local databases containing customer information.
- Keep administrative endpoints protected by server-side authorization.
- Validate all customer input and verify access permissions on the server.

## Project Status

MERCI includes a digital invitation experience, customer portal, order workflow, RSVP management, and administrative tools. Live payment processing, external email delivery, and production database configuration require separate setup and verification.

## License

No license has been specified yet. All rights reserved unless a license is added to this repository.
