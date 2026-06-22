import { t, useFormatter } from "worldality/react";

export function About() {
  const format = useFormatter();

  return (
    <section className="w-full rounded-[calc(var(--radius-lg)+2px)] bg-secondary px-6 py-7 text-start">
      <p className="body-lg text-secondary-foreground">
        {t(
          "This page shows how {brand} loads translated content across routes.",
          {
            brand: "Worldality",
          },
        )}
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <FormatExample
          label={t("Currency")}
          value={format.number(1234.56, {
            style: "currency",
            currency: "USD",
          })}
        />
        <FormatExample
          label={t("Current time")}
          value={format.dateTime(new Date(), "medium")}
        />
        <FormatExample
          label={t("Relative time")}
          value={format.relativeTime(-90)}
        />
        <FormatExample
          label={t("List")}
          value={format.list(["React", "Vite", "Worldality"], {
            type: "conjunction",
          })}
        />
      </div>
    </section>
  );
}

function FormatExample({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background/72 px-4 py-3">
      <p className="body-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-foreground">{value}</p>
    </div>
  );
}
