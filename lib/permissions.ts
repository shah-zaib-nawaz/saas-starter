import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements as orgDefaults,
  adminAc as orgAdminAc,
  memberAc as orgMemberAc,
  ownerAc as orgOwnerAc,
} from "better-auth/plugins/organization/access";
import {
  defaultStatements as adminDefaults,
  adminAc as sysAdminAc,
} from "better-auth/plugins/admin/access";

/* ----------------------------------------------------------------
 * ORGANIZATION-level access control (per-tenant roles)
 * ---------------------------------------------------------------- */
export const orgStatement = {
  ...orgDefaults,
  // your tenant-scoped resource:
  project: ["create", "read", "update", "delete"],
} as const;

export const orgAc = createAccessControl(orgStatement);

export const orgMember = orgAc.newRole({
  ...orgMemberAc.statements,
  project: ["read"],
});

export const orgAdmin = orgAc.newRole({
  ...orgAdminAc.statements,
  project: ["create", "read", "update", "delete"],
});

export const orgOwner = orgAc.newRole({
  ...orgOwnerAc.statements,
  project: ["create", "read", "update", "delete"],
});

/* ----------------------------------------------------------------
 * SYSTEM-level access control (admin plugin / superusers)
 * ---------------------------------------------------------------- */
export const adminStatement = {
  ...adminDefaults,
} as const;

export const adminAc = createAccessControl(adminStatement);

export const userRole = adminAc.newRole({});
export const adminRole = adminAc.newRole({
  ...sysAdminAc.statements,
});
