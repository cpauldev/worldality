/**
 * Solid primitive for theme management
 *
 * Provides theme signal and toggle function with automatic DOM updates
 * and localStorage persistence.
 */
import { createEffect, createSignal } from "solid-js";

import { applyTheme, getInitialTheme, type Theme, toggleTheme } from "../theme";

export function useTheme() {
  const [theme, setTheme] = createSignal<Theme>(getInitialTheme());

  createEffect(() => {
    applyTheme(theme());
  });

  const toggle = () => {
    setTheme((prev) => toggleTheme(prev));
  };

  return { theme, toggle };
}
