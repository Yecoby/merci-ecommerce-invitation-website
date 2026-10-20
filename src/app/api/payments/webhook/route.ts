import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPayMongoSignature } from "@/lib/payments/paymongo";

/**
 * Webhook listener for Payment Gateway updates (PayMongo / Philippine E-Wallets & Cards)
 * POST /api/payments/webhook
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;

  // If webhook secret is not configured in local environment, reject securely
  if (!webhookSecret) {
    return Response.json(
      { error: "Payment webhook integration is unconfigured in this environment." },
      { status: 503 }
    );
  }

  const rawPayload = await request.text();
  const signatureHeader = request.headers.get("paymongo-signature");

  const isValid = verifyPayMongoSignature(rawPayload, signatureHeader, webhookSecret);
  if (!isValid) {
    return Response.json({ error: "Invalid signature verification." }, { status: 400 });
  }

  try {
    const event = JSON.parse(rawPayload);
    const eventType = event.data?.attributes?.type;
    const resourceData = event.data?.attributes?.data;

    // Handle payment paid event
    if (eventType === "payment.paid") {
      const paymentRef = resourceData?.id;
      const orderRef = resourceData?.attributes?.description; // Reference e.g. MERCI-2027-0104
      const amountCentavos = resourceData?.attributes?.amount;

      if (orderRef) {
        const order = await prisma.order.findUnique({
          where: { reference: orderRef },
        });

        if (order) {
          await prisma.$transaction(async (tx) => {
            // Update order status to PAID
            await tx.order.update({
              where: { id: order.id },
              data: {
                status: "PAID",
                amountCentavos: amountCentavos || order.amountCentavos,
              },
            });

            // Create verified payment record
            await tx.paymentRecord.create({
              data: {
                orderId: order.id,
                providerReference: paymentRef || "webhook_event",
                method: resourceData?.attributes?.source?.type || "gcash_card",
                amountCentavos: amountCentavos || 0,
                currency: "PHP",
                status: "CONFIRMED",
                verifiedAt: new Date(),
              },
            });

            // Log status transition
            await tx.orderStatusLog.create({
              data: {
                orderId: order.id,
                fromStatus: order.status,
                toStatus: "PAID",
                note: `Payment confirmed via PayMongo webhook (${paymentRef})`,
              },
            });
          });
        }
      }
    }

    return Response.json({ received: true });
  } catch (err) {
    console.error("[MERCI Payment Webhook Error]:", err);
    return Response.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
