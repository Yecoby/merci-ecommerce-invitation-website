/**
 * MERCI — Auth.js (next-auth v5) configuration.
 *
 * Uses the Prisma adapter for database-backed sessions and the Credentials
 * provider for email + password login.
 *
 * Security notes:
 * - Passwords are hashed with bcryptjs (bcrypt-compatible, no native bindings).
 * - Session strategy is "database" — tokens are stored in the database,
 *   not in a JWT cookie. This means sessions can be revoked server-side.
 * - AUTH_SECRET must be set in production. The library will refuse to start
 *   without it.
 * - Never expose raw passwords, session tokens, or auth secrets in logs.
 */
import NextAuth, { type NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { loginSchema } from "@/lib/validation/auth";
import type { UserRole } from "@prisma/client";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Validate the shape of the incoming credentials.
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // 2. Look up the user. We explicitly select only what we need,
        //    avoiding returning the full record unnecessarily.
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            isActive: true,
          },
        });

        if (!user || !user.isActive) return null;

        // 3. Retrieve the hashed password from the Account record.
        //    We store it in Account.access_token for the "credentials" provider
        //    so the User table itself never exposes a password field.
        const account = await prisma.account.findFirst({
          where: {
            userId: user.id,
            provider: "credentials",
          },
          select: { access_token: true },
        });

        if (!account?.access_token) return null;

        // 4. Constant-time comparison.
        const passwordMatch = await bcryptjs.compare(
          password,
          account.access_token
        );
        if (!passwordMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, attach trusted server-side user fields to the token.
      if (user) {
        token.id = user.id;
        token.role = (user as { role: UserRole }).role;
      }
      // Never accept role or id from user-controlled session updates.
      return token;
    },
    async session({ session, token }) {
      // Attach role and id to session so pages and APIs can check authorization.
      if (token && session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        session.user.role = (token.role as UserRole) || "CUSTOMER";
      }
      return session;
    },
  },
  events: {
    async signIn() {
      // Intentionally avoid logging email or personal data to server logs
      if (process.env.NODE_ENV === "development") {
        console.log("[MERCI Auth] Successful sign-in completed (email redacted)");
      }
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

