"use client";

import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  organizationClient,
  twoFactorClient,
  magicLinkClient,
} from "better-auth/client/plugins";
import { passkeyClient } from "@better-auth/passkey/client"
import {
  orgAc,
  orgMember,
  orgAdmin,
  orgOwner,
  adminAc,
  adminRole,
  userRole,
} from "@/lib/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    adminClient({
      ac: adminAc,
      roles: { admin: adminRole, user: userRole },
    }),
    organizationClient({
      ac: orgAc,
      roles: { owner: orgOwner, admin: orgAdmin, member: orgMember },
      teams: { enabled: true },
    }),
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = "/two-factor";
      },
    }),
    magicLinkClient(),
    passkeyClient(),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  organization,
  admin,
  twoFactor,
} = authClient;
