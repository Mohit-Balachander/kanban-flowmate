import { Project } from "@/types/project";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  ListIcon,
  FilterIcon,
  SortAscIcon,
  CalendarIcon,
  CheckSquareIcon,
  AlertTriangleIcon,
  UserIcon
} from "lucide-react";

interface ListViewProps {
  project: Project;
}

type SortBy = "title" | "priority" | "dueDate" | "status" | "created";
type FilterBy = "all" | "high-priority" | "overdue" | "my-tasks";

export function ListView({ project }: ListViewProps) {
  const [sortBy, setSortBy] = useState<SortBy>("created");
  const [filterBy, setFilterBy] = useState<FilterBy>("all");
  const [sortDesc, setSortDesc] = useState(true);

  const sortedAndFilteredCards = project.cards
    .filter(card => {
      switch (filterBy) {
        case "high-priority":
          return card.priority === "high" || card.priority === "critical";
        case "overdue":
          return card.dueDate && new Date(card.dueDate) < new Date();
        case "my-tasks":
          return card.assignees.length > 0; // In a real app, filter by current user
        default:
          return true;
      }
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "priority":
          const priorityOrder = { none: 0, low: 1, medium: 2, high: 3, critical: 4 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case "dueDate":
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }
      
      if (aValue < bValue) return sortDesc ? 1 : -1;
      if (aValue > bValue) return sortDesc ? -1 : 1;
      return 0;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done": return "text-success";
      case "in-progress": return "text-warning";
      case "review": return "text-secondary";
      default: return "text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-priority-critical";
      case "high": return "text-priority-high";
      case "medium": return "text-priority-medium";
      case "low": return "text-priority-low";
      default: return "text-priority-none";
    }
  };

  return (
    <div className="h-full bg-background">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <ListIcon className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">List View</h2>
            <span className="text-sm text-muted-foreground">
              {sortedAndFilteredCards.length} of {project.cards.length} tasks
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Filter */}
            <div className="flex items-center space-x-2">
              <FilterIcon className="w-4 h-4" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as FilterBy)}
                className="px-3 py-2 bg-card border border-border rounded-md text-sm"
              >
                <option value="all">All Tasks</option>
                <option value="high-priority">High Priority</option>
                <option value="overdue">Overdue</option>
                <option value="my-tasks">My Tasks</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <SortAscIcon className="w-4 h-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="px-3 py-2 bg-card border border-border rounded-md text-sm"
              >
                <option value="created">Created Date</option>
                <option value="title">Title</option>
                <option value="priority">Priority</option>
                <option value="dueDate">Due Date</option>
                <option value="status">Status</option>
              </select>
              <button
                onClick={() => setSortDesc(!sortDesc)}
                className="p-2 hover:bg-hover rounded-md"
              >
                {sortDesc ? "↓" : "↑"}
              </button>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-muted border-b border-border text-sm font-medium text-muted-foreground">
            <div className="col-span-4">Task</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Priority</div>
            <div className="col-span-2">Due Date</div>
            <div className="col-span-2">Assignees</div>
            <div className="col-span-1">Progress</div>
          </div>

          {/* Task Rows */}
          <div className="divide-y divide-border">
            {sortedAndFilteredCards.map((card) => {
              const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();
              const completedSubtasks = card.subtasks.filter(st => st.completed).length;
              const progress = card.subtasks.length > 0 
                ? Math.round((completedSubtasks / card.subtasks.length) * 100)
                : 0;

              return (
                <div
                  key={card.id}
                  className="grid grid-cols-12 gap-4 p-4 hover:bg-hover transition-colors cursor-pointer"
                >
                  {/* Task */}
                  <div className="col-span-4">
                    <div className="font-medium">{card.title}</div>
                    {card.description && (
                      <div className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {card.description}
                      </div>
                    )}
                    {card.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {card.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <span className={cn("capitalize", getStatusColor(card.status))}>
                      {card.status.replace("-", " ")}
                    </span>
                  </div>

                  {/* Priority */}
                  <div className="col-span-1">
                    <div className="flex items-center space-x-1">
                      {(card.priority === "high" || card.priority === "critical") && (
                        <AlertTriangleIcon className="w-4 h-4" />
                      )}
                      <span className={cn("capitalize text-sm", getPriorityColor(card.priority))}>
                        {card.priority}
                      </span>
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="col-span-2">
                    {card.dueDate ? (
                      <div className={cn(
                        "flex items-center space-x-1 text-sm",
                        isOverdue ? "text-error" : "text-muted-foreground"
                      )}>
                        <CalendarIcon className="w-4 h-4" />
                        <span>{new Date(card.dueDate).toLocaleDateString()}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No date</span>
                    )}
                  </div>

                  {/* Assignees */}
                  <div className="col-span-2">
                    {card.assignees.length > 0 ? (
                      <div className="flex -space-x-1">
                        {card.assignees.slice(0, 3).map((assignee, idx) => (
                          <div
                            key={assignee}
                            className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium border-2 border-card"
                          >
                            {assignee.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {card.assignees.length > 3 && (
                          <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs border-2 border-card">
                            +{card.assignees.length - 3}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Unassigned</span>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="col-span-1">
                    {card.subtasks.length > 0 ? (
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {progress}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {sortedAndFilteredCards.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No tasks match your current filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}