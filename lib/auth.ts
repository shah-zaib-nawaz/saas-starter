import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";
import {
  admin,
  organization,
  twoFactor,
  magicLink,
} from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import { db } from "@/db";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendMagicLinkEmail,
  sendOrganizationInvitation,
  sendOtpEmail,
} from "@/lib/email/templates";
import {
  orgAc,
  orgMember,
  orgAdmin,
  orgOwner,
  adminAc,
  adminRole,
  userRole,
} from "@/lib/permissions";
import { member } from "@/db/schema";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  appName: "SaaS Starter",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  // --- Email + Password ---
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      // not awaited intentionally to reduce timing attack surface
      void sendResetPasswordEmail({ to: user.email, url });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      void sendVerificationEmail({ to: user.email, url });
    },
  },

  // --- OAuth ---
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  // Allow linking OAuth to an existing verified email account
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh daily
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 min cookie cache to cut DB reads
    },
  },

  // --- Plugins ---
  plugins: [
    twoFactor({
      issuer: "SaaS Starter",
      otpOptions: {
        async sendOTP({ user, otp }) {
          void sendOtpEmail({ to: user.email, otp });
        },
      },
    }),

    magicLink({
      sendMagicLink: async ({ email, url }) => {
        void sendMagicLinkEmail({ to: email, url });
      },
    }),

    passkey({
      rpID:
        process.env.NODE_ENV === "production"
          ? new URL(process.env.NEXT_PUBLIC_APP_URL!).hostname
          : "localhost",
      rpName: "SaaS Starter",
      origin: process.env.NEXT_PUBLIC_APP_URL,
    }),

    admin({
      ac: adminAc,
      roles: { admin: adminRole, user: userRole },
      defaultRole: "user",
      adminRoles: ["admin"],
    }),

    organization({
      ac: orgAc,
      roles: { owner: orgOwner, admin: orgAdmin, member: orgMember },
      teams: { enabled: true, maximumTeams: 10 },
      allowUserToCreateOrganization: true,
      sendInvitationEmail: async (data) => {
        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation/${data.id}`;
        void sendOrganizationInvitation({
          email: data.email,
          invitedByUsername: data.inviter.user.name,
          invitedByEmail: data.inviter.user.email,
          teamName: data.organization.name,
          inviteLink,
        });
      },
    }),

    // nextCookies MUST be last
    nextCookies(),
  ],

  // Set the user's active org automatically on session creation
  databaseHooks: {
  session: {
    create: {
      before: async (session) => {
        const firstMembership = await db.query.member.findFirst({
          where: eq(member.userId, session.userId),
        });

        return {
          data: {
            ...session,
            activeOrganizationId: firstMembership?.organizationId ?? null,
          },
        };
      },
    },
  },
},
});

export type Session = typeof auth.$Infer.Session;