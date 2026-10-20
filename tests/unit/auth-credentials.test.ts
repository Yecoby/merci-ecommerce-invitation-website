// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { authConfig, handlers } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import bcryptjs from "bcryptjs";
import { NextRequest } from "next/server";

describe("Auth.js Credentials Provider & Session Strategy", () => {
  const credentialsProvider = authConfig.providers.find(
    (p: any) => p.id === "credentials"
  ) as any;

  const authorizeFn = credentialsProvider.options?.authorize || credentialsProvider.authorize;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("configures session strategy as JWT (required for Credentials with adapter)", () => {
    expect(authConfig.session?.strategy).toBe("jwt");
  });

  it("GET /api/auth/providers returns HTTP 200 with credentials provider listed", async () => {
    const req = new NextRequest("http://localhost:3000/api/auth/providers");
    const res = await handlers.GET(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.credentials).toBeDefined();
    expect(data.credentials.id).toBe("credentials");
    expect(data.credentials.type).toBe("credentials");
  });

  describe("Credentials authorize()", () => {
    const mockUser = {
      id: "usr_active_customer",
      name: "Juan Dela Cruz",
      email: "juan@merci.ph",
      image: null,
      role: "CUSTOMER" as const,
      isActive: true,
    };

    const mockHashedPassword = "hashed_bcrypt_password_value";

    it("authorizes successfully with correct credentials and returns safe user fields", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValueOnce(mockUser as any);
      vi.spyOn(prisma.account, "findFirst").mockResolvedValueOnce({
        access_token: mockHashedPassword,
      } as any);
      vi.spyOn(bcryptjs, "compare").mockImplementation(async () => true);

      const result = await authorizeFn({
        email: "juan@merci.ph",
        password: "CorrectPassword123!",
      });

      expect(result).not.toBeNull();
      expect(result?.id).toBe("usr_active_customer");
      expect(result?.name).toBe("Juan Dela Cruz");
      expect(result?.email).toBe("juan@merci.ph");
      expect(result?.role).toBe("CUSTOMER");
      // Must not expose password or access_token
      expect((result as any)?.access_token).toBeUndefined();
      expect((result as any)?.password).toBeUndefined();
    });

    it("rejects invalid password with null", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValueOnce(mockUser as any);
      vi.spyOn(prisma.account, "findFirst").mockResolvedValueOnce({
        access_token: mockHashedPassword,
      } as any);
      vi.spyOn(bcryptjs, "compare").mockImplementation(async () => false);

      const result = await authorizeFn({
        email: "juan@merci.ph",
        password: "WrongPassword!",
      });

      expect(result).toBeNull();
    });

    it("rejects unknown email with null", async () => {
      vi.spyOn(prisma.user, "findUnique").mockResolvedValueOnce(null);

      const result = await authorizeFn({
        email: "unknown@merci.ph",
        password: "AnyPassword123!",
      });

      expect(result).toBeNull();
    });

    it("rejects inactive accounts with null", async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      vi.spyOn(prisma.user, "findUnique").mockResolvedValueOnce(inactiveUser as any);

      const result = await authorizeFn({
        email: "juan@merci.ph",
        password: "CorrectPassword123!",
      });

      expect(result).toBeNull();
    });

    it("rejects malformed or empty credentials with null", async () => {
      const result = await authorizeFn({
        email: "not-an-email",
        password: "",
      });

      expect(result).toBeNull();
    });
  });

  describe("JWT and Session Callbacks", () => {
    const jwtCallback = authConfig.callbacks?.jwt;
    const sessionCallback = authConfig.callbacks?.session;

    it("attaches trusted user id and role to token upon initial sign-in", async () => {
      expect(jwtCallback).toBeDefined();
      if (!jwtCallback) return;

      const token = {};
      const user = {
        id: "usr_admin_123",
        role: "ADMIN" as const,
        email: "admin@merci.ph",
      };

      const updatedToken = (await jwtCallback({ token, user } as any)) as any;
      expect(updatedToken).not.toBeNull();
      expect(updatedToken.id).toBe("usr_admin_123");
      expect(updatedToken.role).toBe("ADMIN");
    });

    it("preserves token id and role on subsequent requests", async () => {
      expect(jwtCallback).toBeDefined();
      if (!jwtCallback) return;

      const existingToken = {
        id: "usr_cust_456",
        role: "CUSTOMER" as const,
      };

      const updatedToken = (await jwtCallback({
        token: existingToken,
      } as any)) as any;
      expect(updatedToken).not.toBeNull();
      expect(updatedToken.id).toBe("usr_cust_456");
      expect(updatedToken.role).toBe("CUSTOMER");
    });

    it("never accepts role escalation from user-controlled session update triggers", async () => {
      expect(jwtCallback).toBeDefined();
      if (!jwtCallback) return;

      const existingToken = {
        id: "usr_cust_789",
        role: "CUSTOMER" as const,
      };

      // Attacker attempts to update session with ADMIN role
      const updatedToken = (await jwtCallback({
        token: existingToken,
        trigger: "update",
        session: { role: "ADMIN" },
      } as any)) as any;

      expect(updatedToken).not.toBeNull();
      expect(updatedToken.role).toBe("CUSTOMER");
    });

    it("session callback attaches id and role to session.user from trusted token", async () => {
      expect(sessionCallback).toBeDefined();
      if (!sessionCallback) return;

      const token = {
        id: "usr_verified_999",
        role: "ADMIN" as const,
      };

      const session = {
        user: { id: "", role: "CUSTOMER" as const, name: "Admin", email: "admin@merci.ph" },
        expires: new Date(Date.now() + 86400000).toISOString(),
      };

      const updatedSession = (await sessionCallback({
        session,
        token,
      } as any)) as any;

      expect(updatedSession.user.id).toBe("usr_verified_999");
      expect(updatedSession.user.role).toBe("ADMIN");
    });
  });
});
