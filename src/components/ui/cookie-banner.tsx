"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

export function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [acknowledged, setAcknowledged] = useState(true);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("merci_cookie_acknowledged");
    if (!stored) {
      setAcknowledged(false);
    }
  }, []);

  const handleAcknowledge = () => {
    localStorage.setItem("merci_cookie_acknowledged", "true");
    setAcknowledged(true);
  };

  if (!mounted || acknowledged) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Notice"
      className="fixed bottom-0 inset-x-0 z-50 p-4 bg-[#292824] text-[#FAF8F3] border-t border-[#8B8278]/40 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <Cookie className="w-5 h-5 text-[#C5A880] shrink-0" aria-hidden="true" />
          <p className="font-light leading-relaxed">
            MERCI utilizes essential cookies to secure your sign-in session and render your digital invitations. We do not use third-party advertising or cross-site tracking cookies. Review our{" "}
            <Link href="/legal/cookies" className="underline hover:text-[#C5A880]">
              Cookie Notice
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="underline hover:text-[#C5A880]">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <button
          onClick={handleAcknowledge}
          className="whitespace-nowrap px-5 py-2 bg-[#FAF8F3] text-[#292824] uppercase tracking-wider text-[11px] font-semibold hover:bg-[#F2EDE4] transition-colors shrink-0"
        >
          Got It
        </button>
      </div>
    </aside>
  );
}
