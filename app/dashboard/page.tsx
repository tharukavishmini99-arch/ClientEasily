"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import OnboardingForm from "@/components/OnboardingForm";
import AiTester from "@/components/AiTester";
import CheckoutButton from "@/components/CheckoutButton";
import SignOutButton from "@/components/SignOutButton";

type Business = any;
type Payment = any;
type Knowledge = any;

const tabs = [
  ["overview", "Overview"],
  ["conversations", "Conversations"],
  ["leads", "Leads"],
  ["customers", "Customers"],
  ["sales", "Sales Pipeline"],
  ["bookings", "Bookings"],
  ["knowledge", "Knowledge Base"],
  ["ai", "AI Assistant"],
  ["followups", "Follow-ups"],
  ["analytics", "Analytics"],
  ["team", "Team"],
  ["integrations", "Integrations"],
  ["billing", "Billing"],
  ["settings", "Settings"],
];

function DashboardContent() {
  const params = useSearchParams();
  const activeTab = params.get("tab") || "overview";
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [business, setBusiness] = useState<Business | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [knowledge, setKnowledge] = useState<Knowledge[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      setUserEmail(user.email || "");

      try {
        const businessSnap = await getDocs(
          query(
            collection(db, "businesses"),
            where("owner_id", "==", user.uid),
            limit(1)
          )
        );

        if (!businessSnap.empty) {
          const businessDoc = businessSnap.docs[0];
          setBusiness({ id: businessDoc.id, ...businessDoc.data() });

          const loadBusinessCollection = async (name: string) => {
            try {
              return await getDocs(
                query(
                  collection(db, name),
                  where("business_id", "==", businessDoc.id)
                )
              );
            } catch {
              return null;
            }
          };

          const [
            paymentSnap,
            knowledgeSnap,
            conversationSnap,
            leadSnap,
            customerSnap,
            followUpSnap,
            bookingSnap,
          ] = await Promise.all([
            getDocs(
              query(
                collection(db, "payments"),
                where("user_id", "==", user.uid)
              )
            ),
            getDocs(
              query(
                collection(db, "knowledge_items"),
                where("business_id", "==", businessDoc.id)
              )
            ),
            loadBusinessCollection("conversations"),
            loadBusinessCollection("leads"),
            loadBusinessCollection("customers"),
            loadBusinessCollection("follow_ups"),
            loadBusinessCollection("bookings"),
          ]);

          const payRows = paymentSnap.docs
            .map((x) => ({ id: x.id, ...x.data() }))
            .sort(
              (a: any, b: any) =>
                String(b.created_at || "").localeCompare(
                  String(a.created_at || "")
                )
            )
            .slice(0, 10);

          setPayments(payRows);
          setKnowledge(
            knowledgeSnap.docs.map((x) => ({ id: x.id, ...x.data() }))
          );

          const rows = (snap: any) =>
            snap ? snap.docs.map((x: any) => ({ id: x.id, ...x.data() })) : [];

          setConversations(rows(conversationSnap));
          setLeads(rows(leadSnap));
          setCustomers(rows(customerSnap));
          setFollowUps(rows(followUpSnap));
          setBookings(rows(bookingSnap));
        }
      } catch (err: any) {
        setError(err?.message || "Could not load your dashboard.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const setupPaid = business?.setup_paid === true;
  const setupComplete = business?.setup_status === "complete";
  const subActive = business?.subscription_status === "active";

  if (loading) {
    return (
      <main className="center">
        <div className="loadingPulse">Loading your workspace…</div>
      </main>
    );
  }

  if (!auth.currentUser) {
    return (
      <main className="center">
        <div className="authBox">
          <span className="eyebrow">ClientEasily</span>
          <h1>Please log in</h1>
          <p className="muted">Sign in to access your business workspace.</p>
          <Link className="btn primary" href="/auth/login">
            Log in
          </Link>
        </div>
      </main>
    );
  }

  if (!business) {
    return (
      <main className="section">
        <div className="container onboardingShell">
          <span className="eyebrow">Business setup</span>
          <h1 className="h2">Teach ClientEasily how your business works.</h1>
          <p className="lead">
            Add your services, FAQs, policies and instructions so the assistant
            can reply accurately across your customer channels.
          </p>
          <OnboardingForm />
        </div>
      </main>
    );
  }

  return (
    <>
      <nav className="nav">
        <div className="container navin">
          <Link className="logo" href="/">
            <span className="logoMark">C</span>
            ClientEasily
          </Link>
          <div className="links">
            <Link href="/features">Product</Link>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/integrations">Integrations</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/creators">Creators</Link>
            <Link className="btn secondary" href="/dashboard">Dashboard</Link>
          </div>
        </div>
      </nav>

      <main className="dashboard">
      <aside className="side dashboardSide">
        <div className="sideBrand">
          <span className="brandMark">C</span>
          <div>
            <b>ClientEasily</b>
            <small>AI workspace</small>
          </div>
        </div>

        <div className="sideNav">
          {tabs.map(([id, label]) => (
            <Link
              key={id}
              href={`/dashboard?tab=${id}`}
              className={activeTab === id ? "active" : ""}
            >
              <span className="sideDot" />
              {label}
            </Link>
          ))}
        </div>

        <div className="sideBottom">
          <div className="sideUser">
            <div className="avatar">
              {(business.name || "F").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <b>{business.name}</b>
              <small>{userEmail}</small>
            </div>
          </div>
          <SignOutButton />
        </div>
      </aside>

      <section className="dashmain">
        <div className="dashTop">
          <div>
            <span className="eyebrow">Business dashboard</span>
            <h1>{business.name}</h1>
            <p className="muted">
              {business.category} {business.location ? `· ${business.location}` : ""}
            </p>
          </div>
          <div className={`status ${subActive ? "statusOn" : "statusOff"}`}>
            <span />
            {subActive ? "AI Active" : "AI Locked"}
          </div>
        </div>

        {error && <div className="error" style={{ marginBottom: 20 }}>{error}</div>}

        {activeTab === "overview" && (
          <Overview
            business={business}
            setupPaid={setupPaid}
            setupComplete={setupComplete}
            subActive={subActive}
            payments={payments}
            conversations={conversations}
            leads={leads}
            followUps={followUps}
            bookings={bookings}
          />
        )}

        {activeTab === "knowledge" && (
          <KnowledgeTab
            business={business}
            items={knowledge}
            onChange={setKnowledge}
          />
        )}

        {activeTab === "ai" && (
          <div className="dashSection">
            <div className="sectionHead">
              <span className="eyebrow">AI Assistant</span>
              <h2 className="h2">Test the assistant before going live.</h2>
              <p className="muted">
                The live API only answers after subscription activation and uses
                your Firestore knowledge base.
              </p>
            </div>
            <AiTester />
          </div>
        )}

        {activeTab === "billing" && (
          <BillingTab
            business={business}
            payments={payments}
            setupPaid={setupPaid}
            setupComplete={setupComplete}
            subActive={subActive}
          />
        )}

        {activeTab === "conversations" && (
          <DataListTab title="Conversations" description="Customer conversations saved in Firebase." items={conversations} empty="No conversations yet." />
        )}
        {activeTab === "leads" && (
          <DataListTab title="Leads" description="Leads captured from your connected sales channels." items={leads} empty="No leads yet." />
        )}
        {activeTab === "customers" && (
          <DataListTab title="Customers" description="Customer records created from your sales workflow." items={customers} empty="No customers yet." />
        )}
        {activeTab === "followups" && (
          <DataListTab title="Follow-ups" description="Follow-up tasks saved for this business." items={followUps} empty="No follow-ups yet." />
        )}
        {activeTab === "bookings" && (
          <DataListTab title="Bookings" description="Bookings and appointment records for this business." items={bookings} empty="No bookings yet." />
        )}
        {activeTab === "settings" && (
          <BusinessSettings business={business} onChange={setBusiness} />
        )}
        {["sales", "analytics", "team", "integrations"].includes(activeTab) && (
          <WorkspaceTab tab={activeTab} business={business} />
        )}
      </section>
    </main>
    </>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<main className="center"><div className="loadingPulse">Loading your workspace…</div></main>}>
      <DashboardContent />
    </Suspense>
  );
}

function Overview({
  business,
  setupPaid,
  setupComplete,
  subActive,
  payments,
  conversations,
  leads,
  followUps,
  bookings,
}: any) {
  const qualifiedLeads = leads.filter((lead: any) => {
    const status = String(lead.status || lead.stage || "").toLowerCase();
    return status === "qualified" || status === "booked" || status === "won";
  });

  const recentConversations = [...conversations]
    .sort((a: any, b: any) =>
      String(b.updated_at || b.created_at || "").localeCompare(
        String(a.updated_at || a.created_at || "")
      )
    )
    .slice(0, 4);
  return (
    <div className="dashSection">
      {!setupPaid && (
        <div className="notice setupNotice">
          <div>
            <b>Start your ClientEasily setup</b>
            <p>
              Pay the <strong>$99 one-time setup fee</strong> to begin the
              business configuration process.
            </p>
          </div>
          <CheckoutButton type="setup">Pay $99 setup fee</CheckoutButton>
        </div>
      )}

      {setupPaid && !setupComplete && (
        <div className="notice setupNotice">
          <div>
            <b>Setup payment received</b>
            <p>
              Your setup is pending. Your team can complete configuration from
              the admin workspace.
            </p>
          </div>
          <span className="pill">Setup pending</span>
        </div>
      )}

      {setupComplete && !subActive && (
        <div className="notice setupNotice">
          <div>
            <b>Your setup is complete</b>
            <p>
              Activate the monthly plan you selected for your AI workspace.
            </p>
          </div>
          <div className="actions" style={{ marginTop: 0 }}>
            <CheckoutButton type="subscription" plan="starter">
              Starter $79/mo
            </CheckoutButton>
            <CheckoutButton type="subscription" plan="pro" className="btn secondary">
              Pro $129/mo
            </CheckoutButton>
          </div>
        </div>
      )}

      <div className="statGrid">
        <div className="stat statAccent">
          <span>New conversations</span>
          <b>{conversations.length}</b>
          <small>Saved in Firebase</small>
        </div>
        <div className="stat">
          <span>New leads</span>
          <b>{leads.length}</b>
          <small>Saved in Firebase</small>
        </div>
        <div className="stat">
          <span>Qualified leads</span>
          <b>{qualifiedLeads.length}</b>
          <small>Qualified / booked / won</small>
        </div>
        <div className="stat">
          <span>Follow-ups</span>
          <b>{followUps.length}</b>
          <small>{bookings.length} bookings</small>
        </div>
      </div>

      <div className="dashboardGrid">
        <div className="card largeDashCard">
          <div className="cardTop">
            <div>
              <span className="eyebrow">Unified inbox</span>
              <h3>Customer conversations</h3>
            </div>
            <span className="muted">All channels</span>
          </div>
          <div className="inboxList">
            {recentConversations.length === 0 ? (
              <div className="notice">
                No conversations yet. Connected channel messages will appear here.
              </div>
            ) : (
              recentConversations.map((row: any) => (
                <div className="inboxRow" key={row.id}>
                  <span className="channelDot blue" />
                  <div className="inboxName">
                    <b>{row.customer_name || row.contact_name || row.name || row.customer_phone || "Customer"}</b>
                    <small>{row.channel || row.source || "Conversation"}</small>
                  </div>
                  <span className="pill">{row.status || row.stage || "Open"}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card largeDashCard">
          <span className="eyebrow">Business profile</span>
          <h3>{business.name}</h3>
          <div className="profileRows">
            <div><span>Category</span><b>{business.category}</b></div>
            <div><span>Location</span><b>{business.location || "Not set"}</b></div>
            <div><span>Plan</span><b>{business.selected_plan || "Awaiting activation"}</b></div>
            <div><span>AI status</span><b>{subActive ? "Live" : "Locked"}</b></div>
          </div>
          <Link className="btn secondary" href="/dashboard?tab=knowledge">
            Manage business knowledge
          </Link>
        </div>
      </div>

      <h2 className="dashTitle">Recent payments</h2>
      <PaymentTable payments={payments} />
    </div>
  );
}

function PaymentTable({ payments }: { payments: any[] }) {
  return (
    <div className="card tableCard">
      <table className="table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr><td colSpan={4} className="muted">No payments yet.</td></tr>
          ) : payments.map((p) => (
            <tr key={p.id}>
              <td>{p.type}</td>
              <td>${(Number(p.amount_cents || 0) / 100).toFixed(2)}</td>
              <td><span className="pill">{p.status}</span></td>
              <td>{p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KnowledgeTab({
  business,
  items,
  onChange,
}: {
  business: any;
  items: any[];
  onChange: (items: any[]) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    if (!title.trim() || !content.trim()) return;
    setBusy(true);
    setError("");

    try {
      const payload = {
        business_id: business.id,
        title: title.trim(),
        content: content.trim(),
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        await updateDoc(doc(db, "knowledge_items", editingId), payload);
        onChange(items.map((x) => x.id === editingId ? { ...x, ...payload } : x));
      } else {
        const created = await addDoc(collection(db, "knowledge_items"), {
          ...payload,
          created_at: new Date().toISOString(),
        });
        onChange([...items, { id: created.id, ...payload }]);
      }

      setTitle("");
      setContent("");
      setEditingId(null);
    } catch (err: any) {
      setError(err?.message || "Could not save knowledge.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    await deleteDoc(doc(db, "knowledge_items", id));
    onChange(items.filter((x) => x.id !== id));
  }

  function edit(item: any) {
    setEditingId(item.id);
    setTitle(item.title || "");
    setContent(item.content || "");
  }

  return (
    <div className="dashSection">
      <div className="sectionHead">
        <span className="eyebrow">Knowledge Base</span>
        <h2 className="h2">Give the AI one accurate source of truth.</h2>
        <p className="muted">
          Store services, prices, FAQs, policies and instructions. The AI is
          instructed not to invent information.
        </p>
      </div>

      <div className="knowledgeLayout">
        <div className="card">
          <h3>{editingId ? "Edit knowledge" : "Add knowledge"}</h3>
          <label className="label">
            Title
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="label">
            Content
            <textarea className="textarea" value={content} onChange={(e) => setContent(e.target.value)} />
          </label>
          {error && <div className="error">{error}</div>}
          <div className="actions">
            <button className="btn primary" onClick={save} disabled={busy}>
              {busy ? "Saving…" : editingId ? "Update" : "Add knowledge"}
            </button>
            {editingId && (
              <button className="btn secondary" onClick={() => { setEditingId(null); setTitle(""); setContent(""); }}>
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="knowledgeList">
          {items.length === 0 ? (
            <div className="card"><h3>No knowledge yet</h3><p className="muted">Add your services, FAQs and policies to train the assistant.</p></div>
          ) : items.map((item) => (
            <div className="card knowledgeItem" key={item.id}>
              <div>
                <span className="eyebrow">Business knowledge</span>
                <h3>{item.title}</h3>
                <p className="muted">{item.content}</p>
              </div>
              <div className="actions">
                <button className="btn secondary" onClick={() => edit(item)}>Edit</button>
                <button className="btn danger" onClick={() => remove(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BillingTab({
  business,
  payments,
  setupPaid,
  setupComplete,
  subActive,
}: any) {
  return (
    <div className="dashSection">
      <div className="sectionHead">
        <span className="eyebrow">Billing</span>
        <h2 className="h2">Simple billing, visible status.</h2>
        <p className="muted">
          Your one-time setup fee is separate from the recurring subscription.
        </p>
      </div>

      <div className="priceGrid">
        <div className="card">
          <span className="eyebrow">Setup</span>
          <h3>$99 one-time</h3>
          <p className="muted">Covers initial business and AI setup.</p>
          {!setupPaid && <CheckoutButton type="setup">Pay setup fee</CheckoutButton>}
          {setupPaid && <span className="pill">Paid</span>}
        </div>

        <div className="card pop">
          <span className="eyebrow">Subscription</span>
          <h3>{business.selected_plan === "pro" ? "$129" : "$79"}/month</h3>
          <p className="muted">
            {subActive ? "Your AI subscription is active." : setupComplete ? "Choose a monthly plan to activate AI." : "Available after setup is complete."}
          </p>
          {setupComplete && !subActive && (
            <div className="actions">
              <CheckoutButton type="subscription" plan="starter">Starter</CheckoutButton>
              <CheckoutButton type="subscription" plan="pro" className="btn secondary">Pro</CheckoutButton>
            </div>
          )}
          {subActive && <span className="pill">Active</span>}
        </div>
      </div>

      <div className="notice" style={{ marginTop: 20 }}>
        <b>Creator commission note:</b> The $99 setup fee is not commissionable.
      </div>

      <h2 className="dashTitle">Payment history</h2>
      <PaymentTable payments={payments} />
    </div>
  );
}

function DataListTab({
  title,
  description,
  items,
  empty,
}: {
  title: string;
  description: string;
  items: any[];
  empty: string;
}) {
  return (
    <div className="dashSection">
      <div className="sectionHead">
        <span className="eyebrow">{title}</span>
        <h2 className="h2">{description}</h2>
      </div>

      <div className="card tableCard">
        {items.length === 0 ? (
          <div className="notice">{empty}</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name / Contact</th>
                <th>Channel / Source</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.customer_name || item.contact_name || item.name || item.email || item.phone || "—"}</td>
                  <td>{item.channel || item.source || item.type || "—"}</td>
                  <td><span className="pill">{item.status || item.stage || "Active"}</span></td>
                  <td>{item.updated_at || item.created_at ? new Date(item.updated_at || item.created_at).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function BusinessSettings({
  business,
  onChange,
}: {
  business: any;
  onChange: (business: any) => void;
}) {
  const [form, setForm] = useState({
    name: business.name || "",
    category: business.category || "",
    location: business.location || "",
    website: business.website || "",
    phone: business.phone || "",
    hours: business.hours || "",
    products: business.products || "",
    faqs: business.faqs || "",
    policies: business.policies || "",
    instructions: business.ai_instructions || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  function change(field: string, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function saveBusiness() {
    if (!form.name.trim()) {
      setSaveError("Business name is required.");
      return;
    }

    setSaving(true);
    setMessage("");
    setSaveError("");

    try {
      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        location: form.location.trim(),
        website: form.website.trim() || null,
        phone: form.phone.trim() || null,
        hours: form.hours.trim() || null,
        products: form.products.trim() || null,
        faqs: form.faqs.trim() || null,
        policies: form.policies.trim() || null,
        ai_instructions: form.instructions.trim() || null,
        updated_at: new Date().toISOString(),
      };

      await updateDoc(doc(db, "businesses", business.id), payload);

      const knowledgeQuery = query(
        collection(db, "knowledge_items"),
        where("business_id", "==", business.id),
        limit(1)
      );
      const knowledgeSnap = await getDocs(knowledgeQuery);
      const knowledgeId = knowledgeSnap.empty
        ? doc(collection(db, "knowledge_items")).id
        : knowledgeSnap.docs[0].id;

      await setDoc(
        doc(db, "knowledge_items", knowledgeId),
        {
          business_id: business.id,
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

      onChange({ ...business, ...payload });
      setMessage("Business setup updated successfully.");
    } catch (err: any) {
      setSaveError(err?.message || "Could not save business settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dashSection">
      <div className="sectionHead">
        <span className="eyebrow">Business Settings</span>
        <h2 className="h2">Edit your business setup.</h2>
        <p className="muted">
          These fields use the same Firebase structure as your original onboarding form.
        </p>
      </div>

      <div className="knowledgeLayout">
        <div className="card">
          <h3>Business profile</h3>
          <label className="label">Business name<input className="input" value={form.name} onChange={(e) => change("name", e.target.value)} /></label>
          <label className="label">Business category<input className="input" value={form.category} onChange={(e) => change("category", e.target.value)} /></label>
          <label className="label">Location<input className="input" value={form.location} onChange={(e) => change("location", e.target.value)} /></label>
          <label className="label">Website<input className="input" value={form.website} onChange={(e) => change("website", e.target.value)} /></label>
          <label className="label">Phone / contact<input className="input" value={form.phone} onChange={(e) => change("phone", e.target.value)} /></label>
          <label className="label">Business hours<textarea className="textarea" value={form.hours} onChange={(e) => change("hours", e.target.value)} /></label>
        </div>

        <div className="card">
          <h3>AI knowledge & instructions</h3>
          <label className="label">Products / services<textarea className="textarea" value={form.products} onChange={(e) => change("products", e.target.value)} /></label>
          <label className="label">FAQs<textarea className="textarea" value={form.faqs} onChange={(e) => change("faqs", e.target.value)} /></label>
          <label className="label">Important policies<textarea className="textarea" value={form.policies} onChange={(e) => change("policies", e.target.value)} /></label>
          <label className="label">AI instructions<textarea className="textarea" value={form.instructions} onChange={(e) => change("instructions", e.target.value)} /></label>

          {saveError && <div className="error" style={{ marginTop: 14 }}>{saveError}</div>}
          {message && <div className="notice" style={{ marginTop: 14 }}>{message}</div>}

          <div className="actions">
            <button className="btn primary" onClick={saveBusiness} disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkspaceTab({ tab, business }: { tab: string; business: any }) {
  const content: Record<string, [string, string, string[]]> = {
    conversations: ["Unified inbox", "Bring customer messages from supported channels into one sales workflow.", ["WhatsApp", "Instagram DMs", "Facebook Messenger", "Website Chat"]],
    leads: ["Lead pipeline", "Capture contact details, buying intent and follow-up status from conversations.", ["New leads", "Qualified leads", "Contacted", "Converted"]],
    sales: ["Sales pipeline", "See where every opportunity sits from first contact to won customer.", ["New", "Qualified", "Booked", "Won / Lost"]],
    bookings: ["Bookings & appointments", "Keep appointment requests, scheduled bookings and follow-up actions visible in one place.", ["Requested", "Confirmed", "Upcoming", "Completed / Cancelled"]],
    customers: ["Customer hub", "Keep customer records organized as conversations turn into relationships.", ["Customer profiles", "Conversation history", "Tags", "Notes"]],
    followups: ["Follow-up automation", "Create rules for warm leads so promising conversations do not get forgotten.", ["First follow-up", "Reminder sequences", "Re-engagement", "Human handover"]],
    analytics: ["Sales analytics", "Track conversations, lead quality and conversion signals in one place.", ["Conversation volume", "Lead conversion", "Response speed", "Channel performance"]],
    settings: ["Workspace settings", "Manage business preferences, AI behavior and account configuration.", ["Business profile", "AI preferences", "Notifications", "Security"]],
    team: ["Team workspace", "Prepare roles and permissions for your sales and support team.", ["Owners", "Agents", "Permissions", "Activity"]],
    integrations: ["Channel integrations", "Connect the customer channels your business uses.", ["WhatsApp", "Instagram DMs", "Facebook Messenger", "SMS", "Email", "Website Chat", "Telegram"]],
  };

  const [title, description, items] = content[tab];

  return (
    <div className="dashSection">
      <div className="sectionHead">
        <span className="eyebrow">{title}</span>
        <h2 className="h2">{description}</h2>
        <p className="muted">
          {business.name} can keep this workspace connected to the same business
          knowledge and AI instructions.
        </p>
      </div>
      <div className="grid4">
        {items.map((item, index) => (
          <div className="card featureCard" key={item}>
            <div className="icon">{String(index + 1).padStart(2, "0")}</div>
            <h3>{item}</h3>
            {tab === "integrations" ? (
              <>
                <p className="muted">Not connected · API credentials required.</p>
                <Link
                  className="btn secondary"
                  href={
                    item === "WhatsApp"
                      ? "/integrations/whatsapp"
                      : item === "Website Chat"
                      ? "/channels/web-chat"
                      : item === "Instagram DMs"
                      ? "/channels/instagram"
                      : item === "Facebook Messenger"
                      ? "/channels/messenger"
                      : "/integrations"
                  }
                >
                  Connect
                </Link>
              </>
            ) : (
              <p className="muted">Ready for your connected workflow.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
