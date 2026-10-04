"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";

export default function AiTester() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);

  async function send() {
    if (!message) return;
    setBusy(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message, history: [] }),
      });
      const json = await response.json();
      setReply(json.reply || json.error || "No response");
    } catch {
      setReply("AI request failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h3>Test your AI</h3>
      <p className="muted">
        Send a real test message to your business-trained assistant.
      </p>
      <textarea
        className="textarea"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Do you have an appointment tomorrow?"
      />
      <button className="btn primary" onClick={send} disabled={busy}>
        {busy ? "Thinking…" : "Send test"}
      </button>
      {reply && (
        <div className="notice" style={{ marginTop: 14 }}>
          {reply}
        </div>
      )}
    </div>
  );
}
