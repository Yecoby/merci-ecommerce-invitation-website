import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/permissions";
import {
  Users,
  Mail,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "Admin Concierge Dashboard — MERCI Digital Invitations",
};

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/account");
  }

  // Aggregate metrics from the live database
  const [
    totalUsers,
    totalInquiries,
    newInquiries,
    totalOrders,
    totalInvitations,
    publishedInvitations,
    inquiries,
    orders,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.order.count(),
    prisma.invitation.count(),
    prisma.invitation.count({ where: { status: "PUBLISHED" } }),
    prisma.inquiry.findMany({
      orderBy: { submittedAt: "desc" },
      take: 10,
    }),
    prisma.order.findMany({
      include: {
        customer: { select: { email: true, name: true } },
        invitation: { select: { publicSlug: true, status: true, title: true } },
        revisions: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <div className="space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#8B8278]/20 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8B8278]">Executive Suite</span>
          <h1 className="text-3xl font-serif text-[#292824] mt-1">Platform Operations</h1>
          <p className="text-xs text-[#8B8278] mt-1">
            Real-time inquiries, invitations, and custom atelier requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#AAB5A0]/20 text-[#2C3527] text-xs uppercase tracking-wider font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Authenticated as {user?.email}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-[#8B8278]/25 p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#8B8278] mb-2">
            <span className="text-xs uppercase tracking-wider">Inquiries</span>
            <Mail className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif text-[#292824]">{totalInquiries}</div>
          <div className="text-[11px] text-[#8B8278] mt-1">
            <span className="font-semibold text-[#292824]">{newInquiries}</span> pending review
          </div>
        </div>

        <div className="bg-white border border-[#8B8278]/25 p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#8B8278] mb-2">
            <span className="text-xs uppercase tracking-wider">Invitations</span>
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif text-[#292824]">{totalInvitations}</div>
          <div className="text-[11px] text-[#8B8278] mt-1">
            <span className="font-semibold text-[#292824]">{publishedInvitations}</span> live published
          </div>
        </div>

        <div className="bg-white border border-[#8B8278]/25 p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#8B8278] mb-2">
            <span className="text-xs uppercase tracking-wider">Registered Users</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif text-[#292824]">{totalUsers}</div>
          <div className="text-[11px] text-[#8B8278] mt-1">Customers & Administrators</div>
        </div>

        <div className="bg-white border border-[#8B8278]/25 p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#8B8278] mb-2">
            <span className="text-xs uppercase tracking-wider">Active Orders</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif text-[#292824]">{totalOrders}</div>
          <div className="text-[11px] text-[#8B8278] mt-1">Client portal orders</div>
        </div>
      </div>

      {/* Recent Inquiries Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif text-[#292824]">Recent Bespoke Inquiries</h2>
            <p className="text-xs text-[#8B8278]">
              Submissions received from the custom invitation proposal form.
            </p>
          </div>
        </div>

        {inquiries.length === 0 ? (
          <div className="bg-white border border-[#8B8278]/20 p-8 text-center text-xs text-[#8B8278]">
            No inquiries received yet. Submit an inquiry through{" "}
            <Link href="/custom-invitation" className="underline text-[#292824]">
              the custom invitation form
            </Link>{" "}
            to see live database records appear here.
          </div>
        ) : (
          <div className="bg-white border border-[#8B8278]/20 overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] border-b border-[#8B8278]/20 uppercase tracking-wider text-[10px] text-[#8B8278]">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Occasion</th>
                  <th className="p-3">Target Date</th>
                  <th className="p-3">Budget Range</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8B8278]/15">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                    <td className="p-3">
                      <div className="font-medium text-[#292824]">{inq.customerName}</div>
                      <div className="text-[11px] text-[#8B8278]">{inq.email}</div>
                    </td>
                    <td className="p-3 uppercase tracking-wider text-[11px] text-[#292824]">
                      {inq.eventType}
                    </td>
                    <td className="p-3 text-[#8B8278]">
                      {inq.eventDate ? new Date(inq.eventDate).toLocaleDateString() : "Flexible"}
                    </td>
                    <td className="p-3 text-[#292824]">{inq.budgetRange || "Standard"}</td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-[#C5A880]/20 text-[#9B7D54]">
                        {inq.status}
                      </span>
                    </td>
                    <td className="p-3 text-[#8B8278]">
                      {new Date(inq.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Orders Management Table */}
      <div className="space-y-4 pt-6 border-t border-[#8B8278]/20">
        <div>
          <h2 className="text-lg font-serif text-[#292824]">Client Portal Orders & Access Codes</h2>
          <p className="text-xs text-[#8B8278]">
            Manage client access codes, briefing progress, draft approvals, and publication status.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-[#8B8278]/20 p-8 text-center text-xs text-[#8B8278]">
            No client portal orders created yet.
          </div>
        ) : (
          <div className="bg-white border border-[#8B8278]/20 overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] border-b border-[#8B8278]/20 uppercase tracking-wider text-[10px] text-[#8B8278]">
                <tr>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Package</th>
                  <th className="p-3">Access Hint</th>
                  <th className="p-3">Order Status</th>
                  <th className="p-3">Briefing</th>
                  <th className="p-3">Revisions</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8B8278]/15">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF8F3]/50 transition-colors">
                    <td className="p-3 font-mono font-semibold text-[#292824]">
                      {ord.reference}
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-[#292824]">{ord.customer.name || "Customer"}</div>
                      <div className="text-[11px] text-[#8B8278]">{ord.customer.email}</div>
                    </td>
                    <td className="p-3 uppercase tracking-wider text-[11px] text-[#292824]">
                      {ord.packageSlug}
                    </td>
                    <td className="p-3 font-mono text-xs text-[#8B8278]">
                      {ord.accessCodeHint || "None"}
                    </td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-[#AAB5A0]/20 text-[#2C3527]">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3 text-[#8B8278]">
                      {ord.briefingStatus}
                    </td>
                    <td className="p-3 text-[#8B8278]">
                      {ord.revisionCount} / {ord.revisionLimit}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <Link
                        href={`/portal/order/${ord.reference}`}
                        target="_blank"
                        className="text-xs underline text-[#292824] hover:text-[#8B8278]"
                      >
                        Open Portal
                      </Link>
                      {ord.invitation && (
                        <Link
                          href={`/i/${ord.invitation.publicSlug}`}
                          target="_blank"
                          className="text-xs underline text-[#8B8278] hover:text-[#292824]"
                        >
                          View Site
                        </Link>
                      )}
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
