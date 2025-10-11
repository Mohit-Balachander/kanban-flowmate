// src/components/KanbanColumn.tsx
import { useState } from "react";
import { Card, Column } from "@/types/project";
import { KanbanCard } from "./KanbanCard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PlusIcon, 
  MoreVerticalIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  SettingsIcon,
  TrendingUpIcon,
  ArchiveIcon,
  EditIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

interface KanbanColumnProps {
  column: Column;
  cards: Card[];
  onCardClick: (card: Card) => void;
  onCreateCard: () => void;
  isDraggedOver?: boolean;
}

export function KanbanColumn({ 
  column, 
  cards, 
  onCardClick, 
  onCreateCard,
  isDraggedOver = false 
}: KanbanColumnProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Calculate column statistics
  const totalCards = cards.length;
  const completedSubtasks = cards.reduce((sum, card) => 
    sum + card.subtasks.filter(st => st.completed).length, 0
  );
  const totalSubtasks = cards.reduce((sum, card) => sum + card.subtasks.length, 0);
  const overdueCards = cards.filter(card => 
    card.dueDate && new Date(card.dueDate) < new Date()
  ).length;
  const priorityCards = cards.filter(card => 
    card.priority === "high" || card.priority === "critical"
  ).length;
  const activeTimeTracking = cards.filter(card => 
    card.timeTracking.isActive
  ).length;

  // WIP limit warning
  const isWipLimitExceeded = column.wipLimit && totalCards > column.wipLimit;
  const wipLimitApproaching = column.wipLimit && totalCards >= column.wipLimit * 0.8;

  // Progress calculation for in-progress columns
  const progressPercent = totalSubtasks > 0 
    ? Math.round((completedSubtasks / totalSubtasks) * 100) 
    : 0;

  return (
    <div
      className={cn(
        "bg-card rounded-lg border border-border/50 flex flex-col transition-all duration-200",
        isDraggedOver && "ring-2 ring-primary/50 bg-primary/5",
        isWipLimitExceeded && "border-error/50 bg-error/5"
      )}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: column.color }}
            />
            <h3 className="font-semibold text-sm">{column.name}</h3>
            <Badge variant="secondary" className="text-xs">
              {totalCards}
            </Badge>
            {column.wipLimit && (
              <Badge 
                variant={isWipLimitExceeded ? "destructive" : wipLimitApproaching ? "outline" : "secondary"}
                className="text-xs"
              >
                {totalCards}/{column.wipLimit}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 h-6 w-6"
            >
              {isCollapsed ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronUpIcon className="w-4 h-4" />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                  <MoreVerticalIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <EditIcon className="w-4 h-4 mr-2" />
                  Edit Column
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Set WIP Limit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <TrendingUpIcon className="w-4 h-4 mr-2" />
                  Column Analytics
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <ArchiveIcon className="w-4 h-4 mr-2" />
                  Archive All Cards
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Column Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-3">
            {priorityCards > 0 && (
              <span className="flex items-center space-x-1 text-error">
                <AlertTriangleIcon className="w-3 h-3" />
                <span>{priorityCards}</span>
              </span>
            )}
            {overdueCards > 0 && (
              <span className="flex items-center space-x-1 text-error">
                <ClockIcon className="w-3 h-3" />
                <span>{overdueCards}</span>
              </span>
            )}
            {activeTimeTracking > 0 && (
              <span className="flex items-center space-x-1 text-success">
                <ClockIcon className="w-3 h-3" />
                <span>{activeTimeTracking} active</span>
              </span>
            )}
          </div>
          
          {totalSubtasks > 0 && (
            <span className="flex items-center space-x-1">
              <CheckCircleIcon className="w-3 h-3" />
              <span>{completedSubtasks}/{totalSubtasks}</span>
            </span>
          )}
        </div>

        {/* Progress bar for in-progress columns */}
        {totalSubtasks > 0 && column.id === "in-progress" && (
          <div className="mt-2">
            <Progress value={progressPercent} className="h-1" />
          </div>
        )}

        {/* WIP Limit Warning */}
        {isWipLimitExceeded && (
          <div className="mt-2 p-2 bg-error/10 border border-error/20 rounded text-xs text-error">
            WIP limit exceeded! Consider moving cards to other columns.
          </div>
        )}
      </div>

      {/* Cards Container */}
      <div 
        className={cn(
          "flex-1 p-2 transition-all duration-200",
          isCollapsed ? "h-0 overflow-hidden p-0" : "min-h-24"
        )}
      >
        <div className="space-y-3">
          {cards.map((card, index) => (
            <KanbanCard
              key={card.id}
              card={card}
              index={index}
              onClick={() => onCardClick(card)}
            />
          ))}
          
          {/* Add Card Button */}
          <Button
            variant="ghost"
            onClick={onCreateCard}
            className={cn(
              "w-full border-2 border-dashed border-border/30 hover:border-border hover:bg-muted/50 transition-colors",
              isDraggedOver && "border-primary/50"
            )}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add a card
          </Button>
        </div>
      </div>
      
      {/* Column Footer (when collapsed) */}
      {isCollapsed && (
        <div className="p-2 border-t border-border/30 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(false)}
            className="text-xs"
          >
            Show {totalCards} cards
          </Button>
        </div>
      )}
    </div>
  );
}