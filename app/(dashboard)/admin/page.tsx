import { requireAdmin } from "@/lib/get-session";
import { listAllUsers } from "@/actions/admin";
import { AdminUserTable } from "@/components/admin-user-table";

export default async function AdminPage() {
  await requireAdmin();                  // server-side gate — RBAC enforced
  const users = await listAllUsers();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin dashboard</h1>
      <AdminUserTable
        users={users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: (u.role as string) ?? "user",
          banned: Boolean(u.banned),
        }))}
      />
    </div>
  );
}
