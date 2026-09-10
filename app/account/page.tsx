"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";

type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

const EMPTY_ADDRESS = {
  label: "Home",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<{
    name: string | null;
    phone: string | null;
    isWhatsApp: boolean;
    dob: string | null;
  } | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(EMPTY_ADDRESS);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => setProfile(d.user));
    fetch("/api/addresses")
      .then((r) => r.json())
      .then((d) => setAddresses(d.addresses ?? []));
  }, [status]);

  if (status === "loading") return null;

  if (status !== "authenticated") {
    return (
      <main className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-xl font-bold mb-4">Sign in to view your profile</h1>
        <button
          onClick={() => signIn("google")}
          className="px-6 py-3 bg-ink text-paper text-sm font-bold uppercase tracking-wide"
        >
          Sign in with Google
        </button>
      </main>
    );
  }

  const addAddress = async () => {
    setError(null);
    const required = ["fullName", "phone", "line1", "city", "state", "pincode"] as const;
    const missing = required.filter((f) => !form[f].trim());
    if (missing.length > 0) {
      setError("Please fill in all required fields.");
      return;
    }
    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not save address");
      return;
    }
    setAddresses((prev) => [data.address, ...prev]);
    setForm(EMPTY_ADDRESS);
    setShowAddForm(false);
  };

  const setDefault = async (id: string) => {
    await fetch(`/api/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const removeAddress = async (id: string) => {
    await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="text-2xl font-bold mb-8">Your Profile</h1>

      <section className="border border-line p-5 mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wide mb-4">
          Account Details
        </h2>
        <dl className="grid grid-cols-3 gap-y-2 text-sm">
          <dt className="text-ink/50">Name</dt>
          <dd className="col-span-2">{profile?.name ?? session?.user?.name}</dd>
          <dt className="text-ink/50">Email</dt>
          <dd className="col-span-2">{session?.user?.email}</dd>
          <dt className="text-ink/50">Phone</dt>
          <dd className="col-span-2">
            {profile?.phone ?? "—"}
            {profile?.isWhatsApp && profile?.phone && (
              <span className="ml-2 text-xs text-ink/40">(WhatsApp)</span>
            )}
          </dd>
          <dt className="text-ink/50">Date of Birth</dt>
          <dd className="col-span-2">
            {profile?.dob
              ? new Date(profile.dob).toLocaleDateString()
              : "—"}
          </dd>
        </dl>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wide">
            Saved Addresses
          </h2>
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="text-xs underline"
          >
            {showAddForm ? "Cancel" : "+ Add address"}
          </button>
        </div>

        {showAddForm && (
          <div className="border border-line p-4 mb-4 space-y-2">
            <input
              className="w-full border border-line px-3 py-2 text-sm"
              placeholder="Label (Home, Work…)"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
            />
            <input
              className="w-full border border-line px-3 py-2 text-sm"
              placeholder="Full name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <input
              className="w-full border border-line px-3 py-2 text-sm"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              className="w-full border border-line px-3 py-2 text-sm"
              placeholder="Address line 1"
              value={form.line1}
              onChange={(e) => setForm({ ...form, line1: e.target.value })}
            />
            <input
              className="w-full border border-line px-3 py-2 text-sm"
              placeholder="Address line 2 (optional)"
              value={form.line2}
              onChange={(e) => setForm({ ...form, line2: e.target.value })}
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                className="border border-line px-3 py-2 text-sm"
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <input
                className="border border-line px-3 py-2 text-sm"
                placeholder="State"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
              <input
                className="border border-line px-3 py-2 text-sm"
                placeholder="Pincode"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              />
            </div>
            {error && <p className="text-sm text-accent">{error}</p>}
            <button
              onClick={addAddress}
              className="w-full py-2.5 bg-ink text-paper text-sm font-bold uppercase tracking-wide"
            >
              Save Address
            </button>
          </div>
        )}

        <div className="space-y-3">
          {addresses.length === 0 && !showAddForm && (
            <p className="text-sm text-ink/50">No saved addresses yet.</p>
          )}
          {addresses.map((a) => (
            <div key={a.id} className="border border-line p-4 flex justify-between">
              <div className="text-sm">
                <p className="font-medium">
                  {a.label}
                  {a.isDefault && (
                    <span className="ml-2 text-[10px] uppercase bg-ink text-paper px-1.5 py-0.5">
                      Default
                    </span>
                  )}
                </p>
                <p className="text-ink/70">{a.fullName} · {a.phone}</p>
                <p className="text-ink/50">
                  {a.line1}
                  {a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} {a.pincode}
                </p>
              </div>
              <div className="flex flex-col gap-1 text-xs items-end shrink-0 ml-4">
                {!a.isDefault && (
                  <button onClick={() => setDefault(a.id)} className="underline">
                    Set default
                  </button>
                )}
                <button
                  onClick={() => removeAddress(a.id)}
                  className="underline text-accent"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
