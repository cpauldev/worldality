import { WORLDALITY_CONFIG } from "example-shared/constants";
import {
  fetchStudioStatus,
  getInitialStudioStatus,
  getStudioStatusClassName,
} from "example-shared/studio";
import { applyTheme, getInitialTheme, toggleTheme } from "example-shared/theme";
import { getCurrentLocale, t, useLocaleRouting } from "worldality/astro";
import { WorldalityWidget } from "worldality/widget";

import { ASTRO_IDS } from "../lib/page-state";

function iconSvg(name: "moon" | "sun"): string {
  if (name === "moon") {
    return '<svg class="size-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
  }

  return '<svg class="size-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>';
}

function setThemeIcon(theme: "light" | "dark"): void {
  const icon = document.getElementById(ASTRO_IDS.themeIcon);
  if (icon) {
    icon.innerHTML = theme === "light" ? iconSvg("moon") : iconSvg("sun");
  }
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

function setStudioStatus() {
  const studioStatus = getInitialStudioStatus();
  const spinnerElement = document.getElementById(ASTRO_IDS.studioSpinner);
  const statusElement = document.getElementById(ASTRO_IDS.studioStatus);
  const labelElement = document.getElementById(ASTRO_IDS.studioStatusLabel);
  const urlElement = document.getElementById(ASTRO_IDS.studioUrl);
  const urlSeparatorElement = document.getElementById(
    ASTRO_IDS.studioUrlSeparator,
  );

  if (spinnerElement) {
    spinnerElement.toggleAttribute("hidden", !studioStatus.isLoading);
  }
  urlElement?.classList.toggle("hidden", !studioStatus.urlLabel);
  urlSeparatorElement?.classList.toggle("hidden", !studioStatus.urlLabel);

  if (statusElement) {
    statusElement.className = `inline-flex items-center gap-1 font-medium ${getStudioStatusClassName(studioStatus.tone)}`;
  }

  if (labelElement) {
    labelElement.textContent = translateStudioStatusLabel(studioStatus.label);
  }

  if (urlElement) {
    urlElement.textContent = studioStatus.urlLabel;
  }
}

function applyStudioStatus(
  snapshot: Awaited<ReturnType<typeof fetchStudioStatus>>,
): void {
  const spinnerElement = document.getElementById(ASTRO_IDS.studioSpinner);
  const statusElement = document.getElementById(ASTRO_IDS.studioStatus);
  const labelElement = document.getElementById(ASTRO_IDS.studioStatusLabel);
  const urlElement = document.getElementById(ASTRO_IDS.studioUrl);
  const urlSeparatorElement = document.getElementById(
    ASTRO_IDS.studioUrlSeparator,
  );

  if (spinnerElement) {
    spinnerElement.toggleAttribute("hidden", !snapshot.isLoading);
  }
  urlElement?.classList.toggle("hidden", !snapshot.urlLabel);
  urlSeparatorElement?.classList.toggle("hidden", !snapshot.urlLabel);

  if (statusElement) {
    statusElement.className = `inline-flex items-center gap-1 font-medium ${getStudioStatusClassName(snapshot.tone)}`;
  }

  if (labelElement) {
    labelElement.textContent = translateStudioStatusLabel(snapshot.label);
  }

  if (urlElement) {
    urlElement.textContent = snapshot.urlLabel;
  }
}

export function setupAstroExamplePage(): void {
  const root = document.getElementById(ASTRO_IDS.root);
  if (!(root instanceof HTMLElement)) return;

  let theme = getInitialTheme();
  let widget: WorldalityWidget | null = null;
  let detachWidget: (() => void) | null = null;
  let studioStatusIntervalId: number | undefined;

  function ensureWidget(): void {
    detachWidget?.();
    widget?.destroy();
    widget = new WorldalityWidget({ ...WORLDALITY_CONFIG, theme });

    const localeButton = document.getElementById(ASTRO_IDS.localeButton);
    if (localeButton instanceof HTMLButtonElement) {
      detachWidget = widget.attachTo(localeButton);
    }
  }

  function render(): void {
    applyTheme(theme);
    setThemeIcon(theme);
    ensureWidget();
  }

  const themeToggle = document.getElementById(ASTRO_IDS.themeToggle);
  const onThemeClick = () => {
    theme = toggleTheme(theme);
    render();
  };

  themeToggle?.addEventListener("click", onThemeClick);
  document
    .querySelectorAll<HTMLButtonElement>("[data-locale-href]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const href = button.dataset.localeHref;
        if (href) {
          window.location.href = href;
        }
      });
    });
  setStudioStatus();
  render();

  const syncStudioStatus = async () => {
    const studioStatus = await fetchStudioStatus();
    applyStudioStatus(studioStatus);
  };

  void syncStudioStatus();
  studioStatusIntervalId = window.setInterval(() => {
    void syncStudioStatus();
  }, 5000);

  const cleanupLocaleRouting = useLocaleRouting();

  window.addEventListener(
    "beforeunload",
    () => {
      themeToggle?.removeEventListener("click", onThemeClick);
      cleanupLocaleRouting();
      if (studioStatusIntervalId !== undefined) {
        window.clearInterval(studioStatusIntervalId);
      }
      detachWidget?.();
      widget?.destroy();
    },
    { once: true },
  );
}
