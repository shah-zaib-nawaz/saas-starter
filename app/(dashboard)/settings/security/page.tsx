"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function SecurityPage() {
  const [password, setPassword] = useState("");
  const [totpUri, setTotpUri] = useState<string | null>(null);
  const [code, setCode] = useState("");

  async function enable2FA() {
    const { data, error } = await authClient.twoFactor.enable({ password });
    if (error) return toast.error(error.message);
    setTotpUri(data?.totpURI ?? null);
    toast.success("Scan the QR/secret in your authenticator, then verify.");
  }

  async function verify2FA() {
    const { error } = await authClient.twoFactor.verifyTotp({ code });
    if (error) return toast.error("Invalid code");
    toast.success("2FA enabled!");
    setTotpUri(null);
  }

  async function addPasskey() {
    const { error } = await authClient.passkey.addPasskey();
    if (error) return toast.error(error.message);
    toast.success("Passkey registered");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Security</h1>

      <Card>
        <CardHeader><CardTitle>Two-factor authentication</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {!totpUri ? (
            <>
              <Label>Confirm password to enable 2FA</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button onClick={enable2FA}>Enable 2FA</Button>
            </>
          ) : (
            <>
              <p className="text-xs break-all rounded bg-muted p-2">{totpUri}</p>
              <Label>Enter the 6-digit code from your app</Label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} />
              <Button onClick={verify2FA}>Verify & activate</Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Passkeys</CardTitle></CardHeader>
        <CardContent>
          <Button variant="outline" onClick={addPasskey}>Register a passkey</Button>
        </CardContent>
      </Card>
    </div>
  );
}
