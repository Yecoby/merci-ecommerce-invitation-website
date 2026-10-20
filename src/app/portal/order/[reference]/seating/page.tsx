import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthorizedPortalOrder } from "@/lib/auth/portal-guard";
import SeatingPlannerClient from "./seating-client";

interface Props {
  params: Promise<{ reference: string }>;
}

export const metadata = {
  title: "Interactive Seating Planner — MERCI Client Portal",
};

export default async function SeatingPlannerPage({ params }: Props) {
  const { reference } = await params;
  const authCtx = await getAuthorizedPortalOrder(reference);

  if (!authCtx) {
    redirect(`/portal?redirect=/portal/order/${reference}/seating`);
  }

  const { order } = authCtx;

  return (
    <SeatingPlannerClient
      reference={order.reference}
      tables={order.seatingTables || []}
      invitation={order.invitation}
    />
  );
}
