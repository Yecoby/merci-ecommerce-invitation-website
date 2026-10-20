"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MerciLogo } from "@/components/ui/merci-logo";
import { KeyRound, Mail, ArrowRight, ShieldCheck, HelpCircle, Loader2, Lock } from "lucide-react";

export default function ClientPortalLoginPage() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recovery modal state
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/portal/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode, email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to access portal. Please check your credentials.");
      }

      router.push(data.redirectUrl || `/portal/order/${data.orderReference}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid order code or email.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryLoading(true);
    setRecoverySuccess(null);

    try {
      const res = await fetch("/api/portal/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveryEmail }),
      });
      const data = await res.json();
      setRecoverySuccess(data.message || "Instructions sent if order exists.");
    } catch {
      setRecoverySuccess("If an active order exists for this email, details have been sent.");
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-[#8B8278]/20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/">
            <MerciLogo size="md" withTagline={false} />
          </Link>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#8B8278] hidden sm:inline">Have an account password?</span>
            <Link
              href="/login"
              className="text-[#292824] underline hover:text-[#8B8278] font-medium transition-colors"
            >
              Customer Sign In →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Portal Entry */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white border border-[#8B8278]/25 p-8 sm:p-10 shadow-sm relative">
            <div className="text-center mb-8">
              <span className="text-[10px] uppercase tracking-widest text-[#8B8278] font-semibold bg-[#FAF8F3] px-3 py-1 border border-[#8B8278]/20 inline-block mb-3">
                Secure Customer Suite
              </span>
              <h1 className="text-3xl font-serif text-[#292824]">MERCI Client Portal</h1>
              <p className="text-xs text-[#8B8278] mt-2 font-light leading-relaxed">
                Enter your unique order access code and associated email to manage your event briefing, review design drafts, and track your invitation.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs leading-relaxed rounded-none">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="accessCode"
                  className="block text-xs uppercase tracking-widest text-[#292824] mb-1.5 font-medium"
                >
                  Order Access Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B8278]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    id="accessCode"
                    type="text"
                    required
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="e.g. MRC-8F2K or MRC-AB12"
                    className="w-full pl-9 pr-4 py-2.5 text-sm font-mono uppercase bg-[#FAF8F3] border border-[#8B8278]/30 focus:border-[#292824] focus:outline-none transition-colors placeholder:text-[#8B8278]/50 text-[#292824]"
                    maxLength={30}
                    disabled={loading}
                  />
                </div>
                <p className="text-[11px] text-[#8B8278] mt-1">
                  Provided in your MERCI atelier confirmation or invoice email.
                </p>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs uppercase tracking-widest text-[#292824] mb-1.5 font-medium"
                >
                  Order Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B8278]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#FAF8F3] border border-[#8B8278]/30 focus:border-[#292824] focus:outline-none transition-colors placeholder:text-[#8B8278]/50 text-[#292824]"
                    maxLength={254}
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#292824] hover:bg-[#3D3B35] text-white text-xs uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying Credentials...
                  </>
                ) : (
                  <>
                    Access My Order Portal <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#8B8278]/15 text-center flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setShowRecovery(true)}
                className="text-xs text-[#8B8278] hover:text-[#292824] underline transition-colors cursor-pointer"
              >
                Lost your access code or order reference?
              </button>
            </div>
          </div>

          {/* Privacy & Security Note */}
          <div className="mt-6 text-center text-xs text-[#8B8278] flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#AAB5A0]" />
            <span>Encrypted 256-bit isolated session · Rate-limited access</span>
          </div>
        </div>
      </main>

      {/* Recovery Modal */}
      {showRecovery && (
        <div className="fixed inset-0 z-50 bg-[#292824]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#8B8278]/30 p-6 sm:p-8 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-serif text-[#292824] mb-2">Order Access Recovery</h3>
            <p className="text-xs text-[#8B8278] leading-relaxed mb-4">
              Enter the email address used during order placement. If an order matches, we will dispatch your order reference and recovery guidance.
            </p>

            {recoverySuccess ? (
              <div className="p-4 bg-[#AAB5A0]/20 text-[#2C3527] text-xs leading-relaxed mb-4">
                {recoverySuccess}
              </div>
            ) : (
              <form onSubmit={handleRecoverySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#292824] mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 text-sm bg-[#FAF8F3] border border-[#8B8278]/30 focus:border-[#292824] focus:outline-none"
                    disabled={recoveryLoading}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRecovery(false)}
                    className="px-4 py-2 border border-[#8B8278]/30 text-xs text-[#8B8278] hover:text-[#292824]"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={recoveryLoading}
                    className="px-4 py-2 bg-[#292824] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35] disabled:opacity-50"
                  >
                    {recoveryLoading ? "Sending..." : "Send Recovery"}
                  </button>
                </div>
              </form>
            )}

            {recoverySuccess && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowRecovery(false)}
                  className="px-4 py-2 bg-[#292824] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35]"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 border-t border-[#8B8278]/15 text-center text-xs text-[#8B8278]">
        © {new Date().getFullYear()} MERCI Digital Invitations · Dedicated Client Suite
      </footer>
    </div>
  );
}
