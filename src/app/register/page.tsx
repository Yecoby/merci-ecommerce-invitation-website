"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MerciLogo } from "@/components/ui/merci-logo";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

interface FieldErrors {
  name?: string[];
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.fields) {
          setFieldErrors(data.fields as FieldErrors);
        } else {
          setError(data.error ?? "Registration failed. Please try again.");
        }
        return;
      }

      // Success — show confirmation, then redirect to login after a moment.
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <CheckCircle2 className="w-12 h-12 text-[#AAB5A0] mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-[#292824] mb-2">
            Account Created
          </h2>
          <p className="text-sm text-[#8B8278] font-light">
            You can now sign in to your MERCI account. Redirecting you to the
            sign-in page…
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

        {/* Card */}
        <div className="bg-white border border-[#8B8278]/20 p-8 sm:p-10">
          <h1 className="text-2xl font-serif text-[#292824] mb-1">
            Create your account
          </h1>
          <p className="text-sm text-[#8B8278] mb-8 font-light">
            Join MERCI and start creating beautiful invitation websites.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs uppercase tracking-widest text-[#292824] mb-1.5"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-[#8B8278]/30 bg-[#FAF8F3] px-4 py-2.5 text-sm text-[#292824] placeholder:text-[#8B8278]/60 focus:outline-none focus:border-[#292824] transition-colors"
                placeholder="Maria Santos"
                maxLength={80}
                disabled={isLoading}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
              />
              {fieldErrors.name && (
                <p id="name-error" className="mt-1 text-xs text-red-600">
                  {fieldErrors.name[0]}
                </p>
              )}
            </div>

            {/* Email */}
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
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
              />
              {fieldErrors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-600">
                  {fieldErrors.email[0]}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs uppercase tracking-widest text-[#292824] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#8B8278]/30 bg-[#FAF8F3] px-4 py-2.5 pr-10 text-sm text-[#292824] placeholder:text-[#8B8278]/60 focus:outline-none focus:border-[#292824] transition-colors"
                  placeholder="Min. 8 characters"
                  maxLength={128}
                  disabled={isLoading}
                  aria-describedby={
                    fieldErrors.password ? "password-error" : "password-hint"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8278] hover:text-[#292824] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {fieldErrors.password ? (
                <p id="password-error" className="mt-1 text-xs text-red-600">
                  {fieldErrors.password[0]}
                </p>
              ) : (
                <p id="password-hint" className="mt-1 text-xs text-[#8B8278]">
                  Must include uppercase, lowercase, and a number.
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs uppercase tracking-widest text-[#292824] mb-1.5"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-[#8B8278]/30 bg-[#FAF8F3] px-4 py-2.5 text-sm text-[#292824] placeholder:text-[#8B8278]/60 focus:outline-none focus:border-[#292824] transition-colors"
                placeholder="Re-enter your password"
                maxLength={128}
                disabled={isLoading}
                aria-describedby={
                  fieldErrors.confirmPassword ? "confirm-error" : undefined
                }
              />
              {fieldErrors.confirmPassword && (
                <p id="confirm-error" className="mt-1 text-xs text-red-600">
                  {fieldErrors.confirmPassword[0]}
                </p>
              )}
            </div>

            {/* Global error */}
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
                  Creating Account…
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#8B8278]">
            Already have an account?{" "}
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

