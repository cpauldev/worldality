<script setup lang="ts">
import { computed } from "vue";
import { getFormatter, t, useCurrentLocale } from "worldality/vue";

const locale = useCurrentLocale();
const format = computed(() => {
  locale.value.code;
  return getFormatter();
});
</script>

<template>
  <section
    class="w-full rounded-[calc(var(--radius-lg)+2px)] bg-secondary px-6 py-7 text-start"
  >
    <p class="body-lg text-secondary-foreground">
      {{
        (locale.code,
        t(
          "This page shows how {brand} loads translated content across routes.",
          { brand: "Worldality" },
        ))
      }}
    </p>
    <div class="mt-6 grid gap-3 sm:grid-cols-2">
      <div class="rounded-lg bg-background/72 px-4 py-3">
        <p class="body-sm font-medium text-muted-foreground">
          {{ (locale.code, t("Currency")) }}
        </p>
        <p class="mt-1 text-foreground">
          {{ format.number(1234.56, { style: "currency", currency: "USD" }) }}
        </p>
      </div>
      <div class="rounded-lg bg-background/72 px-4 py-3">
        <p class="body-sm font-medium text-muted-foreground">
          {{ (locale.code, t("Current time")) }}
        </p>
        <p class="mt-1 text-foreground">
          {{ format.dateTime(new Date(), "medium") }}
        </p>
      </div>
      <div class="rounded-lg bg-background/72 px-4 py-3">
        <p class="body-sm font-medium text-muted-foreground">
          {{ (locale.code, t("Relative time")) }}
        </p>
        <p class="mt-1 text-foreground">{{ format.relativeTime(-90) }}</p>
      </div>
      <div class="rounded-lg bg-background/72 px-4 py-3">
        <p class="body-sm font-medium text-muted-foreground">
          {{ (locale.code, t("List")) }}
        </p>
        <p class="mt-1 text-foreground">
          {{
            format.list(["Nuxt", "Vue", "Worldality"], {
              type: "conjunction",
            })
          }}
        </p>
      </div>
    </div>
  </section>
</template>
