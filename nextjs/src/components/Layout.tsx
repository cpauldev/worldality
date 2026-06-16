"use client";

import { type ReactNode } from "react";

import { useCurrentLocale, useLocaleRouting } from "worldality/react";

import { Controls } from "./Controls";
import { Header } from "./Header";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const locale = useCurrentLocale();

  useLocaleRouting();

  return (
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
  );
}
