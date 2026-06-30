<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Project guide for AI agents

## Project
Multi-tenant SaaS starter. Next.js 15 App Router (NO `src/` dir), Better Auth,
Drizzle ORM, Neon Postgres, Resend, Tailwind + shadcn/ui.

## Commands
- `npm run dev` — start dev server
- `npm run build` / `npm start` — production
- `npx drizzle-kit push` — push schema to Neon
- `npx drizzle-kit studio` — inspect DB
- `npx @better-auth/cli@latest generate --output ./db/schema.ts` — regenerate auth schema
- `npx tsc --noEmit` — typecheck

## Architecture rules
- App Router only; route groups: `(auth)` public, `(dashboard)` protected.
- Auth server instance lives in `lib/auth.ts`. Client in `lib/auth-client.ts`.
- RBAC definitions live in `lib/permissions.ts` and MUST be shared by server + client.
- `nextCookies()` must be the LAST plugin in the auth `plugins` array.
- DB uses Neon HTTP driver (`drizzle-orm/neon-http`).

## Security invariants (DO NOT VIOLATE)
1. Every Server Action that mutates data must call `requireSession()` (or `requireAdmin()`).
2. Every tenant query MUST filter by `session.session.activeOrganizationId`.
   Never trust an org/tenant id supplied by the client.
3. Authorization checks use `auth.api.hasPermission` (org) or role checks (system admin).
4. Middleware does optimistic cookie checks only; real validation happens
   server-side in pages/actions.
5. Never log secrets, tokens, OTPs, or password hashes.

## Adding a new tenant-scoped table
1. Append the table to `db/schema.ts` with an `organizationId` FK to `organization`.
2. `npx drizzle-kit push`
3. Add Server Actions in `actions/` following the 3-layer pattern
   (authenticate → authorize → tenant-scope).

## Env vars
See `.env.example`. Required: DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL,
NEXT_PUBLIC_APP_URL, GOOGLE_*, GITHUB_*, RESEND_API_KEY, EMAIL_FROM.

## Known caveats
- Some Better Auth client/plugin method names (e.g. `twoFactor.verifyTotp` vs
  `twoFactor.verify`, `setRole` vs `setUserRole`) can shift between minor
  versions. Trust the typed `authClient`/`auth.api` autocomplete over memory,
  and confirm against current docs at better-auth.com if a call errors.
- The `databaseHooks` block in `lib/auth.ts` that auto-sets the active
  organization calls `auth.api` from within `auth`'s own initialization in
  some versions, which can cause a circular reference at runtime. If that
  happens, move the logic into a hook that queries the `member` table
  directly via `db` instead of `auth.api`.
- Use the Neon HTTP driver (`neon-http`), not the pooled driver — recent
  `@neondatabase/serverless` versions changed an export that can break
  Better Auth's pooled driver path.
  
<!-- END:nextjs-agent-rules -->
