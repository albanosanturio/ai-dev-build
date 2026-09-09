type View = 'board' | 'archive';

interface HeaderProps {
  view: View;
  onChangeView: (view: View) => void;
  onAddTask: () => void;
}

export function Header({ view, onChangeView, onAddTask }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">PicoBoard</h1>
          <nav className="flex items-center rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => onChangeView('board')}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                view === 'board' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Board
            </button>
            <button
              type="button"
              onClick={() => onChangeView('archive')}
              className={`rounded-md px-3 py-1.5 text-sm transition ${
                view === 'archive' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Archive
            </button>
          </nav>
        </div>
        {view === 'board' && (
          <button
            type="button"
            onClick={onAddTask}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            + Add Task
          </button>
        )}
      </div>
    </header>
  );
}
