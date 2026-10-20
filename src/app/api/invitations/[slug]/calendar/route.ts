import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { TEMPLATES } from "@/lib/templates-data";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    let title = "Celebration";
    let eventDate = "2027-02-14T15:30:00";
    let location = "Sanctuario de San Antonio, Makati City";
    let description = "Digital invitation website hosted on MERCI Digital Invitations.";

    if (!slug.startsWith("demo-")) {
      const invitation = await prisma.invitation.findUnique({
        where: { publicSlug: slug },
        include: { eventData: true },
      });

      if (invitation) {
        title = invitation.title;
        if (invitation.eventData?.eventDate) {
          eventDate = invitation.eventData.eventDate.toISOString();
        }
        if (invitation.eventData?.venueName) {
          location = `${invitation.eventData.venueName}, ${invitation.eventData.venueAddress || ""}`;
        }
        if (invitation.eventData?.welcomeMessage) {
          description = invitation.eventData.welcomeMessage;
        }
      }
    } else {
      const cleanSlug = slug.replace(/^demo-/, "");
      const template = TEMPLATES.find((t) => t.slug === cleanSlug) || TEMPLATES[0];
      title = template.sampleEvent.title;
      location = `${template.sampleEvent.venue}, ${template.sampleEvent.address}`;
      description = template.sampleEvent.story;
    }

    const startDate = new Date(eventDate);
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours later

    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const icsLines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//MERCI Digital Invitations//PH",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `SUMMARY:${title.replace(/[,;]/g, " ")}`,
      `DESCRIPTION:${description.replace(/\n/g, "\\n").replace(/[,;]/g, " ")}`,
      `LOCATION:${location.replace(/[,;]/g, " ")}`,
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `UID:merci-inv-${slug}@merci.ph`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ];

    const icsContent = icsLines.join("\r\n");

    return new Response(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${slug}-celebration.ics"`,
      },
    });
  } catch (error) {
    console.error("[MERCI Calendar ICS Error]:", error);
    return Response.json({ error: "Failed to generate calendar file." }, { status: 500 });
  }
}
