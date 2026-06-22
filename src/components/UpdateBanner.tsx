import { useAppUpdater } from '../hooks/useAppUpdater';

export function UpdateBanner() {
  const { status, update, progress, installUpdate } = useAppUpdater();

  if (status === 'idle' || status === 'checking' || status === 'error') {
    return null;
  }

  const isBusy = status === 'downloading' || status === 'installing';
  const percent =
    progress && progress.total > 0 ? Math.round((progress.downloaded / progress.total) * 100) : null;

  return (
    <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-teal-500/30 bg-teal-500/10 px-4 py-2.5 text-sm">
      <span className="text-teal-700 dark:text-teal-200">
        {status === 'available' && `Update available: v${update?.version}`}
        {status === 'downloading' && `Downloading update${percent !== null ? ` (${percent}%)` : '…'}`}
        {status === 'installing' && 'Installing update…'}
      </span>
      <button
        onClick={installUpdate}
        disabled={isBusy}
        className="shrink-0 rounded-md bg-teal-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isBusy ? 'Please wait…' : 'Update & Restart'}
      </button>
    </div>
  );
}
