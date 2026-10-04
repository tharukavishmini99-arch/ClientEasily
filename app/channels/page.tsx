import Link from "next/link";

const channels = [
  ["whatsapp", "WhatsApp", "Respond to customer messages, qualify leads and route conversations to your team."],
  ["instagram", "Instagram DMs", "Keep up with social conversations and turn interested followers into leads."],
  ["messenger", "Facebook Messenger", "Answer common questions and move conversations toward the next step."],
  ["web-chat", "Website Chat", "Engage visitors instantly with a business-trained assistant on your website."],
];

export default function Channels() {
  return (
    <main className="section lightSection">
      <div className="container">
        <span className="eyebrow purpleEyebrow">CHANNELS</span>
        <h1 className="h1" style={{ color: "#10152f", fontSize: "clamp(48px,7vw,76px)" }}>
          One AI assistant.<br />
          <span style={{ color: "#5146e5" }}>Every customer conversation.</span>
        </h1>
        <p className="lead muted">
          Explore the channel experiences ClientEasily is designed to support.
          Connect the channels your business actually uses and keep your
          business knowledge in one place.
        </p>

        <div className="channelGrid" style={{ marginTop: 36 }}>
          {channels.map(([slug, name, description]) => (
            <Link href={`/channels/${slug}`} className="channelCard" key={slug}>
              <div className={`channelIcon ${slug === "web-chat" ? "web" : slug === "whatsapp" ? "wa" : slug === "instagram" ? "ig" : "fb"}`}>
                {slug === "whatsapp" ? "◉" : slug === "instagram" ? "◎" : slug === "messenger" ? "f" : "⌁"}
              </div>
              <div><h3>{name}</h3><p>{description}</p></div>
              <span className="arrowCircle">→</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
