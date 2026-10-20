"use client";

import React, { useState } from "react";
import { StorefrontNavbar, StorefrontFooter } from "@/components/layout/storefront-layout";
import { CheckCircle2, Send, AlertCircle } from "lucide-react";

export default function CustomInvitationPage() {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    eventType: "wedding",
    eventDate: "",
    preferredStyle: "serenade-wedding",
    guestCount: "100-150",
    budgetRange: "₱3,500 – ₱5,000",
    desiredFeatures: [] as string[],
    notes: "",
    agreedToPrivacy: false,
    botCheck: "", // Honeypot spam prevention
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const featureOptions = [
    "Custom Couple Monogram / Logo",
    "Tailored Color Palette Matching Entourage",
    "Ceremony & Reception Itinerary Timeline",
    "Advanced Dietary & RSVP Plus-One Limits",
    "Background Acoustic Audio Track",
    "Post-Event Photo Keepsake Section",
    "Custom Domain Name Integration",
  ];

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => {
      const exists = prev.desiredFeatures.includes(feature);
      return {
        ...prev,
        desiredFeatures: exists
          ? prev.desiredFeatures.filter((f) => f !== feature)
          : [...prev.desiredFeatures, feature],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Spam honeypot
    if (formData.botCheck) {
      setStatus("success");
      return;
    }

    if (!formData.agreedToPrivacy) {
      setErrorMessage("Please acknowledge the privacy notice to proceed.");
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit custom inquiry.");
      }

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <StorefrontNavbar />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8B8278]">Bespoke Concierge</span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#292824] mt-2 mb-4">
            Request a Custom Invitation
          </h1>
          <p className="text-sm text-[#8B8278] font-light leading-relaxed">
            Tell us about your celebration. Our creative director will review your event details, prepare a tailored aesthetic proposal and quotation, and craft your custom website.
          </p>
        </div>

        {status === "success" ? (
          <div className="bg-white border border-[#8B8278]/25 p-10 text-center max-w-xl mx-auto shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-[#AAB5A0] mx-auto mb-4" />
            <h2 className="font-serif text-2xl text-[#292824] mb-2">Inquiry Successfully Received</h2>
            <p className="text-sm text-[#8B8278] leading-relaxed mb-6 font-light">
              Merci beaucoup, {formData.customerName}! We have recorded your event specifications. Our design concierge will contact you at <span className="font-medium text-[#292824]">{formData.email}</span> within 24 business hours with your preliminary design concept and quotation.
            </p>
            <button
              onClick={() => {
                setStatus("idle");
                setFormData({
                  customerName: "",
                  email: "",
                  phone: "",
                  eventType: "wedding",
                  eventDate: "",
                  preferredStyle: "serenade-wedding",
                  guestCount: "100-150",
                  budgetRange: "₱3,500 – ₱5,000",
                  desiredFeatures: [],
                  notes: "",
                  agreedToPrivacy: false,
                  botCheck: "",
                });
              }}
              className="px-6 py-2.5 bg-[#292824] text-[#FAF8F3] text-xs uppercase tracking-widest font-medium"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#8B8278]/25 p-8 sm:p-12 shadow-sm space-y-8"
          >
            {/* Honeypot field (hidden from genuine users) */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="bot_field"
                tabIndex={-1}
                value={formData.botCheck}
                onChange={(e) => setFormData({ ...formData, botCheck: e.target.value })}
                autoComplete="off"
              />
            </div>

            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Section 1: Contact Information */}
            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold text-[#292824] pb-2 border-b border-[#8B8278]/20 mb-6">
                1. Your Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#292824] mb-2 font-medium">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Clara Santos"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full text-xs bg-[#FAF8F3] border border-[#8B8278]/30 px-3.5 py-2.5 text-[#292824] focus:outline-none focus:border-[#292824]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#292824] mb-2 font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="maria@example.ph"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs bg-[#FAF8F3] border border-[#8B8278]/30 px-3.5 py-2.5 text-[#292824] focus:outline-none focus:border-[#292824]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-[#292824] mb-2 font-medium">
                    Phone / Viber / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+63 917 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs bg-[#FAF8F3] border border-[#8B8278]/30 px-3.5 py-2.5 text-[#292824] focus:outline-none focus:border-[#292824]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Celebration Details */}
            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold text-[#292824] pb-2 border-b border-[#8B8278]/20 mb-6">
                2. Celebration Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#292824] mb-2 font-medium">
                    Event Type *
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full text-xs bg-[#FAF8F3] border border-[#8B8278]/30 px-3.5 py-2.5 text-[#292824] focus:outline-none focus:border-[#292824]"
                  >
                    <option value="wedding">Wedding</option>
                    <option value="debut">Debut (18th)</option>
                    <option value="baptism">Baptism / Christening</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="birthday">Milestone Birthday</option>
                    <option value="other">Other Celebration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#292824] mb-2 font-medium">
                    Target Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full text-xs bg-[#FAF8F3] border border-[#8B8278]/30 px-3.5 py-2.5 text-[#292824] focus:outline-none focus:border-[#292824]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#292824] mb-2 font-medium">
                    Estimated Guests
                  </label>
                  <select
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                    className="w-full text-xs bg-[#FAF8F3] border border-[#8B8278]/30 px-3.5 py-2.5 text-[#292824] focus:outline-none focus:border-[#292824]"
                  >
                    <option value="1-50">Under 50 guests</option>
                    <option value="50-100">50 – 100 guests</option>
                    <option value="100-200">100 – 200 guests</option>
                    <option value="200-350">200 – 350 guests</option>
                    <option value="350+">350+ guests</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Design Style & Features */}
            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold text-[#292824] pb-2 border-b border-[#8B8278]/20 mb-6">
                3. Design Preferences & Desired Features
              </h3>

              <div className="space-y-4">
                <label className="block text-xs uppercase tracking-wider text-[#292824] font-medium">
                  Select Features You Envision:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {featureOptions.map((feat) => {
                    const checked = formData.desiredFeatures.includes(feat);
                    return (
                      <label
                        key={feat}
                        onClick={() => handleFeatureToggle(feat)}
                        className={`flex items-center gap-3 p-3 border text-xs cursor-pointer select-none transition-colors ${checked
                            ? "bg-[#FAF8F3] border-[#292824] text-[#292824]"
                            : "border-[#8B8278]/25 text-[#8B8278] hover:border-[#8B8278]/50"
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => { }}
                          className="rounded-none text-[#292824] focus:ring-0"
                        />
                        <span>{feat}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="pt-4">
                  <label className="block text-xs uppercase tracking-wider text-[#292824] mb-2 font-medium">
                    Additional Notes, Color Themes, or Special Requests
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your venue, mood board, entourage colors, or any specific ideas you have in mind..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full text-xs bg-[#FAF8F3] border border-[#8B8278]/30 px-3.5 py-2.5 text-[#292824] focus:outline-none focus:border-[#292824]"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Privacy & Submission */}
            <div className="pt-4 border-t border-[#8B8278]/20 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreedToPrivacy}
                  onChange={(e) => setFormData({ ...formData, agreedToPrivacy: e.target.checked })}
                  className="mt-1"
                />
                <span className="text-xs text-[#8B8278] leading-relaxed">
                  I agree that MERCI may use my contact and event details solely to prepare a quotation and discuss my celebration invitation. My information will not be sold or shared with third parties.
                </span>
              </label>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-4 bg-[#292824] text-[#FAF8F3] text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === "submitting" ? (
                  <span>Sending Inquiry...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Concierge Inquiry
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>

      <StorefrontFooter />
    </div>
  );
}
