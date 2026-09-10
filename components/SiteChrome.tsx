"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CartDrawer from "@/components/CartDrawer";
import OnboardingDialog from "@/components/OnboardingDialog";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
      <CartDrawer />
      <OnboardingDialog />
    </>
  );
}
