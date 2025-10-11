
import { useState, useEffect } from "react";
import { Card, Subtask } from "@/types/project";
import { useProjects } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  XIcon, 
  CalendarIcon, 
  UserIcon, 
  TagIcon,
  CheckSquareIcon,
  PlusIcon,
  TrashIcon,
  ClockIcon,
  PlayIcon,
  PauseIcon
} from "lucide-react";

interface CardModalProps {
  card?: Card | null;
  columnId?: string | null;
  onClose: () => void;
}

export function CardModal({ card, columnId, onClose }: CardModalProps) {
  const { addCard, updateCard, deleteCard } = useProjects();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as Card["priority"],
    dueDate: "",
    tags: [] as string[],
    assignees: [] as string[]
  });
  const [newTag, setNewTag] = useState("");
  const [newSubtask, setNewSubtask] = useState("");

  useEffect(() => {
    if (card) {
      setFormData({
        title: card.title,
        description: card.description || "",
        priority: card.priority,
        dueDate: card.dueDate || "",
        tags: card.tags,
        assignees: card.assignees
      });
    }
  }, [card]);

  const handleSave = () => {
    if (!formData.title.trim()) return;

    if (card) {
      updateCard(card.id, {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim()
      });
    } else if (columnId) {
      addCard({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: columnId as any,
        columnId,
        subtasks: [],
        attachments: [],
        comments: [],
        timeTracking: { isActive: false },
        dependencies: []
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (card && confirm("Are you sure you want to delete this card?")) {
      deleteCard(card.id);
      onClose();
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addSubtask = () => {
    if (newSubtask.trim() && card) {
      const newSub: Subtask = {
        id: `subtask-${Date.now()}`,
        title: newSubtask.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      updateCard(card.id, {
        subtasks: [...card.subtasks, newSub]
      });
      setNewSubtask("");
    }
  };

  const toggleSubtask = (subtaskId: string) => {
    if (card) {
      updateCard(card.id, {
        subtasks: card.subtasks.map(st => 
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        )
      });
    }
  };

  const deleteSubtask = (subtaskId: string) => {
    if (card) {
      updateCard(card.id, {
        subtasks: card.subtasks.filter(st => st.id !== subtaskId)
      });
    }
  };

  const toggleTimeTracking = () => {
    if (card) {
      const isActive = !card.timeTracking.isActive;
      updateCard(card.id, {
        timeTracking: {
          ...card.timeTracking,
          isActive,
          startedAt: isActive ? new Date().toISOString() : card.timeTracking.startedAt
        }
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {card ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Task title..."
              className="text-lg font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add a description..."
              rows={3}
            />
          </div>

          {/* Priority and Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Card["priority"] }))}
                className="w-full mt-1 p-2 border border-border rounded-md bg-background"
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Due Date
              </label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <TagIcon className="w-4 h-4" />
              Tags
            </label>
            <div className="mt-2 space-y-2">
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-md text-sm"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)}>
                      <XIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button onClick={addTag} variant="outline" size="sm">
                  <PlusIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Subtasks */}
          {card && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <CheckSquareIcon className="w-4 h-4" />
                  Subtasks ({card.subtasks.filter(st => st.completed).length}/{card.subtasks.length})
                </label>
                {card.timeTracking && (
                  <Button
                    onClick={toggleTimeTracking}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {card.timeTracking.isActive ? (
                      <>
                        <PauseIcon className="w-4 h-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <PlayIcon className="w-4 h-4" />
                        Start
                      </>
                    )}
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {card.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleSubtask(subtask.id)}
                      className="rounded"
                    />
                    <span className={cn(
                      "flex-1",
                      subtask.completed && "line-through text-muted-foreground"
                    )}>
                      {subtask.title}
                    </span>
                    <button
                      onClick={() => deleteSubtask(subtask.id)}
                      className="text-muted-foreground hover:text-error"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Add subtask..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSubtask();
                      }
                    }}
                  />
                  <Button onClick={addSubtask} variant="outline" size="sm">
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <div>
              {card && (
                <Button onClick={handleDelete} variant="outline" className="text-error hover:bg-error/10">
                  Delete Task
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {card ? "Save Changes" : "Create Task"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}