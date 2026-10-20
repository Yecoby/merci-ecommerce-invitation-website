/**
 * MERCI — Forgot-password API endpoint.
 *
 * POST /api/auth/forgot-password
 *
 * This is a placeholder implementation. In production:
 * 1. Generate a time-limited secure token (stored in VerificationToken table).
 * 2. Send the token via an authenticated email provider.
 * 3. Never expose the token in the response body or logs.
 *
 * Current behavior: acknowledges the request without sending email.
 * The response is always identical to prevent account enumeration.
 */
import { NextRequest } from "next/server";
import { forgotPasswordSchema } from "@/lib/validation/auth";
import { prisma } from "@/lib/db/prisma";
import { generateSecureToken, hashToken, sendTransactionalEmail } from "@/lib/email/transactional";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      // Return success-shaped response to prevent enumeration.
      return Response.json({ message: "If that email is registered, a reset link has been sent." }, { status: 200 });
    }

    const { email } = parsed.data;

    // Look up the user without revealing the result to the client.
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, isActive: true },
    });

    if (user?.isActive) {
      // Generate secure single-use token valid for 60 minutes
      const rawToken = generateSecureToken(32);
      const hashedTokenValue = hashToken(rawToken);
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store in VerificationToken table
      await prisma.verificationToken.upsert({
        where: { identifier_token: { identifier: email, token: hashedTokenValue } },
        create: {
          identifier: email,
          token: hashedTokenValue,
          expires,
        },
        update: {
          token: hashedTokenValue,
          expires,
        },
      });

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const resetLink = `${appUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

      // Dispatch email if transactional provider is active
      await sendTransactionalEmail({
        to: email,
        subject: "Reset Your MERCI Account Password",
        html: `
          <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; color: #292824; padding: 24px;">
            <h2 style="font-weight: 300; font-size: 24px;">MERCI Digital Invitations</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #8B8278;">
              Hello ${user.name || "Customer"},
            </p>
            <p style="font-size: 14px; line-height: 1.6; color: #8B8278;">
              We received a request to reset the password for your account. Click the button below to choose a new password. This link will expire in 60 minutes.
            </p>
            <div style="margin: 28px 0;">
              <a href="${resetLink}" style="background-color: #292824; color: #FAF8F3; padding: 12px 24px; text-decoration: none; font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em;">
                Reset Password
              </a>
            </div>
            <p style="font-size: 11px; color: #8B8278;">
              If you did not request this, you can safely ignore this email. Your password will remain unchanged.
            </p>
          </div>
        `,
      });
    }

    // Always return the same response to prevent account enumeration.
    return Response.json(
      { message: "If that email is registered, a reset link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[MERCI ForgotPassword] Error:", error);
    return Response.json(
      { message: "If that email is registered, a reset link has been sent." },
      { status: 200 }
    );
  }
}

