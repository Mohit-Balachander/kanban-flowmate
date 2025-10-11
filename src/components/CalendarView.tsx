// src/components/CalendarView.tsx
import { Project, Card } from "@/types/project";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useProjects } from "@/hooks/useProjects";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  PlusIcon,
  FilterIcon,
  AlertTriangleIcon,
  ClockIcon,
  UserIcon,
  CheckSquareIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CardModal } from "./CardModal";

interface CalendarViewProps {
  project: Project;
}

type CalendarFilter = "all" | "high-priority" | "overdue" | "my-tasks";
type ViewMode = "month" | "week";

export function CalendarView({ project }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [filter, setFilter] = useState<CalendarFilter>("all");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createCardDate, setCreateCardDate] = useState<string | null>(null);
  const { updateCard } = useProjects();

  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const startOfCalendar = new Date(startOfMonth);
  startOfCalendar.setDate(startOfCalendar.getDate() - startOfCalendar.getDay());

  const days = [];
  const current = new Date(startOfCalendar);

  while (current <= endOfMonth || current.getDay() !== 0) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const getCardsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return project.cards
      .filter((card) => card.dueDate === dateStr)
      .filter((card) => {
        switch (filter) {
          case "high-priority":
            return card.priority === "high" || card.priority === "critical";
          case "overdue":
            return new Date(card.dueDate || "") < new Date();
          case "my-tasks":
            return card.assignees.length > 0; // In real app, filter by current user
          default:
            return true;
        }
      });
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    );
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleCreateCard = (dateStr: string) => {
    setCreateCardDate(dateStr);
    setSelectedCard(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
    setCreateCardDate(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const todaysCards = getCardsForDate(new Date());
  const upcomingCards = project.cards
    .filter((card) => {
      if (!card.dueDate) return false;
      const dueDate = new Date(card.dueDate);
      const today = new Date();
      const weekFromNow = new Date();
      weekFromNow.setDate(today.getDate() + 7);
      return dueDate > today && dueDate <= weekFromNow;
    })
    .sort(
      (a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
    );

  return (
    <div className="h-full bg-background">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <Badge variant="secondary">
              {project.cards.filter((c) => c.dueDate).length} scheduled tasks
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            {/* Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <FilterIcon className="w-4 h-4 mr-2" />
                  {filter === "all"
                    ? "All Tasks"
                    : filter === "high-priority"
                    ? "High Priority"
                    : filter === "overdue"
                    ? "Overdue"
                    : "My Tasks"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilter("all")}>
                  All Tasks
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("high-priority")}>
                  High Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("overdue")}>
                  Overdue
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("my-tasks")}>
                  My Tasks
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Navigation */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(-1)}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(1)}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 bg-muted">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="p-4 text-center text-sm font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {days.map((day, index) => {
                  const isCurrentMonth =
                    day.getMonth() === currentDate.getMonth();
                  const isToday =
                    day.toDateString() === new Date().toDateString();
                  const cardsForDay = getCardsForDate(day);
                  const dateStr = day.toISOString().split("T")[0];

                  return (
                    <div
                      key={index}
                      className={cn(
                        "min-h-32 p-2 border-r border-b border-border/50 group hover:bg-muted/30 transition-colors",
                        !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                        isToday && "bg-primary/5 border-primary/30"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={cn(
                            "text-sm font-medium",
                            isToday &&
                              "w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center"
                          )}
                        >
                          {day.getDate()}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 p-1 h-6 w-6"
                          onClick={() => handleCreateCard(dateStr)}
                        >
                          <PlusIcon className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="space-y-1">
                        {cardsForDay.slice(0, 3).map((card) => {
                          const isOverdue =
                            new Date(card.dueDate!) < new Date();
                          return (
                            <div
                              key={card.id}
                              onClick={() => handleCardClick(card)}
                              className={cn(
                                "text-xs p-2 rounded cursor-pointer transition-colors border-l-2",
                                getPriorityColor(card.priority),
                                isOverdue
                                  ? "bg-red-50 text-red-800 border-red-500"
                                  : "bg-primary/10 text-primary hover:bg-primary/20"
                              )}
                            >
                              <div className="font-medium truncate">
                                {card.title}
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                {card.assignees.length > 0 && (
                                  <UserIcon className="w-3 h-3" />
                                )}
                                {card.subtasks.length > 0 && (
                                  <span className="text-xs">
                                    {
                                      card.subtasks.filter((st) => st.completed)
                                        .length
                                    }
                                    /{card.subtasks.length}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {cardsForDay.length > 3 && (
                          <div className="text-xs text-muted-foreground px-2">
                            +{cardsForDay.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Tasks */}
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Today ({todaysCards.length})
              </h3>
              <div className="space-y-2">
                {todaysCards.slice(0, 5).map((card) => {
                  const isOverdue = new Date(card.dueDate!) < new Date();
                  return (
                    <div
                      key={card.id}
                      onClick={() => handleCardClick(card)}
                      className="p-2 rounded border cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">
                          {card.title}
                        </span>
                        {isOverdue && (
                          <AlertTriangleIcon className="w-3 h-3 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs",
                            card.priority === "critical" &&
                              "bg-red-100 text-red-800",
                            card.priority === "high" &&
                              "bg-orange-100 text-orange-800"
                          )}
                        >
                          {card.priority}
                        </Badge>
                        {card.timeTracking.isActive && (
                          <ClockIcon className="w-3 h-3 text-green-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
                {todaysCards.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No tasks due today
                  </p>
                )}
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <ClockIcon className="w-4 h-4 mr-2" />
                This Week ({upcomingCards.length})
              </h3>
              <div className="space-y-2">
                {upcomingCards.slice(0, 5).map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    className="p-2 rounded border cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="text-sm font-medium truncate">
                      {card.title}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date(card.dueDate!).toLocaleDateString()}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {card.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
                {upcomingCards.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No upcoming tasks
                  </p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-semibold mb-3">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Tasks:</span>
                  <span>{project.cards.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Due Today:</span>
                  <span
                    className={todaysCards.length > 0 ? "text-orange-600" : ""}
                  >
                    {todaysCards.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Overdue:</span>
                  <span className="text-red-600">
                    {
                      project.cards.filter(
                        (c) => c.dueDate && new Date(c.dueDate) < new Date()
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="text-green-600">
                    {project.cards.filter((c) => c.status === "done").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Modal */}
      {isModalOpen && (
        <CardModal
          card={selectedCard}
          columnId={createCardDate ? "todo" : undefined}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
