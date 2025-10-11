import { Project } from "@/types/project";
import { cn } from "@/lib/utils";
import {
  MenuIcon,
  SearchIcon,
  BellIcon,
  UserIcon,
  LayoutGridIcon,
  CalendarIcon,
  ListIcon,
  FilterIcon,
  SortAscIcon,
  MoreHorizontalIcon,
} from "lucide-react";
interface HeaderProps {
  currentProject: Project | null;
  view: "board" | "calendar" | "list";
  onViewChange: (view: "board" | "calendar" | "list") => void;
  onSidebarToggle: () => void;
}
export function Header({
  currentProject,
  view,
  onViewChange,
  onSidebarToggle,
}: HeaderProps) {
  const viewOptions = [
    { key: "board" as const, label: "Board", icon: LayoutGridIcon },
    { key: "calendar" as const, label: "Calendar", icon: CalendarIcon },
    { key: "list" as const, label: "List", icon: ListIcon },
  ];
  return (
    <header className="bg-card border-b border-border px-4 py-3">
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        {/* Left section */}{" "}
        <div className="flex items-center space-x-4">
          {" "}
          <button
            onClick={onSidebarToggle}
            className="lg:hidden p-2 hover:bg-hover rounded-md"
          >
            {" "}
            <MenuIcon className="w-5 h-5" />{" "}
          </button>{" "}
          {currentProject && (
            <div className="flex items-center space-x-4">
              {" "}
              <div>
                {" "}
                <h1 className="text-xl font-bold">
                  {currentProject.name}
                </h1>{" "}
                <p className="text-sm text-muted-foreground">
                  {" "}
                  {currentProject.cards.length} tasks •{" "}
                  {currentProject.columns.length} columns{" "}
                </p>{" "}
              </div>{" "}
            </div>
          )}{" "}
        </div>{" "}
        {/* Center section - View switcher */}{" "}
        {currentProject && (
          <div className="hidden md:flex items-center bg-muted rounded-lg p-1">
            {" "}
            {viewOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.key}
                  onClick={() => onViewChange(option.key)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    view === option.key
                      ? "bg-card shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {" "}
                  <Icon className="w-4 h-4" /> <span>{option.label}</span>{" "}
                </button>
              );
            })}{" "}
          </div>
        )}{" "}
        {/* Right section */}{" "}
        <div className="flex items-center space-x-2">
          {" "}
          {currentProject && (
            <>
              {" "}
              <div className="hidden md:flex items-center space-x-2">
                {" "}
                <button className="flex items-center space-x-2 px-3 py-2 hover:bg-hover rounded-md text-sm">
                  {" "}
                  <FilterIcon className="w-4 h-4" /> <span>Filter</span>{" "}
                </button>{" "}
                <button className="flex items-center space-x-2 px-3 py-2 hover:bg-hover rounded-md text-sm">
                  {" "}
                  <SortAscIcon className="w-4 h-4" /> <span>Sort</span>{" "}
                </button>{" "}
              </div>{" "}
              <div className="w-px h-6 bg-border mx-2" />{" "}
            </>
          )}{" "}
          <div className="relative">
            {" "}
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />{" "}
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-64 pl-10 pr-4 py-2 bg-muted rounded-md text-sm border-0 focus:ring-2 focus:ring-primary"
            />{" "}
          </div>{" "}
          <button className="relative p-2 hover:bg-hover rounded-md">
            {" "}
            <BellIcon className="w-5 h-5" />{" "}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>{" "}
          </button>{" "}
          <button className="p-2 hover:bg-hover rounded-md">
            {" "}
            <UserIcon className="w-5 h-5" />{" "}
          </button>{" "}
          <button className="p-2 hover:bg-hover rounded-md">
            {" "}
            <MoreHorizontalIcon className="w-5 h-5" />{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </header>
  );
}
