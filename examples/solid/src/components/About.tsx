import { createMemo } from "solid-js";

import { getFormatter, t, useCurrentLocale } from "worldality/solid";

export function About() {
  const locale = useCurrentLocale();
  const format = createMemo(() => {
    locale();
    return getFormatter();
  });

  return (
    <section class="w-full rounded-[calc(var(--radius-lg)+2px)] bg-secondary px-6 py-7 text-start">
      <p class="body-lg text-secondary-foreground">
        {locale() &&
          t(
            "This page shows how {brand} loads translated content across routes.",
            { brand: "Worldality" },
          )}
      </p>
      <div class="mt-6 grid gap-3 sm:grid-cols-2">
        <FormatExample
          label={locale() && t("Currency")}
          value={format().number(1234.56, {
            style: "currency",
            currency: "USD",
          })}
        />
        <FormatExample
          label={locale() && t("Current time")}
          value={format().dateTime(new Date(), "medium")}
        />
        <FormatExample
          label={locale() && t("Relative time")}
          value={format().relativeTime(-90)}
        />
        <FormatExample
          label={locale() && t("List")}
          value={format().list(["Solid", "Vite", "Worldality"], {
            type: "conjunction",
          })}
        />
      </div>
    </section>
  );
}

function FormatExample(props: { label: string; value: string }) {
  return (
    <div class="rounded-lg bg-background/72 px-4 py-3">
      <p class="body-sm font-medium text-muted-foreground">{props.label}</p>
      <p class="mt-1 text-foreground">{props.value}</p>
    </div>
  );
}
