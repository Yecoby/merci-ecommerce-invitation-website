import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getAuthorizedPortalOrder } from "@/lib/auth/portal-guard";

interface RouteContext {
  params: Promise<{ reference: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { reference } = await context.params;
    const authCtx = await getAuthorizedPortalOrder(reference);

    if (!authCtx) {
      return Response.json({ error: "Unauthorized access to order." }, { status: 403 });
    }

    const { order } = authCtx;
    if (!order.invitationId) {
      return Response.json({ error: "No invitation attached to this order." }, { status: 404 });
    }

    const rsvps = await prisma.rSVP.findMany({
      where: { invitationId: order.invitationId },
      orderBy: { submittedAt: "desc" },
    });

    // Build CSV
    const headers = [
      "ID",
      "Guest Name",
      "Email",
      "Response",
      "Headcount",
      "Additional Attendee Names",
      "Meal Choice",
      "Dietary Notes",
      "Message",
      "Submitted At",
    ];

    const escapeCsv = (str: string | null | undefined) => {
      if (!str) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = rsvps.map((r) => [
      escapeCsv(r.id),
      escapeCsv(r.guestName),
      escapeCsv(r.email),
      escapeCsv(r.response),
      r.attendeeCount,
      escapeCsv(r.attendeeNames),
      escapeCsv(r.mealChoice),
      escapeCsv(r.dietaryNotes),
      escapeCsv(r.message),
      escapeCsv(r.submittedAt.toISOString()),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="MERCI-RSVP-${reference}.csv"`,
      },
    });
  } catch (error) {
    console.error("[MERCI CSV Export Error]:", error);
    return Response.json({ error: "Could not generate CSV export." }, { status: 500 });
  }
}
