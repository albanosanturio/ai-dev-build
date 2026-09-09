export type ColumnId = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  column: ColumnId;
  due_date: string | null; // YYYY-MM-DD
  is_hot: boolean;
  order: number;
  archived_at: string | null; // ISO timestamp, null while active
}

/** Fields a caller supplies when creating or editing a task. */
export interface TaskInput {
  title: string;
  description?: string;
  due_date?: string | null;
  is_hot?: boolean;
}
