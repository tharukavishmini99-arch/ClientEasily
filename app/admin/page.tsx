"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import AdminCompleteButton from "@/components/AdminCompleteButton";

export default function Admin() {
  const [allowed, setAllowed] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setLoading(false);
        return;
      }

      setAllowed(true);
      const snapshot = await getDocs(
        query(collection(db, "businesses"), orderBy("created_at", "desc"))
      );
      setBusinesses(snapshot.docs.map((x) => ({ id: x.id, ...x.data() })));
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <main className="center"><div className="loadingPulse">Loading admin…</div></main>;
  if (!allowed) return <main className="center"><div className="authBox"><h1>Admin access only</h1></div></main>;

  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Admin</span>
        <h1 className="h1" style={{ fontSize: "clamp(44px,6vw,68px)" }}>Setup operations.</h1>
        <p className="muted">Mark a paid business setup as complete when your team has finished configuration.</p>

        <div className="card tableCard" style={{ marginTop: 24 }}>
          <table className="table">
            <thead><tr><th>Business</th><th>Setup</th><th>Plan</th><th>Action</th></tr></thead>
            <tbody>
              {businesses.map((b) => (
                <tr key={b.id}>
                  <td>{b.name}</td>
                  <td>{b.setup_status}</td>
                  <td>{b.selected_plan || "—"}</td>
                  <td>{b.setup_paid && b.setup_status !== "complete" ? <AdminCompleteButton businessId={b.id} /> : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
