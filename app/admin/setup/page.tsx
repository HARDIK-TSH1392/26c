"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSetupPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/setup")
      .then((r) => r.json())
      .then((d) => {
        if (!d.needsSetup) {
          router.replace("/admin/login");
        } else {
          setChecking(false);
        }
      });
  }, [router]);

  const submit = async () => {
    setError(null);
    if (!email || password.length < 8) {
      setError("Email and a password of at least 8 characters are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create admin");
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (checking) return null;

  return (
    <main className="min-h-screen bg-ink text-paper flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-bold mb-1">Set up admin account</h1>
        <p className="text-sm text-paper/60 mb-6">
          This runs once — creates the first (and only, for now) admin login.
        </p>
        <div className="space-y-3">
          <input
            className="w-full bg-transparent border border-paper/30 px-3 py-2.5 text-sm"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full bg-transparent border border-paper/30 px-3 py-2.5 text-sm"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full bg-transparent border border-paper/30 px-3 py-2.5 text-sm"
            placeholder="Password (min 8 characters)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-accent mt-3">{error}</p>}
        <button
          onClick={submit}
          disabled={loading}
          className="mt-6 w-full py-3 bg-paper text-ink text-sm font-bold uppercase tracking-wide disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create admin account"}
        </button>
      </div>
    </main>
  );
}
