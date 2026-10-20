import React from "react";
import Link from "next/link";
import { StorefrontNavbar, StorefrontFooter } from "@/components/layout/storefront-layout";
import { Check, ArrowRight, Info } from "lucide-react";

export const metadata = {
  title: "Packages & Pricing — MERCI Digital Invitations",
  description: "Transparent packages for self-service templates and custom concierge invitation design. Philippine Peso (PHP) pricing.",
};

const PACKAGES = [
  {
    id: "self-service",
    name: "Self-Service Template",
    tagline: "Instant, seamless, and fully hosted.",
    samplePrice: "₱1,899",
    billingNote: "One-time illustrative fee",
    description: "Ideal for hosts who want a refined digital invitation ready to share within an hour.",
    popular: false,
    ctaText: "Choose a Template",
    ctaLink: "/invitations",
    features: [
      "Access to all signature templates",
      "Event countdown & Google Maps link",
      "Interactive ceremony & reception schedule",
      "Unlimited guest RSVP submissions",
      "Host RSVP dashboard & CSV export",
      "Mobile-optimized responsive design",
      "12-month active hosting from creation",
      "Instant shareable link for Messenger & Viber",
    ],
  },
  {
    id: "custom-concierge",
    name: "Personalized Concierge",
    tagline: "Tailored to your aesthetic by our studio.",
    samplePrice: "₱3,999",
    billingNote: "One-time illustrative fee",
    description: "Let our design team format your story, color theme, monogram, and custom sections.",
    popular: true,
    ctaText: "Request Custom Design",
    ctaLink: "/custom-invitation",
    features: [
      "Everything in Self-Service Template",
      "Dedicated MERCI invitation designer",
      "Custom monogram or couple illustration",
      "Tailored colorway matching your entourage palette",
      "Private preview link with 2 rounds of revisions",
      "Guest plus-one and dietary requirement tracker",
      "Background music integration",
      "18-month active hosting with post-event photo archive",
    ],
  },
  {
    id: "bespoke-atelier",
    name: "Bespoke Atelier Website",
    tagline: "Fully custom web experience with custom domain.",
    samplePrice: "₱7,499",
    billingNote: "One-time illustrative fee",
    description: "A one-of-a-kind digital presence for grand weddings and landmark celebrations.",
    popular: false,
    ctaText: "Inquire Atelier",
    ctaLink: "/custom-invitation",
    features: [
      "Everything in Personalized Concierge",
      "Custom domain setup (e.g. mateoandsofia.com)",
      "Multi-day celebration itineraries (welcome drinks, ceremony, brunch)",
      "VIP seating & table assignment display",
      "Unlimited design revisions prior to publication",
      "Dedicated WhatsApp / Viber concierge support",
      "24-month extended hosting & permanent keepsake snapshot",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <StorefrontNavbar />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8B8278]">Transparent Investment</span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#292824] mt-2 mb-4">
            Curated Invitation Packages
          </h1>
          <p className="text-sm text-[#8B8278] font-light leading-relaxed">
            Choose between intuitive self-guided creation or our personalized design service. All packages include secure guest RSVP management and mobile-optimized sharing.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 p-3 bg-[#FAF8F3] border border-[#8B8278]/25 text-xs text-[#8B8278] text-left">
            <Info className="w-4 h-4 text-[#C5A880] shrink-0" />
            <span>
              <strong>Note:</strong> Displayed prices are illustrative sample values for development and preview. Actual launch packages and payment methods are finalized upon merchant onboarding.
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`flex flex-col justify-between p-8 bg-white border transition-all duration-300 relative ${pkg.popular
                  ? "border-[#292824] shadow-md ring-1 ring-[#292824]"
                  : "border-[#8B8278]/20 hover:border-[#8B8278]/50"
                }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#292824] text-[#FAF8F3] px-3 py-0.5 text-[10px] uppercase tracking-widest font-medium">
                  Most Preferred
                </div>
              )}

              <div>
                <h3 className="font-serif text-2xl text-[#292824]">{pkg.name}</h3>
                <p className="text-xs text-[#8B8278] mt-1 font-light italic">{pkg.tagline}</p>

                <div className="mt-6 mb-4">
                  <div className="text-4xl font-serif text-[#292824]">{pkg.samplePrice}</div>
                  <div className="text-[11px] text-[#8B8278] uppercase tracking-wider mt-1">{pkg.billingNote}</div>
                </div>

                <p className="text-xs text-[#8B8278] leading-relaxed pt-2 border-t border-[#8B8278]/15 mb-6 font-light">
                  {pkg.description}
                </p>

                <div className="space-y-3 mb-8">
                  <div className="text-[10px] uppercase tracking-widest text-[#292824] font-semibold">
                    Inclusions
                  </div>
                  {pkg.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#292824]">
                      <Check className="w-3.5 h-3.5 text-[#AAB5A0] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#8B8278]/15">
                <Link
                  href={pkg.ctaLink}
                  className={`w-full flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-widest font-medium transition-colors ${pkg.popular
                      ? "bg-[#292824] text-[#FAF8F3] hover:bg-[#3D3B35]"
                      : "border border-[#292824] text-[#292824] hover:bg-[#292824]/5"
                    }`}
                >
                  {pkg.ctaText} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}
