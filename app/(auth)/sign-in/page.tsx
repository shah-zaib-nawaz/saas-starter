"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { SocialButtons } from "@/components/social-buttons";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/dashboard";
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    await authClient.signIn.email(
      {
        email: String(form.get("email")),
        password: String(form.get("password")),
        callbackURL: redirect,
      },
      {
        onSuccess: () => router.push(redirect),
        onError: (ctx) => {
          if (ctx.error.status === 403) toast.error("Please verify your email first.");
          else toast.error(ctx.error.message);
        },
      }
    );
    setLoading(false);
  }

  async function magicLink() {
    const email = prompt("Enter your email for a magic link:");
    if (!email) return;
    await authClient.signIn.magicLink({ email, callbackURL: redirect });
    toast.success("Magic link sent — check your inbox.");
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader><CardTitle>Welcome back</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs underline">Forgot?</Link>
            </div>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <Button variant="ghost" className="w-full" onClick={magicLink}>
          Email me a magic link
        </Button>
        <SocialButtons />
        <p className="text-center text-sm text-muted-foreground">
          No account? <Link href="/sign-up" className="underline">Sign up</Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}