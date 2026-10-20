import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  withTagline?: boolean;
}

export function MerciLogo({ className = "", size = "md", withTagline = false }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl tracking-[0.25em]",
    md: "text-2xl tracking-[0.3em]",
    lg: "text-4xl tracking-[0.35em]",
  }[size];

  return (
    <Link href="/" className={`inline-flex flex-col items-center group ${className}`}>
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-[#8B8278] transition-transform group-hover:rotate-45 duration-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {/* Subtle floral/geometric quatrefoil mark */}
          <path d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z" />
        </svg>
        <span className={`font-serif font-light text-[#292824] ${sizeClasses}`}>
          MERCI
        </span>
      </div>
      {withTagline && (
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#8B8278] mt-0.5">
          Digital Invitations
        </span>
      )}
    </Link>
  );
}
