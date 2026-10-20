import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { ShoppingBag, ArrowRight, Package } from "lucide-react";

export const metadata = {
  title: "My Orders — MERCI Digital Invitations",
};

export default async function AccountOrdersPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const orders = userId
    ? await prisma.order.findMany({
        where: { customerId: userId },
        include: { invitation: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#8B8278]/20">
        <span className="text-xs uppercase tracking-widest text-[#8B8278]">Customer Portal</span>
        <h1 className="text-3xl font-serif text-[#292824] mt-1">Order History & Inquiries</h1>
        <p className="text-xs text-[#8B8278] mt-1">
          Review your self-service package purchases and bespoke concierge inquiries.
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white border border-[#8B8278]/25 p-8 text-center shadow-sm">
            <ShoppingBag className="w-8 h-8 text-[#8B8278] mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-serif text-[#292824] mb-1">No Orders Found</h3>
            <p className="text-xs text-[#8B8278] leading-relaxed mb-6">
              You haven't placed any template or concierge design orders yet.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/pricing"
                className="px-5 py-2 border border-[#292824] text-xs uppercase tracking-widest text-[#292824] hover:bg-[#292824]/5"
              >
                View Packages
              </Link>
              <Link
                href="/custom-invitation"
                className="px-5 py-2 bg-[#292824] text-white text-xs uppercase tracking-widest font-medium hover:bg-[#3D3B35]"
              >
                Request Custom Design
              </Link>
            </div>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-[#8B8278]/25 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-[#292824]">
                    REF: {order.reference}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#AAB5A0]/20 text-[#2C3527] font-semibold">
                    {order.status}
                  </span>
                </div>
                <h3 className="font-serif text-lg text-[#292824]">
                  {order.type === "SELF_SERVICE" ? "Self-Service Template" : "Custom Concierge Service"}
                </h3>
                <p className="text-xs text-[#8B8278]">
                  Created on {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                  {order.amountCentavos ? `₱${(order.amountCentavos / 100).toLocaleString()}` : "Quotation Pending"}{" "}
                  ({order.currency})
                </p>
              </div>

              {order.invitation && (
                <div className="flex items-center gap-4">
                  <Link
                    href={`/i/${order.invitation.publicSlug}`}
                    className="text-xs uppercase tracking-widest font-semibold text-[#292824] hover:text-[#8B8278] transition-colors"
                  >
                    Open Live Link →
                  </Link>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
