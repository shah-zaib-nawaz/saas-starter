"use client";

import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function OrgSwitcher() {
  const { data: orgs } = authClient.useListOrganizations();
  const { data: active } = authClient.useActiveOrganization();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {active?.name ?? "Select org"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {orgs?.map((o) => (
          <DropdownMenuItem
            key={o.id}
            onClick={() => authClient.organization.setActive({ organizationId: o.id })}
          >
            {o.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
