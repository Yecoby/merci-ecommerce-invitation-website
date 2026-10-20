import React from "react";
import Link from "next/link";
import { StorefrontNavbar, StorefrontFooter } from "@/components/layout/storefront-layout";
import { ShieldCheck, Cookie } from "lucide-react";

export const metadata = {
  title: "Cookie & Tracking Notice — MERCI Digital Invitations",
  description: "Explanation of cookies and client storage utilized by MERCI platform.",
};

export default function CookieNoticePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <StorefrontNavbar />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white border border-[#8B8278]/25 p-8 sm:p-12 space-y-8 text-xs text-[#8B8278] leading-relaxed font-light">
          <div className="border-b border-[#8B8278]/20 pb-6">
            <span className="text-[10px] uppercase tracking-widest text-[#8B8278] font-medium">Privacy Notice</span>
            <h1 className="text-3xl font-serif text-[#292824] mt-1 mb-2">Cookie & Local Storage Policy</h1>
            <p className="text-[11px] italic">
              Status: Active Policy Notice. Last updated: October 2026.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292824]">1. Essential Cookies Only</h2>
            <p>
              MERCI uses strictly necessary authentication and security cookies to enable hosts to sign in, edit invitation websites, and manage guest RSVPs. We do not use third-party cross-site behavioral tracking cookies, advertising pixels, or data brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292824]">2. Inventory of Storage & Cookies</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-[#8B8278]/20">
                <thead className="bg-[#FAF8F3] border-b border-[#8B8278]/20 uppercase text-[10px] text-[#292824]">
                  <tr>
                    <th className="p-3">Identifier</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8B8278]/15">
                  <tr>
                    <td className="p-3 font-mono">authjs.session-token</td>
                    <td className="p-3">Strictly Necessary</td>
                    <td className="p-3">Maintains authenticated host session state across requests.</td>
                    <td className="p-3">Session / 30 Days</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">authjs.csrf-token</td>
                    <td className="p-3">Security</td>
                    <td className="p-3">Prevents Cross-Site Request Forgery on authentication requests.</td>
                    <td className="p-3">Session</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">merci_cookie_consent</td>
                    <td className="p-3">Preference</td>
                    <td className="p-3">Stores the visitor's acknowledgement of this cookie policy.</td>
                    <td className="p-3">12 Months</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292824]">3. Third-Party Embeds</h2>
            <p>
              When an invitation host includes a Google Maps link or YouTube/audio track, clicking those links connects directly to those third-party services which operate under their own independent privacy policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292824]">4. Managing Cookie Preferences</h2>
            <p>
              Because our cookies are strictly necessary for the technical operation and security of the platform, disabling them in your browser settings will prevent account sign-in and invitation editing.
            </p>
          </section>
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}
