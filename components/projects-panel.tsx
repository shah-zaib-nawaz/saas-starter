"use client";

import { useState } from "react";
import { createProject, deleteProject } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

type Project = { id: string; name: string; description: string | null };

export function ProjectsPanel({ initialProjects }: { initialProjects: Project[] }) {
  const [name, setName] = useState("");

  async function add() {
    if (!name.trim()) return;
    const res = await createProject({ name });
    if (res?.error) return toast.error(res.error);
    toast.success("Project created");
    setName("");
  }

  async function remove(id: string) {
    const res = await deleteProject(id);
    if (res?.error) return toast.error(res.error);
    toast.success("Deleted");
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="New project name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button onClick={add}>Add</Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {initialProjects.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex items-center justify-between p-4">
              <span>{p.name}</span>
              <Button size="sm" variant="ghost" onClick={() => remove(p.id)}>Delete</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
