import { useCallback, useState } from 'react';

export type SortStrategy = 'recent' | 'created' | 'name';

const STORAGE_KEY = 'sortStrategy';

function loadSortStrategy(): SortStrategy {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'recent' || stored === 'created' || stored === 'name' ? stored : 'recent';
}

/** Tracks the user's chosen list-sort strategy, persisted across launches. */
export function useSortStrategy() {
  const [sortStrategy, setSortStrategyState] = useState<SortStrategy>(loadSortStrategy);

  const setSortStrategy = useCallback((next: SortStrategy) => {
    localStorage.setItem(STORAGE_KEY, next);
    setSortStrategyState(next);
  }, []);

  return { sortStrategy, setSortStrategy };
}
