import { requireSession } from "@/lib/get-session";
import { listProjects } from "@/actions/projects";
import { ProjectsPanel } from "@/components/projects-panel";

export default async function DashboardPage() {
  const session = await requireSession();
  const projects = await listProjects();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {session.user.name}</h1>
        <p className="text-sm text-muted-foreground">
          Active org: {session.session.activeOrganizationId ?? "none — create one in Organization settings"}
        </p>
      </div>
      <ProjectsPanel initialProjects={projects} />
    </div>
  );
}
