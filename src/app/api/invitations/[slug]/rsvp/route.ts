import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

const rsvpSubmissionSchema = z.object({
  guestName: z.string().min(2, "Name is required").max(120),
  email: z.string().email("A valid email is required").max(254).transform((v) => v.toLowerCase().trim()),
  attendance: z.enum(["ATTENDING", "UNABLE_TO_ATTEND", "AWAITING"]),
  attendeeCount: z.number().int().min(1).max(20).default(1),
  attendeeNames: z.string().max(500).optional().nullable(),
  mealChoice: z.string().max(100).optional().nullable(),
  dietaryNotes: z.string().max(300).optional().nullable(),
  message: z.string().max(1000).optional().nullable(),
});

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const body = await request.json();

    const parsed = rsvpSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid RSVP data", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check if this is a demo slug (e.g. demo-serenade-wedding)
    const isDemo = slug.startsWith("demo-");

    if (isDemo) {
      // For demo slugs, return success without DB foreign key errors
      return Response.json(
        {
          success: true,
          message: "Demo RSVP recorded successfully.",
          rsvp: {
            guestName: data.guestName,
            response: data.attendance,
            attendeeCount: data.attendeeCount,
          },
        },
        { status: 201 }
      );
    }

    // Look up invitation by publicSlug
    const invitation = await prisma.invitation.findUnique({
      where: { publicSlug: slug },
      include: { rsvpConfig: true },
    });

    if (!invitation) {
      return Response.json({ error: "Invitation not found" }, { status: 404 });
    }

    if (invitation.status !== "PUBLISHED") {
      return Response.json({ error: "This invitation is not accepting RSVPs at this time." }, { status: 403 });
    }

    if (invitation.rsvpConfig && !invitation.rsvpConfig.isEnabled) {
      return Response.json({ error: "RSVP is currently closed for this event." }, { status: 403 });
    }

    // Save to database
    const rsvp = await prisma.rSVP.create({
      data: {
        invitationId: invitation.id,
        guestName: data.guestName,
        email: data.email,
        response: data.attendance,
        attendeeCount: data.attendance === "ATTENDING" ? data.attendeeCount : 0,
        attendeeNames: data.attendeeNames || null,
        mealChoice: data.mealChoice || null,
        dietaryNotes: data.dietaryNotes || null,
        message: data.message || null,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Your RSVP response has been confirmed.",
        rsvpId: rsvp.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[MERCI RSVP Error]:", error);
    return Response.json({ error: "Failed to submit RSVP response. Please try again." }, { status: 500 });
  }
}
