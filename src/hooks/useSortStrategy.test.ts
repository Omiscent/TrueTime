import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useSortStrategy } from './useSortStrategy';

describe('useSortStrategy', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to recent', () => {
    const { result } = renderHook(() => useSortStrategy());
    expect(result.current.sortStrategy).toBe('recent');
  });

  it('persists the chosen strategy to localStorage and reloads it on next mount', () => {
    const { result } = renderHook(() => useSortStrategy());

    act(() => {
      result.current.setSortStrategy('name');
    });
    expect(localStorage.getItem('sortStrategy')).toBe('name');

    const { result: secondMount } = renderHook(() => useSortStrategy());
    expect(secondMount.current.sortStrategy).toBe('name');
  });

  it('ignores a corrupt stored value and falls back to recent', () => {
    localStorage.setItem('sortStrategy', 'bogus');
    const { result } = renderHook(() => useSortStrategy());
    expect(result.current.sortStrategy).toBe('recent');
  });
});
