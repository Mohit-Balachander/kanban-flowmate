// src/hooks/useProjects.ts
import { useState, useEffect } from "react";
import { Project, Card, Column, ProjectMember } from "@/types/project";
import { useLocalStorage } from "./useLocalStorage";

// Default project template
const createDefaultProject = (name: string): Project => ({
  id: `project-${Date.now()}`,
  name,
  description: `Project created on ${new Date().toLocaleDateString()}`,
  color: "#3b82f6",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  columns: [
    { id: "backlog", name: "Backlog", color: "#6b7280", position: 0 },
    { id: "todo", name: "To Do", color: "#3b82f6", position: 1 },
    {
      id: "in-progress",
      name: "In Progress",
      color: "#f59e0b",
      position: 2,
      wipLimit: 3,
    },
    {
      id: "review",
      name: "Review",
      color: "#8b5cf6",
      position: 3,
      wipLimit: 2,
    },
    { id: "done", name: "Done", color: "#10b981", position: 4 },
  ],
  cards: [],
  members: [
    {
      id: "user-1",
      name: "You",
      email: "user@example.com",
      role: "owner",
    },
  ],
  settings: {
    allowComments: true,
    allowTimeTracking: true,
    enableNotifications: true,
    defaultView: "board",
    workingDays: [1, 2, 3, 4, 5], // Mon-Fri
  },
});

