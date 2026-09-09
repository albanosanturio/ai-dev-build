import { useEffect, useState } from 'react';
import { tasksApi } from '../../api/tasksApi';
import type { Task } from '../../types';
import { formatArchivedTimestamp } from '../../utils/date';

/** Read-only chronological log of archived tasks, newest first. */
export function ArchiveView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    tasksApi
      .listArchivedTasks()
      .then((archived) => {
        if (!cancelled) setTasks(archived);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="py-12 text-center text-sm text-slate-400">Loading archive…</p>;
  }

  if (tasks.length === 0) {
    return <p className="py-12 text-center text-sm text-slate-400">No archived tasks yet.</p>;
  }

  return (
    <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-start justify-between gap-4 px-4 py-3">
          <p className="text-sm text-slate-700">{task.description || task.title}</p>
          <span className="shrink-0 whitespace-nowrap text-xs text-slate-400">
            {formatArchivedTimestamp(task.archived_at!)}
          </span>
        </li>
      ))}
    </ul>
  );
}
