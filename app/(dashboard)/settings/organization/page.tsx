"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function OrganizationPage() {
  const { data: active } = authClient.useActiveOrganization();
  const [orgName, setOrgName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");

  async function createOrg() {
    const slug = orgName.toLowerCase().replace(/\s+/g, "-");
    const { error } = await authClient.organization.create({ name: orgName, slug });
    if (error) return toast.error(error.message);
    toast.success("Organization created");
    setOrgName("");
  }

  async function invite() {
  if (!active) return toast.error("Select an organization first");
  const { error } = await authClient.organization.inviteMember({
    email: inviteEmail,
    role,
    organizationId: active.id,
  });

  if (error) {
    toast.error(error.message);
  } else {
    toast.success("Invitation sent");
  }

  setInviteEmail("");
}

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Organization</h1>

      <Card>
        <CardHeader><CardTitle>Create organization</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Label>Name</Label>
          <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
          <Button onClick={createOrg}>Create</Button>
        </CardContent>
      </Card>

      {active && (
        <>
          <Card>
            <CardHeader><CardTitle>Members of {active.name}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {active.members?.map((m) => (
                <div key={m.id} className="flex justify-between text-sm">
                  <span>{m.user.email}</span>
                  <span className="text-muted-foreground">{m.role}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Invite a member</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Label>Email</Label>
              <Input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
              <Label>Role</Label>
              <select
                className="w-full rounded border p-2 text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value as "member" | "admin")}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <Button onClick={invite}>Send invitation</Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
