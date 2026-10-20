import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StorefrontNavbar, StorefrontFooter } from "@/components/layout/storefront-layout";
import { TEMPLATES } from "@/lib/templates-data";
import { BotanicalFloralAccent, CelestialConstellationAccent } from "@/components/ui/decorative-artwork";
import { CheckCircle2, ArrowRight, Smartphone, Eye, Sparkles } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.slug }));
}

export default async function TemplateDetailPage({ params }: Props) {
  const { slug } = await params;
  const template = TEMPLATES.find((t) => t.slug === slug);

  if (!template) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <StorefrontNavbar />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="text-xs uppercase tracking-widest text-[#8B8278] mb-8">
          <Link href="/invitations" className="hover:text-[#292824]">Invitations</Link>
          <span className="mx-2">/</span>
          <span className="text-[#292824]">{template.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Preview Card */}
          <div className="lg:col-span-7">
            <div
              className="border border-[#8B8278]/25 p-8 sm:p-12 relative overflow-hidden shadow-sm"
              style={{ backgroundColor: template.palette.background, color: template.palette.text }}
            >
              <div className="text-center max-w-md mx-auto space-y-6">
                <div className="text-xs tracking-[0.3em] uppercase opacity-70">
                  {template.occasionLabel} Invitation Preview
                </div>

                <div className="py-4">
                  <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-wide">
                    {template.sampleEvent.hosts}
                  </h1>
                  <p className="text-xs uppercase tracking-widest mt-2 opacity-80">
                    Request the pleasure of your company
                  </p>
                </div>

                <div className="flex justify-center">
                  {template.thumbnailStyle === "midnight-celestial" ? (
                    <CelestialConstellationAccent className="w-16 h-8 text-[#C5A880]" />
                  ) : (
                    <BotanicalFloralAccent className="w-32 h-8 text-current opacity-70" />
                  )}
                </div>

                <div className="space-y-1 text-sm font-light">
                  <p className="font-serif italic text-base">{template.sampleEvent.displayDate}</p>
                  <p>{template.sampleEvent.time}</p>
                  <p className="opacity-80 pt-2">{template.sampleEvent.venue}</p>
                  <p className="text-xs opacity-60">{template.sampleEvent.address}</p>
                </div>

                <div className="p-4 border border-current/20 text-xs font-light italic leading-relaxed">
                  "{template.sampleEvent.story}"
                </div>
              </div>
            </div>

            {/* Quick Demo CTA */}
            <div className="mt-4 flex items-center justify-between text-xs text-[#8B8278] px-2">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#8B8278]" /> Optimized for iOS & Android
              </span>
              <Link
                href={`/i/demo-${template.slug}`}
                className="inline-flex items-center gap-1.5 font-medium text-[#292824] hover:text-[#8B8278] uppercase tracking-wider"
              >
                <Eye className="w-3.5 h-3.5" /> Open Full Interactive Demo
              </Link>
            </div>
          </div>

          {/* Right Configuration & CTA Panel */}
          <div className="lg:col-span-5 space-y-8 bg-white border border-[#8B8278]/20 p-8 sm:p-10">
            <div>
              <div className="inline-block text-[11px] uppercase tracking-widest px-2.5 py-1 bg-[#FAF8F3] border border-[#8B8278]/20 text-[#8B8278] mb-3">
                {template.occasionLabel} Design
              </div>
              <h2 className="text-3xl font-serif text-[#292824]">{template.name}</h2>
              <p className="text-xs italic text-[#8B8278] mt-1">{template.tagline}</p>

              <div className="mt-4 pt-4 border-t border-[#8B8278]/15 flex items-baseline gap-2">
                <span className="text-2xl font-serif text-[#292824]">
                  ₱{template.samplePricePHP.toLocaleString()}
                </span>
                <span className="text-xs text-[#8B8278]">
                  (Sample illustrative package pricing in PHP)
                </span>
              </div>
            </div>

            <p className="text-sm text-[#8B8278] leading-relaxed font-light">
              {template.description}
            </p>

            {/* Inclusions */}
            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold text-[#292824] mb-3">
                Template Features & Inclusions
              </h3>
              <ul className="space-y-2.5">
                {template.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-[#292824]">
                    <CheckCircle2 className="w-4 h-4 text-[#AAB5A0] shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customization Details */}
            <div className="p-4 bg-[#FAF8F3] border border-[#8B8278]/20 text-xs space-y-2">
              <span className="font-semibold text-[#292824] uppercase tracking-wider block text-[10px]">
                Supported Customizations
              </span>
              <p className="text-[#8B8278] leading-relaxed">
                Hosts can adjust titles, dates, time zone, multi-stop schedules, dress codes, Google Maps links, and RSVP deadlines. Color palette tokens and typography pairings can be adjusted in the builder.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-[#8B8278]/15">
              <Link
                href={`/create?template=${template.slug}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#292824] text-[#FAF8F3] text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35] transition-colors"
              >
                Use This Template <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href={`/custom-invitation?preferred=${template.slug}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 border border-[#8B8278]/40 text-[#292824] text-xs uppercase tracking-widest font-medium hover:bg-[#292824]/5 transition-colors"
              >
                Request Concierge Customization
              </Link>
            </div>
          </div>
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}
