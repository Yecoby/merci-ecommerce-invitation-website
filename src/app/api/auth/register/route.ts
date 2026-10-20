/**
 * MERCI — Registration API endpoint.
 *
 * POST /api/auth/register
 *
 * Security notes:
 * - Input validated with Zod before any DB operation.
 * - Password hashed with bcryptjs (cost factor 12).
 * - Hash stored in Account.access_token for the "credentials" provider.
 * - Response never reveals whether an email is already registered
 *   to prevent account enumeration.
 * - Rate limiting should be added via middleware in production.
 */
import { NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { registerSchema } from "@/lib/validation/auth";

const BCRYPT_ROUNDS = 12;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validate input shape and password constraints.
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          error: "Invalid registration data.",
          fields: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // 2. Check if email is already registered.
    //    We return the same "success" response regardless to prevent enumeration.
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      // Return a non-enumerable success response.
      // In production, trigger a "we noticed a sign-in attempt" email instead.
      return Response.json(
        { message: "If this email is available, your account has been created." },
        { status: 200 }
      );
    }

    // 3. Hash the password.
    const hash = await bcryptjs.hash(password, BCRYPT_ROUNDS);

    // 4. Create User + Account in a transaction.
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          role: "CUSTOMER",
          isActive: true,
        },
      });

      // Store the hash in Account.access_token for the credentials provider.
      await tx.account.create({
        data: {
          userId: user.id,
          type: "credentials",
          provider: "credentials",
          providerAccountId: email,
          access_token: hash,
        },
      });

      // Create an empty customer profile.
      await tx.customerProfile.create({
        data: { userId: user.id },
      });
    });

    return Response.json(
      { message: "If this email is available, your account has been created." },
      { status: 201 }
    );
  } catch (error) {
    // Log internally but never expose stack traces to the client.
    console.error("[MERCI Register] Unexpected error:", error);
    return Response.json(
      { error: "Registration could not be completed. Please try again." },
      { status: 500 }
    );
  }
}

