import React from "react";
import { StorefrontNavbar, StorefrontFooter } from "@/components/layout/storefront-layout";

export const metadata = {
  title: "Refund Policy (Draft) — MERCI",
  description: "Draft refund and cancellation policy for MERCI digital invitation platform.",
};

export default function RefundsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <StorefrontNavbar />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white border border-[#8B8278]/25 p-8 sm:p-12 space-y-8 text-xs text-[#8B8278] leading-relaxed font-light">
          <div className="border-b border-[#8B8278]/20 pb-6">
            <span className="text-[10px] uppercase tracking-widest text-[#8B8278] font-medium">Policy Notice</span>
            <h1 className="text-3xl font-serif text-[#292824] mt-1 mb-2">Refund & Cancellation Policy (Draft)</h1>
            <p className="text-[11px] italic">
              Status: Draft policy awaiting merchant policy ratification. Last updated: October 2026.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292824]">1. Digital Products Nature</h2>
            <p>
              Due to the digital, instantly provisioned nature of custom websites, published templates, and design concierge services, standard refunds may be limited once customized work or server publishing has commenced.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292824]">2. Custom Concierge Inquiries & Previews</h2>
            <p>
              If a customer requests a cancellation of a custom concierge order before our designers begin drafting the digital layout, a full refund may be issued. If custom initial proofs have been delivered, a reasonable partial fee may be retained to cover studio design labor.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292824]">3. Technical Dissatisfaction</h2>
            <p>
              If our platform experiences severe unresolved technical malfunctions that prevent your guests from viewing the invitation or submitting RSVPs prior to your event, our concierge will issue a full refund upon verification.
            </p>
          </section>
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}
