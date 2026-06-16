import { getFormatter, t } from "worldality";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatExample(label: string, value: string): string {
  return `<div class="rounded-lg bg-background/72 px-4 py-3"><p class="body-sm font-medium text-muted-foreground">${escapeHtml(
    label,
  )}</p><p class="mt-1 text-foreground">${escapeHtml(value)}</p></div>`;
}

export function renderAbout(): string {
  const format = getFormatter();

  return `<section class="w-full rounded-[calc(var(--radius-lg)+2px)] bg-secondary px-6 py-7 text-start"><p class="body-lg text-secondary-foreground">${escapeHtml(
    t("This page shows how {brand} loads translated content across routes.", {
      brand: "Worldality",
    }),
  )}</p><div class="mt-6 grid gap-3 sm:grid-cols-2">${formatExample(
    t("Currency"),
    format.number(1234.56, { style: "currency", currency: "USD" }),
  )}${formatExample(
    t("Current time"),
    format.dateTime(new Date(), "medium"),
  )}${formatExample(t("Relative time"), format.relativeTime(-90))}${formatExample(
    t("List"),
    format.list(["Vanilla", "Vite", "Worldality"], {
      type: "conjunction",
    }),
  )}</div></section>`;
}
