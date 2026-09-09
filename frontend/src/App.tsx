import { useState } from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board/Board';
import { ArchiveView } from './components/Archive/ArchiveView';
import { TaskModal } from './components/TaskModal';
import { useTasks } from './hooks/useTasks';
import type { Task } from './types';

type View = 'board' | 'archive';

export default function App() {
  const [view, setView] = useState<View>('board');
  // undefined = modal closed, null = create mode, Task = edit mode
  const [modalTask, setModalTask] = useState<Task | null | undefined>(undefined);
  const { tasks, loading, error, createTask, updateTask, deleteTask, archiveTask, moveTask } = useTasks();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header view={view} onChangeView={setView} onAddTask={() => setModalTask(null)} />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {view === 'board' ? (
          <Board
            tasks={tasks}
            loading={loading}
            onEditTask={(task) => setModalTask(task)}
            onDeleteTask={deleteTask}
            onArchiveTask={archiveTask}
            onMoveTask={moveTask}
          />
        ) : (
          <ArchiveView />
        )}
      </main>

      {modalTask !== undefined && (
        <TaskModal
          task={modalTask}
          onClose={() => setModalTask(undefined)}
          onCreate={createTask}
          onUpdate={updateTask}
        />
      )}
    </div>
  );
}
