"use client";

import React, { useState } from "react";
import { StorefrontNavbar, StorefrontFooter } from "@/components/layout/storefront-layout";
import { Mail, Phone, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    botCheck: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.botCheck) {
      setStatus("success");
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to deliver contact message.");
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

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8B8278]">We'd Love To Hear From You</span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#292824] mt-2 mb-4">
            Connect With Our Concierge
          </h1>
          <p className="text-sm text-[#8B8278] font-light leading-relaxed">
            Have a question regarding custom designs, collaboration inquiries, or technical support? Send us a message and our team will respond promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Contact Details */}
          <div className="md:col-span-5 space-y-8">
            <div className="bg-white border border-[#8B8278]/20 p-8 space-y-6">
              <h3 className="font-serif text-xl text-[#292824]">Studio Concierge</h3>
              <p className="text-xs text-[#8B8278] leading-relaxed font-light">
                We are based in the Philippines and serve couples, celebrants, and event planners nationwide and overseas.
              </p>

              <div className="space-y-4 pt-4 border-t border-[#8B8278]/15 text-xs text-[#292824]">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#8B8278]" />
                  <span>hello@merci-invitations.ph</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#8B8278]" />
                  <span>+63 917 000 0000 (Viber / WhatsApp)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#8B8278]" />
                  <span>Monday – Saturday, 9:00 AM – 6:00 PM PHT</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#F2EDE4]/60 border border-[#8B8278]/25 text-xs text-[#8B8278] space-y-2">
              <span className="font-semibold text-[#292824] block uppercase tracking-wider text-[10px]">
                Custom Quote Requests
              </span>
              <p className="leading-relaxed">
                If you are looking for a bespoke quote for custom calligraphy, monograms, or personalized templates, our dedicated form is the fastest way to get an accurate proposal.
              </p>
              <a
                href="/custom-invitation"
                className="inline-block text-[#292824] font-medium underline underline-offset-2 pt-1"
              >
                Go to Custom Request Form →
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7 bg-white border border-[#8B8278]/20 p-8 sm:p-10 shadow-sm">
            {status === "success" ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#AAB5A0] mx-auto" />
                <h3 className="font-serif text-2xl text-[#292824]">Message Received</h3>
                <p className="text-xs text-[#8B8278] max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. We have received your note and will get back to you via email shortly.
                </p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setFormData({ name: "", email: "", subject: "", message: "", botCheck: "" });
                  }}
                  className="px-6 py-2.5 bg-[#292824] text-[#FAF8F3] text-xs uppercase tracking-widest font-medium"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    name="bot_field"
                    tabIndex={-1}
                    value={formData.botCheck}
                    onChange={(e) => setFormData({ ...formData, botCheck: e.target.value })}
                  />
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#292824] mb-2 font-medium">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs bg-[#FAF8F3] border border-[#8B8278]/30 px-3.5 py-2.5 text-[#292824] focus:outline-none focus:border-[#292824]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#292824] mb-2 font-medium">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Inquiry about template customization, etc."
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-xs bg-[#FAF8F3] border border-[#8B8278]/30 px-3.5 py-2.5 text-[#292824] focus:outline-none focus:border-[#292824]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#292824] mb-2 font-medium">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="How may our concierge assist your celebration?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full text-xs bg-[#FAF8F3] border border-[#8B8278]/30 px-3.5 py-2.5 text-[#292824] focus:outline-none focus:border-[#292824]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full py-3.5 bg-[#292824] text-[#FAF8F3] text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {status === "submitting" ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}
