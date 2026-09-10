"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/inventory", label: "Inventory" },
];

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="border-b border-line bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="font-black text-lg">
            26c Admin
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`hover:text-accent transition-colors ${
                  pathname === l.href ? "text-accent" : "text-paper/70"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-paper/50 hidden sm:inline">{email}</span>
          <button onClick={logout} className="text-paper/70 hover:text-accent">
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
