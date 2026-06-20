import { useState, type FormEvent } from 'react';

interface CreateStopwatchFormProps {
  onCreate: (name: string) => void;
}

export function CreateStopwatchForm({ onCreate }: CreateStopwatchFormProps) {
  const [name, setName] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    onCreate(name);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New stopwatch name..."
        className="flex-1 rounded-lg bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-1 ring-slate-200 transition-shadow focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:ring-slate-700"
      />
      <button
        type="submit"
        disabled={!name.trim()}
        className="rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-400 active:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Add
      </button>
    </form>
  );
}
