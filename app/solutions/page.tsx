"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const data: Record<string, string[]> = {
  "Salon & Beauty": [
    "Bookings",
    "Service questions",
    "Lead capture",
  ],
  Restaurant: [
    "Menu questions",
    "Reservations",
    "Promotions",
  ],
  Clinic: [
    "Appointment requests",
    "Service information",
    "Human escalation",
  ],
  Education: [
    "Course enquiries",
    "Lead qualification",
    "Follow-ups",
  ],
  "Real Estate": [
    "Property enquiries",
    "Lead qualification",
    "Viewing requests",
  ],
  Travel: [
    "Trip enquiries",
    "Package questions",
    "Follow-ups",
  ],
  "E-commerce": [
    "Product questions",
    "Order intent",
    "Upsell flows",
  ],
  "Home Services": [
    "Service requests",
    "Quotes",
    "Scheduling",
  ],
  Fitness: [
    "Membership questions",
    "Trial leads",
    "Follow-ups",
  ],
  "Professional Services": [
    "Enquiries",
    "Qualification",
    "Appointments",
  ],
};

function SolutionsContent() {
  const searchParams = useSearchParams();

  const type =
    searchParams.get("type") || "Salon & Beauty";

  const list =
    data[type] || [
      "Customer replies",
      "Lead capture",
      "Follow-ups",
    ];

  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">
          Solutions
        </span>

        <h1
          className="h1"
          style={{
            fontSize: "clamp(48px,7vw,76px)",
          }}
        >
          AI that fits your business.
        </h1>

        <div className="grid4">
          {Object.keys(data).map((key) => (
            <Link
              className={
                "card " +
                (key === type ? "active" : "")
              }
              href={`/solutions?type=${encodeURIComponent(
                key
              )}`}
              key={key}
            >
              <h3>{key}</h3>

              <p>
                {data[key].join(" · ")}
              </p>
            </Link>
          ))}
        </div>

        <div
          className="banner"
          style={{ marginTop: 28 }}
        >
          <h2 className="h2">
            {type}
          </h2>

          <p className="lead">
            Your ClientEasily AI assistant can
            handle common customer questions,
            capture and qualify leads, help with
            bookings, follow up with customers,
            and hand conversations over to your
            team when needed.
          </p>

          <ul className="list">
            {list.map((item) => (
              <li key={item}>
                {item}
              </li>
            ))}
          </ul>

          <Link
            className="btn primary"
            href="/auth/signup"
          >
            Start Free
          </Link>
        </div>
      </div>
    </main>
  );
}

function SolutionsLoading() {
  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">
          Solutions
        </span>

        <h1
          className="h1"
          style={{
            fontSize: "clamp(48px,7vw,76px)",
          }}
        >
          AI that fits your business.
        </h1>

        <p className="lead">
          Loading solutions...
        </p>
      </div>
    </main>
  );
}

export default function Solutions() {
  return (
    <Suspense fallback={<SolutionsLoading />}>
      <SolutionsContent />
    </Suspense>
  );
}