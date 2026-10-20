import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin, permissionErrorResponse } from "@/lib/permissions";
import { prisma } from "@/lib/db/prisma";

const updateInquirySchema = z.object({
  status: z.enum(["NEW", "REVIEWED", "CONVERTED", "ARCHIVED"]),
  notes: z.string().max(2000).optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const inquiries = await prisma.inquiry.findMany({
      orderBy: { submittedAt: "desc" },
    });

    return Response.json({ success: true, inquiries });
  } catch (error) {
    return permissionErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();

    const json = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Inquiry ID is required" }, { status: 400 });
    }

    const parsed = updateInquirySchema.safeParse(json);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid status update data", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await prisma.inquiry.update({
      where: { id },
      data: {
        status: parsed.data.status,
        ...(parsed.data.notes !== undefined ? { notes: parsed.data.notes } : {}),
      },
    });

    return Response.json({ success: true, inquiry: updated });
  } catch (error) {
    return permissionErrorResponse(error);
  }
}
