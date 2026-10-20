import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { TEMPLATES } from "@/lib/templates-data";
import { Plus, Eye, Edit3, Share2, Users, Calendar } from "lucide-react";

export const metadata = {
  title: "My Account — MERCI Digital Invitations",
};

export default async function AccountDashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const invitations = userId
    ? await prisma.invitation.findMany({
        where: { ownerId: userId },
        include: {
          eventData: true,
          template: true,
          _count: { select: { rsvps: true } },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#8B8278]/20">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8B8278]">Customer Portal</span>
          <h1 className="text-3xl font-serif text-[#292824] mt-1">Welcome, {session?.user?.name || "Friend"}</h1>
          <p className="text-xs text-[#8B8278] mt-1">
            Manage your digital invitation websites, monitor RSVP replies, and request atelier edits.
          </p>
        </div>

        <Link
          href="/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#292824] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35] transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Create New Invitation
        </Link>
      </div>

      {/* Invitations List / Empty State */}
      <div className="space-y-4">
        <h2 className="text-sm uppercase tracking-wider font-semibold text-[#292824]">
          Your Invitations
        </h2>

        {invitations.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#8B8278]/25 p-8 flex flex-col justify-between shadow-sm text-center">
              <div>
                <Calendar className="w-8 h-8 text-[#8B8278] mx-auto mb-3" />
                <h3 className="text-lg font-serif text-[#292824] mb-2">No Invitations Yet</h3>
                <p className="text-xs text-[#8B8278] leading-relaxed mb-6">
                  You haven't created any digital invitation websites yet. Start with our interactive builder or try a live template.
                </p>
              </div>
              <Link
                href="/create"
                className="px-6 py-2.5 bg-[#292824] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35] transition-colors"
              >
                Create Invitation Now
              </Link>
            </div>

            {/* Concierge Custom Design Banner */}
            <div className="bg-[#F2EDE4]/60 border border-[#8B8278]/30 p-8 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#C5A880]/20 text-[#9B7D54] font-semibold">
                  Bespoke Atelier Service
                </span>
                <h3 className="text-xl font-serif text-[#292824] mt-3 mb-2">Want our team to craft your site?</h3>
                <p className="text-xs text-[#8B8278] leading-relaxed mb-6">
                  Let our creative directors match your physical stationery, entourage attire, custom calligraphy, and multi-venue schedule.
                </p>
              </div>

              <Link
                href="/custom-invitation"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#292824] hover:text-[#8B8278] transition-colors"
              >
                Submit Custom Request →
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="bg-white border border-[#8B8278]/25 p-6 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#AAB5A0]/20 text-[#2C3527] font-semibold">
                      {inv.status}
                    </span>
                    <span className="text-xs text-[#8B8278] font-serif">
                      {inv.template?.name || "Invitation"}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif text-[#292824] mb-1">{inv.title}</h3>
                  <p className="text-xs text-[#8B8278] flex items-center gap-1.5 mb-4">
                    <Calendar className="w-3.5 h-3.5" />
                    {inv.eventData?.eventDate
                      ? new Date(inv.eventData.eventDate).toLocaleDateString()
                      : "Date TBD"}{" "}
                    {inv.eventData?.venueName ? `· ${inv.eventData.venueName}` : ""}
                  </p>

                  <div className="p-3 bg-[#FAF8F3] border border-[#8B8278]/15 rounded-none space-y-1 mb-4 text-xs">
                    <div className="flex justify-between text-[#8B8278]">
                      <span>RSVP Responses:</span>
                      <span className="font-semibold text-[#292824]">{inv._count.rsvps} Submissions</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#8B8278]/15 flex items-center justify-between text-xs">
                  <Link
                    href={`/i/${inv.publicSlug}`}
                    className="inline-flex items-center gap-1 text-[#292824] hover:text-[#8B8278] font-medium"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Live Link
                  </Link>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/account/invitations/${inv.publicSlug}/rsvps`}
                      className="inline-flex items-center gap-1 text-[#292824] hover:text-[#8B8278] font-medium"
                    >
                      <Users className="w-3.5 h-3.5" /> View RSVPs ({inv._count.rsvps})
                    </Link>
                    <Link
                      href={`/create?edit=${inv.publicSlug}`}
                      className="inline-flex items-center gap-1 text-[#8B8278] hover:text-[#292824]"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
