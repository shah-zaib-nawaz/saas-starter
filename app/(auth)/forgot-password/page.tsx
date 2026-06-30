"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email"));
    await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
    setSent(true);
    toast.success("If that email exists, a reset link is on its way.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader><CardTitle>Reset password</CardTitle></CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-sm text-muted-foreground">Check your inbox for the reset link.</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <Button type="submit" className="w-full">Send reset link</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}