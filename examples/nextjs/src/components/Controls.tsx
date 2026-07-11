"use client";

import { useEffect, useState } from "react";

import { buttonVariants, cn } from "example-shared/ui";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  getAvailableLocales,
  setLocale,
  t,
  useCurrentLocale,
  useCurrentPage,
} from "worldality/react";

export function Controls() {
  const { resolvedTheme: theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const locale = useCurrentLocale();
  const currentPage = useCurrentPage();
  const availableLocales = getAvailableLocales();
  const isAboutPage = currentPage === "about";

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <nav className="flex items-center gap-1 rounded-xl border border-border bg-background p-1">
        <a
          href="/"
          className={cn(
            buttonVariants({
              variant: isAboutPage ? "ghost" : "secondary",
            }),
            "gap-2 px-3",
          )}
          aria-current={isAboutPage ? undefined : "page"}
        >
          <span>{t("Home")}</span>
        </a>
        <a
          href="/about"
          className={cn(
            buttonVariants({
              variant: isAboutPage ? "secondary" : "ghost",
            }),
            "gap-2 px-3",
          )}
          aria-current={isAboutPage ? "page" : undefined}
        >
          <span>{t("About")}</span>
        </a>
      </nav>
      <div className="rounded-xl border border-border bg-background p-1">
        <button
          onClick={toggleTheme}
          className={cn(buttonVariants({ variant: "ghost" }), "gap-2 px-3")}
          aria-label={t("Toggle theme")}
        >
          {mounted && theme === "dark" ? (
            <Sun className="size-4" aria-hidden="true" />
          ) : (
            <Moon className="size-4" aria-hidden="true" />
          )}
          <span>{t("Toggle theme")}</span>
        </button>
      </div>
      <div
        className="flex flex-wrap items-center justify-center gap-1 rounded-xl border border-border bg-background p-1"
        aria-label={t("Change language")}
      >
        {availableLocales.map((availableLocale) => (
          <button
            key={availableLocale.code}
            type="button"
            onClick={() => void setLocale(availableLocale)}
            className={cn(
              buttonVariants({
                variant:
                  availableLocale.code === locale.code ? "secondary" : "ghost",
              }),
              "gap-2 px-3",
            )}
            aria-pressed={availableLocale.code === locale.code}
          >
            <bdi lang={availableLocale.code}>{availableLocale.nativeName}</bdi>
          </button>
        ))}
      </div>
    </div>
  );
}
