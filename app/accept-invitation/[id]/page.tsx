"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function AcceptInvitationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function accept() {
    setLoading(true);
    const { error } = await authClient.organization.acceptInvitation({ invitationId: id });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("You've joined the organization!");
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader><CardTitle>Organization invitation</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            You&apos;ve been invited to join an organization. Sign in first if you haven&apos;t.
          </p>
          <Button onClick={accept} disabled={loading} className="w-full">
            {loading ? "Joining…" : "Accept invitation"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
