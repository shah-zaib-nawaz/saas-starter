"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

function ResetForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newPassword = String(new FormData(e.currentTarget).get("password"));
    setLoading(true);
    const { error } = await authClient.resetPassword({ newPassword, token });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated. Please sign in.");
    router.push("/sign-in");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="password">New password</Label>
        <Input id="password" name="password" type="password" minLength={8} required />
      </div>
      <Button type="submit" className="w-full" disabled={loading || !token}>
        {loading ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader><CardTitle>Choose a new password</CardTitle></CardHeader>
        <CardContent>
          <Suspense>
            <ResetForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
