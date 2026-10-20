import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { ArrowLeft, CheckCircle2, XCircle, Users, Mail, Calendar, Utensils, MessageSquare } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export const metadata = {
  title: "Guest RSVP Management — MERCI Digital Invitations",
};

export default async function InvitationRSVPsPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?redirect=/account/invitations/${slug}/rsvps`);
  }

  const invitation = await prisma.invitation.findUnique({
    where: { publicSlug: slug },
    include: {
      eventData: true,
      rsvps: {
        orderBy: { submittedAt: "desc" },
      },
    },
  });

  if (!invitation) {
    notFound();
  }

  // Authorization check: Only owner or admin can view the guest list
  const isOwner = invitation.ownerId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    redirect("/account");
  }

  const totalResponses = invitation.rsvps.length;
  const attendingGuests = invitation.rsvps.filter((r) => r.response === "ATTENDING");
  const totalAttendingHeadcount = attendingGuests.reduce((sum, r) => sum + r.attendeeCount, 0);
  const declinedCount = invitation.rsvps.filter((r) => r.response === "UNABLE_TO_ATTEND").length;

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Header */}
      <div>
        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#8B8278] hover:text-[#292824] transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Invitations
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#8B8278]/20">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#8B8278]">Host RSVP Manager</span>
            <h1 className="text-3xl font-serif text-[#292824] mt-1">{invitation.title}</h1>
            <p className="text-xs text-[#8B8278] mt-1">
              {invitation.eventData?.eventDate
                ? new Date(invitation.eventData.eventDate).toLocaleDateString()
                : "Celebration"}
              {invitation.eventData?.venueName ? ` · ${invitation.eventData.venueName}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/i/${invitation.publicSlug}`}
              target="_blank"
              className="px-4 py-2 border border-[#292824] text-xs uppercase tracking-widest text-[#292824] hover:bg-[#292824]/5 transition-colors"
            >
              Public View ↗
            </Link>
            <Link
              href={`/create?edit=${invitation.publicSlug}`}
              className="px-4 py-2 bg-[#292824] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35] transition-colors"
            >
              Edit Invitation
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-[#8B8278]/25 p-5 shadow-sm">
          <div className="text-xs text-[#8B8278] uppercase tracking-wider mb-1">Total Submissions</div>
          <div className="text-2xl sm:text-3xl font-serif text-[#292824]">{totalResponses}</div>
          <div className="text-[11px] text-[#8B8278] mt-1">Guest responses</div>
        </div>

        <div className="bg-white border border-[#8B8278]/25 p-5 shadow-sm">
          <div className="text-xs text-[#8B8278] uppercase tracking-wider mb-1">Confirmed Guests</div>
          <div className="text-2xl sm:text-3xl font-serif text-[#2C3527]">{totalAttendingHeadcount}</div>
          <div className="text-[11px] text-[#8B8278] mt-1">Total attending party size</div>
        </div>

        <div className="bg-white border border-[#8B8278]/25 p-5 shadow-sm">
          <div className="text-xs text-[#8B8278] uppercase tracking-wider mb-1">Attending Parties</div>
          <div className="text-2xl sm:text-3xl font-serif text-[#292824]">{attendingGuests.length}</div>
          <div className="text-[11px] text-[#8B8278] mt-1">Households attending</div>
        </div>

        <div className="bg-white border border-[#8B8278]/25 p-5 shadow-sm">
          <div className="text-xs text-[#8B8278] uppercase tracking-wider mb-1">Declined</div>
          <div className="text-2xl sm:text-3xl font-serif text-[#8B8278]">{declinedCount}</div>
          <div className="text-[11px] text-[#8B8278] mt-1">Regretfully declined</div>
        </div>
      </div>

      {/* Guest Response Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif text-[#292824]">Guest Responses</h2>

        {invitation.rsvps.length === 0 ? (
          <div className="bg-white border border-[#8B8278]/25 p-12 text-center text-xs text-[#8B8278] space-y-3">
            <Users className="w-8 h-8 text-[#8B8278] mx-auto opacity-50" />
            <h3 className="text-base font-serif text-[#292824]">No RSVPs Submitted Yet</h3>
            <p className="max-w-md mx-auto leading-relaxed">
              When guests open your public invitation link and respond, their names, attendance status, and meal/dietary notes will appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[#8B8278]/25 overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] border-b border-[#8B8278]/20 uppercase tracking-wider text-[10px] text-[#8B8278]">
                <tr>
                  <th className="p-3">Guest</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Party Headcount</th>
                  <th className="p-3">Dietary & Allergies</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8B8278]/15">
                {invitation.rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                    <td className="p-3">
                      <div className="font-medium text-[#292824]">{rsvp.guestName}</div>
                      {rsvp.email && <div className="text-[11px] text-[#8B8278]">{rsvp.email}</div>}
                    </td>
                    <td className="p-3">
                      {rsvp.response === "ATTENDING" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold text-[#2C3527] bg-[#AAB5A0]/25 px-2 py-0.5">
                          <CheckCircle2 className="w-3 h-3 text-[#2C3527]" /> Attending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold text-[#8B8278] bg-[#8B8278]/15 px-2 py-0.5">
                          <XCircle className="w-3 h-3 text-[#8B8278]" /> Declined
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-serif text-sm text-[#292824]">
                      {rsvp.response === "ATTENDING" ? `${rsvp.attendeeCount} ${rsvp.attendeeCount === 1 ? "guest" : "guests"}` : "0"}
                    </td>
                    <td className="p-3 text-[#8B8278] max-w-xs">
                      {rsvp.dietaryNotes || rsvp.mealChoice ? (
                        <div className="flex items-start gap-1">
                          <Utensils className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                          <span>{[rsvp.mealChoice, rsvp.dietaryNotes].filter(Boolean).join(" · ")}</span>
                        </div>
                      ) : (
                        <span className="opacity-60">None specified</span>
                      )}
                    </td>
                    <td className="p-3 text-[#8B8278] italic max-w-xs">
                      {rsvp.message ? (
                        <div className="flex items-start gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-[#8B8278] shrink-0 mt-0.5 opacity-60" />
                          <span>"{rsvp.message}"</span>
                        </div>
                      ) : (
                        <span className="opacity-40">—</span>
                      )}
                    </td>
                    <td className="p-3 text-[#8B8278] text-[11px]">
                      {new Date(rsvp.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
