"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

export default function AccountMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === "loading") {
    return <div className="w-6 h-6" />;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("google")}
        className="text-sm font-medium uppercase tracking-wide hover:text-accent transition-colors"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-7 h-7 rounded-full overflow-hidden border border-line shrink-0"
        aria-label="Account menu"
      >
        {session.user.image ? (
          <Image src={session.user.image} alt="" fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-ink text-paper text-xs flex items-center justify-center">
            {session.user.name?.[0] ?? "U"}
          </div>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-44 bg-paper border border-line z-50 text-sm">
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 hover:bg-line/40"
            >
              Profile
            </Link>
            <Link
              href="/account/orders"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 hover:bg-line/40"
            >
              My Orders
            </Link>
            <button
              onClick={() => signOut()}
              className="block w-full text-left px-4 py-2.5 hover:bg-line/40 text-accent"
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
