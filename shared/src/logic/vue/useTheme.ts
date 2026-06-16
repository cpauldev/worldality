/**
 * Vue composable for theme management
 *
 * Provides theme state and toggle function with automatic DOM updates
 * and localStorage persistence.
 */
import { ref, watch } from "vue";

import { type Theme, applyTheme, getInitialTheme, toggleTheme } from "../theme";

export function useTheme() {
  const theme = ref<Theme>(getInitialTheme());

  watch(
    theme,
    (newTheme) => {
      applyTheme(newTheme);
    },
    { immediate: true },
  );

  const toggle = () => {
    theme.value = toggleTheme(theme.value);
  };

  return { theme, toggle };
}
