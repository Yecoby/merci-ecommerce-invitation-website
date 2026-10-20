"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MerciLogo } from "@/components/ui/merci-logo";
import { CheckCircle2, AlertCircle, Loader2, Lock, Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token || !email) {
    return (
      <div className="bg-white border border-[#8B8278]/25 p-8 sm:p-10 text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
        <h2 className="text-xl font-serif text-[#292824]">Invalid Reset Link</h2>
        <p className="text-xs text-[#8B8278] leading-relaxed">
          The password reset link is invalid or incomplete. Please request a new link from the forgot password page.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block mt-2 px-6 py-2.5 bg-[#292824] text-white text-xs uppercase tracking-widest font-medium"
        >
          Request New Link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white border border-[#8B8278]/25 p-8 sm:p-10 text-center space-y-4">
        <CheckCircle2 className="w-10 h-10 text-[#2C3527] mx-auto" />
        <h2 className="text-2xl font-serif text-[#292824]">Password Reset Complete</h2>
        <p className="text-xs text-[#8B8278] leading-relaxed">
          Your account password has been updated. You can now log in using your new credentials.
        </p>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-[#292824] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35]"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#8B8278]/25 p-8 sm:p-10 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-serif text-[#292824]">Choose New Password</h1>
        <p className="text-xs text-[#8B8278] mt-1">For account {email}</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-[#292824] uppercase tracking-wider text-[10px] mb-1">
            New Password (Min. 8 characters)
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-[#8B8278]/30 focus:outline-none focus:border-[#292824] pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8278]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[#292824] uppercase tracking-wider text-[10px] mb-1">
            Confirm New Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-[#8B8278]/30 focus:outline-none focus:border-[#292824]"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#292824] text-white uppercase tracking-widest text-xs font-medium hover:bg-[#3D3B35] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {loading ? "Updating Password..." : "Set New Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/">
            <MerciLogo size="md" withTagline={false} />
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="bg-white border border-[#8B8278]/25 p-8 text-center text-xs text-[#8B8278]">
              Loading reset form...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
