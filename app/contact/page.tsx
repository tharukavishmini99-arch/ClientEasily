"use client";

import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <main className="section lightSection">
      <div className="container">
        <span className="eyebrow purpleEyebrow">CONTACT</span>
        <h1 className="h1" style={{ color: "#10152f", fontSize: "clamp(48px,7vw,76px)" }}>
          Let&apos;s talk.
        </h1>
        <p className="lead muted">
          Have a question about setup, plans, channels or the Creator Program?
          Send a message and keep your question with your ClientEasily workspace.
        </p>

        <div className="card" style={{ maxWidth: 760, marginTop: 30 }}>
          {sent ? (
            <div className="notice">
              <b>Message ready.</b>
              <p style={{ margin: "6px 0 0" }}>
                Your message has been prepared. For production launch, connect
                this form to your support inbox or CRM.
              </p>
            </div>
          ) : (
            <form className="form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <label className="label">Name<input className="input" required /></label>
              <label className="label">Email<input className="input" type="email" required /></label>
              <label className="label">How can we help?<textarea className="textarea" required placeholder="Tell us what you need help with." /></label>
              <button className="btn primary">Send message</button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
