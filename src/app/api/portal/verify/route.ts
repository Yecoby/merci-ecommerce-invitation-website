import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import {
  checkPortalRateLimit,
  resetPortalRateLimit,
  normalizeAccessCode,
  hashAccessCode,
  sealPortalSession,
  PORTAL_COOKIE_NAME,
  PORTAL_SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/portal-session";

const verifyPortalSchema = z.object({
  accessCode: z.string().min(4).max(30),
  email: z.string().email().max(254),
});

export async function POST(request: NextRequest) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 1. Rate limiting check per IP
    const rateLimit = checkPortalRateLimit(`portal_login:${clientIp}`);
    if (!rateLimit.allowed) {
      return Response.json(
        {
          error: `Too many access attempts. Please wait ${rateLimit.retryAfterSeconds} seconds before trying again.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds || 60),
          },
        }
      );
    }

    const body = await request.json();
    const parsed = verifyPortalSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "Please enter a valid order code and email address." },
        { status: 400 }
      );
    }

    const normalizedCode = normalizeAccessCode(parsed.data.accessCode);
    const normalizedEmail = parsed.data.email.trim().toLowerCase();
    const codeHash = hashAccessCode(normalizedCode);

    // 2. Query order matching BOTH accessCodeHash and customer.email
    // Note: Never match on accessCode alone! Both code AND email must match.
    const order = await prisma.order.findFirst({
      where: {
        accessCodeHash: codeHash,
        customer: {
          email: normalizedEmail,
        },
      },
      include: {
        customer: {
          select: { id: true, email: true, name: true },
        },
        invitation: {
          select: { id: true, publicSlug: true, status: true, title: true },
        },
      },
    });

    if (!order) {
      // Intentionally generic error message to prevent enumeration
      return Response.json(
        {
          error: "Invalid order code or email. Please check your confirmation message or contact studio support.",
        },
        { status: 401 }
      );
    }

    // Reset rate limit on success
    resetPortalRateLimit(`portal_login:${clientIp}`);

    // 3. Issue encrypted portal session cookie
    const token = sealPortalSession({
      orderId: order.id,
      orderReference: order.reference,
      customerId: order.customerId,
      email: order.customer.email,
      packageSlug: order.packageSlug,
    });

    const isProduction = process.env.NODE_ENV === "production";
    const cookieHeader = `${PORTAL_COOKIE_NAME}=${token}; Path=/; Max-Age=${PORTAL_SESSION_MAX_AGE_SECONDS}; HttpOnly; SameSite=Lax${
      isProduction ? "; Secure" : ""
    }`;

    return new Response(
      JSON.stringify({
        success: true,
        orderReference: order.reference,
        redirectUrl: `/portal/order/${order.reference}`,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookieHeader,
        },
      }
    );
  } catch (error) {
    console.error("[MERCI Portal Verify Error]:", error);
    return Response.json({ error: "Unable to verify access at this time." }, { status: 500 });
  }
}
