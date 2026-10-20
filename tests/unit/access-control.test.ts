import { describe, it, expect, vi } from "vitest";

// Mock @/lib/auth/auth so next-auth doesn't execute in jsdom vitest
vi.mock("@/lib/auth/auth", () => ({
  auth: vi.fn(),
  handlers: { GET: vi.fn(), POST: vi.fn() },
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

import { requireOwnership, requireAdmin, requireAuth, getCurrentUser } from "@/lib/permissions";
import * as authModule from "@/lib/auth/auth";

describe("Access Control & Resource Ownership Enforcement", () => {
  it("allows resource owner to access their own invitation", async () => {
    vi.spyOn(authModule, "auth").mockResolvedValueOnce({
      user: { id: "user_owner_123", email: "owner@merci.ph", role: "CUSTOMER" },
      expires: "2099-01-01",
    } as any);

    const user = await requireOwnership("user_owner_123");
    expect(user.id).toBe("user_owner_123");
  });

  it("blocks cross-account user from modifying another customer's invitation (Horizontal Escalation)", async () => {
    vi.spyOn(authModule, "auth").mockResolvedValueOnce({
      user: { id: "attacker_user_456", email: "attacker@merci.ph", role: "CUSTOMER" },
      expires: "2099-01-01",
    } as any);

    await expect(requireOwnership("victim_user_123")).rejects.toThrow("FORBIDDEN");
  });

  it("blocks regular customers from performing administrator operations (Vertical Escalation)", async () => {
    vi.spyOn(authModule, "auth").mockResolvedValueOnce({
      user: { id: "customer_user_789", email: "customer@merci.ph", role: "CUSTOMER" },
      expires: "2099-01-01",
    } as any);

    await expect(requireAdmin()).rejects.toThrow("FORBIDDEN");
  });

  it("allows verified administrator to access resources", async () => {
    vi.spyOn(authModule, "auth").mockResolvedValueOnce({
      user: { id: "admin_user_001", email: "admin@merci.ph", role: "ADMIN" },
      expires: "2099-01-01",
    } as any);

    const admin = await requireAdmin();
    expect(admin.role).toBe("ADMIN");
  });

  it("allows administrator to access customer-owned resource for support", async () => {
    vi.spyOn(authModule, "auth").mockResolvedValueOnce({
      user: { id: "admin_user_001", email: "admin@merci.ph", role: "ADMIN" },
      expires: "2099-01-01",
    } as any);

    const user = await requireOwnership("customer_user_123");
    expect(user.role).toBe("ADMIN");
  });

  it("blocks unauthenticated / anonymous users from private resources", async () => {
    vi.spyOn(authModule, "auth").mockResolvedValueOnce(null as any);
    await expect(requireAuth()).rejects.toThrow("UNAUTHENTICATED");
  });

  it("returns null when getCurrentUser is called without an active session", async () => {
    vi.spyOn(authModule, "auth").mockResolvedValueOnce(null as any);
    const currentUser = await getCurrentUser();
    expect(currentUser).toBeNull();
  });
});
