import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Stopwatch } from '../types/stopwatch';
import { StopwatchList } from './StopwatchList';

function makeStopwatch(overrides: Partial<Stopwatch> = {}): Stopwatch {
  return {
    id: 'sw-1',
    name: 'Untitled',
    status: 'stopped',
    accumulatedTime: 0,
    lastStartedTimestamp: null,
    ...overrides,
  };
}

describe('StopwatchList ordering', () => {
  it('keeps stable order when nothing is running', () => {
    const stopwatches = [
      makeStopwatch({ id: 'a', name: 'Alpha' }),
      makeStopwatch({ id: 'b', name: 'Beta', status: 'paused' }),
      makeStopwatch({ id: 'c', name: 'Gamma' }),
    ];

    render(
      <StopwatchList
        stopwatches={stopwatches}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
        onDelete={vi.fn()}
        onRename={vi.fn()}
      />
    );

    const names = screen.getAllByRole('heading', { level: 3 }).map((el) => el.textContent);
    expect(names).toEqual(['Alpha', 'Beta', 'Gamma']);
  });

  it('floats the running stopwatch to the top without reordering the rest', () => {
    const stopwatches = [
      makeStopwatch({ id: 'a', name: 'Alpha' }),
      makeStopwatch({ id: 'b', name: 'Beta', status: 'running', lastStartedTimestamp: Date.now() }),
      makeStopwatch({ id: 'c', name: 'Gamma' }),
      makeStopwatch({ id: 'd', name: 'Delta', status: 'paused' }),
    ];

    render(
      <StopwatchList
        stopwatches={stopwatches}
        onStart={vi.fn()}
        onPause={vi.fn()}
        onReset={vi.fn()}
        onDelete={vi.fn()}
        onRename={vi.fn()}
      />
    );

    const names = screen.getAllByRole('heading', { level: 3 }).map((el) => el.textContent);
    expect(names).toEqual(['Beta', 'Alpha', 'Gamma', 'Delta']);
  });
});
