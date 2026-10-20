import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

const updateInvitationSchema = z.object({
  title: z.string().min(2).max(150).optional(),
  hosts: z.string().min(2).max(150).optional(),
  eventDate: z.string().optional().nullable(),
  time: z.string().optional().nullable(),
  venueName: z.string().optional().nullable(),
  venueAddress: z.string().optional().nullable(),
  story: z.string().optional().nullable(),
  dressCode: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
  status: z.enum(["DRAFT", "PREVIEW_READY", "PUBLISHED", "ARCHIVED"]).optional(),
});

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const session = await auth();

    const invitation = await prisma.invitation.findUnique({
      where: { publicSlug: slug },
      include: {
        eventData: true,
        rsvpConfig: true,
        template: true,
        rsvps: session?.user?.id ? true : false,
      },
    });

    if (!invitation) {
      return Response.json({ error: "Invitation not found" }, { status: 404 });
    }

    const isOwner = session?.user?.id && invitation.ownerId === session.user.id;
    const isAdmin = session?.user?.role === "ADMIN";

    // If private/draft and not owner or admin, block access
    if (invitation.status !== "PUBLISHED" && !isOwner && !isAdmin) {
      return Response.json({ error: "Access denied" }, { status: 403 });
    }

    // Never return the RSVP list unless authenticated as the owner or an admin
    if (!isOwner && !isAdmin) {
      const { rsvps, ...publicInvitationData } = invitation;
      return Response.json({ success: true, invitation: publicInvitationData });
    }

    return Response.json({ success: true, invitation });
  } catch (error) {
    console.error("[MERCI Invitation GET Detail Error]:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }

    const invitation = await prisma.invitation.findUnique({
      where: { publicSlug: slug },
    });

    if (!invitation) {
      return Response.json({ error: "Invitation not found" }, { status: 404 });
    }

    // Verify ownership or admin privileges server-side
    const isOwner = invitation.ownerId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return Response.json({ error: "Forbidden: You do not own this invitation" }, { status: 403 });
    }

    const json = await request.json();
    const parsed = updateInvitationSchema.safeParse(json);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid update data", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    let parsedDate: Date | null | undefined = undefined;
    if (data.eventDate !== undefined) {
      if (data.eventDate) {
        const d = new Date(data.eventDate);
        parsedDate = !isNaN(d.getTime()) ? d : null;
      } else {
        parsedDate = null;
      }
    }

    await prisma.$transaction(async (tx) => {
      if (data.title || data.status || data.isPublic !== undefined) {
        await tx.invitation.update({
          where: { id: invitation.id },
          data: {
            ...(data.title ? { title: data.title } : {}),
            ...(data.status ? { status: data.status } : {}),
            ...(data.isPublic !== undefined ? { isPublic: data.isPublic } : {}),
            ...(data.status === "PUBLISHED" ? { publishedAt: new Date() } : {}),
          },
        });
      }

      if (
        data.hosts ||
        parsedDate !== undefined ||
        data.venueName !== undefined ||
        data.venueAddress !== undefined ||
        data.story !== undefined ||
        data.dressCode !== undefined
      ) {
        await tx.eventData.upsert({
          where: { invitationId: invitation.id },
          create: {
            invitationId: invitation.id,
            hosts: data.hosts || "Hosts",
            eventDate: parsedDate ?? null,
            venueName: data.venueName ?? null,
            venueAddress: data.venueAddress ?? null,
            welcomeMessage: data.story ?? null,
            dressCode: data.dressCode ?? null,
          },
          update: {
            ...(data.hosts ? { hosts: data.hosts } : {}),
            ...(parsedDate !== undefined ? { eventDate: parsedDate } : {}),
            ...(data.venueName !== undefined ? { venueName: data.venueName } : {}),
            ...(data.venueAddress !== undefined ? { venueAddress: data.venueAddress } : {}),
            ...(data.story !== undefined ? { welcomeMessage: data.story } : {}),
            ...(data.dressCode !== undefined ? { dressCode: data.dressCode } : {}),
          },
        });
      }
    });

    return Response.json({ success: true, message: "Invitation updated successfully." });
  } catch (error) {
    console.error("[MERCI Invitation PATCH Error]:", error);
    return Response.json({ error: "Failed to update invitation" }, { status: 500 });
  }
}
