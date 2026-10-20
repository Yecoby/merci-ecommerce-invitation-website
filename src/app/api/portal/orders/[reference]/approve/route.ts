import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getAuthorizedPortalOrder } from "@/lib/auth/portal-guard";

interface RouteContext {
  params: Promise<{ reference: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { reference } = await context.params;
    const authCtx = await getAuthorizedPortalOrder(reference);

    if (!authCtx) {
      return Response.json({ error: "Unauthorized access to order." }, { status: 403 });
    }

    const { order } = authCtx;

    await prisma.$transaction(async (tx) => {
      // 1. Mark Order as APPROVED
      await tx.order.update({
        where: { id: order.id },
        data: { status: "APPROVED" },
      });

      // 2. Mark any linked invitation as PREVIEW_READY or APPROVED
      if (order.invitationId) {
        await tx.invitation.update({
          where: { id: order.invitationId },
          data: { status: "PREVIEW_READY" },
        });
      }

      // 3. Log status transition
      await tx.orderStatusLog.create({
        data: {
          orderId: order.id,
          fromStatus: order.status,
          toStatus: "APPROVED",
          note: "Customer approved the design draft.",
          actorId: authCtx.order.customerId,
        },
      });
    });

    return Response.json({
      success: true,
      message: "Design draft officially approved. The studio has been notified to prepare your live publication.",
    });
  } catch (error) {
    console.error("[MERCI Draft Approval Error]:", error);
    return Response.json({ error: "Could not approve draft." }, { status: 500 });
  }
}
