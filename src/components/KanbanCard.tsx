import { Card } from "@/types/project";
import { cn } from "@/lib/utils";
import { Draggable } from "@hello-pangea/dnd";
import { 
  CalendarIcon, 
  MessageSquareIcon, 
  PaperclipIcon, 
  CheckSquareIcon,
  ClockIcon,
  UserIcon,
  AlertTriangleIcon
} from "lucide-react";

interface KanbanCardProps {
  card: Card;
  index: number;
  onClick: () => void;
}

const priorityColors = {
  none: "bg-priority-none",
  low: "bg-priority-low",
  medium: "bg-priority-medium", 
  high: "bg-priority-high",
  critical: "bg-priority-critical"
};

const priorityIcons = {
  critical: AlertTriangleIcon,
  high: AlertTriangleIcon,
  medium: AlertTriangleIcon,
  low: AlertTriangleIcon,
  none: () => null
};

export function KanbanCard({ card, index, onClick }: KanbanCardProps) {
  const completedSubtasks = card.subtasks.filter(st => st.completed).length;
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();
  const PriorityIcon = priorityIcons[card.priority];

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={cn(
            "bg-gradient-card border border-border/50 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
            snapshot.isDragging && "shadow-lg rotate-2 scale-105"
          )}
        >
          {/* Priority Indicator */}
          {card.priority !== "none" && (
            <div className={cn(
              "absolute top-0 left-0 w-full h-1 rounded-t-lg",
              priorityColors[card.priority]
            )} />
          )}

          {/* Card Header */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-sm leading-tight pr-2">{card.title}</h4>
              {card.priority !== "none" && PriorityIcon && (
                <PriorityIcon className={cn(
                  "w-4 h-4 flex-shrink-0",
                  card.priority === "critical" && "text-priority-critical",
                  card.priority === "high" && "text-priority-high",
                  card.priority === "medium" && "text-priority-medium",
                  card.priority === "low" && "text-priority-low"
                )} />
              )}
            </div>

            {card.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {card.description}
              </p>
            )}
          </div>

          {/* Tags */}
          {card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {card.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md"
                >
                  {tag}
                </span>
              ))}
              {card.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{card.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Card Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
            <div className="flex items-center space-x-3">
              {/* Due Date */}
              {card.dueDate && (
                <div className={cn(
                  "flex items-center space-x-1 text-xs",
                  isOverdue ? "text-error" : "text-muted-foreground"
                )}>
                  <CalendarIcon className="w-3 h-3" />
                  <span>{new Date(card.dueDate).toLocaleDateString()}</span>
                </div>
              )}

              {/* Subtasks */}
              {card.subtasks.length > 0 && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <CheckSquareIcon className="w-3 h-3" />
                  <span>{completedSubtasks}/{card.subtasks.length}</span>
                </div>
              )}

              {/* Comments */}
              {card.comments.length > 0 && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <MessageSquareIcon className="w-3 h-3" />
                  <span>{card.comments.length}</span>
                </div>
              )}

              {/* Attachments */}
              {card.attachments.length > 0 && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <PaperclipIcon className="w-3 h-3" />
                  <span>{card.attachments.length}</span>
                </div>
              )}

              {/* Time Tracking */}
              {card.timeTracking.isActive && (
                <div className="flex items-center space-x-1 text-xs text-success">
                  <ClockIcon className="w-3 h-3" />
                  <span>Active</span>
                </div>
              )}
            </div>

            {/* Assignees */}
            {card.assignees.length > 0 && (
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
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}