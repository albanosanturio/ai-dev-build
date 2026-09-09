import { useState, type FormEvent, type MouseEvent } from 'react';
import type { Task, TaskInput } from '../types';

interface TaskModalProps {
  /** null = create mode, a Task = edit mode. */
  task: Task | null;
  onClose: () => void;
  onCreate: (input: TaskInput) => Promise<void>;
  onUpdate: (id: string, patch: TaskInput) => Promise<void>;
}

export function TaskModal({ task, onClose, onCreate, onUpdate }: TaskModalProps) {
  const isEdit = task !== null;
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [dueDate, setDueDate] = useState(task?.due_date ?? '');
  const [isHot, setIsHot] = useState(task?.is_hot ?? false);
  const [submitting, setSubmitting] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError('Title is required');
      return;
    }

    setSubmitting(true);
    const input: TaskInput = {
      title: trimmedTitle,
      description,
      due_date: dueDate || null,
      is_hot: isHot,
    };
    try {
      if (isEdit && task) {
        await onUpdate(task.id, input);
      } else {
        await onCreate(input);
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  function stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl" onClick={stopPropagation}>
        <h2 className="mb-4 text-base font-semibold text-lakers-purple">{isEdit ? 'Edit Task' : 'Add Task'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Title</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError(null);
              }}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-lakers-purple focus:outline-none focus:ring-1 focus:ring-lakers-purple"
              placeholder="Task title"
            />
            {titleError && <p className="mt-1 text-xs text-red-500">{titleError}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-lakers-purple focus:outline-none focus:ring-1 focus:ring-lakers-purple"
              placeholder="Optional details"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">Due date</label>
              <input
                type="date"
                value={dueDate ?? ''}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-lakers-purple focus:outline-none focus:ring-1 focus:ring-lakers-purple"
              />
            </div>
            <label className="flex items-center gap-2 pt-5 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={isHot}
                onChange={(e) => setIsHot(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-lakers-purple focus:ring-lakers-purple"
              />
              🔥 HOT
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-lakers-purple px-4 py-2 text-sm font-bold text-lakers-gold hover:bg-lakers-purpleDark disabled:opacity-50"
            >
              {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
