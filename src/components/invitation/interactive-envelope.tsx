"use client";

import React, { useState } from "react";
import { Mail, Sparkles, Heart } from "lucide-react";

interface Props {
  hosts: string;
  occasionLabel: string;
  onOpen: () => void;
  accentColor?: string;
}

export function InteractiveEnvelopeModal({ hosts, occasionLabel, onOpen, accentColor }: Props) {
  const [opening, setOpening] = useState(false);

  const handleOpenClick = () => {
    setOpening(true);
    setTimeout(() => {
      onOpen();
    }, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1917]/85 backdrop-blur-md transition-opacity duration-500 ${
        opening ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative max-w-sm w-full bg-[#FAF8F3] text-[#292824] border border-[#8B8278]/30 shadow-2xl p-8 sm:p-10 text-center transform transition-all duration-500">
        <div className="w-12 h-12 mx-auto mb-4 border border-[#8B8278]/30 rounded-full flex items-center justify-center bg-white shadow-sm">
          <Mail className="w-5 h-5 text-[#8B8278]" />
        </div>

        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8B8278] block mb-2 font-medium">
          A Formal Invitation to You
        </span>

        <h2 className="font-serif text-2xl sm:text-3xl text-[#292824] leading-tight mb-2">
          {hosts}
        </h2>

        <p className="text-xs uppercase tracking-widest text-[#8B8278] mb-8 font-light">
          {occasionLabel}
        </p>

        {/* Wax seal styled button */}
        <button
          onClick={handleOpenClick}
          className="group relative inline-flex items-center gap-2 px-8 py-3 bg-[#292824] text-white text-xs uppercase tracking-[0.25em] font-medium shadow-md hover:bg-[#3D3B35] transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <span>Open Invitation</span>
          <Sparkles className="w-3.5 h-3.5 text-[#C5A880] group-hover:rotate-12 transition-transform" />
        </button>

        <p className="text-[10px] text-[#8B8278]/70 mt-6 tracking-wide">
          Click above to open the digital celebration suite
        </p>
      </div>
    </div>
  );
}
