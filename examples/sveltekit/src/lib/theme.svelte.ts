import { getContext, setContext } from "svelte";

export type Theme = "light" | "dark";
type ThemeState = { readonly value: Theme; toggle: () => void };
const themeKey = Symbol("theme");

export function provideTheme(initialTheme: Theme) {
  let theme = $state<Theme>(initialTheme);
  $effect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
    document.cookie = `theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
  });
  const state: ThemeState = {
    get value() {
      return theme;
    },
    toggle: () => {
      theme = theme === "light" ? "dark" : "light";
    },
  };
  setContext(themeKey, state);
  return state;
}

export function useTheme() {
  const state = getContext<ThemeState>(themeKey);
  if (!state) throw new Error("useTheme must be used below the root layout");
  return state;
}
