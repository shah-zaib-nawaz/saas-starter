"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  async function resend() {
    const email = prompt("Confirm your email to resend verification:");
    if (!email) return;
    await authClient.sendVerificationEmail({ email, callbackURL: "/dashboard" });
    toast.success("Verification email sent.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader><CardTitle>Verify your email</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We sent you a verification link. Click it to activate your account.
          </p>
          <Button variant="outline" onClick={resend}>Resend email</Button>
        </CardContent>
      </Card>
    </div>
  );
}
