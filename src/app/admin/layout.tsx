import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login");   // ⬅️ CHANGE THIS LINE (was "/admin/login")
  }

  return <AdminShell adminName={session.name}>{children}</AdminShell>;
}