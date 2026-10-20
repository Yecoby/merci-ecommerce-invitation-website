import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthorizedPortalOrder } from "@/lib/auth/portal-guard";
import { prisma } from "@/lib/db/prisma";
import GuestListClient from "./guests-client";

interface Props {
  params: Promise<{ reference: string }>;
}

export const metadata = {
  title: "RSVP & Guest Management — MERCI Client Portal",
};

export default async function PortalGuestsPage({ params }: Props) {
  const { reference } = await params;
  const authCtx = await getAuthorizedPortalOrder(reference);

  if (!authCtx) {
    redirect(`/portal?redirect=/portal/order/${reference}/guests`);
  }

  const { order } = authCtx;
  let rsvps: any[] = [];
  if (order.invitationId) {
    rsvps = await prisma.rSVP.findMany({
      where: { invitationId: order.invitationId },
      orderBy: { submittedAt: "desc" },
    });
  }

  return (
    <GuestListClient
      reference={order.reference}
      rsvps={rsvps}
      invitation={order.invitation}
    />
  );
}
