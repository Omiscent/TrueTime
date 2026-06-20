export type StopwatchStatus = 'running' | 'paused' | 'stopped';

export interface Stopwatch {
  id: string;
  name: string;
  status: StopwatchStatus;
  /** Milliseconds accumulated across all previous running periods. */
  accumulatedTime: number;
  /** Unix epoch ms when the stopwatch was last started; null when not running. */
  lastStartedTimestamp: number | null;
  /** Unix epoch ms of the last create/start/pause/reset; drives most-recently-used ordering. */
  lastActiveAt: number | null;
}
