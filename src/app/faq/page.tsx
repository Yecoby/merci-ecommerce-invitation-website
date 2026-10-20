"use client";

import React, { useState } from "react";
import { StorefrontNavbar, StorefrontFooter } from "@/components/layout/storefront-layout";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: "general" | "customization" | "rsvp" | "hosting";
}

const FAQS: FAQItem[] = [
  {
    category: "general",
    question: "What is a MERCI digital invitation website?",
    answer: "A MERCI digital invitation is a private, custom-designed single-page website created specifically for your wedding, debut, baptism, or celebration. Instead of a flat picture or PDF, guests receive an interactive, mobile-optimized experience featuring your event story, countdown, schedule, location directions, attire guide, and direct RSVP confirmation.",
  },
  {
    category: "general",
    question: "How do I share the invitation with my guests?",
    answer: "Once published, your invitation has a unique, elegant link (e.g., merci.ph/i/mateo-sofia). You can easily copy and paste this link into Messenger, Viber, WhatsApp, SMS, or include a QR code on your save-the-date stationery.",
  },
  {
    category: "customization",
    question: "What is the difference between Self-Service and Custom Concierge?",
    answer: "With Self-Service Templates, you choose a pre-designed layout, fill in your own celebration details using our intuitive builder, preview live, and publish directly. With our Custom Concierge Service, our design studio works with you personally to tailor colors, integrate your custom monogram or illustrations, format multi-part schedules, and provide revision rounds before publishing.",
  },
  {
    category: "customization",
    question: "Can I adjust colors and fonts to match our entourage palette?",
    answer: "Yes! Each template includes curated colorways and typography pairings designed by our art director. For custom orders, we can match your exact wedding motif hex codes or entourage swatches.",
  },
  {
    category: "rsvp",
    question: "How does the guest RSVP system work?",
    answer: "Guests can confirm their attendance with a single tap, specify how many guests are attending within your host-configured limits, note any dietary restrictions (allergies, vegan, halal), and leave a warm congratulatory message. As the host, you can view confirmed attendees in real time and export the guest list to a spreadsheet anytime.",
  },
  {
    category: "rsvp",
    question: "Can I set an RSVP deadline or limit plus-ones?",
    answer: "Yes. You have full control over the RSVP deadline date. Once the deadline passes, new submissions are automatically closed. You can also enforce maximum attendee counts per submission to maintain accurate catering headcounts.",
  },
  {
    category: "hosting",
    question: "How long does my digital invitation remain active online?",
    answer: "Standard self-service templates include 12 months of active hosting from publication. Custom concierge packages include 18 to 24 months, allowing ample time after the celebration to share post-event photos and thank-you notes. We communicate any renewal or archival policies transparently in advance.",
  },
  {
    category: "hosting",
    question: "Can I edit event details after the invitation has been published?",
    answer: "Yes! If ceremony timings change, parking guidance is updated, or weather adjustments are needed, you can update your invitation information instantly through your MERCI account dashboard without changing the published URL.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <StorefrontNavbar />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8B8278]">Questions & Clarity</span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#292824] mt-2 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-[#8B8278] font-light leading-relaxed">
            Everything you need to know about creating, customizing, and sharing your MERCI digital invitation.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-[#8B8278]/20 transition-all duration-200 overflow-hidden"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-serif text-lg text-[#292824] font-light">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#8B8278] shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#292824]" : ""
                      }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-[#8B8278] font-light leading-relaxed border-t border-[#8B8278]/10">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-16 p-8 bg-[#F2EDE4]/60 border border-[#8B8278]/25 text-center">
          <HelpCircle className="w-8 h-8 text-[#8B8278] mx-auto mb-3" />
          <h3 className="font-serif text-xl text-[#292824] mb-2">Have a question not answered here?</h3>
          <p className="text-xs text-[#8B8278] mb-6 font-light">
            Our team is always delighted to assist you with special requests, custom inquiries, or technical guidance.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-2.5 bg-[#292824] text-[#FAF8F3] text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35] transition-colors"
          >
            Get In Touch
          </a>
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}
