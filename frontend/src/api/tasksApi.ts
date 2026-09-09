import type { ColumnId, Task, TaskInput } from '../types';

/**
 * Centralized backend access for tasks.
 *
 * This is the ONLY module that knows how task data is fetched and persisted.
 * Every component/hook goes through `tasksApi` instead of touching storage
 * directly. For now it's backed by an in-memory store (mirrored to
 * localStorage so state survives a page refresh) with a simulated network
 * delay. Swapping this out for real HTTP calls to a backend later should not
 * require changing any calling code — just the internals of these methods.
 */

const STORAGE_KEY = 'picoboard.tasks.v1';
const SIMULATED_LATENCY_MS = 250;

function delay<T>(value: T, ms = SIMULATED_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function clone(list: Task[]): Task[] {
  return list.map((t) => ({ ...t }));
}

function seedTasks(): Task[] {
  const iso = (daysFromToday: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromToday);
    return d.toISOString().slice(0, 10);
  };

  return [
    {
      id: crypto.randomUUID(),
      title: 'Define MVP scope',
      description: 'Write down what is in and out of scope for the mini kanban MVP.',
      column: 'done',
      due_date: iso(-3),
      is_hot: false,
      order: 0,
      archived_at: null,
    },
    {
      id: crypto.randomUUID(),
      title: 'Design the task data model',
      description: 'Task entity fields and the three-column enum.',
      column: 'done',
      due_date: null,
      is_hot: false,
      order: 1,
      archived_at: null,
    },
    {
      id: crypto.randomUUID(),
      title: 'Build board drag & drop',
      description: 'Cross-column and within-column reordering with native HTML5 DnD.',
      column: 'in_progress',
      due_date: iso(5),
      is_hot: true,
      order: 0,
      archived_at: null,
    },
    {
      id: crypto.randomUUID(),
      title: 'Wire up the archive view',
      description: '',
      column: 'todo',
      due_date: null,
      is_hot: false,
      order: 0,
      archived_at: null,
    },
    {
      id: crypto.randomUUID(),
      title: 'Fix overdue badge on Done column',
      description: 'Overdue badge should never show once a card is in Done.',
      column: 'todo',
      due_date: iso(-2),
      is_hot: true,
      order: 1,
      archived_at: null,
    },
    {
      id: crypto.randomUUID(),
      title: 'Polish empty states',
      description: '',
      column: 'todo',
      due_date: null,
      is_hot: false,
      order: 2,
      archived_at: null,
    },
  ];
}

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedTasks();
    const parsed = JSON.parse(raw) as Task[];
    if (!Array.isArray(parsed) || parsed.length === 0) return seedTasks();
    return parsed;
  } catch {
    return seedTasks();
  }
}

function saveTasks(tasks: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore persistence failures (e.g. private browsing storage limits) —
    // the in-memory store keeps working for the rest of the session.
  }
}

let tasks: Task[] = loadTasks();

/** Recompute `order` (0-based, per column) for every active task in a column. */
function reindexColumn(column: ColumnId) {
  tasks
    .filter((t) => t.column === column && !t.archived_at)
    .sort((a, b) => a.order - b.order)
    .forEach((t, i) => {
      t.order = i;
    });
}

export const tasksApi = {
  /** Active (non-archived) tasks across all columns. */
  async listActiveTasks(): Promise<Task[]> {
    return delay(clone(tasks.filter((t) => !t.archived_at)));
  },

  /** Archived tasks, newest archived first. */
  async listArchivedTasks(): Promise<Task[]> {
    const archived = tasks
      .filter((t): t is Task & { archived_at: string } => t.archived_at !== null)
      .sort((a, b) => (a.archived_at < b.archived_at ? 1 : -1));
    return delay(clone(archived));
  },

  /** Creates a task at the top of the To Do column. */
  async createTask(input: TaskInput): Promise<Task> {
    tasks
      .filter((t) => t.column === 'todo' && !t.archived_at)
      .forEach((t) => {
        t.order += 1;
      });

    const task: Task = {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      description: input.description?.trim() ?? '',
      column: 'todo',
      due_date: input.due_date || null,
      is_hot: input.is_hot ?? false,
      order: 0,
      archived_at: null,
    };
    tasks = [task, ...tasks];
    saveTasks(tasks);
    return delay({ ...task });
  },

  /** Updates a task's editable fields in place (does not change column/order). */
  async updateTask(id: string, patch: TaskInput): Promise<Task> {
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new Error(`Task ${id} not found`);

    task.title = patch.title.trim();
    task.description = patch.description?.trim() ?? '';
    task.due_date = patch.due_date || null;
    task.is_hot = patch.is_hot ?? false;

    saveTasks(tasks);
    return delay({ ...task });
  },

  /** Removes a task permanently, no confirmation. */
  async deleteTask(id: string): Promise<void> {
    const task = tasks.find((t) => t.id === id);
    tasks = tasks.filter((t) => t.id !== id);
    if (task) reindexColumn(task.column);
    saveTasks(tasks);
    return delay(undefined);
  },

  /** Archives a Done-column task, removing it from the active board. */
  async archiveTask(id: string): Promise<Task> {
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new Error(`Task ${id} not found`);

    task.archived_at = new Date().toISOString();
    reindexColumn(task.column);
    saveTasks(tasks);
    return delay({ ...task });
  },

  /** Moves a task to `toColumn` at `toIndex`, reindexing affected column(s). */
  async moveTask(id: string, toColumn: ColumnId, toIndex: number): Promise<Task[]> {
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new Error(`Task ${id} not found`);

    const fromColumn = task.column;
    task.column = toColumn;

    const destList = tasks
      .filter((t) => t.column === toColumn && !t.archived_at && t.id !== id)
      .sort((a, b) => a.order - b.order);
    const clampedIndex = Math.max(0, Math.min(toIndex, destList.length));
    destList.splice(clampedIndex, 0, task);
    destList.forEach((t, i) => {
      t.order = i;
    });

    if (fromColumn !== toColumn) {
      reindexColumn(fromColumn);
    }

    saveTasks(tasks);
    return delay(clone(tasks.filter((t) => !t.archived_at)));
  },
};
