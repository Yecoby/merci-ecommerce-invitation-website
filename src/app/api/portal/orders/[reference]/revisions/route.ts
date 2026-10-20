import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { getAuthorizedPortalOrder } from "@/lib/auth/portal-guard";

const revisionSchema = z.object({
  description: z.string().min(5, "Please provide detailed revision notes.").max(2000),
});

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

    // Check revision limit
    if (order.revisionCount >= order.revisionLimit) {
      return Response.json(
        {
          error: `You have reached the maximum included revisions (${order.revisionLimit}) for this package. Please contact concierge support if additional adjustments are required.`,
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsed = revisionSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid revision request", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create RevisionRequest
      const rev = await tx.revisionRequest.create({
        data: {
          orderId: order.id,
          description: parsed.data.description,
          status: "PENDING",
        },
      });

      // Update Order revisionCount & status
      await tx.order.update({
        where: { id: order.id },
        data: {
          revisionCount: { increment: 1 },
          status: "REVISION_REQUESTED",
        },
      });

      // Log status transition
      await tx.orderStatusLog.create({
        data: {
          orderId: order.id,
          fromStatus: order.status,
          toStatus: "REVISION_REQUESTED",
          note: `Customer requested revision round #${order.revisionCount + 1}`,
          actorId: authCtx.order.customerId,
        },
      });

      return rev;
    });

    return Response.json({
      success: true,
      message: "Revision request submitted to the atelier design team.",
      revision: result,
      remainingRevisions: Math.max(0, order.revisionLimit - (order.revisionCount + 1)),
    });
  } catch (error) {
    console.error("[MERCI Revision POST Error]:", error);
    return Response.json({ error: "Could not submit revision request." }, { status: 500 });
  }
}
