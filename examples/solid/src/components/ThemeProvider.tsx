import {
  createContext,
  createEffect,
  createSignal,
  type JSX,
  onMount,
  useContext,
} from "solid-js";

type Theme = "light" | "dark";
const ThemeContext = createContext<{
  theme: () => Theme;
  toggleTheme: () => void;
}>();

export function ThemeProvider(props: { children: JSX.Element }) {
  const [theme, setTheme] = createSignal<Theme>("light");
  const [hydrated, setHydrated] = createSignal(false);
  onMount(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") setTheme(stored);
    setHydrated(true);
  });
  createEffect(() => {
    if (!hydrated() || typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme() === "dark");
    localStorage.setItem("theme", theme());
  });
  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: () =>
          setTheme((value) => (value === "light" ? "dark" : "light")),
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used within ThemeProvider");
  return value;
}
