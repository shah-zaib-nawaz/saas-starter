"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SocialButtons() {
  const oauth = (provider: "google" | "github") =>
    authClient.signIn.social({ provider, callbackURL: "/dashboard" });

  return (
    <div className="space-y-2">
      <div className="relative py-2 text-center text-xs text-muted-foreground">
        <span className="bg-background px-2">or continue with</span>
      </div>
      <Button variant="outline" className="w-full" onClick={() => oauth("google")}>
        Continue with Google
      </Button>
      <Button variant="outline" className="w-full" onClick={() => oauth("github")}>
        Continue with GitHub
      </Button>
    </div>
  );
}
