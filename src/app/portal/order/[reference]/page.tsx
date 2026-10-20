import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAuthorizedPortalOrder } from "@/lib/auth/portal-guard";
import { MerciLogo } from "@/components/ui/merci-logo";
import {
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  Eye,
  MessageSquare,
  Users,
  Grid,
  Calendar,
  AlertCircle,
  ArrowRight,
  LogOut,
  ShieldCheck,
  Download,
  ExternalLink,
} from "lucide-react";

interface Props {
  params: Promise<{ reference: string }>;
}

export const metadata = {
  title: "Client Portal — MERCI Digital Invitations",
};

export default async function OrderPortalPage({ params }: Props) {
  const { reference } = await params;
  const authCtx = await getAuthorizedPortalOrder(reference);

  if (!authCtx) {
    redirect(`/portal?redirect=/portal/order/${reference}`);
  }

  const { order, isPasswordAccount, userEmail, isAdmin } = authCtx;

  // Derive status steps & progress
  const hasBriefing = order.briefingStatus === "SUBMITTED";
  const hasDraft = order.status === "PREVIEW_READY" || order.status === "APPROVED" || order.status === "PUBLISHED";
  const isApproved = order.status === "APPROVED" || order.status === "PUBLISHED";
  const isPublished = order.status === "PUBLISHED";

  const steps = [
    {
      title: "1. Order Confirmed",
      desc: `Package: ${order.packageSlug.replace("-", " ").toUpperCase()}`,
      completed: true,
      current: false,
    },
    {
      title: "2. Event Briefing",
      desc: hasBriefing ? "Submitted to Atelier" : "Awaiting Host Details",
      completed: hasBriefing,
      current: !hasBriefing,
      actionUrl: `/portal/order/${order.reference}/briefing`,
      actionText: hasBriefing ? "Edit / Review Briefing" : "Complete Briefing Now →",
    },
    {
      title: "3. Design & Draft",
      desc: hasDraft ? "Private Draft Available" : "Atelier In Production",
      completed: hasDraft,
      current: hasBriefing && !hasDraft,
      actionUrl: order.invitation ? `/portal/order/${order.reference}/draft` : undefined,
      actionText: order.invitation ? "Open Private Draft Preview →" : undefined,
    },
    {
      title: "4. Review & Approval",
      desc: isApproved ? "Draft Approved" : `${order.revisionLimit - order.revisionCount} revisions left`,
      completed: isApproved,
      current: hasDraft && !isApproved,
    },
    {
      title: "5. Published Live",
      desc: isPublished ? "Ready to Share" : "Awaiting Final Launch",
      completed: isPublished,
      current: isApproved && !isPublished,
      actionUrl: isPublished && order.invitation ? `/i/${order.invitation.publicSlug}` : undefined,
      actionText: isPublished ? "View Public Live Website →" : undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col justify-between">
      {/* Portal Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#8B8278]/20">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <MerciLogo size="md" withTagline={false} />
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-wider bg-[#292824] text-white">
              {order.reference}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#8B8278] hidden md:inline">
              Authenticated as <strong className="text-[#292824]">{userEmail}</strong>
            </span>
            <form action="/api/portal/logout" method="POST">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#8B8278]/30 hover:border-[#292824] text-[#292824] transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Exit Portal
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-6xl mx-auto px-4 py-10 w-full space-y-10 flex-1">
        {/* Banner */}
        <div className="bg-white border border-[#8B8278]/25 p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-widest text-[#8B8278] font-semibold">
                MERCI Atelier Concierge
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-[#AAB5A0]/20 text-[#2C3527]">
                Status: {order.status}
              </span>
            </div>
            <h1 className="text-3xl font-serif text-[#292824]">
              {order.invitation?.title || `Order ${order.reference}`}
            </h1>
            <p className="text-xs text-[#8B8278] mt-1.5 font-light leading-relaxed max-w-xl">
              Welcome to your dedicated digital celebration hub. Track your invitation drafting progress, submit customized event wording, and review designer revisions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href={`/portal/order/${order.reference}/briefing`}
              className="px-5 py-2.5 bg-[#292824] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35] transition-colors text-center"
            >
              {hasBriefing ? "Review Briefing" : "Start Event Briefing"}
            </Link>
            {order.invitation && (
              <Link
                href={`/portal/order/${order.reference}/draft`}
                className="px-5 py-2.5 border border-[#292824] text-[#292824] text-xs uppercase tracking-widest font-medium hover:bg-[#292824]/5 transition-colors text-center"
              >
                Draft Preview
              </Link>
            )}
          </div>
        </div>

        {/* Workflow Progress Tracker */}
        <div className="bg-white border border-[#8B8278]/25 p-8 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292824] mb-6">
            Production & Delivery Roadmap
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((st, idx) => (
              <div
                key={idx}
                className={`p-4 border transition-colors ${
                  st.completed
                    ? "border-[#AAB5A0] bg-[#FAF8F3]/60"
                    : st.current
                    ? "border-[#292824] bg-white shadow-sm ring-1 ring-[#292824]/10"
                    : "border-[#8B8278]/20 bg-[#FAF8F3]/30 opacity-70"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#292824]">{st.title}</span>
                  {st.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#AAB5A0]" />
                  ) : (
                    <Clock className="w-4 h-4 text-[#8B8278]" />
                  )}
                </div>
                <p className="text-[11px] text-[#8B8278]">{st.desc}</p>
                {st.actionUrl && (
                  <Link
                    href={st.actionUrl}
                    className="inline-block mt-3 text-[11px] font-semibold text-[#292824] underline hover:text-[#8B8278]"
                  >
                    {st.actionText}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Hub & Quick Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Panel 1: Briefing & Design */}
          <div className="bg-white border border-[#8B8278]/25 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-[#8B8278]" />
                <h3 className="text-base font-serif text-[#292824]">Event Briefing</h3>
              </div>
              <p className="text-xs text-[#8B8278] leading-relaxed mb-4">
                {hasBriefing
                  ? "Your event details, timeline, dress code, and venue links have been recorded."
                  : "Please supply your event dates, venue coordinates, entourage, and wording preferences."}
              </p>
            </div>
            <Link
              href={`/portal/order/${order.reference}/briefing`}
              className="inline-flex items-center justify-between px-4 py-2 border border-[#8B8278]/30 hover:border-[#292824] text-xs uppercase tracking-wider text-[#292824] transition-colors"
            >
              <span>{hasBriefing ? "Edit Briefing" : "Fill Out Briefing"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Panel 2: Draft Review & Revisions */}
          <div className="bg-white border border-[#8B8278]/25 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-5 h-5 text-[#8B8278]" />
                <h3 className="text-base font-serif text-[#292824]">Draft Review & Approval</h3>
              </div>
              <p className="text-xs text-[#8B8278] leading-relaxed mb-4">
                Inspect your custom layout on mobile and desktop. Approve the design to publish or submit specific revision requests.
              </p>
              <div className="text-[11px] text-[#8B8278] mb-4">
                Revisions used: <strong>{order.revisionCount}</strong> of <strong>{order.revisionLimit}</strong>
              </div>
            </div>
            <Link
              href={`/portal/order/${order.reference}/draft`}
              className="inline-flex items-center justify-between px-4 py-2 bg-[#292824] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#3D3B35] transition-colors"
            >
              <span>Review Draft & Revisions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Panel 3: RSVP & Seating Plan */}
          <div className="bg-white border border-[#8B8278]/25 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-[#8B8278]" />
                <h3 className="text-base font-serif text-[#292824]">RSVP & Guest Management</h3>
              </div>
              <p className="text-xs text-[#8B8278] leading-relaxed mb-4">
                {order.invitation?._count?.rsvps || 0} guest responses recorded so far. Manage plus-ones, meal options, and arrange table seating.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href={`/portal/order/${order.reference}/guests`}
                className="inline-flex items-center justify-between px-4 py-2 border border-[#8B8278]/30 hover:border-[#292824] text-xs uppercase tracking-wider text-[#292824] transition-colors"
              >
                <span>View Guest List</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={`/portal/order/${order.reference}/seating`}
                className="inline-flex items-center justify-between px-4 py-2 border border-[#8B8278]/30 hover:border-[#292824] text-xs uppercase tracking-wider text-[#292824] transition-colors"
              >
                <span>Interactive Seating Plan</span>
                <Grid className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Studio Support Contact */}
        <div className="p-6 bg-white border border-[#8B8278]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#8B8278]">
          <div>
            <strong className="text-[#292824] font-medium block mb-0.5">Need concierge guidance?</strong>
            <span>Direct studio support: hello@merci-invitations.ph · Monday to Saturday, 9:00 AM – 6:00 PM PHT</span>
          </div>
          <Link
            href="/contact"
            className="px-4 py-2 border border-[#8B8278]/30 text-[#292824] hover:bg-[#FAF8F3] transition-colors uppercase tracking-widest text-[11px] self-start sm:self-auto"
          >
            Contact Atelier Concierge
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[#8B8278]/15 bg-white/50 text-center text-xs text-[#8B8278]">
        © {new Date().getFullYear()} MERCI Digital Invitations · Dedicated Client Suite
      </footer>
    </div>
  );
}
