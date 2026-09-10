import { getAdminSession } from "@/lib/admin-auth";
import AdminNav from "@/components/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    // login / setup pages — no dashboard chrome
    return <div className="min-h-screen bg-ink">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <AdminNav email={session.email} />
      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}
