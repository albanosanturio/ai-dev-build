import { useRef, useState, type DragEvent } from 'react';
import type { ColumnId, Task } from '../../types';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  columnId: ColumnId;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onArchiveTask: (id: string) => void;
  onMoveTask: (id: string, toColumn: ColumnId, toIndex: number) => void;
}

export function Column({
  columnId,
  title,
  tasks,
  onEditTask,
  onDeleteTask,
  onArchiveTask,
  onMoveTask,
}: ColumnProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  function computeDropIndex(clientY: number): number {
    const container = listRef.current;
    if (!container) return tasks.length;
    const cards = Array.from(container.querySelectorAll<HTMLElement>('[data-task-card]'));
    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) return i;
    }
    return cards.length;
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDraggingOver(true);
    setDragOverIndex(computeDropIndex(e.clientY));
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setIsDraggingOver(false);
      setDragOverIndex(null);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    const dropIndex = dragOverIndex ?? tasks.length;
    setIsDraggingOver(false);
    setDragOverIndex(null);
    if (taskId) onMoveTask(taskId, columnId, dropIndex);
  }

  return (
    <div className="flex flex-col rounded-lg bg-slate-100/60">
      <div className="flex items-center justify-between px-3 py-3">
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500">
          {tasks.length}
        </span>
      </div>
      <div
        ref={listRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex min-h-[140px] flex-1 flex-col gap-2 rounded-lg p-2 pt-0 transition-colors ${
          isDraggingOver ? 'bg-slate-200/70' : ''
        }`}
      >
        {tasks.length === 0 && !isDraggingOver && (
          <p className="px-2 py-6 text-center text-xs text-slate-400">No tasks</p>
        )}
        {tasks.map((task, index) => (
          <div key={task.id}>
            {isDraggingOver && dragOverIndex === index && <DropIndicator />}
            <TaskCard
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task.id)}
              onArchive={columnId === 'done' ? () => onArchiveTask(task.id) : undefined}
            />
          </div>
        ))}
        {isDraggingOver && dragOverIndex === tasks.length && <DropIndicator />}
      </div>
    </div>
  );
}

function DropIndicator() {
  return <div className="h-1 rounded-full bg-slate-400/60" />;
}
