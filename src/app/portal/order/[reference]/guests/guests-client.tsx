"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Utensils,
  Mail,
  Grid,
} from "lucide-react";

interface Props {
  reference: string;
  rsvps: any[];
  invitation: any;
}

export default function GuestListClient({ reference, rsvps, invitation }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ATTENDING" | "UNABLE_TO_ATTEND">("ALL");

  const filteredRsvps = useMemo(() => {
    return rsvps.filter((r) => {
      const matchesSearch =
        r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.email && r.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.dietaryNotes && r.dietaryNotes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.mealChoice && r.mealChoice.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === "ALL" || r.response === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rsvps, searchTerm, statusFilter]);

  const totalResponses = rsvps.length;
  const attendingList = rsvps.filter((r) => r.response === "ATTENDING");
  const totalHeadcount = attendingList.reduce((acc, curr) => acc + (curr.attendeeCount || 1), 0);
  const declinedCount = rsvps.filter((r) => r.response === "UNABLE_TO_ATTEND").length;

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col justify-between">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#8B8278]/20">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/portal/order/${reference}`}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#8B8278] hover:text-[#292824] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Portal
            </Link>
            <span className="text-[#8B8278]/40">|</span>
            <span className="text-xs uppercase font-medium text-[#292824] hidden sm:inline font-mono">
              Guest Manager · {reference}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/portal/order/${reference}/seating`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#8B8278]/30 hover:border-[#292824] text-xs uppercase tracking-wider text-[#292824] transition-colors"
            >
              <Grid className="w-3.5 h-3.5" /> Seating Plan
            </Link>
            <a
              href={`/api/portal/orders/${reference}/rsvps/export`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#292824] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35] transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </a>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-6xl mx-auto px-4 py-10 w-full space-y-8 flex-1">
        {/* Header Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#8B8278]/20 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#8B8278]">Host Concierge Hub</span>
            <h1 className="text-3xl font-serif text-[#292824] mt-1">Guest RSVP Directory</h1>
            <p className="text-xs text-[#8B8278] mt-1">
              Live guest attendance, dietary preferences, and verified headcount for {invitation?.title || "your celebration"}.
            </p>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-[#8B8278]/25 p-5 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#8B8278] block mb-1">
              Confirmed Headcount
            </span>
            <span className="font-serif text-3xl text-[#292824]">{totalHeadcount}</span>
            <span className="text-xs text-[#8B8278] block mt-1">Total attending guests</span>
          </div>

          <div className="bg-white border border-[#8B8278]/25 p-5 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#8B8278] block mb-1">
              Attending Parties
            </span>
            <span className="font-serif text-3xl text-[#2C3527]">{attendingList.length}</span>
            <span className="text-xs text-[#8B8278] block mt-1">Accepted invitations</span>
          </div>

          <div className="bg-white border border-[#8B8278]/25 p-5 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#8B8278] block mb-1">
              Declined Responses
            </span>
            <span className="font-serif text-3xl text-[#8B8278]">{declinedCount}</span>
            <span className="text-xs text-[#8B8278] block mt-1">Unable to attend</span>
          </div>

          <div className="bg-white border border-[#8B8278]/25 p-5 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#8B8278] block mb-1">
              Total Responses
            </span>
            <span className="font-serif text-3xl text-[#292824]">{totalResponses}</span>
            <span className="text-xs text-[#8B8278] block mt-1">RSVPs recorded</span>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#8B8278]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by guest name, email, dietary allergy, or meal..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#8B8278]/30 focus:border-[#292824] focus:outline-none text-[#292824]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-[#292824] text-white font-medium"
                  : "bg-white border border-[#8B8278]/30 text-[#8B8278] hover:text-[#292824]"
              }`}
            >
              All ({rsvps.length})
            </button>
            <button
              onClick={() => setStatusFilter("ATTENDING")}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                statusFilter === "ATTENDING"
                  ? "bg-[#292824] text-white font-medium"
                  : "bg-white border border-[#8B8278]/30 text-[#8B8278] hover:text-[#292824]"
              }`}
            >
              Attending ({attendingList.length})
            </button>
            <button
              onClick={() => setStatusFilter("UNABLE_TO_ATTEND")}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                statusFilter === "UNABLE_TO_ATTEND"
                  ? "bg-[#292824] text-white font-medium"
                  : "bg-white border border-[#8B8278]/30 text-[#8B8278] hover:text-[#292824]"
              }`}
            >
              Declined ({declinedCount})
            </button>
          </div>
        </div>

        {/* Table of Guests */}
        <div className="bg-white border border-[#8B8278]/25 shadow-sm overflow-x-auto">
          {filteredRsvps.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#8B8278]">
              No guest responses found matching your current filter.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] border-b border-[#8B8278]/20 uppercase tracking-widest text-[#8B8278] text-[10px]">
                <tr>
                  <th className="py-3 px-4">Guest Name</th>
                  <th className="py-3 px-4">Response</th>
                  <th className="py-3 px-4">Party Count</th>
                  <th className="py-3 px-4">Entrée & Dietary Notes</th>
                  <th className="py-3 px-4">Well Wishes</th>
                  <th className="py-3 px-4 text-right">Date Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8B8278]/15">
                {filteredRsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-[#FAF8F3]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#292824]">{rsvp.guestName}</div>
                      {rsvp.email && (
                        <div className="text-[11px] text-[#8B8278] flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {rsvp.email}
                        </div>
                      )}
                      {rsvp.attendeeNames && (
                        <div className="text-[10px] text-[#8B8278]/80 mt-1 italic">
                          Party: {rsvp.attendeeNames}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {rsvp.response === "ATTENDING" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#AAB5A0]/20 text-[#2C3527] font-semibold text-[10px] uppercase">
                          <CheckCircle2 className="w-3 h-3" /> Attending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 font-semibold text-[10px] uppercase">
                          <XCircle className="w-3 h-3" /> Declined
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-[#292824]">
                      {rsvp.response === "ATTENDING" ? rsvp.attendeeCount : "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      {rsvp.mealChoice && (
                        <div className="font-medium text-[#292824]">{rsvp.mealChoice}</div>
                      )}
                      {rsvp.dietaryNotes && (
                        <div className="text-[11px] text-amber-800 bg-amber-50 px-1.5 py-0.5 inline-block mt-0.5">
                          Allergy: {rsvp.dietaryNotes}
                        </div>
                      )}
                      {!rsvp.mealChoice && !rsvp.dietaryNotes && (
                        <span className="text-[#8B8278]/60">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#8B8278] max-w-xs truncate">
                      {rsvp.message || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[11px] text-[#8B8278] font-mono">
                      {new Date(rsvp.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
