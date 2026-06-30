import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/get-session";
import { UserMenu } from "@/components/user-menu";
import { OrgSwitcher } from "@/components/org-switcher";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();        // server-side, authoritative
  if (!session) redirect("/sign-in");

  const isAdmin = session.user.role === "admin";

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-semibold">SaaS Starter</Link>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/settings">Account</Link>
            <Link href="/settings/organization">Organization</Link>
            {isAdmin && <Link href="/admin">Admin</Link>}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <OrgSwitcher />
          <UserMenu name={session.user.name} email={session.user.email} image={session.user.image} />
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-6">{children}</main>
    </div>
  );
}
