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
  studioPreviewImage,
  widgetPreviewImage,
} from "example-shared/capability-cards";
import { WORLDALITY_CONFIG } from "example-shared/constants";
import {
  fetchStudioStatus,
  getInitialStudioStatus,
  getStudioStatusClassName,
} from "example-shared/studio";
import { cn } from "example-shared/ui";
import { getCurrentLocale, t } from "worldality";
import { WorldalityWidget } from "worldality/widget";

const WORLDALITY_STUDIO_LABEL = "Worldality Studio";
const WORLDALITY_WIDGET_LABEL = "Worldality Widget";

let widget: WorldalityWidget | null = null;
let detachWidget: (() => void) | null = null;
let intervalId: number | undefined;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function icon(
  name: "arrowUpRight" | "globe" | "loaderCircle" | "monitor" | "puzzle",
  className: string,
): string {
  const normalizedClassName =
    className.includes("text-blue-500") || className.includes("text-rose-500")
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
    puzzle:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"></path></svg>',
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
    : normalizedClassName.includes("text-rose-500")
      ? "#f43f5e"
      : "";
  const style = `width:${size}px;height:${size}px${color ? `;color:${color}` : ""}`;

  return markup.replace(
    "<svg ",
    `<svg width="${size}" height="${size}" style="${style}" class="${normalizedClassName}" aria-hidden="true" `,
  );
}

function translateStudioStatusLabel(label: string): string {
  switch (label) {
    case "Checking...":
      return t("Checking...");
    case "Connected":
      return t("Connected");
    case "Starting...":
      return t("Starting...");
    case "Error":
      return t("Error");
    case "Ready to launch":
      return t("Ready to launch");
    case "Unavailable":
      return t("Unavailable");
    default:
      return label;
  }
}

function applyStudioStatus(status = getInitialStudioStatus()): void {
  const statusNode = document.querySelector<HTMLElement>(
    "[data-studio-status]",
  );
  const spinnerNode = document.querySelector<HTMLElement>(
    "[data-studio-spinner]",
  );
  const labelNode = document.querySelector<HTMLElement>(
    "[data-studio-status-label]",
  );
  const urlNode = document.querySelector<HTMLElement>("[data-studio-url]");
  const separatorNode = document.querySelector<HTMLElement>(
    "[data-studio-url-separator]",
  );

  spinnerNode?.toggleAttribute("hidden", !status.isLoading);
  urlNode?.classList.toggle("hidden", !status.urlLabel);
  separatorNode?.classList.toggle("hidden", !status.urlLabel);

  if (statusNode) {
    statusNode.className = `inline-flex items-center gap-1 font-medium ${getStudioStatusClassName(
      status.tone,
    )}`;
  }
  if (labelNode)
    labelNode.textContent = translateStudioStatusLabel(status.label);
  if (urlNode) urlNode.textContent = status.urlLabel;
}

export function renderHome(theme: "light" | "dark"): string {
  const locale = getCurrentLocale();
  const cardClassName = cn(
    CAPABILITY_TILE_CLASS_NAME,
    CARD_ELEVATION_SHADOW_CLASS_NAME,
    CARD_INSET_BORDER_OVERLAY_CLASS_NAME,
  );
  const initialStudioStatus = getInitialStudioStatus();

  queueMicrotask(() => {
    const localeButton = document.querySelector<HTMLButtonElement>(
      "[data-locale-widget]",
    );
    widget = new WorldalityWidget({ ...WORLDALITY_CONFIG, theme });
    if (localeButton) detachWidget = widget.attachTo(localeButton);
    applyStudioStatus(initialStudioStatus);
    intervalId = window.setInterval(() => {
      void fetchStudioStatus().then(applyStudioStatus);
    }, 5000);
  });

  return `<div class="grid gap-6 sm:grid-cols-2"><a href="/worldality" target="_blank" rel="noreferrer" class="${cardClassName}" aria-label="${escapeHtml(
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
    initialStudioStatus.tone,
  )}">${icon("loaderCircle", "size-3.5 animate-spin").replace(
    'aria-hidden="true"',
    `aria-hidden="true" data-studio-spinner${
      initialStudioStatus.isLoading ? "" : " hidden"
    }`,
  )}<span data-studio-status-label>${escapeHtml(
    translateStudioStatusLabel(initialStudioStatus.label),
  )}</span></span><span data-studio-url-separator class="${cn(
    "text-white/48",
    !initialStudioStatus.urlLabel && "hidden",
  )}" aria-hidden="true">/</span><span data-studio-url class="${cn(
    "text-white/72",
    !initialStudioStatus.urlLabel && "hidden",
  )}">${escapeHtml(
    initialStudioStatus.urlLabel,
  )}</span></div></div></a><button type="button" data-locale-widget aria-label="${escapeHtml(
    t("Change language"),
  )}" class="${cardClassName}"><div class="${CAPABILITY_IMAGE_WRAPPER_CLASS_NAME}" aria-hidden="true"><img src="${widgetPreviewImage}" alt="" class="${CAPABILITY_IMAGE_CLASS_NAME}"></div><div class="${CAPABILITY_OVERLAY_CLASS_NAME}" aria-hidden="true"></div><div class="relative z-10 flex w-full flex-col items-center justify-center gap-4"><div class="${CAPABILITY_ICON_FRAME_CLASS_NAME}">${icon(
    "puzzle",
    "text-rose-500",
  )}</div><h4 class="text-white">${escapeHtml(
    WORLDALITY_WIDGET_LABEL,
  )}</h4><div class="${CAPABILITY_CTA_CLASS_NAME}">${icon(
    "globe",
    "size-6",
  )}<bdi class="locale-script" lang="${escapeHtml(
    locale.code,
  )}">${escapeHtml(locale.nativeName)}</bdi></div></div><div class="${CAPABILITY_FOOTER_CLASS_NAME}"><div class="text-center body-sm font-medium text-white/72">${escapeHtml(
    t("Change language"),
  )}</div></div></button></div>`;
}

export function teardownHome(): void {
  if (intervalId !== undefined) {
    window.clearInterval(intervalId);
    intervalId = undefined;
  }
  detachWidget?.();
  detachWidget = null;
  widget?.destroy();
  widget = null;
}
