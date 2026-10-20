import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { getAuthorizedPortalOrder } from "@/lib/auth/portal-guard";

const createTableSchema = z.object({
  name: z.string().min(1, "Table name is required").max(100),
  capacity: z.number().int().min(1).max(50).default(8),
  shape: z.enum(["round", "rectangular"]).default("round"),
  notes: z.string().max(500).optional().nullable(),
});

const assignGuestSchema = z.object({
  tableId: z.string().min(1),
  guestName: z.string().min(1).max(150),
  rsvpId: z.string().optional().nullable(),
  seatNumber: z.number().int().optional().nullable(),
});

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
    const tables = await prisma.seatingTable.findMany({
      where: { orderId: order.id },
      include: { assignments: true },
      orderBy: { sortOrder: "asc" },
    });

    // Also fetch confirmed attending RSVPs if an invitation is linked
    let confirmedGuests: Array<{ id: string; name: string; count: number }> = [];
    if (order.invitationId) {
      const rsvps = await prisma.rSVP.findMany({
        where: { invitationId: order.invitationId, response: "ATTENDING" },
        select: { id: true, guestName: true, attendeeCount: true, attendeeNames: true },
      });

      rsvps.forEach((r) => {
        if (r.attendeeNames) {
          const names = r.attendeeNames.split(/[,;\n]/).map((n) => n.trim()).filter(Boolean);
          names.forEach((name, i) => confirmedGuests.push({ id: `${r.id}_${i}`, name, count: 1 }));
        } else {
          confirmedGuests.push({ id: r.id, name: r.guestName, count: r.attendeeCount });
        }
      });
    }

    return Response.json({ success: true, tables, confirmedGuests });
  } catch (error) {
    console.error("[MERCI Seating GET Error]:", error);
    return Response.json({ error: "Failed to load seating plan." }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { reference } = await context.params;
    const authCtx = await getAuthorizedPortalOrder(reference);

    if (!authCtx) {
      return Response.json({ error: "Unauthorized access to order." }, { status: 403 });
    }

    const { order } = authCtx;
    const body = await request.json();

    if (body.action === "ASSIGN_GUEST") {
      const parsed = assignGuestSchema.safeParse(body);
      if (!parsed.success) {
        return Response.json({ error: "Invalid assignment data" }, { status: 400 });
      }

      // Check capacity of target table
      const table = await prisma.seatingTable.findUnique({
        where: { id: parsed.data.tableId },
        include: { _count: { select: { assignments: true } } },
      });

      if (!table) return Response.json({ error: "Table not found." }, { status: 404 });
      if (table._count.assignments >= table.capacity) {
        return Response.json(
          { error: `Table "${table.name}" has reached capacity (${table.capacity} seats).` },
          { status: 400 }
        );
      }

      const assignment = await prisma.seatingAssignment.create({
        data: {
          tableId: parsed.data.tableId,
          guestName: parsed.data.guestName,
          rsvpId: parsed.data.rsvpId || null,
          seatNumber: parsed.data.seatNumber || null,
        },
      });

      return Response.json({ success: true, assignment }, { status: 201 });
    }

    // Default action: CREATE_TABLE
    const parsed = createTableSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid table configuration" }, { status: 400 });
    }

    const table = await prisma.seatingTable.create({
      data: {
        orderId: order.id,
        name: parsed.data.name,
        capacity: parsed.data.capacity,
        shape: parsed.data.shape,
        notes: parsed.data.notes || null,
      },
    });

    return Response.json({ success: true, table }, { status: 201 });
  } catch (error) {
    console.error("[MERCI Seating POST Error]:", error);
    return Response.json({ error: "Failed to modify seating plan." }, { status: 500 });
  }
}
