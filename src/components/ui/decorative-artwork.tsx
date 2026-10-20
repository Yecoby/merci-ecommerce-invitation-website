import React from "react";

export function BotanicalFloralAccent({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      className={`text-[#8B8278]/60 ${className}`}
      aria-hidden="true"
    >
      <path d="M10 20 Q 50 15, 80 20 Q 110 25, 150 20" strokeDasharray="1 3" />
      <circle cx="80" cy="20" r="3" fill="currentColor" />
      <path d="M72 16 C76 12, 84 12, 88 16" />
      <path d="M72 24 C76 28, 84 28, 88 24" />
      <path d="M60 18 Q 66 12, 70 18 Q 66 22, 60 18 Z" fill="currentColor" opacity="0.3" />
      <path d="M100 18 Q 94 12, 90 18 Q 94 22, 100 18 Z" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export function CelestialConstellationAccent({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={`text-[#C5A880]/70 ${className}`}
      aria-hidden="true"
    >
      <polygon points="50,15 54,38 77,42 54,46 50,69 46,46 23,42 46,38" fill="currentColor" opacity="0.4" />
      <circle cx="80" cy="25" r="1.5" fill="currentColor" />
      <circle cx="20" cy="75" r="1.5" fill="currentColor" />
      <circle cx="75" cy="70" r="2" fill="currentColor" />
      <circle cx="25" cy="30" r="1" fill="currentColor" />
      <line x1="50" y1="15" x2="80" y2="25" strokeDasharray="2 3" opacity="0.5" />
      <line x1="46" y1="46" x2="20" y2="75" strokeDasharray="2 3" opacity="0.5" />
    </svg>
  );
}

export function ModernArchFrame({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={`relative rounded-t-[100px] border border-[#8B8278]/20 bg-[#FAF8F3] overflow-hidden p-6 ${className}`}>
      {children}
    </div>
  );
}
