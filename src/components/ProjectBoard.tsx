import { useState } from "react";
import { Project } from "@/types/project";
import { KanbanBoard } from "./KanbanBoard";
import { CalendarView } from "./CalendarView";
import { ListView } from "./ListView";

interface ProjectBoardProps {
  project: Project;
  view: "board" | "calendar" | "list";
}

export function ProjectBoard({ project, view }: ProjectBoardProps) {
  switch (view) {
    case "calendar":
      return <CalendarView project={project} />;
    case "list":
      return <ListView project={project} />;
    default:
      return <KanbanBoard project={project} />;
  }
}