"use client";

import { useEffect, useState } from "react";

type AdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  phone: string | null;
  isWhatsApp: boolean;
  onboarded: boolean;
  createdAt: string;
  _count: { orders: number };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []))
      .finally(() => setLoading(false));
  }, []);

  const visible = users.filter((u) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q)
    );
  });

  return (
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-sm text-ink/50">{users.length} signed up</p>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, email, or phone"
        className="w-full border border-line px-3 py-2.5 text-sm mb-6"
      />

      {loading && <p className="text-sm text-ink/50">Loading…</p>}

      {!loading && visible.length === 0 && (
        <p className="text-sm text-ink/50">No customers found.</p>
      )}

      <div className="border border-line divide-y divide-line">
        {visible.map((u) => (
          <div key={u.id} className="flex items-center gap-4 p-4 text-sm">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-line shrink-0">
              {u.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={u.image} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{u.name ?? "Unnamed"}</p>
              <p className="text-ink/50 text-xs truncate">
                {u.email ?? "No email"}
                {u.phone ? ` · ${u.phone}${u.isWhatsApp ? " (WhatsApp)" : ""}` : ""}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-semibold">{u._count.orders} orders</p>
              <p className="text-ink/40 text-xs">
                Joined {new Date(u.createdAt).toLocaleDateString()}
              </p>
            </div>
            {!u.onboarded && (
              <span className="text-[10px] uppercase px-2 py-1 bg-amber-500 text-white shrink-0">
                Incomplete
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
