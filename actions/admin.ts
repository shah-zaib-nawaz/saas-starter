"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/get-session";

export async function listAllUsers() {
  await requireAdmin();
  const res = await auth.api.listUsers({
    headers: await headers(),
    query: { limit: 100 },
  });
  return res.users;
}

export async function banUser(userId: string) {
  await requireAdmin();
  await auth.api.banUser({ headers: await headers(), body: { userId } });
}

export async function unbanUser(userId: string) {
  await requireAdmin();
  await auth.api.unbanUser({ headers: await headers(), body: { userId } });
}

export async function setUserRole(userId: string, role: "admin" | "user") {
  await requireAdmin();
  await auth.api.setRole({ headers: await headers(), body: { userId, role } });
}
