"use client";

import { useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function AccountPage() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user.name ?? "");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");

  async function saveProfile() {
    const { error } = await authClient.updateUser({ name });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile updated");
    }
  }

  async function changePassword() {
    const { error } = await authClient.changePassword({
      currentPassword: current,
      newPassword: next,
      revokeOtherSessions: true,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password changed");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Account</h1>
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <Button onClick={saveProfile}>Save</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Change password</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Label>Current password</Label>
          <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
          <Label>New password</Label>
          <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} />
          <Button onClick={changePassword}>Update password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
