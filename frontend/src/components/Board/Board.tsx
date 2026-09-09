import type { ColumnId, Task } from '../../types';
import { Column } from './Column';

const COLUMNS: { id: ColumnId; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
];

interface BoardProps {
  tasks: Task[];
  loading: boolean;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onArchiveTask: (id: string) => void;
  onMoveTask: (id: string, toColumn: ColumnId, toIndex: number) => void;
}

export function Board({ tasks, loading, onEditTask, onDeleteTask, onArchiveTask, onMoveTask }: BoardProps) {
  if (loading) {
    return <p className="py-12 text-center text-sm text-slate-400">Loading board…</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {COLUMNS.map((col) => (
        <Column
          key={col.id}
          columnId={col.id}
          title={col.label}
          tasks={tasks.filter((t) => t.column === col.id).sort((a, b) => a.order - b.order)}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onArchiveTask={onArchiveTask}
          onMoveTask={onMoveTask}
        />
      ))}
    </div>
  );
}
