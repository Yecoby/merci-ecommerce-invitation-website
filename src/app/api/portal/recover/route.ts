import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { sendTransactionalEmail } from "@/lib/email/transactional";
import { checkPortalRateLimit } from "@/lib/auth/portal-session";

const recoverSchema = z.object({
  email: z.string().email().max(254),
});

export async function POST(request: NextRequest) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    const rateLimit = checkPortalRateLimit(`portal_recover:${clientIp}`);
    if (!rateLimit.allowed) {
      return Response.json(
        { error: "Too many recovery requests. Please wait a few moments before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = recoverSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const email = parsed.data.email.trim().toLowerCase();

    // Look up orders matching email
    const orders = await prisma.order.findMany({
      where: { customer: { email } },
      select: { reference: true, packageSlug: true },
    });

    if (orders.length > 0) {
      // In development or when email provider is configured, queue message
      await sendTransactionalEmail({
        to: email,
        subject: "MERCI Client Portal — Your Order Access Details",
        html: `<p>Hello,</p><p>We received a request to retrieve your MERCI Client Portal order references: ${orders
          .map((o) => `<strong>${o.reference}</strong>`)
          .join(", ")}.</p><p>Please check your initial confirmation message for your secure access code, or reply to this email for concierge assistance.</p>`,
      });
    }

    // Always return generic success to prevent account/order enumeration
    return Response.json({
      success: true,
      message:
        "If an active order is associated with this email, your access instructions and references have been sent.",
    });
  } catch (error) {
    console.error("[MERCI Portal Recover Error]:", error);
    return Response.json({ error: "Unable to process recovery request at this time." }, { status: 500 });
  }
}