// Sample cards for demo
const createSampleCards = (projectId: string): Card[] => [
  {
    id: `card-${Date.now()}-1`,
    title: "Set up project structure",
    description:
      "Initialize the project with proper folder structure and configuration",
    priority: "high",
    status: "done",
    assignees: ["You"],
    tags: ["setup", "configuration"],
    dueDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
    columnId: "done",
    subtasks: [
      {
        id: "sub-1",
        title: "Create folder structure",
        completed: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "sub-2",
        title: "Set up TypeScript config",
        completed: true,
        createdAt: new Date().toISOString(),
      },
    ],
    attachments: [],
    comments: [
      {
        id: "comment-1",
        content: "Project structure looks good! Ready for development.",
        author: "You",
        createdAt: new Date().toISOString(),
        mentions: [],
      },
    ],
    timeTracking: { isActive: false, actual: 120 },
    dependencies: [],
  },
  {
    id: `card-${Date.now()}-2`,
    title: "Implement user authentication",
    description:
      "Add login/logout functionality with proper session management",
    priority: "medium",
    status: "in-progress",
    assignees: ["You"],
    tags: ["auth", "security"],
    dueDate: new Date(Date.now() + 604800000).toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    columnId: "in-progress",
    subtasks: [
      {
        id: "sub-3",
        title: "Set up authentication service",
        completed: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "sub-4",
        title: "Create login form",
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "sub-5",
        title: "Add session management",
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ],
    attachments: [],
    comments: [],
    timeTracking: {
      isActive: true,
      startedAt: new Date().toISOString(),
      estimated: 480,
    },
    dependencies: [],
  },
  {
    id: `card-${Date.now()}-3`,
    title: "Design system updates",
    description:
      "Update the design system with new components and improved accessibility",
    priority: "low",
    status: "todo",
    assignees: [],
    tags: ["design", "ui", "accessibility"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    columnId: "todo",
    subtasks: [],
    attachments: [],
    comments: [],
    timeTracking: { isActive: false, estimated: 360 },
    dependencies: [],
  },
];

export function useProjects() {
  const [projects, setProjects] = useLocalStorage<Project[]>("projects", []);
  const [currentProjectId, setCurrentProjectId] = useLocalStorage<
    string | null
  >("current-project", null);

  const currentProject =
    projects.find((p) => p.id === currentProjectId) || null;

  // Auto-create demo project if none exist
  useEffect(() => {
    if (projects.length === 0) {
      const demoProject = createDefaultProject("Demo Project");
      demoProject.cards = createSampleCards(demoProject.id);
      setProjects([demoProject]);
      setCurrentProjectId(demoProject.id);
    }
  }, [projects.length, setProjects, setCurrentProjectId]);

  const createProject = (name: string, template?: "blank" | "demo") => {
    const newProject = createDefaultProject(name);

    if (template === "demo") {
      newProject.cards = createSampleCards(newProject.id);
    }

    setProjects((prev) => [...prev, newProject]);
    setCurrentProjectId(newProject.id);
    return newProject;
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const deleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (currentProjectId === projectId) {
      const remainingProjects = projects.filter((p) => p.id !== projectId);
      setCurrentProjectId(
        remainingProjects.length > 0 ? remainingProjects[0].id : null
      );
    }
  };

  const setCurrentProject = (projectId: string | null) => {
    setCurrentProjectId(projectId);
  };

  const addCard = (cardData: Omit<Card, "id" | "createdAt" | "updatedAt">) => {
    const newCard: Card = {
      ...cardData,
      id: `card-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (currentProject) {
      updateProject(currentProject.id, {
        cards: [...currentProject.cards, newCard],
      });
    }
  };

  const updateCard = (cardId: string, updates: Partial<Card>) => {
    if (currentProject) {
      const updatedCards = currentProject.cards.map((card) =>
        card.id === cardId
          ? { ...card, ...updates, updatedAt: new Date().toISOString() }
          : card
      );
      updateProject(currentProject.id, { cards: updatedCards });
    }
  };

  const deleteCard = (cardId: string) => {
    if (currentProject) {
      updateProject(currentProject.id, {
        cards: currentProject.cards.filter((card) => card.id !== cardId),
      });
    }
  };

  const addColumn = (columnData: Omit<Column, "id" | "position">) => {
    if (currentProject) {
      const newColumn: Column = {
        ...columnData,
        id: `column-${Date.now()}`,
        position: currentProject.columns.length,
      };
      updateProject(currentProject.id, {
        columns: [...currentProject.columns, newColumn],
      });
    }
  };

  const updateColumn = (columnId: string, updates: Partial<Column>) => {
    if (currentProject) {
      updateProject(currentProject.id, {
        columns: currentProject.columns.map((col) =>
          col.id === columnId ? { ...col, ...updates } : col
        ),
      });
    }
  };

  const deleteColumn = (columnId: string) => {
    if (currentProject) {
      // Move cards from deleted column to first column
      const updatedCards = currentProject.cards.map((card) =>
        card.columnId === columnId
          ? { ...card, columnId: currentProject.columns[0]?.id || "todo" }
          : card
      );

      updateProject(currentProject.id, {
        columns: currentProject.columns.filter((col) => col.id !== columnId),
        cards: updatedCards,
      });
    }
  };

  const addMember = (member: Omit<ProjectMember, "id">) => {
    if (currentProject) {
      const newMember: ProjectMember = {
        ...member,
        id: `member-${Date.now()}`,
      };
      updateProject(currentProject.id, {
        members: [...currentProject.members, newMember],
      });
    }
  };

  const removeMember = (memberId: string) => {
    if (currentProject) {
      updateProject(currentProject.id, {
        members: currentProject.members.filter((m) => m.id !== memberId),
      });
    }
  };

  const searchCards = (query: string) => {
    if (!currentProject || !query.trim()) return currentProject?.cards || [];

    return currentProject.cards.filter(
      (card) =>
        card.title.toLowerCase().includes(query.toLowerCase()) ||
        card.description?.toLowerCase().includes(query.toLowerCase()) ||
        card.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const filterCards = (filters: {
    priority?: Card["priority"][];
    assignees?: string[];
    tags?: string[];
    status?: Card["status"][];
    overdue?: boolean;
  }) => {
    if (!currentProject) return [];

    return currentProject.cards.filter((card) => {
      if (filters.priority && !filters.priority.includes(card.priority))
        return false;
      if (
        filters.assignees &&
        !card.assignees.some((a) => filters.assignees!.includes(a))
      )
        return false;
      if (filters.tags && !card.tags.some((t) => filters.tags!.includes(t)))
        return false;
      if (filters.status && !filters.status.includes(card.status)) return false;
      if (
        filters.overdue &&
        card.dueDate &&
        new Date(card.dueDate) >= new Date()
      )
        return false;

      return true;
    });
  };

  const getProjectStats = () => {
    if (!currentProject) return null;

    const cards = currentProject.cards;
    const totalCards = cards.length;
    const completedCards = cards.filter((c) => c.status === "done").length;
    const inProgressCards = cards.filter(
      (c) => c.status === "in-progress"
    ).length;
    const overdueCards = cards.filter(
      (c) =>
        c.dueDate && new Date(c.dueDate) < new Date() && c.status !== "done"
    ).length;

    const totalEstimated = cards.reduce(
      (sum, card) => sum + (card.timeTracking.estimated || 0),
      0
    );
    const totalActual = cards.reduce(
      (sum, card) => sum + (card.timeTracking.actual || 0),
      0
    );

    return {
      totalCards,
      completedCards,
      inProgressCards,
      overdueCards,
      completionRate:
        totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0,
      totalEstimated: Math.round(totalEstimated / 60), // Convert to hours
      totalActual: Math.round(totalActual / 60), // Convert to hours
    };
  };

  return {
    projects,
    currentProject,
    createProject,
    updateProject,
    deleteProject,
    setCurrentProject,
    addCard,
    updateCard,
    deleteCard,
    addColumn,
    updateColumn,
    deleteColumn,
    addMember,
    removeMember,
    searchCards,
    filterCards,
    getProjectStats,
  };
}
