import "./globals.css";
import Script from "next/script";
import SiteChrome from "@/components/SiteChrome";

export const metadata = {
  title: "ClientEasily — AI Sales Assistant",
  description:
    "Turn customer conversations into qualified leads, bookings and sales with a business-trained AI sales assistant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Script
          id="lemon-squeezy-affiliate-config"
          strategy="beforeInteractive"
        >
          {`
            window.lemonSqueezyAffiliateConfig = {
              store: "clienteasily"
            };
          `}
        </Script>

        <Script
          src="https://lmsqueezy.com/affiliate.js"
          strategy="afterInteractive"
        />

        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}