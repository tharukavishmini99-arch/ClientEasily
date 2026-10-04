"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";

export default function CheckoutButton({
  type,
  plan,
  children,
  className = "btn primary",
}: {
  type: "setup" | "subscription";
  plan?: "starter" | "pro";
  children: React.ReactNode;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);

  async function checkout() {
    setBusy(true);

    try {
      const token =
        await auth.currentUser?.getIdToken();

      if (!token) {
        window.location.href = "/auth/login";
        return;
      }

      let affiliateRef = "";

      try {
        const lemon =
          (window as any).LemonSqueezy;

        affiliateRef =
          lemon?.Affiliate?.GetId?.() || "";
      } catch {
        affiliateRef = "";
      }

      const response = await fetch(
        "/api/checkout",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type":
              "application/json",
          },
          body: JSON.stringify({
            type,
            plan,
            affiliate_ref:
              affiliateRef || null,
          }),
        }
      );

      const json =
        await response.json();

      if (!response.ok) {
        alert(
          json.error ||
            "Checkout could not be created."
        );
        return;
      }

      window.location.href = json.url;
    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      alert(
        "Checkout could not be created."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={checkout}
      disabled={busy}
    >
      {busy
        ? "Opening checkout…"
        : children}
    </button>
  );
}