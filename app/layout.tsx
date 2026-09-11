import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { GreenLeavesProvider } from "@/lib/green-leaves-context";
import AuthProvider from "@/components/AuthProvider";
import SiteChrome from "@/components/SiteChrome";
import PostHogProvider from "@/components/PostHogProvider";
import PostHogIdentify from "@/components/PostHogIdentify";

const SITE_URL = "https://26c.in";
const SITE_NAME = "26c";
const SITE_DESCRIPTION =
  "26c is a graphic tee label. Hand-drawn prints, oversized fits, 100% cotton, printed in small batches.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "26c — Graphic Tees",
    template: "%s — 26c",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "graphic tees",
    "oversized t-shirts",
    "streetwear India",
    "hand-drawn print tees",
    "26c",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "26c — Graphic Tees",
    description: SITE_DESCRIPTION,
    images: [{ url: "/opengraph-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "26c — Graphic Tees",
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "26c",
      legalName: "NH Tech Private Limited",
      url: SITE_URL,
      logo: `${SITE_URL}/logo/26c-logo-color2-large.webp`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PostHogProvider>
          <AuthProvider>
            <PostHogIdentify />
            <GreenLeavesProvider>
              <CartProvider>
                <SiteChrome>{children}</SiteChrome>
              </CartProvider>
            </GreenLeavesProvider>
          </AuthProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
