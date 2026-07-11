import { type JSX } from "solid-js";

import { useCurrentLocale } from "worldality/solid";

import { Controls } from "./Controls";
import { Header } from "./Header";
import { ThemeProvider } from "./ThemeProvider";

type LayoutProps = {
  children: JSX.Element;
};

export function Layout(props: LayoutProps) {
  const locale = useCurrentLocale();

  return (
    <ThemeProvider>
      <div
        dir={locale().direction}
        class="flex min-h-screen items-start bg-background font-sans antialiased"
      >
        <div class="mx-auto w-full max-w-4xl px-4 py-16">
          <Header />
          <main class="space-y-8">
            <Controls />
            {props.children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
