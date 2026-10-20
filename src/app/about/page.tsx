import React from "react";
import Link from "next/link";
import { StorefrontNavbar, StorefrontFooter } from "@/components/layout/storefront-layout";
import { Heart, Sparkles, Shield, Compass } from "lucide-react";

export const metadata = {
  title: "About Us — MERCI Digital Invitations",
  description: "Learn about the philosophy, craftsmanship, and mission behind MERCI digital invitation websites.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <StorefrontNavbar />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8B8278]">Our Story & Philosophy</span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#292824] mt-2 mb-4">
            The Spirit of MERCI
          </h1>
          <p className="text-sm text-[#8B8278] font-light leading-relaxed">
            Derived from the French word for "thank you," MERCI was conceived from a deep reverence for the warmth of gathering loved ones together.
          </p>
        </div>

        {/* Narrative */}
        <div className="space-y-12 text-sm text-[#8B8278] leading-relaxed font-light">
          <section className="bg-white border border-[#8B8278]/20 p-8 sm:p-12">
            <h2 className="text-2xl font-serif text-[#292824] mb-4">
              More than an RSVP link: A digital prelude to celebration.
            </h2>
            <p className="mb-4">
              In an era where invitations are often shared through instant messaging apps, couples and families were faced with a dilemma: choose expensive, easily lost paper stationery, or settle for an impersonal generic PDF flyer.
            </p>
            <p>
              MERCI bridges this divide. We combine the romantic typography and editorial composure of fine stationery with the modern conveniences of responsive web design—instant RSVPs, interactive maps, dietary preferences, and delicate musical accompaniment.
            </p>
          </section>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#F2EDE4]/50 border border-[#8B8278]/25">
              <Sparkles className="w-6 h-6 text-[#C5A880] mb-3" />
              <h3 className="font-serif text-lg text-[#292824] mb-2">Editorial Poise</h3>
              <p className="text-xs leading-relaxed">
                Quiet luxury, balanced whitespace, and refined serif pairings create a sophisticated aesthetic tailored to your celebration.
              </p>
            </div>

            <div className="p-6 bg-[#F2EDE4]/50 border border-[#8B8278]/25">
              <Heart className="w-6 h-6 text-[#D9B7B0] mb-3" />
              <h3 className="font-serif text-lg text-[#292824] mb-2">Respectful Hospitality</h3>
              <p className="text-xs leading-relaxed">
                We believe guests should have a joyful, friction-free experience: no compulsory app downloads, no noisy popups, and respectful audio controls.
              </p>
            </div>

            <div className="p-6 bg-[#F2EDE4]/50 border border-[#8B8278]/25">
              <Shield className="w-6 h-6 text-[#AAB5A0] mb-3" />
              <h3 className="font-serif text-lg text-[#292824] mb-2">Data Privacy First</h3>
              <p className="text-xs leading-relaxed">
                Your guest lists, dietary notes, and personal love stories remain private. We never sell customer records or expose attendee contact data.
              </p>
            </div>
          </div>

          <section className="text-center pt-8 border-t border-[#8B8278]/20">
            <h3 className="text-2xl font-serif text-[#292824] mb-3">
              Crafted in the Philippines for celebrations everywhere.
            </h3>
            <p className="max-w-xl mx-auto mb-6 text-xs text-[#8B8278]">
              Whether you are planning an intimate Tagaytay garden ceremony, a grand ballroom debut in BGC, or a family christening in Makati, MERCI is honored to be part of your story.
            </p>
            <Link
              href="/invitations"
              className="inline-block px-8 py-3 bg-[#292824] text-[#FAF8F3] text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35] transition-colors"
            >
              Explore Our Collection
            </Link>
          </section>
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}
