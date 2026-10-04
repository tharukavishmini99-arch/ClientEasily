import Link from "next/link";

export default function Creators() {
  return (
    <main className="section">
      <div className="container">
        <div className="sectionHead">
          <span className="eyebrow">Creator Program</span>

          <h1
            className="h1"
            style={{ fontSize: "clamp(48px,7vw,76px)" }}
          >
            Build recurring income by referring real businesses.
          </h1>

          <p className="lead">
            Earn 20% lifetime recurring commission on eligible subscription
            revenue from businesses you refer.
          </p>
        </div>

        <div className="grid3">
          <div className="card">
            <div className="icon">20%</div>
            <h3>Recurring commission</h3>
            <p>
              Commission is calculated on eligible $79/$129 subscription
              revenue.
            </p>
          </div>

          <div className="card">
            <div className="icon">01</div>
            <h3>$99 setup fee excluded</h3>
            <p>The one-time setup fee is not commissionable.</p>
          </div>

          <div className="card">
            <div className="icon">∞</div>
            <h3>Track everything</h3>
            <p>
              Use your creator dashboard to see referrals, commissions and
              payout status.
            </p>
          </div>
        </div>

        <div className="banner" style={{ marginTop: 28 }}>
          <span className="eyebrow">Join ClientEasily</span>

          <h2 className="h2">Creator account</h2>

          <p className="muted">
            Create a creator account to get your referral link, or log in to
            manage your existing creator account.
          </p>

          <div className="actions">
            <Link
              className="btn primary"
              href="/auth/signup/creator"
            >
              Create Creator Account
            </Link>

            <Link
              className="btn secondary"
              href="/auth/login/creator"
            >
              Creator Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}