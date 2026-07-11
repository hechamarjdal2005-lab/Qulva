import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <AdminSidebar userEmail={user.email || ""} />
      <div className="flex-1 ml-0 md:ml-64">
        <main className="p-6 md:p-12">{children}</main>
      </div>
    </div>
  );
}
