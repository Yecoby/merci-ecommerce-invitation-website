"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { StorefrontNavbar, StorefrontFooter } from "@/components/layout/storefront-layout";
import { TEMPLATES } from "@/lib/templates-data";
import { BotanicalFloralAccent, CelestialConstellationAccent } from "@/components/ui/decorative-artwork";
import { Check, Sparkles, ArrowRight, Eye, Smartphone, Calendar, MapPin, Users, Heart } from "lucide-react";

function CreateInvitationContent() {
  const searchParams = useSearchParams();
  const initialTemplateSlug = searchParams.get("template") || TEMPLATES[0].slug;
  const editSlug = searchParams.get("edit"); // Support editing an existing invitation

  const [selectedTemplateSlug, setSelectedTemplateSlug] = useState(initialTemplateSlug);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [invitationPublicSlug, setInvitationPublicSlug] = useState<string | null>(editSlug);

  // Form state
  const [formData, setFormData] = useState({
    title: "Mateo & Sofia's Wedding Celebration",
    hosts: "Mateo Valenzuela & Sofia Ramirez",
    eventDate: "2027-02-14",
    time: "3:30 PM",
    venueName: "Villa San Lorenzo Pavilion",
    venueAddress: "Ridgeview Heights, Tagaytay City, Cavite",
    story: "Mateo and Sofia met in Intramuros six years ago. After countless shared coffees and adventures, we invite you to celebrate the start of forever.",
    dressCode: "Formal Garden Attire in Soft Earthy Neutrals and Dusty Rose",
    enableRSVP: true,
    maxGuests: 150,
    allowPlusOne: true,
    isPublic: false,
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
    mealOptions: ["Roast Herb Beef Tenderloin", "Pan-Seared Seabass", "Vegetarian Truffle Risotto"],
  });

  const [saving, setSaving] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(!!editSlug);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load existing invitation details if edit param provided
  React.useEffect(() => {
    if (editSlug) {
      fetch(`/api/invitations/${editSlug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.invitation) {
            const inv = data.invitation;
            setInvitationPublicSlug(inv.publicSlug);
            if (inv.template?.slug) {
              setSelectedTemplateSlug(inv.template.slug);
            }
            setFormData({
              title: inv.title || "",
              hosts: inv.eventData?.hosts || "",
              eventDate: inv.eventData?.eventDate ? inv.eventData.eventDate.split("T")[0] : "",
              time: "3:30 PM",
              venueName: inv.eventData?.venueName || "",
              venueAddress: inv.eventData?.venueAddress || "",
              story: inv.eventData?.welcomeMessage || "",
              dressCode: inv.eventData?.dressCode || "",
              enableRSVP: inv.rsvpConfig?.isEnabled ?? true,
              maxGuests: inv.rsvpConfig?.maxGuests || 150,
              allowPlusOne: inv.rsvpConfig?.allowPlusOne ?? true,
              isPublic: inv.isPublic ?? false,
              status: inv.status || "DRAFT",
              mealOptions: ["Roast Herb Beef Tenderloin", "Pan-Seared Seabass", "Vegetarian Truffle Risotto"],
            });
          }
        })
        .catch(() => {})
        .finally(() => setLoadingExisting(false));
    }
  }, [editSlug]);

  const selectedTemplate = TEMPLATES.find((t) => t.slug === selectedTemplateSlug) || TEMPLATES[0];

  const handleSaveDraft = async (publish: boolean = false) => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    const payloadStatus = publish ? "PUBLISHED" : formData.status;
    const payloadIsPublic = publish ? true : formData.isPublic;

    try {
      let res: Response;
      if (invitationPublicSlug) {
        // Update existing invitation
        res = await fetch(`/api/invitations/${invitationPublicSlug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            hosts: formData.hosts,
            eventDate: formData.eventDate,
            time: formData.time,
            venueName: formData.venueName,
            venueAddress: formData.venueAddress,
            story: formData.story,
            dressCode: formData.dressCode,
            isPublic: payloadIsPublic,
            status: payloadStatus,
          }),
        });
      } else {
        // Create new invitation
        res = await fetch("/api/invitations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateSlug: selectedTemplateSlug,
            title: formData.title,
            hosts: formData.hosts,
            eventDate: formData.eventDate,
            time: formData.time,
            venueName: formData.venueName,
            venueAddress: formData.venueAddress,
            story: formData.story,
            dressCode: formData.dressCode,
            enableRSVP: formData.enableRSVP,
            maxGuests: formData.maxGuests,
            allowPlusOne: formData.allowPlusOne,
          }),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = `/register?redirect=/create?template=${selectedTemplateSlug}`;
          return;
        }
        throw new Error(data.error || "Failed to save invitation");
      }

      const currentSlug = data.publicSlug || invitationPublicSlug || "saved";
      setInvitationPublicSlug(currentSlug);
      setSaveSuccess(currentSlug);
      if (publish) {
        setFormData((prev) => ({ ...prev, status: "PUBLISHED", isPublic: true }));
      }
    } catch (err: any) {
      setSaveError(err.message || "Failed to save invitation.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F3]">
      <StorefrontNavbar />

      <main className="flex-1 py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Step Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8B8278]">Interactive Builder</span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#292824] mt-2 mb-3">
            Design Your Digital Invitation
          </h1>
          <p className="text-xs sm:text-sm text-[#8B8278] font-light">
            Choose an atelier template, personalize your event schedule and narrative, and test your guest preview in real time.
          </p>

          {/* Stepper Tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-8 border-y border-[#8B8278]/20 py-3">
            <button
              onClick={() => setStep(1)}
              className={`text-xs uppercase tracking-wider px-3 py-1.5 transition-colors ${
                step === 1 ? "bg-[#292824] text-white font-medium" : "text-[#8B8278] hover:text-[#292824]"
              }`}
            >
              1. Choose Template
            </button>
            <span className="text-xs text-[#8B8278]">/</span>
            <button
              onClick={() => setStep(2)}
              className={`text-xs uppercase tracking-wider px-3 py-1.5 transition-colors ${
                step === 2 ? "bg-[#292824] text-white font-medium" : "text-[#8B8278] hover:text-[#292824]"
              }`}
            >
              2. Event Details
            </button>
            <span className="text-xs text-[#8B8278]">/</span>
            <button
              onClick={() => setStep(3)}
              className={`text-xs uppercase tracking-wider px-3 py-1.5 transition-colors ${
                step === 3 ? "bg-[#292824] text-white font-medium" : "text-[#8B8278] hover:text-[#292824]"
              }`}
            >
              3. Review & RSVP
            </button>
          </div>
        </div>

        {/* Builder Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Form Controls */}
          <div className="lg:col-span-6 bg-white border border-[#8B8278]/25 p-6 sm:p-8 shadow-sm">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-serif text-[#292824] mb-1">Select an Invitation Style</h2>
                  <p className="text-xs text-[#8B8278]">
                    Each template is crafted for high-end digital presentation on both mobile devices and desktops.
                  </p>
                </div>

                <div className="space-y-4">
                  {TEMPLATES.map((tmpl) => {
                    const isSelected = tmpl.slug === selectedTemplateSlug;
                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => setSelectedTemplateSlug(tmpl.slug)}
                        className={`p-4 border cursor-pointer transition-all ${
                          isSelected
                            ? "border-[#292824] ring-1 ring-[#292824] bg-[#FAF8F3]/50"
                            : "border-[#8B8278]/25 hover:border-[#8B8278]/60 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-serif text-lg font-normal text-[#292824]">{tmpl.name}</span>
                          <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 bg-[#8B8278]/10 text-[#8B8278]">
                            {tmpl.occasionLabel}
                          </span>
                        </div>
                        <p className="text-xs text-[#8B8278] font-light mb-3">{tmpl.tagline}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-[#8B8278]/15 text-[11px] text-[#8B8278]">
                          <span>Sample Price: ₱{tmpl.samplePricePHP.toLocaleString()}</span>
                          {isSelected && <span className="font-semibold text-[#292824] flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Selected</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 bg-[#292824] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35] transition-colors"
                  >
                    Next: Event Details →
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-serif text-[#292824] mb-1">Event Information</h2>
                  <p className="text-xs text-[#8B8278]">
                    Fill in the core ceremony and celebration details. Preview updates in real-time on the right.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[#292824] font-medium mb-1 uppercase tracking-wider text-[10px]">
                      Invitation Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-[#8B8278]/30 focus:outline-none focus:border-[#292824]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#292824] font-medium mb-1 uppercase tracking-wider text-[10px]">
                      Honorees / Hosts
                    </label>
                    <input
                      type="text"
                      value={formData.hosts}
                      onChange={(e) => setFormData({ ...formData, hosts: e.target.value })}
                      className="w-full px-3 py-2 border border-[#8B8278]/30 focus:outline-none focus:border-[#292824]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#292824] font-medium mb-1 uppercase tracking-wider text-[10px]">
                        Event Date
                      </label>
                      <input
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        className="w-full px-3 py-2 border border-[#8B8278]/30 focus:outline-none focus:border-[#292824]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#292824] font-medium mb-1 uppercase tracking-wider text-[10px]">
                        Ceremony Time
                      </label>
                      <input
                        type="text"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        placeholder="e.g. 3:30 PM PHT"
                        className="w-full px-3 py-2 border border-[#8B8278]/30 focus:outline-none focus:border-[#292824]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#292824] font-medium mb-1 uppercase tracking-wider text-[10px]">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      value={formData.venueName}
                      onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                      className="w-full px-3 py-2 border border-[#8B8278]/30 focus:outline-none focus:border-[#292824]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#292824] font-medium mb-1 uppercase tracking-wider text-[10px]">
                      Venue Address & Location
                    </label>
                    <input
                      type="text"
                      value={formData.venueAddress}
                      onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                      className="w-full px-3 py-2 border border-[#8B8278]/30 focus:outline-none focus:border-[#292824]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#292824] font-medium mb-1 uppercase tracking-wider text-[10px]">
                      Dress Code / Attire
                    </label>
                    <input
                      type="text"
                      value={formData.dressCode}
                      onChange={(e) => setFormData({ ...formData, dressCode: e.target.value })}
                      className="w-full px-3 py-2 border border-[#8B8278]/30 focus:outline-none focus:border-[#292824]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#292824] font-medium mb-1 uppercase tracking-wider text-[10px]">
                      Couple's Story / Welcome Message
                    </label>
                    <textarea
                      rows={3}
                      value={formData.story}
                      onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                      className="w-full px-3 py-2 border border-[#8B8278]/30 focus:outline-none focus:border-[#292824]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-[#8B8278]/15">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs uppercase tracking-widest text-[#8B8278] hover:text-[#292824]"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 bg-[#292824] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35] transition-colors"
                  >
                    Next: Review & RSVP →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-serif text-[#292824] mb-1">RSVP Preferences & Save</h2>
                  <p className="text-xs text-[#8B8278]">
                    Configure how your guests will confirm attendance.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <label className="flex items-center gap-2 p-3 bg-[#FAF8F3] border border-[#8B8278]/25 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableRSVP}
                      onChange={(e) => setFormData({ ...formData, enableRSVP: e.target.checked })}
                      className="rounded-none border-[#8B8278]/30"
                    />
                    <span className="font-medium text-[#292824]">Enable Interactive RSVP Submission</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 bg-[#FAF8F3] border border-[#8B8278]/25 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allowPlusOne}
                      onChange={(e) => setFormData({ ...formData, allowPlusOne: e.target.checked })}
                      className="rounded-none border-[#8B8278]/30"
                    />
                    <span className="font-medium text-[#292824]">Allow Plus-Ones / Additional Family Members</span>
                  </label>

                  <div className="p-4 border border-[#8B8278]/25 bg-white space-y-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#292824] block">
                      Sample Entree Selections
                    </span>
                    <ul className="space-y-1 text-[#8B8278]">
                      {formData.mealOptions.map((opt, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#8B8278] rounded-full" />
                          {opt}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-[#FAF8F3] border border-[#8B8278]/30 text-xs space-y-2">
                    <span className="font-medium text-[#292824] block">Save & Launch Next Steps</span>
                    <p className="text-[#8B8278] leading-relaxed">
                      Save your invitation draft to your MERCI account to manage guest RSVPs, customize further, or publish your shareable link.
                    </p>
                  </div>

                  {saveSuccess && (
                    <div className="p-4 bg-[#AAB5A0]/20 border border-[#2C3527]/30 text-xs text-[#2C3527] space-y-2">
                      <p className="font-medium">Invitation draft successfully saved to your account!</p>
                      <div className="flex gap-3">
                        <Link href="/account" className="underline font-semibold">Go to My Invitations</Link>
                        <Link href={`/i/${saveSuccess}`} className="underline">Preview Link</Link>
                      </div>
                    </div>
                  )}

                  {saveError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-xs text-red-600">
                      {saveError}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-[#8B8278]/15">
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs uppercase tracking-widest text-[#8B8278] hover:text-[#292824]"
                  >
                    ← Back
                  </button>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/i/demo-${selectedTemplate.slug}`}
                      className="px-4 py-2 border border-[#292824] text-xs uppercase tracking-widest text-[#292824] hover:bg-[#292824]/5"
                    >
                      Full Demo
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleSaveDraft(false)}
                      disabled={saving}
                      className="px-5 py-2.5 border border-[#292824] text-[#292824] text-xs uppercase tracking-widest font-medium hover:bg-[#292824]/5 transition-colors disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Draft"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveDraft(true)}
                      disabled={saving}
                      className="px-6 py-2.5 bg-[#292824] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35] transition-colors disabled:opacity-50"
                    >
                      {saving ? "Publishing..." : "Publish Live Link"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Live Responsive Preview Mockup */}
          <div className="lg:col-span-6 sticky top-28">
            <div className="text-xs uppercase tracking-widest text-[#8B8278] mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" /> Mobile Live Preview
              </span>
              <span>Template: {selectedTemplate.name}</span>
            </div>

            {/* Mobile Frame Container */}
            <div className="max-w-sm mx-auto border-[10px] border-[#292824] rounded-[36px] shadow-2xl overflow-hidden bg-white">
              {/* Notch */}
              <div className="h-4 bg-[#292824] flex justify-center items-center">
                <div className="w-16 h-2 bg-white/20 rounded-full" />
              </div>

              {/* Viewport Content */}
              <div
                className="p-6 text-center min-h-[520px] flex flex-col justify-between transition-colors duration-300"
                style={{
                  backgroundColor: selectedTemplate.palette.background,
                  color: selectedTemplate.palette.text,
                }}
              >
                <div className="space-y-4">
                  <div className="text-[10px] tracking-[0.3em] uppercase opacity-70">
                    {selectedTemplate.occasionLabel} Invitation
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-light tracking-wide">
                      {formData.hosts || "Mateo & Sofia"}
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest mt-1 opacity-75">
                      Warmly invite you to celebrate
                    </p>
                  </div>

                  <div className="flex justify-center py-1">
                    {selectedTemplate.thumbnailStyle === "midnight-celestial" ? (
                      <CelestialConstellationAccent className="w-12 h-6 text-[#C5A880]" />
                    ) : (
                      <BotanicalFloralAccent className="w-24 h-6 text-current opacity-70" />
                    )}
                  </div>

                  <div className="space-y-1 text-xs font-light">
                    <p className="font-serif italic text-sm">{formData.eventDate || "February 14, 2027"}</p>
                    <p>{formData.time || "3:30 PM PHT"}</p>
                    <p className="opacity-90 pt-1 font-medium">{formData.venueName || "Villa San Lorenzo"}</p>
                    <p className="text-[10px] opacity-70">{formData.venueAddress || "Tagaytay City, Cavite"}</p>
                  </div>

                  <div className="p-3 border border-current/20 text-[11px] font-light italic leading-relaxed">
                    "{formData.story}"
                  </div>

                  {formData.dressCode && (
                    <div className="text-[10px] opacity-80 pt-1">
                      <span className="font-medium uppercase tracking-wider block">Attire:</span>
                      {formData.dressCode}
                    </div>
                  )}
                </div>

                <div className="pt-6">
                  <button
                    disabled
                    className="w-full py-2.5 text-xs uppercase tracking-widest font-medium border border-current opacity-90 cursor-default"
                  >
                    RSVP to Event
                  </button>
                  <p className="text-[9px] opacity-60 mt-1 uppercase tracking-widest">
                    Digital RSVP Powered by MERCI
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}

export default function CreateInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F3] text-xs uppercase tracking-widest text-[#8B8278]">
          Loading builder...
        </div>
      }
    >
      <CreateInvitationContent />
    </Suspense>
  );
}
