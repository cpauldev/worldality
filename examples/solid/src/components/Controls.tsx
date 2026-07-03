import { createMemo, For } from "solid-js";

import { useTheme } from "example-shared/solid/useTheme";
import { buttonVariants, cn } from "example-shared/ui";
import { Moon, Sun } from "lucide-solid";
import {
  getAvailableLocales,
  getLocalizedUrl,
  setLocale,
  t,
  useCurrentLocale,
  useCurrentPage,
} from "worldality/solid";

export function Controls() {
  const { theme, toggle } = useTheme();
  const locale = useCurrentLocale();
  const currentPage = useCurrentPage();
  const availableLocales = createMemo(() => {
    locale();
    return getAvailableLocales();
  });
  const isAboutPage = createMemo(() => currentPage() === "about");
  const homeHref = createMemo(() => {
    locale();
    currentPage();
    return getLocalizedUrl("index");
  });
  const aboutHref = createMemo(() => {
    locale();
    currentPage();
    return getLocalizedUrl("about");
  });
  return (
    <div class="flex flex-wrap items-center justify-center gap-3">
      <nav class="flex items-center gap-1 rounded-xl border border-border bg-background p-1">
        <a
          href={homeHref()}
          class={cn(
            buttonVariants({ variant: isAboutPage() ? "ghost" : "secondary" }),
            "gap-2 px-3",
          )}
          aria-current={isAboutPage() ? undefined : "page"}
        >
          <span>{locale() && t("Home")}</span>
        </a>
        <a
          href={aboutHref()}
          class={cn(
            buttonVariants({ variant: isAboutPage() ? "secondary" : "ghost" }),
            "gap-2 px-3",
          )}
          aria-current={isAboutPage() ? "page" : undefined}
        >
          <span>{locale() && t("About")}</span>
        </a>
      </nav>
      <div class="rounded-xl border border-border bg-background p-1">
        <button
          onClick={toggle}
          class={cn(buttonVariants({ variant: "ghost" }), "gap-2 px-3")}
          aria-label={locale() && t("Toggle theme")}
        >
          {theme() === "light" ? (
            <Moon class="size-4" aria-hidden="true" />
          ) : (
            <Sun class="size-4" aria-hidden="true" />
          )}
          <span>{locale() && t("Toggle theme")}</span>
        </button>
      </div>
      <div
        class="flex flex-wrap items-center justify-center gap-1 rounded-xl border border-border bg-background p-1"
        aria-label={locale() && t("Change language")}
      >
        <For each={availableLocales()}>
          {(availableLocale) => (
            <button
              type="button"
              onClick={() => void setLocale(availableLocale)}
              class={cn(
                buttonVariants({
                  variant:
                    availableLocale.code === locale().code
                      ? "secondary"
                      : "ghost",
                }),
                "gap-2 px-3",
              )}
              aria-pressed={availableLocale.code === locale().code}
            >
              <bdi lang={availableLocale.code}>
                {availableLocale.nativeName}
              </bdi>
            </button>
          )}
        </For>
      </div>
    </div>
  );
}
