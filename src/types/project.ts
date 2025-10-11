export interface Card {
  id: string;
  title: string;
  description?: string;
  priority: "none" | "low" | "medium" | "high" | "critical";
  status: "backlog" | "todo" | "in-progress" | "review" | "done";
  assignees: string[];
  tags: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  columnId: string;
  subtasks: Subtask[];
  attachments: Attachment[];
  comments: Comment[];
  timeTracking: TimeTracking;
  dependencies: string[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  mentions: string[];
}

export interface TimeTracking {
  estimated?: number; // in minutes
  actual?: number; // in minutes
  isActive: boolean;
  startedAt?: string;
}

export interface Column {
  id: string;
  name: string;
  color: string;
  position: number;
  wipLimit?: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  columns: Column[];
  cards: Card[];
  members: ProjectMember[];
  settings: ProjectSettings;
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "admin" | "member" | "viewer";
}

export interface ProjectSettings {
  allowComments: boolean;
  allowTimeTracking: boolean;
  enableNotifications: boolean;
  defaultView: "board" | "calendar" | "list";
  workingDays: number[];
}