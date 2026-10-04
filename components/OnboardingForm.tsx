"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

const cats = [
  "Salon & Beauty",
  "Restaurant",
  "Clinic",
  "Education",
  "Real Estate",
  "Travel",
  "E-commerce",
  "Home Services",
  "Fitness",
  "Professional Services",
  "Other",
];

type FormState = {
  name: string;
  category: string;
  location: string;
  website: string;
  phone: string;
  hours: string;
  products: string;
  faqs: string;
  policies: string;
  instructions: string;
};

export default function OnboardingForm({ businessId }: { businessId?: string }) {
  const [form, setForm] = useState<FormState>({
    name: "",
    category: "Salon & Beauty",
    location: "",
    website: "",
    phone: "",
    hours: "",
    products: "",
    faqs: "",
    policies: "",
    instructions: "",
  });
  const [refCode, setRefCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref =
      params.get("ref") ||
      localStorage.getItem("flowsell_ref") ||
      "";

    if (ref) {
      setRefCode(ref);
      localStorage.setItem("flowsell_ref", ref);
    }

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const q = query(
        collection(db, "businesses"),
        where("owner_id", "==", user.uid),
        limit(1)
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        const data = snap.docs[0].data() as Partial<FormState>;
        setForm((current) => ({ ...current, ...data }));
      }
    });

    return () => unsub();
  }, []);

  function upd(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Please log in again.");

      let referredByCreatorId: string | null = null;

      if (refCode) {
        const rr = await fetch("/api/referral/resolve", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ code: refCode }),
        });
        if (rr.ok) {
          const rj = await rr.json();
          referredByCreatorId = rj.id || null;
        }
      }

      let existingId = businessId;

      if (!existingId) {
        const existing = await getDocs(
          query(
            collection(db, "businesses"),
            where("owner_id", "==", user.uid),
            limit(1)
          )
        );
        if (!existing.empty) existingId = existing.docs[0].id;
      }

      const id = existingId || doc(collection(db, "businesses")).id;

      await setDoc(
        doc(db, "businesses", id),
        {
          owner_id: user.uid,
          name: form.name,
          category: form.category,
          location: form.location,
          website: form.website || null,
          phone: form.phone || null,
          hours: form.hours || null,
          products: form.products || null,
          faqs: form.faqs || null,
          policies: form.policies || null,
          ai_instructions: form.instructions || null,
          referred_by_creator_id: referredByCreatorId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { merge: true }
      );

      const knowledgeQuery = query(
        collection(db, "knowledge_items"),
        where("business_id", "==", id),
        limit(1)
      );
      const knowledgeSnap = await getDocs(knowledgeQuery);
      const knowledgeId = knowledgeSnap.empty
        ? doc(collection(db, "knowledge_items")).id
        : knowledgeSnap.docs[0].id;

      await setDoc(
        doc(db, "knowledge_items", knowledgeId),
        {
          business_id: id,
          title: "Core business knowledge",
          content:
            `Products/services:\n${form.products}\n\n` +
            `FAQs:\n${form.faqs}\n\n` +
            `Policies:\n${form.policies}\n\n` +
            `AI instructions:\n${form.instructions}`,
          updated_at: new Date().toISOString(),
          created_at: knowledgeSnap.empty
            ? new Date().toISOString()
            : knowledgeSnap.docs[0].data().created_at || new Date().toISOString(),
        },
        { merge: true }
      );

      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Could not save your business.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form" onSubmit={save}>
      <label className="label">
        Business name
        <input
          className="input"
          required
          value={form.name}
          onChange={(e) => upd("name", e.target.value)}
        />
      </label>

      <label className="label">
        Business category
        <select
          className="select"
          value={form.category}
          onChange={(e) => upd("category", e.target.value)}
        >
          {cats.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>

      <label className="label">
        Location
        <input
          className="input"
          value={form.location}
          onChange={(e) => upd("location", e.target.value)}
          placeholder="City / area"
        />
      </label>

      <label className="label">
        Website (optional)
        <input
          className="input"
          value={form.website}
          onChange={(e) => upd("website", e.target.value)}
        />
      </label>

      <label className="label">
        Phone / contact
        <input
          className="input"
          value={form.phone}
          onChange={(e) => upd("phone", e.target.value)}
        />
      </label>

      <label className="label">
        Business hours
        <textarea
          className="textarea"
          value={form.hours}
          onChange={(e) => upd("hours", e.target.value)}
          placeholder="Mon–Sat 9:00–18:00"
        />
      </label>

      <label className="label">
        Products / services
        <textarea
          className="textarea"
          required
          value={form.products}
          onChange={(e) => upd("products", e.target.value)}
        />
      </label>

      <label className="label">
        FAQs
        <textarea
          className="textarea"
          value={form.faqs}
          onChange={(e) => upd("faqs", e.target.value)}
        />
      </label>

      <label className="label">
        Important policies
        <textarea
          className="textarea"
          value={form.policies}
          onChange={(e) => upd("policies", e.target.value)}
        />
      </label>

      <label className="label">
        AI instructions
        <textarea
          className="textarea"
          value={form.instructions}
          onChange={(e) => upd("instructions", e.target.value)}
          placeholder="Tone, booking rules, escalation rules, etc."
        />
      </label>

      {error && <div className="error">{error}</div>}

      <button className="btn primary" disabled={busy}>
        {busy ? "Saving…" : "Save business & continue"}
      </button>
    </form>
  );
}
