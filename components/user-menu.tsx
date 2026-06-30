"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserMenu({ name, email, image }: { name: string; email: string; image?: string | null }) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-8 w-8">
          {image && <AvatarImage src={image} alt={name} />}
          <AvatarFallback>{name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled className="flex-col items-start">
          <span className="font-medium">{name}</span>
          <span className="text-xs text-muted-foreground">{email}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings/security")}>Security</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            authClient.signOut({ fetchOptions: { onSuccess: () => router.push("/sign-in") } })
          }
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
