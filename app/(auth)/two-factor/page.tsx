"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function TwoFactorPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  async function verify() {
    const { error } = await authClient.twoFactor.verifyTotp({ code });
    if (error) return toast.error("Invalid code");
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader><CardTitle>Two-factor authentication</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
          />
          <Button className="w-full" onClick={verify}>Verify</Button>
        </CardContent>
      </Card>
    </div>
  );
}
