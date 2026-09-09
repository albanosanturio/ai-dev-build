import { useCallback, useEffect, useState } from 'react';
import { tasksApi } from '../api/tasksApi';
import type { ColumnId, Task, TaskInput } from '../types';

/** Loads and mutates active board tasks, going through `tasksApi` only. */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const active = await tasksApi.listActiveTasks();
      setTasks(active);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load tasks');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const createTask = useCallback(
    async (input: TaskInput) => {
      await tasksApi.createTask(input);
      await refresh();
    },
    [refresh],
  );

  const updateTask = useCallback(
    async (id: string, patch: TaskInput) => {
      await tasksApi.updateTask(id, patch);
      await refresh();
    },
    [refresh],
  );

  const deleteTask = useCallback(async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await tasksApi.deleteTask(id);
  }, []);

  const archiveTask = useCallback(async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await tasksApi.archiveTask(id);
  }, []);

  const moveTask = useCallback(async (id: string, toColumn: ColumnId, toIndex: number) => {
    const updated = await tasksApi.moveTask(id, toColumn, toIndex);
    setTasks(updated);
  }, []);

  return { tasks, loading, error, createTask, updateTask, deleteTask, archiveTask, moveTask };
}
