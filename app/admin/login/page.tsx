"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/setup")
      .then((r) => r.json())
      .then((d) => {
        if (d.needsSetup) router.replace("/admin/setup");
      });
  }, [router]);

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink text-paper flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-bold mb-1">26c Admin</h1>
        <p className="text-sm text-paper/60 mb-6">Sign in to manage orders.</p>
        <div className="space-y-3">
          <input
            className="w-full bg-transparent border border-paper/30 px-3 py-2.5 text-sm"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <input
            className="w-full bg-transparent border border-paper/30 px-3 py-2.5 text-sm"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        {error && <p className="text-sm text-accent mt-3">{error}</p>}
        <button
          onClick={submit}
          disabled={loading}
          className="mt-6 w-full py-3 bg-paper text-ink text-sm font-bold uppercase tracking-wide disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </div>
    </main>
  );
}
