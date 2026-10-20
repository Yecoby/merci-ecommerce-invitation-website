"use client";

import React, { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TEMPLATES } from "@/lib/templates-data";
import { BotanicalFloralAccent, CelestialConstellationAccent } from "@/components/ui/decorative-artwork";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Music,
  Share2,
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function PublicInvitationPage({ params }: Props) {
  const [slug, setSlug] = React.useState<string | null>(null);
  const [dbInvitation, setDbInvitation] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    params.then(async (p) => {
      setSlug(p.slug);
      if (!p.slug.startsWith("demo-")) {
        try {
          const res = await fetch(`/api/invitations/${p.slug}`);
          if (res.ok) {
            const data = await res.json();
            if (data.invitation) {
              setDbInvitation(data.invitation);
            }
          }
        } catch {
          // Fallback to template preset if offline or not found
        }
      }
      setLoading(false);
    });
  }, [params]);

  if (!slug || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F3] text-xs uppercase tracking-widest text-[#8B8278]">
        Loading celebration...
      </div>
    );
  }

  // Handle demo slugs (e.g. "demo-serenade-wedding" or "serenade-wedding")
  const cleanSlug = slug.replace(/^demo-/, "");
  const template = TEMPLATES.find((t) => t.slug === cleanSlug) || TEMPLATES[0];

  // Render values: merge database record (if available) with template defaults
  const eventDetails = {
    hosts: dbInvitation?.eventData?.hosts || template.sampleEvent.hosts,
    displayDate: dbInvitation?.eventData?.eventDate
      ? new Date(dbInvitation.eventData.eventDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : template.sampleEvent.displayDate,
    time: template.sampleEvent.time,
    story: dbInvitation?.eventData?.welcomeMessage || template.sampleEvent.story,
    venue: dbInvitation?.eventData?.venueName || template.sampleEvent.venue,
    address: dbInvitation?.eventData?.venueAddress || template.sampleEvent.address,
    dressCode: dbInvitation?.eventData?.dressCode || template.sampleEvent.dressCode,
    schedule: template.sampleEvent.schedule,
    title: dbInvitation?.title || template.sampleEvent.title,
  };

  // Guest RSVP submission state
  const [rsvpState, setRsvpState] = useState({
    guestName: "",
    email: "",
    attendance: "ATTENDING",
    attendeeCount: 1,
    attendeeNames: "",
    mealChoice: "",
    dietaryNotes: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rsvpError, setRsvpError] = useState("");

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setRsvpError("");

    try {
      const res = await fetch(`/api/invitations/${slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rsvpState),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit RSVP");
      }

      setSubmitted(true);
    } catch (err: any) {
      setRsvpError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between selection:bg-[#292824] selection:text-white"
      style={{
        backgroundColor: template.palette.background,
        color: template.palette.text,
      }}
    >
      {/* Sticky Top Bar for Visitors */}
      <header className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between border-b border-current/10 backdrop-blur-md bg-inherit/90">
        <div className="text-xs tracking-widest uppercase font-serif">
          MERCI Atelier
        </div>
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: template.sampleEvent.title,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Invitation link copied to clipboard!");
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 border border-current/30 text-xs tracking-wider uppercase hover:bg-current/5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <a
            href="#rsvp-section"
            className="px-3 py-1 bg-current text-[background] text-xs tracking-wider uppercase font-medium hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: template.palette.text,
              color: template.palette.background,
            }}
          >
            RSVP Now
          </a>
        </div>
      </header>

      {/* Main Invitation Narrative */}
      <main className="max-w-2xl mx-auto px-6 py-16 sm:py-24 text-center space-y-16 sm:space-y-24">
        {/* Cover Hero */}
        <section className="space-y-6 pt-4">
          <div className="text-[11px] tracking-[0.35em] uppercase opacity-70">
            {template.occasionLabel} Celebration
          </div>

          <div className="py-2">
            <h1 className="font-serif text-4xl sm:text-6xl font-light tracking-wide leading-tight">
              {eventDetails.hosts}
            </h1>
            <p className="text-xs uppercase tracking-widest mt-3 opacity-75">
              Cordially invite you to celebrate with them
            </p>
          </div>

          <div className="flex justify-center my-6">
            {template.thumbnailStyle === "midnight-celestial" ? (
              <CelestialConstellationAccent className="w-20 h-10 text-[#C5A880]" />
            ) : (
              <BotanicalFloralAccent className="w-36 h-10 text-current opacity-70" />
            )}
          </div>

          <div className="space-y-2">
            <p className="font-serif italic text-xl sm:text-2xl">{eventDetails.displayDate}</p>
            <p className="text-sm tracking-wide opacity-90">{eventDetails.time}</p>
          </div>
        </section>

        {/* Story Section */}
        <section className="space-y-6 p-8 border border-current/20 bg-current/[0.02]">
          <span className="text-[10px] uppercase tracking-[0.3em] opacity-70">Our Story</span>
          <p className="font-serif italic text-base sm:text-lg leading-relaxed max-w-lg mx-auto opacity-90">
            "{eventDetails.story}"
          </p>
        </section>

        {/* Schedule & Venue */}
        <section className="space-y-10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] opacity-70 block mb-2">Location</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light">{eventDetails.venue}</h2>
            <p className="text-xs opacity-75 max-w-md mx-auto mt-1 leading-relaxed">
              {eventDetails.address}
            </p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                `${eventDetails.venue} ${eventDetails.address}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest mt-4 underline underline-offset-4 hover:opacity-75"
            >
              <MapPin className="w-3.5 h-3.5" /> View on Google Maps
            </a>
          </div>

          {/* Schedule Timeline */}
          <div className="pt-6 border-t border-current/15">
            <span className="text-[10px] uppercase tracking-[0.3em] opacity-70 block mb-6">Celebration Itinerary</span>
            <div className="space-y-4 max-w-md mx-auto text-left">
              {eventDetails.schedule.map((item, idx) => (
                <div key={idx} className="flex items-baseline gap-4 text-xs border-b border-current/10 pb-2">
                  <span className="font-serif text-sm opacity-80 w-20 shrink-0">{item.time}</span>
                  <span className="opacity-90">{item.activity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dress Code */}
          {eventDetails.dressCode && (
            <div className="pt-6 border-t border-current/15">
              <span className="text-[10px] uppercase tracking-[0.3em] opacity-70 block mb-2">Attire Guide</span>
              <p className="text-xs opacity-90 max-w-md mx-auto leading-relaxed">
                {eventDetails.dressCode}
              </p>
            </div>
          )}
        </section>

        {/* RSVP Form Section */}
        <section id="rsvp-section" className="space-y-6 pt-10 border-t border-current/20">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] opacity-70 block mb-1">Kindly Respond</span>
            <h2 className="font-serif text-3xl font-light">Confirm Your Attendance</h2>
            <p className="text-xs opacity-75 mt-1">
              Please RSVP by the requested date to help us finalize arrangements.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 border border-current/30 bg-current/5 space-y-3">
              <CheckCircle2 className="w-8 h-8 mx-auto text-current opacity-80" />
              <h3 className="font-serif text-xl">Thank you, {rsvpState.guestName || "Guest"}!</h3>
              <p className="text-xs opacity-80 max-w-sm mx-auto leading-relaxed">
                Your response has been warmly received. We look forward to celebrating together!
              </p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-4 max-w-md mx-auto text-left text-xs">
              <div>
                <label className="block uppercase tracking-wider text-[10px] opacity-80 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={rsvpState.guestName}
                  onChange={(e) => setRsvpState({ ...rsvpState, guestName: e.target.value })}
                  placeholder="Juan dela Cruz"
                  className="w-full px-3 py-2 bg-transparent border border-current/30 focus:outline-none focus:border-current"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[10px] opacity-80 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={rsvpState.email}
                  onChange={(e) => setRsvpState({ ...rsvpState, email: e.target.value })}
                  placeholder="juan@example.com"
                  className="w-full px-3 py-2 bg-transparent border border-current/30 focus:outline-none focus:border-current"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[10px] opacity-80 mb-1">
                  Attendance *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRsvpState({ ...rsvpState, attendance: "ATTENDING" })}
                    className={`py-2 px-3 border text-center uppercase tracking-wider transition-colors ${
                      rsvpState.attendance === "ATTENDING"
                        ? "bg-current text-[background] font-medium"
                        : "border-current/30 opacity-70"
                    }`}
                    style={
                      rsvpState.attendance === "ATTENDING"
                        ? {
                            backgroundColor: template.palette.text,
                            color: template.palette.background,
                          }
                        : {}
                    }
                  >
                    Joyfully Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpState({ ...rsvpState, attendance: "UNABLE_TO_ATTEND" })}
                    className={`py-2 px-3 border text-center uppercase tracking-wider transition-colors ${
                      rsvpState.attendance === "UNABLE_TO_ATTEND"
                        ? "bg-current text-[background] font-medium"
                        : "border-current/30 opacity-70"
                    }`}
                    style={
                      rsvpState.attendance === "UNABLE_TO_ATTEND"
                        ? {
                            backgroundColor: template.palette.text,
                            color: template.palette.background,
                          }
                        : {}
                    }
                  >
                    Regretfully Decline
                  </button>
                </div>
              </div>

              {rsvpState.attendance === "ATTENDING" && (
                <>
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] opacity-80 mb-1">
                      Total Attending In Your Party
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={rsvpState.attendeeCount}
                      onChange={(e) =>
                        setRsvpState({ ...rsvpState, attendeeCount: parseInt(e.target.value, 10) || 1 })
                      }
                      className="w-full px-3 py-2 bg-transparent border border-current/30 focus:outline-none focus:border-current"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[10px] opacity-80 mb-1">
                      Dietary Restrictions / Allergies (Optional)
                    </label>
                    <input
                      type="text"
                      value={rsvpState.dietaryNotes}
                      onChange={(e) => setRsvpState({ ...rsvpState, dietaryNotes: e.target.value })}
                      placeholder="e.g. Vegetarian, Nut Allergy"
                      className="w-full px-3 py-2 bg-transparent border border-current/30 focus:outline-none focus:border-current"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block uppercase tracking-wider text-[10px] opacity-80 mb-1">
                  Message or Well Wishes for the Host
                </label>
                <textarea
                  rows={2}
                  value={rsvpState.message}
                  onChange={(e) => setRsvpState({ ...rsvpState, message: e.target.value })}
                  placeholder="Warmest congratulations!"
                  className="w-full px-3 py-2 bg-transparent border border-current/30 focus:outline-none focus:border-current"
                />
              </div>

              {rsvpError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-600 text-xs">
                  {rsvpError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 uppercase tracking-widest text-xs font-medium border border-current hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{
                  backgroundColor: template.palette.text,
                  color: template.palette.background,
                }}
              >
                {submitting ? "Submitting Response..." : "Submit Response"}
              </button>
            </form>
          )}
        </section>
      </main>

      {/* Invitation Footer */}
      <footer className="py-8 text-center text-xs opacity-60 border-t border-current/10">
        <p className="tracking-widest uppercase text-[10px]">
          Created with <Link href="/" className="underline hover:opacity-80">MERCI Digital Invitations</Link>
        </p>
      </footer>
    </div>
  );
}
