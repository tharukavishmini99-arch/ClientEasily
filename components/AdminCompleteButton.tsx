"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";

export default function AdminCompleteButton({
  businessId,
}: {
  businessId: string;
}) {
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/setup/complete", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ businessId }),
      });

      if (response.ok) location.reload();
      else alert((await response.json()).error || "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button className="btn primary" onClick={go} disabled={busy}>
      {busy ? "Saving…" : "Complete setup"}
    </button>
  );
}
