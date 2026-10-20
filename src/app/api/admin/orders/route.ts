import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin, permissionErrorResponse } from "@/lib/permissions";
import { prisma } from "@/lib/db/prisma";
import {
  generateOrderAccessCode,
  hashAccessCode,
  createAccessCodeHint,
} from "@/lib/auth/portal-session";

const createOrderSchema = z.object({
  customerId: z.string().min(1),
  packageSlug: z.enum(["self-service", "custom-concierge", "bespoke-atelier"]),
  type: z.enum(["SELF_SERVICE", "CUSTOM_SERVICE"]).default("CUSTOM_SERVICE"),
  amountCentavos: z.number().int().optional().nullable(),
  notes: z.string().optional().nullable(),
  inquiryId: z.string().optional().nullable(),
  templateSlug: z.string().optional().default("serenade-wedding"),
  eventTitle: z.string().optional().default("Custom Celebration"),
});

const updateOrderSchema = z.object({
  status: z
    .enum([
      "INQUIRY",
      "QUOTATION_PENDING",
      "AWAITING_CUSTOMER_APPROVAL",
      "AWAITING_PAYMENT",
      "PAID",
      "IN_PROGRESS",
      "PREVIEW_READY",
      "REVISION_REQUESTED",
      "APPROVED",
      "PUBLISHED",
      "COMPLETED",
      "CANCELLED",
      "REFUNDED",
    ])
    .optional(),
  reissueAccessCode: z.boolean().optional(),
  revisionLimit: z.number().int().min(0).max(10).optional(),
  internalNotes: z.string().max(2000).optional(),
  publishInvitation: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const orders = await prisma.order.findMany({
      include: {
        customer: { select: { id: true, name: true, email: true } },
        invitation: { select: { id: true, publicSlug: true, status: true, title: true } },
        revisions: { orderBy: { createdAt: "desc" } },
        inquiry: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ success: true, orders });
  } catch (error) {
    return permissionErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminUser = await requireAdmin();
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid order data", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 1. Generate unique reference and access code
    const dateYear = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const reference = `MERCI-${dateYear}-${randomSuffix}`;

    const rawAccessCode = generateOrderAccessCode(); // e.g. MRC-8F2K
    const accessCodeHash = hashAccessCode(rawAccessCode);
    const accessCodeHint = createAccessCodeHint(rawAccessCode);

    // 2. Look up template
    let template = await prisma.template.findUnique({
      where: { slug: data.templateSlug },
      include: { currentVersion: true },
    });

    if (!template) {
      // Seed default category and template if absent
      const cat = await prisma.templateCategory.upsert({
        where: { slug: "weddings" },
        create: { slug: "weddings", name: "Weddings" },
        update: {},
      });
      template = await prisma.template.create({
        data: {
          slug: data.templateSlug,
          name: "Serenade",
          tagline: "Timeless Parisian Romance",
          description: "Editorial digital invitation suite.",
          categoryId: cat.id,
        },
        include: { currentVersion: true },
      });
    }

    let versionId = template.currentVersionId;
    if (!versionId) {
      const v = await prisma.templateVersion.create({
        data: {
          templateId: template.id,
          version: 1,
          designConfig: JSON.stringify({ palette: "warm-neutral" }),
          supportedFeatures: JSON.stringify(["countdown", "rsvp", "maps", "schedule"]),
        },
      });
      versionId = v.id;
    }

    // 3. Create order, invitation, and audit log in a transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      // Create linked invitation
      const inv = await tx.invitation.create({
        data: {
          title: data.eventTitle,
          ownerId: data.customerId,
          templateId: template.id,
          templateVersionId: versionId!,
          status: "DRAFT",
          isPublic: false,
        },
      });

      // Create linked eventData & rsvpConfig
      await tx.eventData.create({
        data: {
          invitationId: inv.id,
          hosts: "Hosts",
        },
      });

      await tx.rSVPConfig.create({
        data: {
          invitationId: inv.id,
          isEnabled: true,
        },
      });

      // Create order
      const ord = await tx.order.create({
        data: {
          reference,
          customerId: data.customerId,
          invitationId: inv.id,
          type: data.type,
          packageSlug: data.packageSlug,
          status: "IN_PROGRESS",
          amountCentavos: data.amountCentavos || 399900,
          notes: data.notes || null,
          accessCodeHash,
          accessCodeHint,
        },
      });

      if (data.inquiryId) {
        await tx.inquiry.update({
          where: { id: data.inquiryId },
          data: { status: "CONVERTED", orderId: ord.id },
        });
      }

      await tx.auditLog.create({
        data: {
          actorId: adminUser.id,
          action: "ORDER_CREATED",
          entityType: "Order",
          entityId: ord.id,
          detail: JSON.stringify({ reference, package: data.packageSlug }),
        },
      });

      return ord;
    });

    return Response.json(
      {
        success: true,
        order: newOrder,
        rawAccessCode, // Returned once so admin can relay to customer or invoice
        message: `Order ${reference} created. Access code issued: ${rawAccessCode}`,
      },
      { status: 201 }
    );
  } catch (error) {
    return permissionErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const adminUser = await requireAdmin();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return Response.json({ error: "Order ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = updateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid update data", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    let newAccessCode: string | undefined = undefined;
    let accessCodeHash: string | undefined = undefined;
    let accessCodeHint: string | undefined = undefined;

    if (data.reissueAccessCode) {
      newAccessCode = generateOrderAccessCode();
      accessCodeHash = hashAccessCode(newAccessCode);
      accessCodeHint = createAccessCodeHint(newAccessCode);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { invitation: true },
      });
      if (!order) throw new Error("Order not found");

      const ord = await tx.order.update({
        where: { id: orderId },
        data: {
          ...(data.status ? { status: data.status } : {}),
          ...(data.revisionLimit !== undefined ? { revisionLimit: data.revisionLimit } : {}),
          ...(data.internalNotes !== undefined ? { internalNotes: data.internalNotes } : {}),
          ...(accessCodeHash ? { accessCodeHash, accessCodeHint } : {}),
        },
      });

      // If publishInvitation is true or status is PUBLISHED
      if ((data.publishInvitation || data.status === "PUBLISHED") && order.invitationId) {
        await tx.invitation.update({
          where: { id: order.invitationId },
          data: {
            status: "PUBLISHED",
            isPublic: true,
            publishedAt: new Date(),
          },
        });
      }

      await tx.auditLog.create({
        data: {
          actorId: adminUser.id,
          action: "ORDER_UPDATED",
          entityType: "Order",
          entityId: orderId,
          detail: JSON.stringify(data),
        },
      });

      return ord;
    });

    return Response.json({
      success: true,
      order: updated,
      newAccessCode,
      message: "Order successfully updated by administrator.",
    });
  } catch (error) {
    return permissionErrorResponse(error);
  }
}
