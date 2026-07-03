/**
 * React hook for theme management
 *
 * Provides theme state and toggle function with automatic DOM updates
 * and localStorage persistence.
 */
import { useEffect, useState } from "react";

import { applyTheme, getInitialTheme, type Theme, toggleTheme } from "../theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = () => {
    setTheme((prev) => toggleTheme(prev));
  };

  return { theme, toggle };
}
