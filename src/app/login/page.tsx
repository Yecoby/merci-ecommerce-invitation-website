"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { MerciLogo } from "@/components/ui/merci-logo";
import { Eye, EyeOff, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("callbackUrl") || searchParams.get("redirect") || "/account";
  // Protect against open redirect attacks: ensure it is a safe relative path
  const targetUrl =
    rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") && !rawRedirect.includes("\\")
      ? rawRedirect
      : "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        // Do not reveal whether the email or password was wrong.
        setError("The email or password you entered is incorrect.");
      } else {
        router.push(targetUrl);
        router.refresh();
      }
    } catch {
      setError("The email or password you entered is incorrect.");
    } finally {
      setIsLoading(false);
    }
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
            Welcome back
          </h1>
          <p className="text-sm text-[#8B8278] mb-8 font-light">
            Sign in to your MERCI account.
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs uppercase tracking-widest text-[#292824]"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#8B8278] hover:text-[#292824] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#8B8278]/30 bg-[#FAF8F3] px-4 py-2.5 pr-10 text-sm text-[#292824] placeholder:text-[#8B8278]/60 focus:outline-none focus:border-[#292824] transition-colors"
                  placeholder="••••••••"
                  maxLength={128}
                  disabled={isLoading}
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
            </div>

            {/* Error message */}
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
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#8B8278]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[#292824] font-medium hover:underline transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <p className="mt-6 text-center text-xs text-[#8B8278]">
          <Link href="/" className="hover:text-[#292824] transition-colors">
            ← Return to MERCI
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center text-xs uppercase tracking-widest text-[#8B8278]">
          Loading sign-in...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

