/**
 * Server-side helper to verify that an incoming request or server page
 * has an authenticated portal session matching the requested order reference.
 */
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { unsealPortalSession, PORTAL_COOKIE_NAME, PortalSessionPayload } from "@/lib/auth/portal-session";
import { auth } from "@/lib/auth/auth";

export interface AuthorizedPortalContext {
  order: any;
  isPasswordAccount: boolean;
  isAdmin: boolean;
  userEmail: string;
}

export async function getAuthorizedPortalOrder(orderReference: string): Promise<AuthorizedPortalContext | null> {
  const normalizedRef = orderReference.trim().toUpperCase();

  // 1. Check portal session cookie first
  const cookieStore = await cookies();
  const portalCookie = cookieStore.get(PORTAL_COOKIE_NAME)?.value;

  let portalPayload: PortalSessionPayload | null = null;
  if (portalCookie) {
    portalPayload = unsealPortalSession(portalCookie);
  }

  // 2. Also check if user is signed in with password account (NextAuth) or is Admin
  const authSession = await auth();
  const isAdmin = authSession?.user?.role === "ADMIN";

  // Fetch target order
  const order = await prisma.order.findUnique({
    where: { reference: normalizedRef },
    include: {
      customer: {
        select: { id: true, name: true, email: true },
      },
      invitation: {
        include: {
          eventData: true,
          rsvpConfig: true,
          template: true,
          _count: { select: { rsvps: true } },
        },
      },
      revisions: {
        orderBy: { createdAt: "desc" },
      },
      seatingTables: {
        include: {
          assignments: true,
        },
        orderBy: { sortOrder: "asc" },
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
      inquiry: true,
    },
  });

  if (!order) return null;

  // Authorization check:
  // Case A: Valid portal session matching this exact order reference
  const isPortalMatch = portalPayload && portalPayload.orderReference === normalizedRef;

  // Case B: Logged-in customer matching order.customerId
  const isOwnerMatch = authSession?.user?.id && authSession.user.id === order.customerId;

  // Case C: Administrator
  if (isAdmin || isPortalMatch || isOwnerMatch) {
    return {
      order,
      isPasswordAccount: !!authSession?.user?.id,
      isAdmin,
      userEmail: portalPayload?.email || authSession?.user?.email || order.customer.email,
    };
  }

  return null;
}
