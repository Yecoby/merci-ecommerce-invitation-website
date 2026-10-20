import React from "react";
import { StorefrontNavbar, StorefrontFooter } from "@/components/layout/storefront-layout";

export const metadata = {
  title: "Terms of Service (Draft) — MERCI",
  description: "Draft terms of service for MERCI digital invitation platform.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <StorefrontNavbar />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white border border-[#8B8278]/25 p-8 sm:p-12 space-y-8 text-xs text-[#8B8278] leading-relaxed font-light">
          <div className="border-b border-[#8B8278]/20 pb-6">
            <span className="text-[10px] uppercase tracking-widest text-[#8B8278] font-medium">Legal Notice</span>
            <h1 className="text-3xl font-serif text-[#292824] mt-1 mb-2">Terms of Service (Draft)</h1>
            <p className="text-[11px] italic">
              Status: Initial draft awaiting formal legal review prior to commercial launch. Last updated: October 2026.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292824]">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the MERCI digital invitation platform, you agree to comply with and be bound by these draft Terms of Service. If you disagree with any part of these terms, please refrain from using the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292824]">2. Permitted Use & Content Standards</h2>
            <p>
              You agree to provide accurate celebration details and confirm that you own or have permission to use any photographs, monograms, music tracks, or textual works uploaded to your invitation. Content that is unlawful, defamatory, hateful, or infringing on intellectual property is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292824]">3. Packages, Revisions, and Hosting Duration</h2>
            <p>
              Self-service templates are published upon order confirmation. Custom concierge orders include the specified revision rounds agreed upon prior to final approval. Hosting durations correspond to the package selected and are not represented as perpetual or permanent without scheduled renewal.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292824]">4. Limitation of Liability</h2>
            <p>
              While we maintain high availability and robust data backups, MERCI cannot guarantee uninterrupted service against telecommunication disruptions or third-party cloud infrastructure failures.
            </p>
          </section>
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}
