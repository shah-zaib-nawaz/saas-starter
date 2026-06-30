"use client";

import { banUser, unbanUser, setUserRole } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Row = { id: string; name: string; email: string; role: string; banned: boolean };

export function AdminUserTable({ users }: { users: Row[] }) {
  const router = useRouter();
  const refresh = () => router.refresh();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((u) => (
          <TableRow key={u.id}>
            <TableCell>
              <div className="font-medium">{u.name}</div>
              <div className="text-xs text-muted-foreground">{u.email}</div>
            </TableCell>
            <TableCell><Badge variant="outline">{u.role}</Badge></TableCell>
            <TableCell>{u.banned ? <Badge variant="destructive">Banned</Badge> : "Active"}</TableCell>
            <TableCell className="space-x-2 text-right">
              <Button size="sm" variant="ghost"
                onClick={async () => { 
                  await setUserRole(u.id, u.role === "admin" ? "user" : "admin"); 
                  toast.success("Role updated"); 
                  refresh(); 
                }}>
                {u.role === "admin" ? "Demote" : "Promote"}
              </Button>
              <Button size="sm" variant={u.banned ? "outline" : "destructive"}
                onClick={async () => {
                  if (u.banned) {
                    await unbanUser(u.id);
                  } else {
                    await banUser(u.id);
                  }
                  toast.success("Done"); 
                  refresh(); 
                }}>
                {u.banned ? "Unban" : "Ban"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}