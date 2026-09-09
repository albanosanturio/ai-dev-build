import type { ColumnId } from '../types';

export function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Overdue only applies to active cards outside the Done column. */
export function isOverdue(dueDate: string | null, column: ColumnId): boolean {
  if (!dueDate || column === 'done') return false;
  return dueDate < todayISODate();
}

/** Formats an ISO timestamp as `YYYY-MM-DD HH:mm` for the archive log. */
export function formatArchivedTimestamp(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
