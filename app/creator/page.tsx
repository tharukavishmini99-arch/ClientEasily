"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import SignOutButton from "@/components/SignOutButton";

export default function Creator() {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [creator, setCreator] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const profileSnap = await getDocs(
          query(collection(db, "profiles"), where("id", "==", user.uid), limit(1))
        );
        const profile = profileSnap.empty ? null : profileSnap.docs[0].data();

        if (profile?.role !== "creator") {
          setLoading(false);
          return;
        }

        const creatorSnap = await getDocs(
          query(collection(db, "creators"), where("user_id", "==", user.uid), limit(1))
        );

        if (creatorSnap.empty) {
          setLoading(false);
          return;
        }

        const creatorData = {
          id: creatorSnap.docs[0].id,
          ...creatorSnap.docs[0].data(),
        };

        const commissions = await getDocs(
          query(
            collection(db, "commissions"),
            where("creator_id", "==", creatorData.id)
          )
        );

        setCreator(creatorData);
        setRows(
          commissions.docs
            .map((x) => ({ id: x.id, ...x.data() }))
            .sort((a: any, b: any) =>
              String(b.created_at || "").localeCompare(String(a.created_at || ""))
            )
        );
        setAllowed(true);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) return <main className="center"><div className="loadingPulse">Loading creator dashboard…</div></main>;

  if (!auth.currentUser) {
    return <main className="center"><div className="authBox"><h1>Creator login required</h1><Link className="btn primary" href="/auth/login">Log in</Link></div></main>;
  }

  if (!allowed) {
    return <main className="center"><div className="authBox"><h1>Creator account required</h1><p className="muted">Use the Creator signup flow to access creator earnings.</p><Link className="btn primary" href="/creators">Join Creator Program</Link></div></main>;
  }

  const total = rows.reduce((sum, row) => sum + Number(row.amount_cents || 0), 0);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "");

  return (
    <main className="dashboard">
      <aside className="side dashboardSide">
        <div className="sideBrand"><span className="brandMark">F</span><div><b>ClientEasily</b><small>Creator workspace</small></div></div>
        <div className="sideNav">
          <Link className="active" href="/creator"><span className="sideDot" />Overview</Link>
          <Link href="/creators"><span className="sideDot" />Program</Link>
        </div>
        <div className="sideBottom"><SignOutButton /></div>
      </aside>

      <section className="dashmain">
        <span className="eyebrow">Creator dashboard</span>
        <h1>Track your recurring earnings.</h1>
        <p className="muted">20% eligible recurring subscription commission. The $99 one-time setup fee is never commissionable.</p>

        <div className="statGrid">
          <div className="stat statAccent"><span>Total commission</span><b>${(total / 100).toFixed(2)}</b><small>Lifetime recorded</small></div>
          <div className="stat"><span>Rate</span><b>20%</b><small>Eligible recurring revenue</small></div>
          <div className="stat"><span>Commission records</span><b>{rows.length}</b><small>Recorded in Firestore</small></div>
          <div className="stat"><span>Status</span><b>{creator?.status || "active"}</b><small>Creator account</small></div>
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <h3>Your referral link</h3>
          <p className="muted">Share this link with businesses:</p>
          <div className="notice">{appUrl}/auth/signup?ref={creator?.referral_code}</div>
        </div>

        <h2 className="dashTitle">Commission history</h2>
        <div className="card tableCard">
          <table className="table">
            <thead><tr><th>Business</th><th>Amount</th><th>Source</th><th>Status</th></tr></thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={4} className="muted">No commissions yet.</td></tr>
              ) : rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.business_id}</td>
                  <td>${(Number(row.amount_cents || 0) / 100).toFixed(2)}</td>
                  <td>{row.source}</td>
                  <td><span className="pill">{row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
