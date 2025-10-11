import { useState } from "react";
import { ProjectBoard } from "@/components/ProjectBoard";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useProjects } from "@/hooks/useProjects";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const Index = () => {
  const { projects, createProject, currentProject, setCurrentProject } =
    useProjects();
  const [sidebarOpen, setSidebarOpen] = useLocalStorage("sidebar-open", true);
  const [view, setView] = useState<"board" | "calendar" | "list">("board");

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          projects={projects}
          currentProject={currentProject}
          onProjectSelect={setCurrentProject}
          onCreateProject={createProject}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            currentProject={currentProject}
            view={view}
            onViewChange={setView}
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          />

          <main className="flex-1 overflow-hidden">
            {currentProject ? (
              <ProjectBoard project={currentProject} view={view} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-4xl">🚀</span>
                  </div>
                  <h2 className="text-2xl font-bold">
                    Welcome to Kanban FlowMate
                  </h2>
                  <p className="text-muted-foreground max-w-md">
                    Create your first project to start organizing tasks and
                    tracking progress with an intuitive Kanban board.
                  </p>
                  <button
                    onClick={() => createProject("My First Project")}
                    className="bg-gradient-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Create First Project
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
