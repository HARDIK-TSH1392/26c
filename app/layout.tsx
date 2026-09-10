import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import AuthProvider from "@/components/AuthProvider";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "26c — Graphic Tees",
  description:
    "26c is a graphic tee label. Hand-drawn prints, oversized fits, 100% cotton.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          <CartProvider>
            <SiteChrome>{children}</SiteChrome>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
