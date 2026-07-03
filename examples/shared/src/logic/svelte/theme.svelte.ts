/**
 * Svelte utilities for theme management
 *
 * Provides theme state management with automatic DOM updates
 * and localStorage persistence for Svelte 5 (runes).
 */
import {
  applyTheme as applyThemeToDOM,
  getInitialTheme,
  type Theme,
  toggleTheme as toggleThemeValue,
} from "../theme";

export function createTheme() {
  let theme = $state<Theme>(getInitialTheme());

  // Apply theme changes to DOM
  $effect(() => {
    if (typeof window !== "undefined") {
      applyThemeToDOM(theme);
    }
  });

  return {
    get value() {
      return theme;
    },
    toggle() {
      theme = toggleThemeValue(theme);
    },
  };
}
