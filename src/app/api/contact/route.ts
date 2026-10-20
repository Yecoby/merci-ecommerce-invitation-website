import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("A valid email address is required").max(254).transform((v) => v.toLowerCase().trim()),
  subject: z.string().max(150).optional().nullable(),
  message: z.string().min(5, "Message must be at least 5 characters").max(3000),
  botCheck: z.string().max(50).optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();

    // Spam honeypot
    if (json.botCheck) {
      return Response.json({ success: true, message: "Message received." }, { status: 200 });
    }

    const parsed = contactSchema.safeParse(json);
    if (!parsed.success) {
      return Response.json(
        {
          error: "Invalid contact submission.",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    // Persist as an Inquiry record with status "NEW" and eventType "General Contact Inquiry"
    await prisma.inquiry.create({
      data: {
        customerName: name,
        email,
        eventType: subject || "General Inquiry",
        notes: message,
        privacyAgreed: true,
        status: "NEW",
      },
    });

    return Response.json(
      {
        success: true,
        message: "Your message has been received. Our concierge will respond shortly.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[MERCI Contact API] Error processing message:", error);
    return Response.json(
      { error: "Failed to deliver contact message. Please try again." },
      { status: 500 }
    );
  }
}
