import { NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { hashToken } from "@/lib/email/transactional";

const resetPasswordActionSchema = z.object({
  email: z
    .string()
    .transform((v) => v.toLowerCase().trim())
    .pipe(z.string().email()),
  token: z.string().min(10),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Must include uppercase, lowercase, and a number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetPasswordActionSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid password reset request", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, token, password } = parsed.data;
    const hashed = hashToken(token);

    // Look up verification token
    const record = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: hashed,
      },
    });

    if (!record) {
      return Response.json({ error: "Invalid or expired password reset link." }, { status: 400 });
    }

    // Check expiration
    if (new Date() > record.expires) {
      // Clean up expired token
      await prisma.verificationToken.deleteMany({
        where: { identifier: email, token: hashed },
      });
      return Response.json({ error: "This password reset link has expired. Please request a new one." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return Response.json({ error: "Account not found." }, { status: 404 });
    }

    const newPasswordHash = await bcryptjs.hash(password, 12);

    // Execute password update and single-use token consumption in a transaction
    await prisma.$transaction(async (tx) => {
      // Update account password hash
      await tx.account.updateMany({
        where: {
          userId: user.id,
          provider: "credentials",
        },
        data: {
          access_token: newPasswordHash,
        },
      });

      // Consume (delete) the verification token so it cannot be replayed
      await tx.verificationToken.deleteMany({
        where: {
          identifier: email,
          token: hashed,
        },
      });
    });

    return Response.json({ success: true, message: "Your password has been successfully reset. You can now sign in." });
  } catch (error) {
    console.error("[MERCI ResetPassword] Error:", error);
    return Response.json({ error: "Failed to reset password. Please try again." }, { status: 500 });
  }
}
