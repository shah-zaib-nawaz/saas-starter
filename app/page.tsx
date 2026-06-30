import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Users, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSession } from "@/lib/get-session";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            SaaS Starter
          </Link>
          <nav className="flex items-center gap-4">
            {session ? (
              <Button asChild size="sm">
                <Link href="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-4xl px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
          The Ultimate Multi-Tenant <br />
          <span className="bg-linear-to-r from-neutral-900 to-neutral-500 bg-clip-text text-transparent dark:from-neutral-100 dark:to-neutral-400">
            SaaS Architecture
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          A rock-solid foundation for scalable applications. Built with Next.js, Better Auth, 
          Drizzle ORM, Neon Postgres, and Tailwind CSS.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button asChild size="lg" className="h-12 px-6">
            <Link href={session ? "/dashboard" : "/sign-up"}>
              {session ? "View Dashboard" : "Start Building For Free"}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-6">
            <a href="https://github.com" target="_blank" rel="noreferrer">
              Documentation
            </a>
          </Button>
        </div>
      </section>

      {/* Technical Features Grid */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Production-Ready Architecture
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything configured from security invariants to optimal performance paths.
          </p>
        </div>

        {/* Changed gap-6 to gap-x-6 and gap-y-4 to pull cards closer vertically */}
        <div className="mt-12 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <Card className="bg-muted/40 border-muted">
            <CardContent className="p-6">
              <Shield className="h-8 w-8 text-neutral-800 dark:text-neutral-200" />
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-card-foreground">Secure Authentication</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Server-side sessions, fully managed 2FA (TOTP), Passkeys, and robust OAuth linking 
                via the Better Auth ecosystem.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="bg-muted/40 border-muted">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-neutral-800 dark:text-neutral-200" />
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-card-foreground">Multi-Tenancy & RBAC</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Built-in organization workspaces, granular role-based access controls, and multi-user 
                invitation management.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="bg-muted/40 border-muted">
            <CardContent className="p-6">
              <Database className="h-8 w-8 text-neutral-800 dark:text-neutral-200" />
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-card-foreground">Tenant-Isolated DB</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Drizzle ORM paired with Neon Serverless Postgres HTTP path ensures absolute transactional 
                tenant isolation at the query layer.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Core Architectural Guardrails */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h3 className="text-center text-2xl font-bold tracking-tight">
            Security & Performance Invariants Implemented
          </h3>
          <ul className="mt-8 space-y-4">
            {[
              "Optimistic route shielding via Next.js Middleware with authoritative server-side fallback validation.",
              "Three-layer mutation defense architecture: Authenticate → Authorize → Query Tenant Scoping.",
              "High-efficiency lookups via Better Auth custom 5-minute cookie caching mechanisms.",
              "Complete system-level management via dedicated, secure superuser Admin dashboards."
            ].map((text, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm sm:text-base">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-neutral-800 dark:text-neutral-200" />
                <span className="text-muted-foreground">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-center px-4 text-sm text-muted-foreground sm:px-6">
          <p>© 2026 SaaS Starter Corp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}