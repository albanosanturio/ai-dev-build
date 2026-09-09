type View = 'board' | 'archive';

interface HeaderProps {
  view: View;
  onChangeView: (view: View) => void;
  onAddTask: () => void;
}

export function Header({ view, onChangeView, onAddTask }: HeaderProps) {
  return (
    <header className="border-b-4 border-lakers-gold bg-lakers-purple">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-semibold tracking-tight text-lakers-gold">Mamban</h1>
          <nav className="flex items-center rounded-lg bg-lakers-purpleDark p-1">
            <button
              type="button"
              onClick={() => onChangeView('board')}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                view === 'board'
                  ? 'bg-lakers-gold text-lakers-purpleDark shadow-sm'
                  : 'text-purple-200 hover:text-lakers-gold'
              }`}
            >
              Board
            </button>
            <button
              type="button"
              onClick={() => onChangeView('archive')}
              className={`rounded-md px-3 py-1.5 text-sm transition ${
                view === 'archive'
                  ? 'bg-lakers-gold text-lakers-purpleDark shadow-sm'
                  : 'text-purple-200 hover:text-lakers-gold'
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
            className="rounded-md bg-lakers-gold px-4 py-2 text-sm font-bold text-lakers-purpleDark transition hover:bg-lakers-goldDark"
          >
            + Add Task
          </button>
        )}
      </div>
    </header>
  );
}
