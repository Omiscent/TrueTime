import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTheme } from './useTheme';

function mockMatchMedia(prefersDark: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const mql = {
    matches: prefersDark,
    media: '(prefers-color-scheme: dark)',
    addEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener);
    },
  };
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mql));
  return {
    fireChange: (matches: boolean) => {
      mql.matches = matches;
      listeners.forEach((listener) => listener({ matches } as MediaQueryListEvent));
    },
  };
}

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('defaults to system theme and resolves it from the OS preference', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('system');
    expect(result.current.resolvedTheme).toBe('dark');
  });

  it('applies the dark class to <html> only when the resolved theme is dark', () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useTheme());

    expect(document.documentElement.classList.contains('dark')).toBe(false);

    act(() => {
      result.current.setTheme('dark');
    });
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => {
      result.current.setTheme('light');
    });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('persists the chosen theme to localStorage and reloads it on next mount', () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });
    expect(localStorage.getItem('theme')).toBe('dark');

    const { result: secondMount } = renderHook(() => useTheme());
    expect(secondMount.current.theme).toBe('dark');
    expect(secondMount.current.resolvedTheme).toBe('dark');
  });

  it('tracks live OS preference changes while on the system theme', () => {
    const { fireChange } = mockMatchMedia(false);
    const { result } = renderHook(() => useTheme());

    expect(result.current.resolvedTheme).toBe('light');

    act(() => {
      fireChange(true);
    });
    expect(result.current.resolvedTheme).toBe('dark');
  });
});
