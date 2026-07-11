import { inject, type InjectionKey, provide, ref, type Ref, watch } from "vue";

type Theme = "light" | "dark";
type ThemeState = { theme: Ref<Theme>; toggleTheme: () => void };
const themeKey: InjectionKey<ThemeState> = Symbol("theme");

export function provideTheme() {
  const theme = ref<Theme>("light");
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") theme.value = stored;
  }
  watch(
    theme,
    (value) => {
      if (typeof document === "undefined") return;
      document.documentElement.classList.toggle("dark", value === "dark");
      localStorage.setItem("theme", value);
    },
    { immediate: true },
  );
  const state = {
    theme,
    toggleTheme: () => {
      theme.value = theme.value === "light" ? "dark" : "light";
    },
  };
  provide(themeKey, state);
  return state;
}

export function useTheme() {
  const state = inject(themeKey);
  if (!state) throw new Error("useTheme must be used below the app layout");
  return state;
}
