import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { getAuthorizedPortalOrder } from "@/lib/auth/portal-guard";

const briefingSchema = z.object({
  // Basic Event Overview
  eventType: z.string().min(1).max(100),
  hosts: z.string().min(1).max(200),
  eventTitle: z.string().min(1).max(200),
  wordingStyle: z.string().max(2000).optional().nullable(),
  eventDate: z.string().optional().nullable(),
  time: z.string().max(100).optional().nullable(),
  timeZone: z.string().max(100).default("Asia/Manila"),
  
  // Location
  venueName: z.string().max(200).optional().nullable(),
  venueAddress: z.string().max(400).optional().nullable(),
  venueMapUrl: z.string().max(1000).optional().nullable(),
  
  // Ceremony & Reception Details
  ceremonyDetails: z.string().max(1000).optional().nullable(),
  receptionDetails: z.string().max(1000).optional().nullable(),
  dressCode: z.string().max(500).optional().nullable(),
  scheduleItems: z.array(z.object({ time: z.string(), activity: z.string() })).optional().default([]),
  
  // RSVP & Guest Options
  rsvpDeadline: z.string().optional().nullable(),
  enableRSVP: z.boolean().default(true),
  allowPlusOne: z.boolean().default(false),
  mealOptions: z.array(z.string()).optional().default([]),
  
  // Additional Sections
  entourageOrVIPs: z.string().max(2000).optional().nullable(),
  giftGuide: z.string().max(1000).optional().nullable(),
  travelAccommodations: z.string().max(2000).optional().nullable(),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional().default([]),
  languagePreference: z.string().max(50).default("English"),
  specialNotes: z.string().max(2000).optional().nullable(),
  
  // Status transition flag
  submitBriefing: z.boolean().optional().default(false),
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
    let briefing = null;
    if (order.briefingData) {
      try {
        briefing = JSON.parse(order.briefingData);
      } catch {
        briefing = null;
      }
    }

    return Response.json({
      success: true,
      briefingStatus: order.briefingStatus,
      briefing,
      orderStatus: order.status,
    });
  } catch (error) {
    console.error("[MERCI Portal Briefing GET Error]:", error);
    return Response.json({ error: "Failed to load briefing data." }, { status: 500 });
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
    const parsed = briefingSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const newBriefingStatus = data.submitBriefing ? "SUBMITTED" : "IN_PROGRESS";
    const newOrderStatus = data.submitBriefing && order.status === "INQUIRY" ? "IN_PROGRESS" : order.status;

    // Update order with briefing JSON
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          briefingData: JSON.stringify(data),
          briefingStatus: newBriefingStatus,
          status: newOrderStatus,
        },
      });

      // If an invitation is already linked, mirror core fields to eventData
      if (order.invitationId) {
        let parsedDate: Date | null = null;
        if (data.eventDate) {
          const d = new Date(data.eventDate);
          if (!isNaN(d.getTime())) parsedDate = d;
        }

        let parsedRsvpDeadline: Date | null = null;
        if (data.rsvpDeadline) {
          const d = new Date(data.rsvpDeadline);
          if (!isNaN(d.getTime())) parsedRsvpDeadline = d;
        }

        await tx.eventData.upsert({
          where: { invitationId: order.invitationId },
          create: {
            invitationId: order.invitationId,
            hosts: data.hosts,
            eventDate: parsedDate,
            timeZone: data.timeZone,
            venueName: data.venueName,
            venueAddress: data.venueAddress,
            venueMapUrl: data.venueMapUrl,
            welcomeMessage: data.wordingStyle,
            schedule: JSON.stringify(data.scheduleItems),
            dressCode: data.dressCode,
            rsvpDeadline: parsedRsvpDeadline,
          },
          update: {
            hosts: data.hosts,
            eventDate: parsedDate,
            timeZone: data.timeZone,
            venueName: data.venueName,
            venueAddress: data.venueAddress,
            venueMapUrl: data.venueMapUrl,
            welcomeMessage: data.wordingStyle,
            schedule: JSON.stringify(data.scheduleItems),
            dressCode: data.dressCode,
            rsvpDeadline: parsedRsvpDeadline,
          },
        });

        await tx.rSVPConfig.upsert({
          where: { invitationId: order.invitationId },
          create: {
            invitationId: order.invitationId,
            isEnabled: data.enableRSVP,
            deadline: parsedRsvpDeadline,
            allowPlusOne: data.allowPlusOne,
            enableMealChoice: data.mealOptions.length > 0,
            mealOptions: JSON.stringify(data.mealOptions),
          },
          update: {
            isEnabled: data.enableRSVP,
            deadline: parsedRsvpDeadline,
            allowPlusOne: data.allowPlusOne,
            enableMealChoice: data.mealOptions.length > 0,
            mealOptions: JSON.stringify(data.mealOptions),
          },
        });
      }
    });

    return Response.json({
      success: true,
      message: data.submitBriefing
        ? "Your event briefing has been successfully submitted to the atelier team!"
        : "Draft briefing autosaved successfully.",
      briefingStatus: newBriefingStatus,
    });
  } catch (error) {
    console.error("[MERCI Portal Briefing POST Error]:", error);
    return Response.json({ error: "Failed to save briefing." }, { status: 500 });
  }
}
