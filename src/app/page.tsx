import { ProjectProvider } from "@/context/ProjectContext";
import { PlannerShell } from "@/components/layout/PlannerShell";

export default function Home() {
  return (
    <ProjectProvider>
      <PlannerShell />
    </ProjectProvider>
  );
}
