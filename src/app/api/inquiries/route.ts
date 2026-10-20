import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

const inquirySchema = z.object({
  customerName: z.string().min(2, "Customer name must be at least 2 characters").max(100),
  email: z.string().email("A valid email address is required").max(254).transform((v) => v.toLowerCase().trim()),
  phone: z.string().max(40).optional().nullable(),
  eventType: z.string().min(1, "Event type is required").max(60),
  eventDate: z.string().optional().nullable(),
  preferredStyle: z.string().max(100).optional().nullable(),
  guestCount: z.string().max(50).optional().nullable(),
  budgetRange: z.string().max(50).optional().nullable(),
  desiredFeatures: z.array(z.string()).optional().default([]),
  notes: z.string().max(2000).optional().nullable(),
  agreedToPrivacy: z.boolean().refine((val) => val === true, "Must agree to privacy policy"),
  botCheck: z.string().max(50).optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();

    // Honeypot check
    if (json.botCheck) {
      return Response.json({ success: true, message: "Inquiry received." }, { status: 200 });
    }

    const parsed = inquirySchema.safeParse(json);
    if (!parsed.success) {
      return Response.json(
        {
          error: "Invalid inquiry submission.",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    let parsedDate: Date | null = null;
    if (data.eventDate) {
      const d = new Date(data.eventDate);
      if (!isNaN(d.getTime())) {
        parsedDate = d;
      }
    }

    const approxGuestCount = data.guestCount ? parseInt(data.guestCount.replace(/\D/g, ""), 10) || null : null;

    const inquiry = await prisma.inquiry.create({
      data: {
        customerName: data.customerName,
        email: data.email,
        phone: data.phone || null,
        eventType: data.eventType,
        eventDate: parsedDate,
        preferredStyle: data.preferredStyle || null,
        approxGuestCount,
        desiredFeatures: JSON.stringify(data.desiredFeatures),
        budgetRange: data.budgetRange || null,
        notes: data.notes || null,
        privacyAgreed: true,
        status: "NEW",
      },
    });

    return Response.json(
      {
        success: true,
        inquiryId: inquiry.id,
        message: "Your inquiry has been received. Our team will review and contact you within 24–48 hours.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[MERCI Inquiry] Failed to save inquiry:", error);
    return Response.json(
      { error: "Could not submit inquiry at this time. Please try again." },
      { status: 500 }
    );
  }
}
