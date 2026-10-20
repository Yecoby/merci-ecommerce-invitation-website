import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthorizedPortalOrder } from "@/lib/auth/portal-guard";
import DraftReviewClient from "./draft-client";

interface Props {
  params: Promise<{ reference: string }>;
}

export const metadata = {
  title: "Draft Preview & Review — MERCI Client Portal",
};

export default async function DraftReviewPage({ params }: Props) {
  const { reference } = await params;
  const authCtx = await getAuthorizedPortalOrder(reference);

  if (!authCtx) {
    redirect(`/portal?redirect=/portal/order/${reference}/draft`);
  }

  const { order } = authCtx;

  return (
    <DraftReviewClient
      reference={order.reference}
      orderStatus={order.status}
      revisionCount={order.revisionCount}
      revisionLimit={order.revisionLimit}
      revisions={order.revisions}
      invitation={order.invitation}
    />
  );
}
