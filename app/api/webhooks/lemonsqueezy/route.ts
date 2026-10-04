import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getAdminDb } from "@/lib/firebase-admin";
import { commissionForSubscription } from "@/lib/commission";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("LEMONSQUEEZY_WEBHOOK_SECRET is not configured.");
      return new NextResponse("Webhook secret not configured", {
        status: 500,
      });
    }

    const raw = await req.text();
    const signature = req.headers.get("x-signature") || "";

    const expected = crypto
      .createHmac("sha256", secret)
      .update(raw)
      .digest("hex");

    if (
      !signature ||
      signature.length !== expected.length ||
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expected)
      )
    ) {
      return new NextResponse("Invalid signature", {
        status: 401,
      });
    }

    const body = JSON.parse(raw);

    const event =
      req.headers.get("x-event-name") ||
      body?.meta?.event_name ||
      "unknown";

    const attrs = body?.data?.attributes || {};
    const custom = body?.meta?.custom_data || {};

    const userId = String(custom.user_id || "");
    const businessId = String(custom.business_id || "");
    const purchaseType = String(custom.purchase_type || "");
    const plan = String(custom.plan || "");

    const providerId = String(body?.data?.id || "");

    const db = getAdminDb();

    // Prevent the same webhook from being processed twice.
    const eventKey = `${event}_${providerId}`;

    const eventRef = db
      .collection("webhook_events")
      .doc(eventKey);

    const existingEvent = await eventRef.get();

    if (existingEvent.exists) {
      return NextResponse.json({
        received: true,
        duplicate: true,
      });
    }

    await eventRef.set({
      event_name: event,
      provider_id: providerId,
      payload: body,
      created_at: new Date().toISOString(),
    });

    /*
     * --------------------------------------------------
     * $99 ONE-TIME SETUP PAYMENT
     * --------------------------------------------------
     */

    if (
      event === "order_created" &&
      purchaseType === "setup" &&
      userId &&
      businessId
    ) {
      const amountCents = Number(
        attrs.total ?? attrs.subtotal ?? 0
      );

      const paymentRef = db
        .collection("payments")
        .doc(`order_${providerId}`);

      await paymentRef.set(
        {
          user_id: userId,
          business_id: businessId,

          type: "setup",

          amount_cents: amountCents,
          currency: attrs.currency || "USD",

          status: "paid",
          provider: "lemon_squeezy",

          provider_order_id: providerId,

          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { merge: true }
      );

      await db
        .collection("businesses")
        .doc(businessId)
        .update({
          setup_paid: true,
          setup_status: "pending",
          updated_at: new Date().toISOString(),
        });
    }

    /*
     * --------------------------------------------------
     * NEW SUBSCRIPTION
     * --------------------------------------------------
     */

    if (
      event === "subscription_created" &&
      purchaseType === "subscription" &&
      userId &&
      businessId
    ) {
      const subscriptionId = providerId;

      await db
        .collection("businesses")
        .doc(businessId)
        .update({
          selected_plan:
            plan === "pro" ? "pro" : "starter",

          subscription_id: subscriptionId,

          subscription_status:
            attrs.status || "active",

          lemon_customer_id: attrs.customer_id
            ? String(attrs.customer_id)
            : null,

          lemon_variant_id: attrs.variant_id
            ? String(attrs.variant_id)
            : null,

          subscription_renews_at:
            attrs.renews_at || null,

          subscription_ends_at:
            attrs.ends_at || null,

          updated_at: new Date().toISOString(),
        });
    }

    /*
     * --------------------------------------------------
     * SUBSCRIPTION PAYMENT
     * Initial payment + renewals
     * --------------------------------------------------
     */

    if (
      event === "subscription_payment_success" &&
      userId &&
      businessId
    ) {
      const subscriptionId = attrs.subscription_id
        ? String(attrs.subscription_id)
        : "";

      const amountCents = Number(
        attrs.total ?? attrs.subtotal ?? 0
      );

      const invoiceId = providerId;

      const paymentRef = db
        .collection("payments")
        .doc(`subscription_invoice_${invoiceId}`);

      const oldPayment = await paymentRef.get();

      if (!oldPayment.exists) {
        await paymentRef.set({
          user_id: userId,
          business_id: businessId,

          type: "subscription",
          plan:
            plan === "pro" ? "pro" : "starter",

          amount_cents: amountCents,
          currency: attrs.currency || "USD",

          status: "paid",
          provider: "lemon_squeezy",

          provider_invoice_id: invoiceId,
          subscription_id: subscriptionId || null,

          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        /*
         * Creator commission
         * Setup fee is NOT included.
         */

        const businessDoc = await db
          .collection("businesses")
          .doc(businessId)
          .get();

        const creatorId =
          businessDoc.data()?.referred_by_creator_id;

        if (creatorId && amountCents > 0) {
          const commission =
            commissionForSubscription(amountCents);

          await db
            .collection("commissions")
            .doc(`subscription_${invoiceId}`)
            .set({
              creator_id: creatorId,
              business_id: businessId,

              payment_id: paymentRef.id,

              amount_cents: commission,

              status: "pending",
              source: "subscription",

              provider_invoice_id: invoiceId,

              created_at:
                new Date().toISOString(),
            });
        }
      }
    }

    /*
     * --------------------------------------------------
     * SUBSCRIPTION STATUS CHANGES
     * --------------------------------------------------
     */

    if (
      event === "subscription_created" ||
      event === "subscription_updated" ||
      event === "subscription_cancelled" ||
      event === "subscription_resumed" ||
      event === "subscription_expired" ||
      event === "subscription_paused" ||
      event === "subscription_unpaused"
    ) {
      const subscriptionId = providerId;

      if (subscriptionId) {
        let businessSnapshot;

        if (businessId) {
          const directBusiness = await db
            .collection("businesses")
            .doc(businessId)
            .get();

          businessSnapshot = directBusiness.exists
            ? directBusiness
            : null;
        } else {
          businessSnapshot = null;
        }

        if (businessSnapshot) {
          await businessSnapshot.ref.update({
            subscription_id: subscriptionId,

            subscription_status:
              attrs.status || "unknown",

            subscription_renews_at:
              attrs.renews_at || null,

            subscription_ends_at:
              attrs.ends_at || null,

            updated_at:
              new Date().toISOString(),
          });
        } else {
          const snapshot = await db
            .collection("businesses")
            .where(
              "subscription_id",
              "==",
              subscriptionId
            )
            .limit(1)
            .get();

          if (!snapshot.empty) {
            await snapshot.docs[0].ref.update({
              subscription_status:
                attrs.status || "unknown",

              subscription_renews_at:
                attrs.renews_at || null,

              subscription_ends_at:
                attrs.ends_at || null,

              updated_at:
                new Date().toISOString(),
            });
          }
        }
      }
    }

    /*
     * --------------------------------------------------
     * REFUND
     * --------------------------------------------------
     */

    if (event === "order_refunded") {
      const orderId = providerId;

      const snapshot = await db
        .collection("payments")
        .where(
          "provider_order_id",
          "==",
          orderId
        )
        .get();

      if (!snapshot.empty) {
        const batch = db.batch();

        snapshot.docs.forEach((payment) => {
          batch.update(payment.ref, {
            status: "refunded",
            updated_at:
              new Date().toISOString(),
          });
        });

        await batch.commit();
      }
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error: any) {
    console.error(
      "Lemon Squeezy webhook error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Webhook processing failed.",
      },
      { status: 500 }
    );
  }
}