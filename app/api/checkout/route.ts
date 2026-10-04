import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { createCheckout } from "@/lib/lemonsqueezy";

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authorization.replace("Bearer ", "");

    const decoded =
      await getAdminAuth().verifyIdToken(token);

    const userId = decoded.uid;

    const {
      type,
      plan = "starter",
      affiliate_ref,
    } = await req.json();

    if (
      type !== "setup" &&
      type !== "subscription"
    ) {
      return NextResponse.json(
        { error: "Invalid checkout type" },
        { status: 400 }
      );
    }

    if (
      type === "subscription" &&
      plan !== "starter" &&
      plan !== "pro"
    ) {
      return NextResponse.json(
        { error: "Invalid subscription plan" },
        { status: 400 }
      );
    }

    const db = getAdminDb();

    const snapshot = await db
      .collection("businesses")
      .where("owner_id", "==", userId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Business setup required" },
        { status: 400 }
      );
    }

    const businessDoc = snapshot.docs[0];

    const business =
      businessDoc.data() as any;

    let variant = 0;

    if (type === "setup") {
      variant = Number(
        process.env
          .LEMONSQUEEZY_SETUP_VARIANT_ID
      );
    } else {
      variant =
        plan === "pro"
          ? Number(
              process.env
                .LEMONSQUEEZY_PRO_VARIANT_ID
            )
          : Number(
              process.env
                .LEMONSQUEEZY_STARTER_VARIANT_ID
            );
    }

    if (!variant) {
      return NextResponse.json(
        {
          error:
            "Lemon Squeezy variant is not configured.",
        },
        { status: 500 }
      );
    }

    if (
      type === "subscription" &&
      !business.setup_paid
    ) {
      return NextResponse.json(
        {
          error:
            "Please pay the $99 setup fee first.",
        },
        { status: 400 }
      );
    }

    if (
      type === "subscription" &&
      business.setup_status !== "complete"
    ) {
      return NextResponse.json(
        {
          error:
            "Your setup must be completed before subscription activation.",
        },
        { status: 400 }
      );
    }

    const checkoutUrl =
      await createCheckout(
        variant,
        {
          user_id: userId,
          business_id: businessDoc.id,
          purchase_type: type,
          plan:
            type === "subscription"
              ? String(plan)
              : "setup",
        },
        decoded.email || undefined,
        decoded.name || undefined
      );

    let finalCheckoutUrl =
      checkoutUrl;

    if (
      typeof affiliate_ref === "string" &&
      affiliate_ref.trim()
    ) {
      const url =
        new URL(checkoutUrl);

      url.searchParams.set(
        "aff_ref",
        affiliate_ref.trim()
      );

      finalCheckoutUrl =
        url.toString();
    }

    return NextResponse.json({
      url: finalCheckoutUrl,
    });
  } catch (error: any) {
    console.error(
      "Checkout error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Checkout could not be created.",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest
) {
  return NextResponse.redirect(
    new URL("/dashboard", req.url)
  );
}