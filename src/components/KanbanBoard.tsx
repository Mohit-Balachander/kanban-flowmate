src/components/KanbanBoard.tsximport { useState } from "react";
import { Project, Card } from "@/types/project";
import { KanbanColumn } from "./KanbanColumn";
import { CardModal } from "./CardModal";
import { useProjects } from "@/hooks/useProjects";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";

interface KanbanBoardProps {
  project: Project;
}

export function KanbanBoard({ project }: KanbanBoardProps) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createCardInColumn, setCreateCardInColumn] = useState<string | null>(null);
  const { updateCard } = useProjects();

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleCreateCard = (columnId: string) => {
    setCreateCardInColumn(columnId);
    setSelectedCard(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
    setCreateCardInColumn(null);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const card = project.cards.find(c => c.id === draggableId);

    if (card && destination.droppableId !== card.columnId) {
      updateCard(draggableId, { 
        columnId: destination.droppableId,
        status: destination.droppableId as any
      });
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-background to-muted/20">
      <div className="h-full overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 p-6 h-full min-w-max">
            {project.columns.map((column) => {
              const columnCards = project.cards.filter(card => card.columnId === column.id);
              return (
                <Droppable key={column.id} droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="min-w-80"
                    >
                      <KanbanColumn
                        column={column}
                        cards={columnCards}
                        onCardClick={handleCardClick}
                        onCreateCard={() => handleCreateCard(column.id)}
                        isDraggedOver={snapshot.isDraggingOver}
                      />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {isModalOpen && (
        <CardModal
          card={selectedCard}
          columnId={createCardInColumn}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}