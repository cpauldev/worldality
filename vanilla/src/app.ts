import {
  type ExampleFrameworkId,
  getExampleFramework,
} from "example-shared/non-framework/frameworks";
import { applyTheme, getInitialTheme, toggleTheme } from "example-shared/theme";
import { buttonVariants, cn } from "example-shared/ui";
import {
  detectCurrentPage,
  getAvailableLocales,
  getCurrentLocale,
  getLocalizedUrl,
  setLocale,
  subscribe,
  t,
} from "worldality";

import { renderAbout } from "./components/about";
import { renderHome, teardownHome } from "./components/home";

export interface MountExampleAppOptions {
  container: HTMLElement;
  framework: ExampleFrameworkId;
}

type AppState = {
  theme: "light" | "dark";
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function icon(
  name: "moon" | "plus" | "sun" | "vite",
  className: string,
): string {
  const markup = {
    moon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"></path></svg>',
    sun: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>',
    plus: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>',
    vite: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.056 23.238a.57.57 0 0 1-1.02-.355v-5.202c0-.63-.512-1.143-1.144-1.143H5.148a.57.57 0 0 1-.464-.903l3.777-5.29c.54-.753 0-1.804-.93-1.804H.57a.574.574 0 0 1-.543-.746a.6.6 0 0 1 .08-.157L5.008.78a.57.57 0 0 1 .467-.24h14.589a.57.57 0 0 1 .466.903l-3.778 5.29c-.54.755 0 1.806.93 1.806h5.745c.238 0 .424.138.513.322a.56.56 0 0 1-.063.603z"></path></svg>',
  }[name];

  const size = className.includes("size-5")
    ? 20
    : className.includes("size-4")
      ? 16
      : className.includes("size-3.5")
        ? 14
        : 16;
  const style = `width:${size}px;height:${size}px`;

  return markup.replace(
    "<svg ",
    `<svg width="${size}" height="${size}" style="${style}" class="${className}" aria-hidden="true" `,
  );
}

function renderControls(theme: AppState["theme"]): string {
  const locale = getCurrentLocale();
  const currentPage = detectCurrentPage();
  const isAboutPage = currentPage === "about";
  const homeHref = getLocalizedUrl("index");
  const aboutHref = getLocalizedUrl("about");

  return `<div class="flex flex-wrap items-center justify-center gap-3"><nav class="flex items-center gap-1 rounded-xl border border-border bg-background p-1"><a href="${escapeHtml(homeHref)}" class="${cn(
    buttonVariants({ variant: isAboutPage ? "ghost" : "secondary" }),
    "gap-2 px-3",
  )}" ${isAboutPage ? "" : 'aria-current="page"'}><span>${escapeHtml(
    t("Home"),
  )}</span></a><a href="${escapeHtml(aboutHref)}" class="${cn(
    buttonVariants({ variant: isAboutPage ? "secondary" : "ghost" }),
    "gap-2 px-3",
  )}" ${isAboutPage ? 'aria-current="page"' : ""}><span>${escapeHtml(
    t("About"),
  )}</span></a></nav><div class="rounded-xl border border-border bg-background p-1"><button type="button" data-action="toggle-theme" class="${cn(
    buttonVariants({ variant: "ghost" }),
    "gap-2 px-3",
  )}" aria-label="${escapeHtml(t("Toggle theme"))}">${
    theme === "light" ? icon("moon", "size-4") : icon("sun", "size-4")
  }<span>${escapeHtml(
    t("Toggle theme"),
  )}</span></button></div><div class="flex flex-wrap items-center justify-center gap-1 rounded-xl border border-border bg-background p-1" aria-label="${escapeHtml(
    t("Change language"),
  )}">${getAvailableLocales()
    .map(
      (availableLocale) =>
        `<button type="button" data-locale="${escapeHtml(
          availableLocale.code,
        )}" class="${cn(
          buttonVariants({
            variant:
              availableLocale.code === locale.code ? "secondary" : "ghost",
          }),
          "gap-2 px-3",
        )}" aria-pressed="${
          availableLocale.code === locale.code
        }"><bdi lang="${escapeHtml(
          availableLocale.code,
        )}">${escapeHtml(availableLocale.nativeName)}</bdi></button>`,
    )
    .join("")}</div></div>`;
}

function renderShell(
  state: AppState,
  framework: ReturnType<typeof getExampleFramework>,
): string {
  const locale = getCurrentLocale();
  const page = detectCurrentPage();
  const content = page === "about" ? renderAbout() : renderHome();

  applyTheme(state.theme);

  return `<div dir="${escapeHtml(
    locale.direction,
  )}" class="flex min-h-screen items-start bg-background font-sans antialiased"><div class="mx-auto w-full max-w-4xl px-4 py-16"><header class="mb-12 flex flex-col items-center gap-4 text-center"><div class="flex flex-col items-center gap-2"><img src="/favicon.svg" alt="" class="size-11 shrink-0" aria-hidden="true"><h1 class="text-foreground">Worldality</h1><div class="inline-flex flex-wrap items-center justify-center gap-2"><div class="inline-flex min-h-10 min-w-40 items-center justify-center gap-2 px-4 body-lg whitespace-nowrap" style="background-color:${framework.pillBackground};color:${framework.pillForeground}">${framework.iconSvg}<p>${escapeHtml(
    framework.label,
  )}</p></div><div class="inline-flex min-h-10 items-center justify-center gap-1.5 px-3.5 body-lg text-white whitespace-nowrap" style="background: linear-gradient(135deg, #8f45ff 0%, #6096f1 100%)" aria-hidden="true">${icon(
    "plus",
    "size-3.5 shrink-0",
  )}${icon("vite", "size-4 shrink-0")}<span>Vite</span></div></div></div></header><main class="space-y-8">${renderControls(state.theme)}${content}</main></div></div>`;
}

export function mountExampleApp({
  container,
  framework: frameworkId,
}: MountExampleAppOptions) {
  const framework = getExampleFramework(frameworkId);
  const state: AppState = {
    theme: getInitialTheme(),
  };

  const render = () => {
    teardownHome();
    container.innerHTML = renderShell(state, framework);
  };

  const onClick = (event: Event) => {
    const target = event.target as HTMLElement | null;
    const actionButton = target?.closest<HTMLButtonElement>("[data-action]");
    if (actionButton?.dataset.action === "toggle-theme") {
      state.theme = toggleTheme(state.theme);
      render();
      return;
    }

    const localeButton = target?.closest<HTMLButtonElement>("[data-locale]");
    if (localeButton?.dataset.locale) {
      void setLocale(localeButton.dataset.locale);
    }
  };

  container.addEventListener("click", onClick);
  render();
  const unsubscribe = subscribe(render);

  return () => {
    container.removeEventListener("click", onClick);
    teardownHome();
    unsubscribe();
  };
}
