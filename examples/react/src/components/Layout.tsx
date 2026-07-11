import { type ReactNode } from "react";

import { useCurrentLocale } from "worldality/react";

import { Controls } from "./Controls";
import { Header } from "./Header";
import { ThemeProvider } from "./ThemeProvider";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const locale = useCurrentLocale();

  return (
    <ThemeProvider>
      <div
        dir={locale.direction}
        className="flex min-h-screen items-start bg-background font-sans antialiased"
      >
        <div className="mx-auto w-full max-w-4xl px-4 py-16">
          <Header />
          <main className="space-y-8">
            <Controls />
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
