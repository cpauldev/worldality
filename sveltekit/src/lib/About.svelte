<script lang="ts">
  import { currentLocale, getFormatter, t } from "worldality/svelte";

  const brand = "Worldality";
  const formatter = $derived(($currentLocale.code, getFormatter()));
</script>

<section
  class="w-full rounded-[calc(var(--radius-lg)+2px)] bg-secondary px-6 py-7 text-start"
>
  <p class="body-lg text-secondary-foreground">
    {t("This page shows how {brand} loads translated content across routes.", {
      brand,
    })}
  </p>
  <div class="mt-6 grid gap-3 sm:grid-cols-2">
    <div class="rounded-lg bg-background/72 px-4 py-3">
      <p class="body-sm font-medium text-muted-foreground">{t("Currency")}</p>
      <p class="mt-1 text-foreground">
        {formatter.number(1234.56, {
          style: "currency",
          currency: "USD",
        })}
      </p>
    </div>
    <div class="rounded-lg bg-background/72 px-4 py-3">
      <p class="body-sm font-medium text-muted-foreground">
        {t("Current time")}
      </p>
      <p class="mt-1 text-foreground">
        {formatter.dateTime(new Date(), "medium")}
      </p>
    </div>
    <div class="rounded-lg bg-background/72 px-4 py-3">
      <p class="body-sm font-medium text-muted-foreground">
        {t("Relative time")}
      </p>
      <p class="mt-1 text-foreground">{formatter.relativeTime(-90)}</p>
    </div>
    <div class="rounded-lg bg-background/72 px-4 py-3">
      <p class="body-sm font-medium text-muted-foreground">{t("List")}</p>
      <p class="mt-1 text-foreground">
        {formatter.list(["SvelteKit", "Vite", "Worldality"], {
          type: "conjunction",
        })}
      </p>
    </div>
  </div>
</section>
