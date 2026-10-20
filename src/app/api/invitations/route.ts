import { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

const createInvitationSchema = z.object({
  templateSlug: z.string().min(1),
  title: z.string().min(2).max(150),
  hosts: z.string().min(2).max(150),
  eventDate: z.string().optional().nullable(),
  time: z.string().optional().nullable(),
  venueName: z.string().optional().nullable(),
  venueAddress: z.string().optional().nullable(),
  story: z.string().optional().nullable(),
  dressCode: z.string().optional().nullable(),
  enableRSVP: z.boolean().default(true),
  maxGuests: z.number().int().min(1).optional().nullable(),
  allowPlusOne: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }

    const invitations = await prisma.invitation.findMany({
      where: { ownerId: session.user.id },
      include: {
        eventData: true,
        rsvpConfig: true,
        _count: {
          select: { rsvps: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ success: true, invitations });
  } catch (error) {
    console.error("[MERCI Invitations GET Error]:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }

    const json = await request.json();
    const parsed = createInvitationSchema.safeParse(json);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid invitation data", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Look up or establish template in DB
    let template = await prisma.template.findUnique({
      where: { slug: data.templateSlug },
      include: { currentVersion: true },
    });

    // If template does not exist in DB yet, seed template category + template record
    if (!template) {
      let category = await prisma.templateCategory.findFirst({
        where: { slug: "general" },
      });

      if (!category) {
        category = await prisma.templateCategory.create({
          data: {
            slug: "general",
            name: "Celebrations & Weddings",
          },
        });
      }

      template = await prisma.template.create({
        data: {
          slug: data.templateSlug,
          name: data.templateSlug.replace(/-/g, " ").toUpperCase(),
          tagline: "Curated MERCI digital invitation design",
          description: "Fine stationery aesthetic transformed for modern web presentation.",
          categoryId: category.id,
        },
        include: { currentVersion: true },
      });

      // Create initial version snapshot
      const initialVersion = await prisma.templateVersion.create({
        data: {
          templateId: template.id,
          version: 1,
          designConfig: JSON.stringify({}),
          supportedFeatures: JSON.stringify(["rsvp", "countdown", "schedule"]),
        },
      });

      template = await prisma.template.update({
        where: { id: template.id },
        data: { currentVersionId: initialVersion.id },
        include: { currentVersion: true },
      });
    }

    const currentVersionId = template.currentVersionId;
    if (!currentVersionId) {
      return Response.json({ error: "Template version unavailable" }, { status: 500 });
    }

    let parsedDate: Date | null = null;
    if (data.eventDate) {
      const d = new Date(data.eventDate);
      if (!isNaN(d.getTime())) {
        parsedDate = d;
      }
    }

    // Create invitation, eventData, and rsvpConfig transactionally
    const invitation = await prisma.$transaction(async (tx) => {
      const inv = await tx.invitation.create({
        data: {
          title: data.title,
          ownerId: session.user.id,
          templateId: template.id,
          templateVersionId: currentVersionId,
          status: "DRAFT",
          isPublic: false,
        },
      });

      await tx.eventData.create({
        data: {
          invitationId: inv.id,
          hosts: data.hosts,
          eventDate: parsedDate,
          venueName: data.venueName || null,
          venueAddress: data.venueAddress || null,
          welcomeMessage: data.story || null,
          dressCode: data.dressCode || null,
          schedule: JSON.stringify([]),
        },
      });

      await tx.rSVPConfig.create({
        data: {
          invitationId: inv.id,
          isEnabled: data.enableRSVP,
          allowPlusOne: data.allowPlusOne,
          maxGuests: data.maxGuests || null,
        },
      });

      return inv;
    });

    return Response.json(
      {
        success: true,
        invitationId: invitation.id,
        publicSlug: invitation.publicSlug,
        message: "Invitation saved successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[MERCI Invitations POST Error]:", error);
    return Response.json({ error: "Failed to create invitation." }, { status: 500 });
  }
}
