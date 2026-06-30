"use server";

import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { project } from "@/db/schema";
import { auth } from "@/lib/auth";
import { requireSession } from "@/lib/get-session";
import { headers } from "next/headers";

const createSchema = z.object({
  name: z.string().min(1).max(80),
  description: z.string().max(500).optional(),
});

export async function createProject(input: z.infer<typeof createSchema>) {
  const session = await requireSession();           // 1. authenticated?
  const orgId = session.session.activeOrganizationId;
  if (!orgId) return { error: "No active organization." };

  // 2. authorized? (org-level RBAC)
  const allowed = await auth.api.hasPermission({
    headers: await headers(),
    body: { permissions: { project: ["create"] } },
  });
  if (!allowed.success) return { error: "You don't have permission." };

  const parsed = createSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid input." };

  // 3. data scoped to the tenant
  await db.insert(project).values({
    ...parsed.data,
    organizationId: orgId,
    createdById: session.user.id,
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function listProjects() {
  const session = await requireSession();
  const orgId = session.session.activeOrganizationId;
  if (!orgId) return [];
  // Tenant isolation: only this org's rows are ever returned.
  return db.select().from(project).where(eq(project.organizationId, orgId));
}

export async function deleteProject(id: string) {
  const session = await requireSession();
  const orgId = session.session.activeOrganizationId;
  if (!orgId) return { error: "No active organization." };

  const allowed = await auth.api.hasPermission({
    headers: await headers(),
    body: { permissions: { project: ["delete"] } },
  });
  if (!allowed.success) return { error: "You don't have permission." };

  await db
    .delete(project)
    .where(and(eq(project.id, id), eq(project.organizationId, orgId)));

  revalidatePath("/dashboard");
  return { success: true };
}
