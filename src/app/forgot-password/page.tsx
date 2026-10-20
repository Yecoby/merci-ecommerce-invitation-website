"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MerciLogo } from "@/components/ui/merci-logo";
import { Loader2, CheckCircle2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // Always show success — don't reveal if the email is registered.
      if (res.ok || res.status === 200) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-10">
            <Link href="/">
              <MerciLogo size="lg" withTagline={false} />
            </Link>
          </div>
          <div className="bg-white border border-[#8B8278]/20 p-10">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Mail className="w-10 h-10 text-[#8B8278]" />
                <CheckCircle2 className="w-5 h-5 text-[#AAB5A0] absolute -bottom-1 -right-1" />
              </div>
            </div>
            <h2 className="text-xl font-serif text-[#292824] mb-3">
              Check your inbox
            </h2>
            <p className="text-sm text-[#8B8278] font-light leading-relaxed">
              If <strong className="text-[#292824]">{email}</strong> is
              registered with MERCI, we&apos;ve sent a password reset link.
              Please check your spam folder if you don&apos;t see it within a
              few minutes.
            </p>
            <p className="mt-4 text-xs text-[#8B8278]">
              <strong>Note:</strong> Email delivery is not yet configured for
              this environment. Contact{" "}
              <a
                href="mailto:hello@merci-invitations.ph"
                className="underline hover:text-[#292824]"
              >
                hello@merci-invitations.ph
              </a>{" "}
              for assistance.
            </p>
          </div>
          <p className="mt-6 text-xs text-[#8B8278]">
            <Link href="/login" className="hover:text-[#292824] transition-colors">
              ← Back to sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-10 text-center">
          <Link href="/">
            <MerciLogo size="lg" withTagline={false} />
          </Link>
        </div>

        <div className="bg-white border border-[#8B8278]/20 p-8 sm:p-10">
          <h1 className="text-2xl font-serif text-[#292824] mb-1">
            Reset your password
          </h1>
          <p className="text-sm text-[#8B8278] mb-8 font-light">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-widest text-[#292824] mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#8B8278]/30 bg-[#FAF8F3] px-4 py-2.5 text-sm text-[#292824] placeholder:text-[#8B8278]/60 focus:outline-none focus:border-[#292824] transition-colors"
                placeholder="your@email.com"
                maxLength={254}
                disabled={isLoading}
              />
            </div>

            {error && (
              <div
                role="alert"
                className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#292824] text-[#FAF8F3] text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Sending…
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#8B8278]">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="text-[#292824] font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[#8B8278]">
          <Link href="/" className="hover:text-[#292824] transition-colors">
            ← Return to MERCI
          </Link>
        </p>
      </div>
    </div>
  );
}

