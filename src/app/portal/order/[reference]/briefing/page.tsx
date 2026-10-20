"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MerciLogo } from "@/components/ui/merci-logo";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Save,
  Calendar,
  MapPin,
  Clock,
  Heart,
  Sparkles,
  HelpCircle,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface Props {
  params: Promise<{ reference: string }>;
}

export default function GuidedBriefingClient({ params }: Props) {
  const router = useRouter();
  const [reference, setReference] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setReference(p.reference));
  }, [params]);

  // Briefing Form State
  const [formData, setFormData] = useState({
    // Step 1: Overview
    eventType: "Wedding",
    hosts: "",
    eventTitle: "",
    wordingStyle: "",
    languagePreference: "English",

    // Step 2: Date & Location
    eventDate: "",
    time: "",
    timeZone: "Asia/Manila",
    venueName: "",
    venueAddress: "",
    venueMapUrl: "",

    // Step 3: Ceremony & Schedule
    ceremonyDetails: "",
    receptionDetails: "",
    dressCode: "",
    scheduleItems: [
      { time: "3:30 PM", activity: "Guest Arrival & Welcome Cocktails" },
      { time: "4:00 PM", activity: "Ceremony" },
      { time: "6:00 PM", activity: "Reception & Dinner" },
    ],

    // Step 4: RSVP & Guest Experience
    rsvpDeadline: "",
    enableRSVP: true,
    allowPlusOne: true,
    mealOptions: ["Roast Herb Beef", "Pan-Seared Salmon", "Vegetarian Risotto"],

    // Step 5: Special Details & VIPs
    entourageOrVIPs: "",
    giftGuide: "Your presence is the greatest gift. Should you wish to honor us with a gift, a monetary contribution towards our new beginning is warmly appreciated.",
    travelAccommodations: "",
    specialNotes: "",
    faqs: [
      { question: "Is there parking available?", answer: "Yes, complimentary valet and self-parking are provided at the venue." },
      { question: "Can I bring children?", answer: "While we love your little ones, our celebration is an adults-only occasion unless specified on your formal invitation." },
    ],
  });

  // Load existing briefing
  useEffect(() => {
    if (!reference) return;
    fetch(`/api/portal/orders/${reference}/briefing`)
      .then((res) => res.json())
      .then((data) => {
        if (data.briefing) {
          setFormData((prev) => ({
            ...prev,
            ...data.briefing,
          }));
        }
      })
      .catch((err) => console.error("Error loading briefing:", err))
      .finally(() => setLoading(false));
  }, [reference]);

  // Autosave handler
  const handleSave = useCallback(
    async (submit: boolean = false) => {
      setSaving(true);
      setError(null);
      setSaveSuccess(null);

      try {
        const res = await fetch(`/api/portal/orders/${reference}/briefing`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            submitBriefing: submit,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to save briefing.");
        }

        setSaveSuccess(data.message || (submit ? "Briefing submitted!" : "Progress saved."));
        if (submit) {
          setTimeout(() => {
            router.push(`/portal/order/${reference}`);
          }, 1500);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while saving.");
      } finally {
        setSaving(false);
      }
    },
    [formData, reference, router]
  );

  const addScheduleItem = () => {
    setFormData((prev) => ({
      ...prev,
      scheduleItems: [...prev.scheduleItems, { time: "", activity: "" }],
    }));
  };

  const removeScheduleItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      scheduleItems: prev.scheduleItems.filter((_, i) => i !== index),
    }));
  };

  const addFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const removeFaq = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center text-xs uppercase tracking-widest text-[#8B8278]">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading Event Briefing...
      </div>
    );
  }

  const stepsList = [
    { num: 1, label: "Overview & Wording" },
    { num: 2, label: "Date & Venue" },
    { num: 3, label: "Schedule & Attire" },
    { num: 4, label: "RSVP & Meals" },
    { num: 5, label: "Gifts, VIPs & FAQs" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col justify-between">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#8B8278]/20">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/portal/order/${reference}`}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#8B8278] hover:text-[#292824] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Portal Dashboard
            </Link>
            <span className="text-[#8B8278]/40">|</span>
            <span className="font-mono text-xs uppercase font-medium text-[#292824] hidden sm:inline">
              Briefing · {reference}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#8B8278]/30 hover:border-[#292824] text-xs uppercase tracking-wider text-[#292824] transition-colors bg-white cursor-pointer"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Draft</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-10 w-full space-y-8 flex-1">
        {/* Title */}
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8B8278]">Atelier Blueprint</span>
          <h1 className="text-3xl font-serif text-[#292824] mt-1">Guided Event Briefing</h1>
          <p className="text-xs text-[#8B8278] mt-1 leading-relaxed">
            Every celebration has a unique rhythm. Provide as much or as little detail as applies to your event. You can save and resume anytime.
          </p>
        </div>

        {/* Step Tabs */}
        <div className="flex items-center justify-between border-b border-[#8B8278]/20 overflow-x-auto pb-2 gap-4">
          {stepsList.map((st) => (
            <button
              key={st.num}
              type="button"
              onClick={() => setCurrentStep(st.num)}
              className={`pb-2 text-xs uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                currentStep === st.num
                  ? "border-[#292824] text-[#292824] font-semibold"
                  : "border-transparent text-[#8B8278] hover:text-[#292824]"
              }`}
            >
              Step {st.num}: {st.label}
            </button>
          ))}
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-none">
            {error}
          </div>
        )}
        {saveSuccess && (
          <div className="p-4 bg-[#AAB5A0]/20 border border-[#AAB5A0]/40 text-[#2C3527] text-xs flex items-center gap-2 rounded-none">
            <CheckCircle2 className="w-4 h-4 text-[#AAB5A0]" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white border border-[#8B8278]/25 p-8 shadow-sm">
          {/* STEP 1: Overview */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-serif text-[#292824] border-b border-[#8B8278]/15 pb-3">
                1. Event Overview & Custom Wording
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#292824] mb-1.5 font-medium">
                    Event Type
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F3] border border-[#8B8278]/30 text-sm text-[#292824] focus:outline-none focus:border-[#292824]"
                  >
                    <option value="Wedding">Wedding Celebration</option>
                    <option value="Debut">Debut & 18th Birthday</option>
                    <option value="Baptism">Baptism & Christening</option>
                    <option value="Anniversary">Anniversary Celebration</option>
                    <option value="Milestone Birthday">Milestone Birthday Party</option>
                    <option value="Private Gala">Private Gala & Dinner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#292824] mb-1.5 font-medium">
                    Language Preference
                  </label>
                  <input
                    type="text"
                    value={formData.languagePreference}
                    onChange={(e) => setFormData({ ...formData, languagePreference: e.target.value })}
                    placeholder="e.g. English, Bilingual (English & Tagalog), French"
                    className="w-full px-4 py-2.5 bg-[#FAF8F3] border border-[#8B8278]/30 text-sm text-[#292824] focus:outline-none focus:border-[#292824]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#292824] mb-1.5 font-medium">
                  Host or Celebrant Names
                </label>
                <input
                  type="text"
                  value={formData.hosts}
                  onChange={(e) => setFormData({ ...formData, hosts: e.target.value })}
                  placeholder="e.g. Mateo Valenzuela & Sofia Ramirez"
                  className="w-full px-4 py-2.5 bg-[#FAF8F3] border border-[#8B8278]/30 text-sm text-[#292824] focus:outline-none focus:border-[#292824]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#292824] mb-1.5 font-medium">
                  Event Headline / Formal Title
                </label>
                <input
                  type="text"
                  value={formData.eventTitle}
                  onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
                  placeholder="e.g. The Nuptials of Mateo & Sofia"
                  className="w-full px-4 py-2.5 bg-[#FAF8F3] border border-[#8B8278]/30 text-sm text-[#292824] focus:outline-none focus:border-[#292824]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#292824] mb-1.5 font-medium">
                  Opening Note, Love Story or Welcome Message
                </label>
                <textarea
                  rows={4}
                  value={formData.wordingStyle || ""}
                  onChange={(e) => setFormData({ ...formData, wordingStyle: e.target.value })}
                  placeholder="Share a short welcome paragraph, relationship milestone, or biblical/literary quote to feature on your invitation header."
                  className="w-full px-4 py-2.5 bg-[#FAF8F3] border border-[#8B8278]/30 text-sm text-[#292824] focus:outline-none focus:border-[#292824]"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Date & Venue */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-serif text-[#292824] border-b border-[#8B8278]/15 pb-3">
                2. Celebration Date & Venue Location
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#292824] mb-1.5 font-medium">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={formData.eventDate || ""}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F3] border border-[#8B8278]/30 text-sm text-[#292824] focus:outline-none focus:border-[#292824]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#292824] mb-1.5 font-medium">
                    Assembly / Starting Time
                  </label>
                  <input
                    type="text"
                    value={formData.time || ""}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g. 3:30 PM PHT"
                    className="w-full px-4 py-2.5 bg-[#FAF8F3] border border-[#8B8278]/30 text-sm text-[#292824] focus:outline-none focus:border-[#292824]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#292824] mb-1.5 font-medium">
                  Primary Venue Name
                </label>
                <input
                  type="text"
                  value={formData.venueName || ""}
                  onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                  placeholder="e.g. San Antonio Sanctuary / Villa San Lorenzo Pavilion"
                  className="w-full px-4 py-2.5 bg-[#FAF8F3] border border-[#8B8278]/30 text-sm text-[#292824] focus:outline-none focus:border-[#292824]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#292824] mb-1.5 font-medium">
                  Venue Full Address
                </label>
                <input
                  type="text"
                  value={formData.venueAddress || ""}
                  onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                  placeholder="e.g. Forbes Park, Makati City, Metro Manila"
                  className="w-full px-4 py-2.5 bg-[#FAF8F3] border border-[#8B8278]/30 text-sm text-[#292824] focus:outline-none focus:border-[#292824]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#292824] mb-1.5 font-medium">
                  Google Maps or Waze Share URL
                </label>
                <input
                  type="url"
                  value={formData.venueMapUrl || ""}
                  onChange={(e) => setFormData({ ...formData, venueMapUrl: e.target.value })}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-4 py-2.5 bg-[#FAF8F3] border border-[#8B8278]/30 text-sm text-[#292824] focus:outline-none focus:border-[#292824]"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Schedule & Attire */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-serif text-[#292824] border-b border-[#8B8278]/15 pb-3">
                3. Timeline Schedule & Dress Code
              </h2>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#292824] mb-1.5 font-medium">
                  Dress Code & Palette Guidance
                </label>
                <textarea
                  rows={3}
                  value={formData.dressCode || ""}
                  onChange={(e) => setFormData({ ...formData, dressCode: e.target.value })}
                  placeholder="e.g. Formal Black Tie. Gentlemen in barong or dark suits; ladies in floor-length gowns in warm neutrals, sage, and dusty rose."
                  className="w-full px-4 py-2.5 bg-[#FAF8F3] border border-[#8B8278]/30 text-sm text-[#292824] focus:outline-none focus:border-[#292824]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs uppercase tracking-wider text-[#292824] font-medium">
                    Order of Events / Itinerary
                  </label>
                  <button
                    type="button"
                    onClick={addScheduleItem}
                    className="inline-flex items-center gap-1 text-xs text-[#292824] font-semibold underline hover:text-[#8B8278] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Milestone
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.scheduleItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => {
                          const updated = [...formData.scheduleItems];
                          updated[idx].time = e.target.value;
                          setFormData({ ...formData, scheduleItems: updated });
                        }}
                        placeholder="Time (e.g. 4:00 PM)"
                        className="w-1/3 px-3 py-2 text-sm bg-[#FAF8F3] border border-[#8B8278]/30 focus:outline-none focus:border-[#292824]"
                      />
                      <input
                        type="text"
                        value={item.activity}
                        onChange={(e) => {
                          const updated = [...formData.scheduleItems];
                          updated[idx].activity = e.target.value;
                          setFormData({ ...formData, scheduleItems: updated });
                        }}
                        placeholder="Activity (e.g. Solemn Ceremony)"
                        className="flex-1 px-3 py-2 text-sm bg-[#FAF8F3] border border-[#8B8278]/30 focus:outline-none focus:border-[#292824]"
                      />
                      <button
                        type="button"
                        onClick={() => removeScheduleItem(idx)}
                        className="p-2 text-[#8B8278] hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: RSVP & Meals */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-serif text-[#292824] border-b border-[#8B8278]/15 pb-3">
                4. RSVP Configuration & Dining Selections
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#292824] mb-1.5 font-medium">
                    RSVP Response Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.rsvpDeadline || ""}
                    onChange={(e) => setFormData({ ...formData, rsvpDeadline: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8F3] border border-[#8B8278]/30 text-sm text-[#292824] focus:outline-none focus:border-[#292824]"
                  />
                </div>

                <div className="flex flex-col justify-center space-y-3 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableRSVP}
                      onChange={(e) => setFormData({ ...formData, enableRSVP: e.target.checked })}
                      className="w-4 h-4 rounded text-[#292824]"
                    />
                    <span className="text-xs uppercase tracking-wider text-[#292824]">
                      Enable Interactive RSVP on Live Invitation
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allowPlusOne}
                      onChange={(e) => setFormData({ ...formData, allowPlusOne: e.target.checked })}
                      className="w-4 h-4 rounded text-[#292824]"
                    />
                    <span className="text-xs uppercase tracking-wider text-[#292824]">
                      Allow Plus-One / Family Attendee Count
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#292824] mb-1.5 font-medium">
                  Dinner / Entrée Course Options (Optional)
                </label>
                <p className="text-xs text-[#8B8278] mb-3">
                  Comma-separated list of meal options presented to attending guests during RSVP.
                </p>
                <input
                  type="text"
                  value={formData.mealOptions.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mealOptions: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="e.g. Roasted Herb Beef, Pan-Seared Seabass, Truffle Risotto"
                  className="w-full px-4 py-2.5 bg-[#FAF8F3] border border-[#8B8278]/30 text-sm text-[#292824] focus:outline-none focus:border-[#292824]"
                />
              </div>
            </div>
          )}

          {/* STEP 5: VIPs, Gifts & FAQs */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-lg font-serif text-[#292824] border-b border-[#8B8278]/15 pb-3">
                5. Entourage VIPs, Registry & FAQs
              </h2>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#292824] mb-1.5 font-medium">
                  Entourage, Godparents, or Key Participants
                </label>
                <textarea
                  rows={4}
                  value={formData.entourageOrVIPs || ""}
                  onChange={(e) => setFormData({ ...formData, entourageOrVIPs: e.target.value })}
                  placeholder="List principal sponsors / ninong & ninang, maid of honor, best man, or 18 roses participants to feature in the entourage index."
                  className="w-full px-4 py-2.5 bg-[#FAF8F3] border border-[#8B8278]/30 text-sm text-[#292824] focus:outline-none focus:border-[#292824]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#292824] mb-1.5 font-medium">
                  Gift Guide & Registry Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.giftGuide || ""}
                  onChange={(e) => setFormData({ ...formData, giftGuide: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF8F3] border border-[#8B8278]/30 text-sm text-[#292824] focus:outline-none focus:border-[#292824]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs uppercase tracking-wider text-[#292824] font-medium">
                    Frequently Asked Questions for Guests
                  </label>
                  <button
                    type="button"
                    onClick={addFaq}
                    className="inline-flex items-center gap-1 text-xs text-[#292824] font-semibold underline hover:text-[#8B8278] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add FAQ
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.faqs.map((faq, idx) => (
                    <div key={idx} className="p-4 bg-[#FAF8F3] border border-[#8B8278]/25 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8B8278]">
                          Question #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFaq(idx)}
                          className="text-[#8B8278] hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => {
                          const updated = [...formData.faqs];
                          updated[idx].question = e.target.value;
                          setFormData({ ...formData, faqs: updated });
                        }}
                        placeholder="Question (e.g. Can I bring plus-ones?)"
                        className="w-full px-3 py-2 text-sm bg-white border border-[#8B8278]/30 focus:outline-none focus:border-[#292824]"
                      />
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => {
                          const updated = [...formData.faqs];
                          updated[idx].answer = e.target.value;
                          setFormData({ ...formData, faqs: updated });
                        }}
                        placeholder="Answer"
                        className="w-full px-3 py-2 text-sm bg-white border border-[#8B8278]/30 focus:outline-none focus:border-[#292824]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-[#8B8278]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#8B8278]/30 text-xs uppercase tracking-wider text-[#292824] hover:bg-[#FAF8F3] cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Previous Step
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => {
                    handleSave(false);
                    setCurrentStep(currentStep + 1);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#292824] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35] cursor-pointer"
                >
                  Next Step <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#292824] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35] cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      Submit Briefing to Atelier <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[#8B8278]/15 bg-white/50 text-center text-xs text-[#8B8278]">
        © {new Date().getFullYear()} MERCI Digital Invitations · Dedicated Client Suite
      </footer>
    </div>
  );
}
