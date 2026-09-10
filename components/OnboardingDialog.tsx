"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function OnboardingDialog() {
  const { data: session, status, update } = useSession();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isWhatsApp, setIsWhatsApp] = useState(true);
  const [dob, setDob] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || session.user.onboarded) return;

    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setName(data.user?.name ?? session.user.name ?? "");
        if (data.user?.dob) {
          setDob(new Date(data.user.dob).toISOString().slice(0, 10));
        }
        setOpen(true);
      });
  }, [status, session]);

  if (!open) return null;

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim()) return setError("Please enter your name.");
    if (!/^[0-9]{10}$/.test(phone)) {
      return setError("Please enter a valid 10-digit phone number.");
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          isWhatsApp,
          dob: dob || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Could not save");
      }
      await update(); // refresh session so session.user.onboarded flips
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center px-4">
      <div className="bg-paper w-full max-w-md p-6">
        <h2 className="text-lg font-bold mb-1">Welcome to 26c 👋</h2>
        <p className="text-sm text-ink/60 mb-6">
          Just a couple of details so we can keep you posted on your orders.
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-ink/50">
              Name
            </label>
            <input
              className="w-full border border-line px-3 py-2.5 text-sm mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-ink/50">
              Phone number
            </label>
            <input
              className="w-full border border-line px-3 py-2.5 text-sm mt-1"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="10-digit mobile number"
              maxLength={10}
            />
            <label className="flex items-center gap-2 mt-2 text-xs text-ink/70">
              <input
                type="checkbox"
                checked={isWhatsApp}
                onChange={(e) => setIsWhatsApp(e.target.checked)}
              />
              This is my WhatsApp number
            </label>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-ink/50">
              Date of birth{" "}
              <span className="normal-case text-ink/40">(optional)</span>
            </label>
            <input
              type="date"
              className="w-full border border-line px-3 py-2.5 text-sm mt-1"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="text-sm text-accent mt-3">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="mt-6 w-full py-3.5 bg-ink text-paper text-sm font-bold uppercase tracking-wide hover:bg-accent transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Continue"}
        </button>
      </div>
    </div>
  );
}
