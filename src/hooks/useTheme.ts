import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

function loadTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
}

/**
 * Tracks the user's chosen theme plus the resolved light/dark value to
 * actually render, and keeps the `dark` class on <html> in sync so
 * Tailwind's `dark:` variants apply. Defaults to 'system' so a first-run
 * user gets their OS preference rather than a hardcoded theme.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(loadTheme);
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () => window.matchMedia(MEDIA_QUERY).matches
  );

  useEffect(() => {
    const media = window.matchMedia(MEDIA_QUERY);
    const onChange = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const resolvedTheme: 'light' | 'dark' =
    theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next);
    setThemeState(next);
  }, []);

  return { theme, resolvedTheme, setTheme };
}
