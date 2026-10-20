/**
 * MERCI — Permission helpers.
 *
 * All authorization checks must happen server-side.
 * Never trust client-supplied roles, ownership IDs, or status values.
 */
import { auth } from "@/lib/auth/auth";
import type { UserRole } from "@prisma/client";

/**
 * Returns the current session or null if unauthenticated.
 * Use in Server Components and Route Handlers.
 */
export async function getSession() {
  return auth();
}

/**
 * Returns the current user's id and role, or null if not authenticated.
 */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user?.id) return null;
  return {
    id: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? "",
    role: (session.user.role as UserRole) ?? "CUSTOMER",
  };
}

/**
 * Requires authentication. Returns the current user or throws a redirect-worthy
 * error that the caller should translate into a redirect to /login.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}

/**
 * Requires ADMIN role. Throws if the user is not an admin.
 */
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}

/**
 * Returns true if the current user is an admin.
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "ADMIN";
}

/**
 * Asserts that the current user owns the given resource.
 * Throws FORBIDDEN if the IDs do not match and the user is not an admin.
 */
export async function requireOwnership(ownerId: string) {
  const user = await requireAuth();
  if (user.id !== ownerId && user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}

/**
 * Converts permission errors into appropriate HTTP response objects.
 * Use in Route Handlers.
 */
export function permissionErrorResponse(error: unknown): Response {
  if (error instanceof Error) {
    if (error.message === "UNAUTHENTICATED") {
      return Response.json({ error: "Authentication required." }, { status: 401 });
    }
    if (error.message === "FORBIDDEN") {
      return Response.json({ error: "Access denied." }, { status: 403 });
    }
  }
  return Response.json({ error: "Internal server error." }, { status: 500 });
}

