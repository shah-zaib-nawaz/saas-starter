import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Use in protected pages/actions: redirects if not authenticated. */
export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  return session;
}

/** Gate admin-only pages/actions. */
export async function requireAdmin() {
  const session = await requireSession();
  if (session.user.role !== "admin") redirect("/dashboard");
  return session;
}
