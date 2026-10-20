import { describe, it, expect, vi } from "vitest";

// Mock @/lib/auth/auth so next-auth doesn't execute in jsdom vitest
vi.mock("@/lib/auth/auth", () => ({
  auth: vi.fn(),
  handlers: { GET: vi.fn(), POST: vi.fn() },
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

import { permissionErrorResponse } from "@/lib/permissions";

describe("Permissions and Security Helpers", () => {
  it("converts UNAUTHENTICATED error to 401 response", async () => {
    const error = new Error("UNAUTHENTICATED");
    const response = permissionErrorResponse(error);
    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json.error).toBe("Authentication required.");
  });

  it("converts FORBIDDEN error to 403 response", async () => {
    const error = new Error("FORBIDDEN");
    const response = permissionErrorResponse(error);
    expect(response.status).toBe(403);
    const json = await response.json();
    expect(json.error).toBe("Access denied.");
  });

  it("converts unknown error to 500 internal server error response", async () => {
    const error = new Error("Database timeout");
    const response = permissionErrorResponse(error);
    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json.error).toBe("Internal server error.");
  });
});
