# SaaS Starter

A production-ready multi-tenant SaaS starter built with **Next.js 15** (App Router, no `src/`), **Better Auth**, **Drizzle ORM**, **Neon Postgres**, **Resend**, and **Tailwind + shadcn/ui**.

## Features

- Email/password auth with email verification and password reset
- OAuth sign-in (Google, GitHub) with account linking
- Magic link sign-in
- Two-factor authentication (TOTP) and passkeys
- Multi-tenant organizations with roles (owner/admin/member) and team invitations
- System-level RBAC with an admin dashboard (promote/demote/ban users)
- Server Action security pattern: authenticate → authorize → tenant-scope every mutation
- Transactional email via Resend (verification, reset, magic link, OTP, invitations)

## Tech stack

| Layer | Tool |
|---|---|
| Framework | Next.js 15 (App Router) |
| Auth | Better Auth (`admin`, `organization`, `twoFactor`, `magicLink`, `passkey` plugins) |
| Database | Neon Postgres via Drizzle ORM (`neon-http` driver) |
| Email | Resend |
| UI | Tailwind CSS + shadcn/ui |

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URL` — Neon Postgres connection string
- `BETTER_AUTH_SECRET` — generate with `openssl rand -base64 32`
- `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL` — `http://localhost:3000` for local dev
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
- `RESEND_API_KEY`, `EMAIL_FROM`

### 3. Generate and push the database schema

```bash
npx @better-auth/cli@latest generate --output ./db/schema.ts
npx drizzle-kit push
```

### 4. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000].

## Project structure

```
saas-starter/
├── app/
│   ├── (auth)/             # sign-in, sign-up, password reset, 2FA, etc.
│   ├── (dashboard)/        # protected app: dashboard, settings, admin
│   ├── accept-invitation/  # organization invite acceptance
│   └── api/auth/[...all]/  # Better Auth route handler
├── components/             # shared UI + shadcn components
├── db/                     # Drizzle client and schema
├── lib/                    # auth server/client instances, permissions, email
├── actions/                # Server Actions (mutations)
├── middleware.ts           # optimistic route protection
└── drizzle.config.ts
```

## Security model

Every data-mutating Server Action follows a three-layer pattern:

1. **Authenticate** — `requireSession()` confirms a valid session.
2. **Authorize** — `auth.api.hasPermission` (org-level) or a role check (system-level) confirms the action is allowed.
3. **Tenant-scope** — every query filters by `session.session.activeOrganizationId`, never by a client-supplied org ID.

Route-level protection in `middleware.ts` is an optimistic cookie check only; the real, authoritative checks happen server-side in each page and Server Action.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Start the production server |
| `npm run lint` | Lint the project |
| `npm run db:push` | Push schema changes to Neon |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run auth:generate` | Regenerate the Better Auth schema |

## Deployment (Vercel)

1. Push the repo to GitHub and import it into Vercel.
2. Add all `.env` variables in the Vercel project settings, updating `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production domain.
3. Update the Google and GitHub OAuth callback URLs to `https://yourdomain.com/api/auth/callback/{google,github}`.
4. Verify a sending domain in Resend and update `EMAIL_FROM`.
5. Run `npx drizzle-kit push` against the production `DATABASE_URL`.

## For AI coding agents

See [AGENT.md](./AGENT.md) for architecture rules, security invariants, and known caveats to follow when modifying this codebase.