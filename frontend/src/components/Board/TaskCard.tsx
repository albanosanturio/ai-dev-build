import type { DragEvent, MouseEvent } from 'react';
import type { Task } from '../../types';
import { isOverdue } from '../../utils/date';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onArchive?: () => void;
}

export function TaskCard({ task, onEdit, onDelete, onArchive }: TaskCardProps) {
  const overdue = isOverdue(task.due_date, task.column);

  function handleDragStart(e: DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  }

  function stopAnd(handler: () => void) {
    return (e: MouseEvent) => {
      e.stopPropagation();
      handler();
    };
  }

  return (
    <div
      data-task-card
      draggable
      onDragStart={handleDragStart}
      onClick={onEdit}
      className="group cursor-grab rounded-md border border-slate-200 border-l-4 border-l-lakers-purple bg-white p-3 shadow-sm transition hover:shadow active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-800">{task.title}</p>
        <button
          type="button"
          onClick={stopAnd(onDelete)}
          aria-label="Delete task"
          className="shrink-0 rounded p-1 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
        >
          <TrashIcon />
        </button>
      </div>

      {(task.is_hot || overdue || task.due_date) && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {task.is_hot && (
            <span className="rounded-full bg-lakers-gold px-2 py-0.5 text-[11px] font-semibold text-lakers-purpleDark">
              🔥 HOT
            </span>
          )}
          {overdue && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-600">
              Overdue
            </span>
          )}
          {task.due_date && <span className="text-[11px] text-slate-400">{task.due_date}</span>}
        </div>
      )}

      {onArchive && (
        <button
          type="button"
          onClick={stopAnd(onArchive)}
          className="mt-3 w-full rounded-md border border-lakers-purple/30 py-1 text-xs font-medium text-lakers-purple transition hover:bg-lakers-purple/5"
        >
          Archive
        </button>
      )}
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
