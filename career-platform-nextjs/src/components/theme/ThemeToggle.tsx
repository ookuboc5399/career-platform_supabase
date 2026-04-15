'use client';

import clsx from 'clsx';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme, resolved } = useTheme();

  if (!resolved) {
    return (
      <div
        className="h-9 w-[7.5rem] shrink-0 rounded-lg bg-gray-200/80 dark:bg-gray-700/50"
        aria-hidden
      />
    );
  }

  return (
    <div
      className="flex shrink-0 rounded-lg border border-gray-200 bg-gray-100/90 p-0.5 dark:border-gray-600 dark:bg-gray-800/90"
      role="group"
      aria-label="サイトの表示モード"
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-pressed={theme === 'light'}
        className={clsx(
          'rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm',
          theme === 'light'
            ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
        )}
      >
        Light
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-pressed={theme === 'dark'}
        className={clsx(
          'rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm',
          theme === 'dark'
            ? 'bg-gray-800 text-white shadow-sm dark:bg-gray-600'
            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
        )}
      >
        Black
      </button>
    </div>
  );
}
