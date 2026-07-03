import { getCurrentLocale, subscribe, t } from "worldality";
import { WorldalityWidget } from "worldality/widget";

import {
  CAPABILITY_CTA_CLASS_NAME,
  CAPABILITY_FOOTER_CLASS_NAME,
  CAPABILITY_ICON_FRAME_CLASS_NAME,
  CAPABILITY_IMAGE_CLASS_NAME,
  CAPABILITY_IMAGE_WRAPPER_CLASS_NAME,
  CAPABILITY_OVERLAY_CLASS_NAME,
  CAPABILITY_TILE_CLASS_NAME,
  CARD_ELEVATION_SHADOW_CLASS_NAME,
  CARD_INSET_BORDER_OVERLAY_CLASS_NAME,
  THEME_TOGGLE_CLASS_NAME,
  studioPreviewImage,
  widgetPreviewImage,
} from "../logic/capability-cards";
import { WORLDALITY_CONFIG } from "../logic/constants";
import {
  fetchStudioStatus,
  getInitialStudioStatus,
  getStudioStatusClassName,
} from "../logic/studio";
import { applyTheme, getInitialTheme, toggleTheme } from "../logic/theme";
import { buttonVariants, cn } from "../ui";
import { type ExampleFrameworkId, getExampleFramework } from "./frameworks";

const VITE_LABEL = "Vite";
const WORLDALITY_STUDIO_LABEL = "Worldality Studio";
const WORLDALITY_WIDGET_LABEL = "Worldality Widget";

