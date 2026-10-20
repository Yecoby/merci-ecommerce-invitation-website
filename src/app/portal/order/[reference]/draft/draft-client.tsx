"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MerciLogo } from "@/components/ui/merci-logo";
import {
  ArrowLeft,
  Smartphone,
  Monitor,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Send,
  Loader2,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

interface Props {
  reference: string;
  orderStatus: string;
  revisionCount: number;
  revisionLimit: number;
  revisions: any[];
  invitation: any;
}

export default function DraftReviewClient({
  reference,
  orderStatus,
  revisionCount,
  revisionLimit,
  revisions,
  invitation,
}: Props) {
  const router = useRouter();
  const [deviceView, setDeviceView] = useState<"mobile" | "desktop">("mobile");
  const [revisionText, setRevisionText] = useState("");
  const [submittingRev, setSubmittingRev] = useState(false);
  const [approving, setApproving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const remainingRevisions = Math.max(0, revisionLimit - revisionCount);
  const previewSlug = invitation?.publicSlug || "demo-serenade-wedding";

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this draft for final publication?")) return;

    setApproving(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/portal/orders/${reference}/approve`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Approval failed.");

      setFeedback({ type: "success", msg: data.message });
      setTimeout(() => router.refresh(), 1500);
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message || "Failed to approve draft." });
    } finally {
      setApproving(false);
    }
  };

  const handleRequestRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionText.trim()) return;

    setSubmittingRev(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/portal/orders/${reference}/revisions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: revisionText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit revision.");

      setFeedback({ type: "success", msg: data.message });
      setRevisionText("");
      setTimeout(() => router.refresh(), 1500);
    } catch (err: any) {
      setFeedback({ type: "error", msg: err.message || "Failed to request revision." });
    } finally {
      setSubmittingRev(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#8B8278]/20">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/portal/order/${reference}`}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#8B8278] hover:text-[#292824] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Portal
            </Link>
            <span className="text-[#8B8278]/40">|</span>
            <span className="text-xs uppercase font-medium text-[#292824] hidden sm:inline font-mono">
              Draft Review · {reference}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#FAF8F3] border border-[#8B8278]/20 p-1">
            <button
              onClick={() => setDeviceView("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                deviceView === "mobile"
                  ? "bg-[#292824] text-white font-medium"
                  : "text-[#8B8278] hover:text-[#292824]"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile View
            </button>
            <button
              onClick={() => setDeviceView("desktop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                deviceView === "desktop"
                  ? "bg-[#292824] text-white font-medium"
                  : "text-[#8B8278] hover:text-[#292824]"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> Desktop View
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Invitation Frame */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 text-xs text-[#8B8278]">
            <span className="uppercase tracking-wider font-medium">Interactive Live Draft Sandbox</span>
            <a
              href={`/i/${previewSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#292824] underline hover:text-[#8B8278]"
            >
              <span>Open in new tab</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Device Frame */}
          <div
            className={`transition-all duration-300 bg-white border border-[#8B8278]/30 shadow-md overflow-hidden ${
              deviceView === "mobile"
                ? "w-full max-w-[400px] h-[780px] rounded-[36px] p-2 ring-8 ring-[#292824]/10"
                : "w-full h-[780px] rounded-lg p-1 ring-1 ring-[#8B8278]/30"
            }`}
          >
            <iframe
              src={`/i/${previewSlug}`}
              title="Invitation Draft Preview"
              className="w-full h-full rounded-[24px] border-none bg-white"
            />
          </div>
        </div>

        {/* Right Column: Approval & Revision Control Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Status Alert */}
          {feedback && (
            <div
              className={`p-4 text-xs ${
                feedback.type === "success"
                  ? "bg-[#AAB5A0]/20 text-[#2C3527] border border-[#AAB5A0]/50"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {feedback.msg}
            </div>
          )}

          {/* Approval Card */}
          <div className="bg-white border border-[#8B8278]/25 p-6 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#8B8278] font-semibold">
              Step 1: Inspect & Sign Off
            </span>
            <h2 className="text-xl font-serif text-[#292824] mt-1 mb-2">Ready to Publish?</h2>
            <p className="text-xs text-[#8B8278] leading-relaxed mb-6 font-light">
              If the layout, typography, date, venue coordinates, and wording meet your vision, approve the draft to initiate final live publication.
            </p>

            <button
              onClick={handleApprove}
              disabled={approving || orderStatus === "APPROVED" || orderStatus === "PUBLISHED"}
              className="w-full py-3 bg-[#292824] hover:bg-[#3D3B35] text-white text-xs uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {approving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Recording Approval...
                </>
              ) : orderStatus === "APPROVED" || orderStatus === "PUBLISHED" ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#AAB5A0]" /> Draft Already Approved
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Approve Draft for Live Launch
                </>
              )}
            </button>
          </div>

          {/* Revision Request Card */}
          <div className="bg-white border border-[#8B8278]/25 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest text-[#8B8278] font-semibold">
                Step 2: Request Atelier Edits
              </span>
              <span className="text-xs font-medium text-[#292824]">
                {remainingRevisions} of {revisionLimit} remaining
              </span>
            </div>
            <h2 className="text-xl font-serif text-[#292824] mb-2">Request Revisions</h2>
            <p className="text-xs text-[#8B8278] leading-relaxed mb-4 font-light">
              Explain changes you'd like made to colors, text, itinerary timing, or entourage formatting. Our atelier team will adjust and notify you.
            </p>

            <form onSubmit={handleRequestRevision} className="space-y-4">
              <textarea
                rows={4}
                required
                value={revisionText}
                onChange={(e) => setRevisionText(e.target.value)}
                placeholder="e.g. Please update ceremony time to 4:00 PM and change the accent font color on the RSVP button to warm taupe..."
                disabled={submittingRev || remainingRevisions <= 0}
                className="w-full px-4 py-2.5 bg-[#FAF8F3] border border-[#8B8278]/30 text-sm text-[#292824] focus:outline-none focus:border-[#292824] disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={submittingRev || remainingRevisions <= 0 || !revisionText.trim()}
                className="w-full py-2.5 border border-[#292824] text-[#292824] hover:bg-[#292824] hover:text-white text-xs uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
              >
                {submittingRev ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting Request...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Submit Revision Request
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Revision History */}
          {revisions && revisions.length > 0 && (
            <div className="bg-white border border-[#8B8278]/25 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#292824] border-b border-[#8B8278]/15 pb-2">
                Revision History
              </h3>
              <div className="space-y-3">
                {revisions.map((rev: any, idx: number) => (
                  <div key={rev.id || idx} className="text-xs space-y-1 p-3 bg-[#FAF8F3] border border-[#8B8278]/20">
                    <div className="flex items-center justify-between font-semibold text-[#292824]">
                      <span>Round #{revisions.length - idx}</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-white border border-[#8B8278]/20">
                        {rev.status}
                      </span>
                    </div>
                    <p className="text-[#8B8278]">{rev.description}</p>
                    {rev.adminNotes && (
                      <p className="text-[11px] text-[#2C3527] bg-[#AAB5A0]/15 p-2 mt-1">
                        <strong>Studio Note:</strong> {rev.adminNotes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[#8B8278]/15 bg-white/50 text-center text-xs text-[#8B8278]">
        © {new Date().getFullYear()} MERCI Digital Invitations · Dedicated Client Suite
      </footer>
    </div>
  );
}
