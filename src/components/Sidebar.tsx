// src/components/Sidebar.tsx
import { useState } from "react";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  PlusIcon,
  SearchIcon,
  FolderIcon,
  StarIcon,
  SettingsIcon,
  TrendingUpIcon,
  UsersIcon,
  ArchiveIcon,
  MoreVerticalIcon,
  ChevronLeftIcon,
  HomeIcon,
  ClockIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  CalendarIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  projects: Project[];
  currentProject: Project | null;
  onProjectSelect: (projectId: string) => void;
  onCreateProject: (name: string) => void;
}

export function Sidebar({
  isOpen,
  onToggle,
  projects,
  currentProject,
  onProjectSelect,
  onCreateProject,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      onCreateProject(newProjectName.trim());
      setNewProjectName("");
      setNewProjectDescription("");
      setIsCreateDialogOpen(false);
    }
  };

  const getProjectStats = (project: Project) => {
    const totalCards = project.cards.length;
    const completedCards = project.cards.filter(
      (c) => c.status === "done"
    ).length;
    const inProgressCards = project.cards.filter(
      (c) => c.status === "in-progress"
    ).length;
    const overdueCards = project.cards.filter(
      (c) =>
        c.dueDate && new Date(c.dueDate) < new Date() && c.status !== "done"
    ).length;

    return { totalCards, completedCards, inProgressCards, overdueCards };
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">ProjectFlow</h2>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 hover:bg-hover rounded-md"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 py-2">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onProjectSelect(currentProject?.id || "")}
          >
            <HomeIcon className="w-4 h-4 mr-3" />
            Dashboard
          </Button>

          {currentProject && (
            <>
              <Button variant="ghost" className="w-full justify-start">
                <CalendarIcon className="w-4 h-4 mr-3" />
                My Calendar
                <Badge variant="secondary" className="ml-auto">
                  {currentProject.cards.filter((c) => c.dueDate).length}
                </Badge>
              </Button>

              <Button variant="ghost" className="w-full justify-start">
                <ClockIcon className="w-4 h-4 mr-3" />
                Time Tracking
                <Badge variant="secondary" className="ml-auto">
                  {
                    currentProject.cards.filter((c) => c.timeTracking.isActive)
                      .length
                  }
                </Badge>
              </Button>
            </>
          )}
        </div>
        <Separator className="my-4" />
      </div>

      {/* Projects Section */}
      <div className="flex-1 px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Projects
          </h3>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                <PlusIcon className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Project Name</label>
                  <Input
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Description (Optional)
                  </label>
                  <Textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Project description..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject}>Create Project</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {filteredProjects.map((project) => {
              const stats = getProjectStats(project);
              const isActive = currentProject?.id === project.id;

              return (
                <div
                  key={project.id}
                  className={cn(
                    "group relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "hover:bg-hover"
                  )}
                  onClick={() => onProjectSelect(project.id)}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm truncate">
                          {project.name}
                        </span>
                        {stats.overdueCards > 0 && (
                          <AlertTriangleIcon className="w-3 h-3 text-error flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <CheckCircleIcon className="w-3 h-3" />
                          <span>
                            {stats.completedCards}/{stats.totalCards}
                          </span>
                        </span>
                        {stats.inProgressCards > 0 && (
                          <Badge
                            variant="secondary"
                            className="px-1 py-0 text-xs"
                          >
                            {stats.inProgressCards} active
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 p-1 h-6 w-6"
                      >
                        <MoreVerticalIcon className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <StarIcon className="w-4 h-4 mr-2" />
                        Star Project
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UsersIcon className="w-4 h-4 mr-2" />
                        Manage Members
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <SettingsIcon className="w-4 h-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <ArchiveIcon className="w-4 h-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {projects.length === 0 && (
          <div className="text-center py-8">
            <FolderIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-3">
              No projects yet
            </p>
            <Button
              size="sm"
              onClick={() => setIsCreateDialogOpen(true)}
              className="mx-auto"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Create First Project
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-primary-foreground">
                U
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">You</p>
              <p className="text-xs text-muted-foreground">Free Plan</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="p-1">
            <SettingsIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  if (!isOpen) {
    return (
      <div className="hidden lg:block w-16 flex-shrink-0 bg-card border-r border-border">
        <div className="p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-8 h-8 p-0"
          >
            <FolderIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onToggle}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex-shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
}