export interface MountExampleAppOptions {
  container: HTMLElement;
  framework: ExampleFrameworkId;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function icon(
  name:
    | "arrowUpRight"
    | "globe"
    | "loaderCircle"
    | "monitor"
    | "moon"
    | "plus"
    | "puzzle"
    | "sun"
    | "vite",
  className: string,
): string {
  const normalizedClassName =
    className.includes("text-blue-500") || className.includes("text-pink-500")
      ? cn("size-7", className)
      : className;
  const markup = {
    arrowUpRight:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>',
    globe:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>',
    loaderCircle:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>',
    monitor:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line></svg>',
    moon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"></path></svg>',
    sun: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>',
    plus: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>',
    puzzle:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"></path></svg>',
    vite: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.056 23.238a.57.57 0 0 1-1.02-.355v-5.202c0-.63-.512-1.143-1.144-1.143H5.148a.57.57 0 0 1-.464-.903l3.777-5.29c.54-.753 0-1.804-.93-1.804H.57a.574.574 0 0 1-.543-.746a.6.6 0 0 1 .08-.157L5.008.78a.57.57 0 0 1 .467-.24h14.589a.57.57 0 0 1 .466.903l-3.778 5.29c-.54.755 0 1.806.93 1.806h5.745c.238 0 .424.138.513.322a.56.56 0 0 1-.063.603z"></path></svg>',
  }[name];

  const size = normalizedClassName.includes("size-7")
    ? 28
    : normalizedClassName.includes("size-6")
      ? 24
      : normalizedClassName.includes("size-5")
        ? 20
        : normalizedClassName.includes("size-4.5")
          ? 18
          : normalizedClassName.includes("size-4")
            ? 16
            : normalizedClassName.includes("size-3.5")
              ? 14
              : normalizedClassName.includes("size-3")
                ? 12
                : 24;
  const color = normalizedClassName.includes("text-blue-500")
    ? "#3b82f6"
    : normalizedClassName.includes("text-pink-500")
      ? "#ec4899"
      : "";
  const style = `width:${size}px;height:${size}px${color ? `;color:${color}` : ""}`;

  return markup.replace(
    "<svg ",
    `<svg width="${size}" height="${size}" style="${style}" class="${normalizedClassName}" aria-hidden="true" `,
  );
}

export function mountExampleApp({
  container,
  framework: frameworkId,
}: MountExampleAppOptions) {
  const framework = getExampleFramework(frameworkId);
  const state = {
    theme: getInitialTheme(),
    studioStatus: getInitialStudioStatus(),
  };
  let widget: WorldalityWidget | null = null;
  let detachWidget: (() => void) | null = null;

  const applyStudioStatus = () => {
    const studioStatus = container.querySelector<HTMLElement>(
      "[data-studio-status]",
    );
    const studioSpinner = container.querySelector<HTMLElement>(
      "[data-studio-spinner]",
    );
    const studioStatusLabel = container.querySelector<HTMLElement>(
      "[data-studio-status-label]",
    );
    const studioUrl = container.querySelector<HTMLElement>("[data-studio-url]");
    const studioUrlSeparator = container.querySelector<HTMLElement>(
      "[data-studio-url-separator]",
    );

    studioSpinner?.toggleAttribute("hidden", !state.studioStatus.isLoading);
    studioUrl?.classList.toggle("hidden", !state.studioStatus.urlLabel);
    studioUrlSeparator?.classList.toggle(
      "hidden",
      !state.studioStatus.urlLabel,
    );

    if (studioStatus) {
      studioStatus.className = `inline-flex items-center gap-1 font-medium ${getStudioStatusClassName(
        state.studioStatus.tone,
      )}`;
    }

    if (studioStatusLabel) {
      studioStatusLabel.textContent = state.studioStatus.label;
    }

    if (studioUrl) {
      studioUrl.textContent = state.studioStatus.urlLabel;
    }
  };

  const render = () => {
    const locale = getCurrentLocale();
    const cardClassName = cn(
      CAPABILITY_TILE_CLASS_NAME,
      CARD_ELEVATION_SHADOW_CLASS_NAME,
      CARD_INSET_BORDER_OVERLAY_CLASS_NAME,
    );
    applyTheme(state.theme);

    container.innerHTML = `<div dir="${escapeHtml(
      locale.direction,
    )}" class="flex min-h-screen items-center bg-background font-sans antialiased"><div class="mx-auto w-full max-w-4xl px-4 py-16"><header class="mb-12 flex flex-col items-center gap-4 text-center"><div class="flex flex-col items-center gap-2"><img src="/favicon.svg" alt="" class="size-11 shrink-0" aria-hidden="true"><h1 class="text-foreground">Worldality</h1><div class="inline-flex flex-wrap items-center justify-center gap-2"><div class="inline-flex min-h-10 min-w-40 items-center justify-center gap-2 px-4 body-lg whitespace-nowrap" style="background-color:${framework.pillBackground};color:${framework.pillForeground}">${framework.iconSvg}<p>${escapeHtml(
      framework.label,
    )}</p></div><div class="inline-flex min-h-10 items-center justify-center gap-1.5 px-3.5 body-lg text-white whitespace-nowrap" style="background: linear-gradient(135deg, #8f45ff 0%, #6096f1 100%)" aria-label="${escapeHtml(
      t("Powered by {framework}", { framework: VITE_LABEL }),
    )}">${icon(
      "plus",
      "size-3.5 shrink-0",
    )}${icon("vite", "size-4 shrink-0")}<span>${escapeHtml(VITE_LABEL)}</span></div></div></div></header><main class="space-y-8"><div class="grid gap-6 sm:grid-cols-2"><a href="/worldality" target="_blank" rel="noreferrer" class="${cardClassName}" aria-label="${escapeHtml(
      t("Open {studio}", { studio: WORLDALITY_STUDIO_LABEL }),
    )}"><div class="${CAPABILITY_IMAGE_WRAPPER_CLASS_NAME}" aria-hidden="true"><img src="${studioPreviewImage}" alt="" class="${CAPABILITY_IMAGE_CLASS_NAME}"></div><div class="${CAPABILITY_OVERLAY_CLASS_NAME}" aria-hidden="true"></div><div class="relative z-10 flex w-full flex-col items-center justify-center gap-4"><div class="${CAPABILITY_ICON_FRAME_CLASS_NAME}">${icon(
      "monitor",
      "text-blue-500",
    )}</div><h4 class="text-white">${escapeHtml(
      WORLDALITY_STUDIO_LABEL,
    )}</h4><div class="${CAPABILITY_CTA_CLASS_NAME}">${escapeHtml(
      t("Open {studio}", { studio: "Studio" }),
    )}${icon(
      "arrowUpRight",
      cn("size-6", locale.direction === "rtl" && "-scale-x-100"),
    )}</div></div><div class="${CAPABILITY_FOOTER_CLASS_NAME}"><div class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center body-sm"><span data-studio-status class="inline-flex items-center gap-1 font-medium ${getStudioStatusClassName(
      state.studioStatus.tone,
    )}">${icon("loaderCircle", "size-3.5 animate-spin").replace(
      'aria-hidden="true"',
      `aria-hidden="true" data-studio-spinner${
        state.studioStatus.isLoading ? "" : " hidden"
      }`,
    )}<span data-studio-status-label>${escapeHtml(
      state.studioStatus.label,
    )}</span></span><span data-studio-url-separator class="${cn(
      "text-white/48",
      !state.studioStatus.urlLabel && "hidden",
    )}" aria-hidden="true">/</span><span data-studio-url class="${cn(
      "text-white/72",
      !state.studioStatus.urlLabel && "hidden",
    )}">${escapeHtml(
      state.studioStatus.urlLabel,
    )}</span></div></div></a><button type="button" data-locale-button aria-label="${escapeHtml(
      t("Change language"),
    )}" class="${cardClassName}"><div class="${CAPABILITY_IMAGE_WRAPPER_CLASS_NAME}" aria-hidden="true"><img src="${widgetPreviewImage}" alt="" class="${CAPABILITY_IMAGE_CLASS_NAME}"></div><div class="${CAPABILITY_OVERLAY_CLASS_NAME}" aria-hidden="true"></div><div class="relative z-10 flex w-full flex-col items-center justify-center gap-4"><div class="${CAPABILITY_ICON_FRAME_CLASS_NAME}">${icon(
      "puzzle",
      "text-pink-500",
    )}</div><h4 class="text-white">${escapeHtml(
      WORLDALITY_WIDGET_LABEL,
    )}</h4><div class="${CAPABILITY_CTA_CLASS_NAME}">${icon(
      "globe",
      "size-6",
    )}<bdi class="locale-script" lang="${escapeHtml(locale.code)}">${escapeHtml(
      locale.nativeName,
    )}</bdi></div></div></button></div><div class="flex justify-center"><button type="button" data-action="toggle-theme" data-slot="button" data-variant="ghost" data-size="icon" aria-label="${escapeHtml(
      t("Toggle theme"),
    )}" class="${cn(
      buttonVariants({ variant: "ghost", size: "icon" }),
      THEME_TOGGLE_CLASS_NAME,
    )}">${
      state.theme === "light" ? icon("moon", "size-5") : icon("sun", "size-5")
    }</button></div></main></div></div>`;

    detachWidget?.();
    widget?.destroy();
    widget = new WorldalityWidget({ ...WORLDALITY_CONFIG, theme: state.theme });

    const localeButton = container.querySelector<HTMLButtonElement>(
      "[data-locale-button]",
    );
    if (localeButton) {
      detachWidget = widget.attachTo(localeButton);
    }

    applyStudioStatus();
  };

  const onClick = (event: Event) => {
    const target = (
      event.target as HTMLElement | null
    )?.closest<HTMLButtonElement>("[data-action]");
    if (!target) return;

    if (target.dataset.action === "toggle-theme") {
      state.theme = toggleTheme(state.theme);
      render();
    }
  };

  container.addEventListener("click", onClick);
  render();
  const syncStudioStatus = async () => {
    state.studioStatus = await fetchStudioStatus();
    applyStudioStatus();
  };
  void syncStudioStatus();
  const studioStatusIntervalId = window.setInterval(() => {
    void syncStudioStatus();
  }, 5000);
  const unsubscribe = subscribe(render);

  return () => {
    container.removeEventListener("click", onClick);
    window.clearInterval(studioStatusIntervalId);
    detachWidget?.();
    widget?.destroy();
    unsubscribe();
  };
}
