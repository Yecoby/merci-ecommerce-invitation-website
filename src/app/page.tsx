import React from "react";
import Link from "next/link";
import { StorefrontNavbar, StorefrontFooter } from "@/components/layout/storefront-layout";
import { BotanicalFloralAccent, CelestialConstellationAccent, ModernArchFrame } from "@/components/ui/decorative-artwork";
import { TEMPLATES } from "@/lib/templates-data";
import { ArrowRight, CheckCircle2, Sparkles, Send, Calendar, Clock, Music, Users, ShieldCheck, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <StorefrontNavbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative px-4 pt-16 pb-20 md:pt-28 md:pb-32 overflow-hidden bg-gradient-to-b from-[#FAF8F3] via-[#F2EDE4]/60 to-[#FAF8F3]">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs uppercase tracking-[0.25em] text-[#8B8278] border border-[#8B8278]/25 bg-[#FAF8F3]/70 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Digital Invitations Elevated</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light text-[#292824] leading-[1.15] tracking-tight">
              A modern prelude to your <br />
              <span className="italic font-normal">most memorable</span> moments.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#8B8278] max-w-2xl mx-auto font-light leading-relaxed">
              MERCI crafts romantic, bespoke invitation websites with seamless RSVP tracking, ceremony itineraries, and interactive details that delight your guests.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/invitations"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#292824] text-[#FAF8F3] text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35] transition-all duration-300 shadow-sm"
              >
                Explore Designs
              </Link>
              <Link
                href="/custom-invitation"
                className="w-full sm:w-auto px-8 py-3.5 border border-[#292824] text-[#292824] text-xs uppercase tracking-widest font-medium hover:bg-[#292824]/5 transition-all duration-300"
              >
                Request Custom Service
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-xs text-[#8B8278] uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#AAB5A0]" /> Mobile & Messaging First
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#AAB5A0]" /> Real-time RSVP Tracking
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#AAB5A0]" /> Philippine Peso (₱)
              </span>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS / DUAL MODEL */}
        <section className="py-20 bg-[#FAF8F3] border-t border-[#8B8278]/15">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-widest text-[#8B8278]">Two Thoughtful Ways To Create</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#292824] mt-2">
                Designed to fit your celebration rhythm.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Option 1: Self-Service */}
              <div className="bg-[#FAF8F3] border border-[#8B8278]/25 p-8 sm:p-10 relative flex flex-col justify-between hover:border-[#8B8278]/60 transition-colors">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#8B8278] font-medium mb-3">Model A · Instant & Intuitive</div>
                  <h3 className="text-2xl font-serif text-[#292824] mb-3">Self-Service Templates</h3>
                  <p className="text-sm text-[#8B8278] leading-relaxed mb-6 font-light">
                    Pick a curated editorial design, input your venue, schedule, and guest preferences, preview in real-time, and publish in minutes.
                  </p>
                  <ul className="space-y-3 text-xs text-[#292824] tracking-wide mb-8">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#8B8278]" />
                      Curated color palettes and customizable typography
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#8B8278]" />
                      Instant mobile preview and guest test link
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#8B8278]" />
                      Direct RSVP link sharing to Messenger & Viber
                    </li>
                  </ul>
                </div>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#292824] hover:text-[#8B8278] transition-colors"
                >
                  Start Building <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Option 2: Custom Service */}
              <div className="bg-[#F2EDE4]/50 border border-[#8B8278]/30 p-8 sm:p-10 relative flex flex-col justify-between hover:border-[#8B8278]/60 transition-colors">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#9B7D54] font-medium mb-3">Model B · Bespoke Concierge</div>
                  <h3 className="text-2xl font-serif text-[#292824] mb-3">Custom Concierge Service</h3>
                  <p className="text-sm text-[#8B8278] leading-relaxed mb-6 font-light">
                    Work directly with our design team. Share your theme, custom artwork, monogram, and itinerary. We prepare a tailored preview, revise to perfection, and launch.
                  </p>
                  <ul className="space-y-3 text-xs text-[#292824] tracking-wide mb-8">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#9B7D54]" />
                      Bespoke layouts, custom colorways, and illustration integration
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#9B7D54]" />
                      Dedicated preview revisions with personal designer
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#9B7D54]" />
                      Custom audio track selection and advanced guest groups
                    </li>
                  </ul>
                </div>
                <Link
                  href="/custom-invitation"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#292824] hover:text-[#8B8278] transition-colors"
                >
                  Inquire For Custom Design <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CURATED TEMPLATE GALLERY PREVIEW */}
        <section className="py-24 bg-[#FAF8F3] border-t border-[#8B8278]/15">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#8B8278]">Signature Collection</span>
                <h2 className="text-3xl sm:text-4xl font-serif text-[#292824] mt-2">
                  Designs crafted with poise.
                </h2>
              </div>
              <Link
                href="/invitations"
                className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-[#292824] hover:text-[#8B8278] transition-colors"
              >
                View all collection ({TEMPLATES.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="group flex flex-col bg-white border border-[#8B8278]/20 overflow-hidden hover:border-[#8B8278]/50 transition-all duration-300"
                >
                  {/* Decorative Card Header Visual */}
                  <div
                    className="h-64 p-6 flex flex-col justify-between relative overflow-hidden"
                    style={{ backgroundColor: tmpl.palette.background, color: tmpl.palette.text }}
                  >
                    <div className="flex items-center justify-between text-xs tracking-widest uppercase opacity-75">
                      <span>{tmpl.occasionLabel}</span>
                      <span>Sample ₱{tmpl.samplePricePHP.toLocaleString()}</span>
                    </div>

                    <div className="text-center my-auto">
                      <div className="text-xs uppercase tracking-[0.3em] opacity-60 mb-1">MERCI Collection</div>
                      <h3 className="font-serif text-2xl font-light tracking-wide">{tmpl.name}</h3>
                      <p className="text-[11px] opacity-75 italic mt-1 font-serif line-clamp-1">{tmpl.tagline}</p>
                    </div>

                    <div className="flex justify-center">
                      {tmpl.thumbnailStyle === "arch-editorial" && <BotanicalFloralAccent className="w-24 h-6 text-current opacity-60" />}
                      {tmpl.thumbnailStyle === "midnight-celestial" && <CelestialConstellationAccent className="w-16 h-8 text-[#C5A880]" />}
                      {tmpl.thumbnailStyle === "soft-botanical" && <BotanicalFloralAccent className="w-24 h-6 text-current opacity-60" />}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between bg-[#FAF8F3]">
                    <div>
                      <p className="text-xs text-[#8B8278] leading-relaxed line-clamp-2 mb-4 font-light">
                        {tmpl.description}
                      </p>
                      <div className="space-y-1 mb-6">
                        {tmpl.features.slice(0, 3).map((feat, i) => (
                          <div key={i} className="text-[11px] text-[#292824] flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-[#8B8278] rounded-full" />
                            {feat}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#8B8278]/15 flex items-center justify-between">
                      <Link
                        href={`/invitations/${tmpl.slug}`}
                        className="text-xs uppercase tracking-widest font-medium text-[#292824] hover:text-[#8B8278] transition-colors"
                      >
                        Explore Design
                      </Link>
                      <Link
                        href={`/i/demo-${tmpl.slug}`}
                        className="text-xs uppercase tracking-widest font-light text-[#8B8278] hover:text-[#292824] transition-colors"
                      >
                        Live Demo →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES HIGHLIGHT */}
        <section className="py-20 bg-[#F2EDE4]/40 border-t border-[#8B8278]/15">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-widest text-[#8B8278]">Complete Guest Experience</span>
              <h2 className="text-3xl font-serif text-[#292824] mt-2">
                Thoughtful features for unforgettable hospitality.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 bg-[#FAF8F3] border border-[#8B8278]/20">
                <Users className="w-6 h-6 text-[#8B8278] mb-4" />
                <h4 className="font-serif text-lg text-[#292824] mb-2">Smart RSVP Tracking</h4>
                <p className="text-xs text-[#8B8278] leading-relaxed">
                  Real-time confirmations, dietary notes, plus-one limits, and exportable guest lists with instant host notifications.
                </p>
              </div>

              <div className="p-6 bg-[#FAF8F3] border border-[#8B8278]/20">
                <Calendar className="w-6 h-6 text-[#8B8278] mb-4" />
                <h4 className="font-serif text-lg text-[#292824] mb-2">Ceremony Itinerary</h4>
                <p className="text-xs text-[#8B8278] leading-relaxed">
                  Clear, beautiful timeline guides your guests seamlessly from ceremony to reception, attire guidance, and photo sessions.
                </p>
              </div>

              <div className="p-6 bg-[#FAF8F3] border border-[#8B8278]/20">
                <Music className="w-6 h-6 text-[#8B8278] mb-4" />
                <h4 className="font-serif text-lg text-[#292824] mb-2">Acoustic Ambience</h4>
                <p className="text-xs text-[#8B8278] leading-relaxed">
                  Optional gentle background music with polite guest-controlled playback that never auto-plays without consent.
                </p>
              </div>

              <div className="p-6 bg-[#FAF8F3] border border-[#8B8278]/20">
                <ShieldCheck className="w-6 h-6 text-[#8B8278] mb-4" />
                <h4 className="font-serif text-lg text-[#292824] mb-2">Private & Secure</h4>
                <p className="text-xs text-[#8B8278] leading-relaxed">
                  Unguessable slugs, private drafts, protected client dashboards, and strictly isolated database records.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="py-20 bg-[#FAF8F3] text-center border-t border-[#8B8278]/15">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-serif text-[#292824] mb-4">
              Begin your celebration story with MERCI.
            </h2>
            <p className="text-sm text-[#8B8278] max-w-xl mx-auto mb-8 font-light leading-relaxed">
              Whether you wish to customize a template in minutes or have our concierge build a bespoke masterpiece, your guests will be enchanted.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/create"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#292824] text-[#FAF8F3] text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35] transition-colors"
              >
                Choose A Template
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-3.5 border border-[#8B8278]/40 text-[#292824] text-xs uppercase tracking-widest font-medium hover:bg-[#292824]/5 transition-colors"
              >
                Talk to Our Concierge
              </Link>
            </div>
          </div>
        </section>
      </main>

      <StorefrontFooter />
    </div>
  );
}
