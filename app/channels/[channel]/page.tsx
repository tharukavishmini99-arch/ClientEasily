import Link from "next/link";
import { notFound } from "next/navigation";

const data: Record<string, { name: string; title: string; text: string; points: string[] }> = {
  whatsapp: {
    name: "WhatsApp",
    title: "AI replies for WhatsApp conversations.",
    text: "Give customers fast, accurate answers while your team keeps control of the conversations that need a human.",
    points: ["Customer questions", "Lead capture", "Buying intent", "Human handover"],
  },
  instagram: {
    name: "Instagram DMs",
    title: "Turn Instagram conversations into sales opportunities.",
    text: "Keep up with incoming DMs, answer approved business questions and capture warm prospects.",
    points: ["DM replies", "Product/service questions", "Lead qualification", "Follow-ups"],
  },
  messenger: {
    name: "Facebook Messenger",
    title: "Keep Messenger conversations moving.",
    text: "Use your business knowledge to handle common questions and route qualified opportunities to your team.",
    points: ["FAQ replies", "Lead capture", "Conversation routing", "Human handover"],
  },
  "web-chat": {
    name: "Website Chat",
    title: "Turn website visitors into conversations.",
    text: "Give visitors an always-on way to ask questions, learn about your offer and become qualified leads.",
    points: ["Visitor questions", "Service information", "Lead capture", "Sales handover"],
  },
};

export function generateStaticParams() {
  return Object.keys(data).map((channel) => ({ channel }));
}

export default async function ChannelPage({ params }: { params: Promise<{ channel: string }> }) {
  const { channel } = await params;
  const item = data[channel];
  if (!item) notFound();

  return (
    <main className="section lightSection">
      <div className="container">
        <span className="eyebrow purpleEyebrow">{item.name}</span>
        <h1 className="h1" style={{ color: "#10152f", fontSize: "clamp(48px,7vw,76px)" }}>
          {item.title}
        </h1>
        <p className="lead muted" style={{ maxWidth: 760 }}>{item.text}</p>

        <div className="grid4" style={{ marginTop: 35 }}>
          {item.points.map((point, index) => (
            <div className="card" key={point}>
              <div className="icon">{String(index + 1).padStart(2, "0")}</div>
              <h3>{point}</h3>
              <p>Use the same business knowledge and AI rules across your customer workflow.</p>
            </div>
          ))}
        </div>

        <div className="banner" style={{ marginTop: 30 }}>
          <h2 className="h2" style={{ color: "#10152f" }}>Ready to build your customer reply workflow?</h2>
          <p className="muted">Start with your business information and configure the assistant for your workflow.</p>
          <Link className="btn primary" href="/auth/signup">Start Free →</Link>
        </div>
      </div>
    </main>
  );
}
