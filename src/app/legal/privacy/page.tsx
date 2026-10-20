import React from "react";
import { StorefrontNavbar, StorefrontFooter } from "@/components/layout/storefront-layout";

export const metadata = {
  title: "Privacy Policy (Draft) — MERCI",
  description: "Draft privacy policy for MERCI digital invitation platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <StorefrontNavbar />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white border border-[#8B8278]/25 p-8 sm:p-12 space-y-8 text-xs text-[#8B8278] leading-relaxed font-light">
          <div className="border-b border-[#8B8278]/20 pb-6">
            <span className="text-[10px] uppercase tracking-widest text-[#8B8278] font-medium">Legal Notice</span>
            <h1 className="text-3xl font-serif text-[#292824] mt-1 mb-2">Privacy Policy (Draft)</h1>
            <p className="text-[11px] italic">
              Status: Initial draft awaiting formal legal certification prior to commercial launch in the Philippines. Last updated: October 2026.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292824]">1. Overview & Data Protection</h2>
            <p>
              MERCI ("we," "our," or "the Platform") respects the privacy and confidentiality of celebration hosts, event planners, and their invited guests. This draft policy explains how event information, host contact credentials, and guest RSVP entries are collected, processed, and safeguarded.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292824]">2. Information We Collect</h2>
            <p>
              <strong>Host Information:</strong> When you register an account, order custom concierge services, or create a self-service invitation, we collect your name, email address, hashed authentication credentials, and optional phone/messaging contact details.
            </p>
            <p>
              <strong>Event Details:</strong> Celebration title, celebrant or couple names, venue address, ceremony itineraries, dress codes, and uploaded photographic or musical assets.
            </p>
            <p>
              <strong>Guest RSVP Data:</strong> Attendee names, attendance status (Attending / Unable to attend), confirmed headcounts, voluntary dietary notes (e.g. food allergies, vegan, halal), and optional congratulatory messages.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292824]">3. How Data is Used</h2>
            <p>
              We collect information strictly to render your custom digital invitation website, accurately track guest attendance for your catering and venue planning, and provide customer support. We do not sell, rent, or trade customer or guest personal data to any third-party advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292824]">4. Guest Privacy & Isolation</h2>
            <p>
              Published invitations are hosted at distinct, unguessable slugs. Guests can only submit their own attendance confirmation; the complete guest list and contact information are accessible exclusively by the authenticated host through their private client portal.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292824]">5. Data Retention & Archival</h2>
            <p>
              Event invitations remain hosted for the duration of the purchased package (typically 12 to 24 months). Hosts may request the deletion, export, or archival of their invitation and guest responses at any time by contacting our support team.
            </p>
          </section>
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}
