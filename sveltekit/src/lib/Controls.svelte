<script lang="ts">
  import { Moon, Sun } from "@lucide/svelte";
  import { createTheme } from "example-shared/svelte/theme.svelte";
  import { buttonVariants, cn } from "example-shared/ui";
  import {
    currentLocale,
    currentPage,
    getAvailableLocales,
    getLocalizedUrl,
    setLocale,
    t,
  } from "worldality/svelte";

  const theme = createTheme();
  const availableLocales = $derived(
    ($currentLocale.code, getAvailableLocales()),
  );
  const homeHref = $derived(
    ($currentLocale.code, $currentPage, getLocalizedUrl("index")),
  );
  const aboutHref = $derived(
    ($currentLocale.code, $currentPage, getLocalizedUrl("about")),
  );
</script>

<div class="flex flex-wrap items-center justify-center gap-3">
  <nav class="flex items-center gap-1 rounded-xl border border-border bg-background p-1">
    <a
      href={homeHref}
      data-sveltekit-reload
      class={cn(
        buttonVariants({
          variant: $currentPage === "about" ? "ghost" : "secondary",
        }),
        "gap-2 px-3",
      )}
      aria-current={$currentPage === "about" ? undefined : "page"}
    >
      <span>{t("Home")}</span>
    </a>
    <a
      href={aboutHref}
      data-sveltekit-reload
      class={cn(
        buttonVariants({
          variant: $currentPage === "about" ? "secondary" : "ghost",
        }),
        "gap-2 px-3",
      )}
      aria-current={$currentPage === "about" ? "page" : undefined}
    >
      <span>{t("About")}</span>
    </a>
  </nav>
  <div class="rounded-xl border border-border bg-background p-1">
    <button
      type="button"
      onclick={() => theme.toggle()}
      class={cn(buttonVariants({ variant: "ghost" }), "gap-2 px-3")}
      aria-label={t("Toggle theme")}
    >
      {#if theme.value === "light"}
        <Moon class="size-4" aria-hidden="true" />
      {:else}
        <Sun class="size-4" aria-hidden="true" />
      {/if}
      <span>{t("Toggle theme")}</span>
    </button>
  </div>
  <div
    class="flex flex-wrap items-center justify-center gap-1 rounded-xl border border-border bg-background p-1"
    aria-label={t("Change language")}
  >
    {#each availableLocales as availableLocale (availableLocale.code)}
      <button
        type="button"
        onclick={() => void setLocale(availableLocale)}
        class={cn(
          buttonVariants({
            variant:
              availableLocale.code === $currentLocale.code
                ? "secondary"
                : "ghost",
          }),
          "gap-2 px-3",
        )}
        aria-pressed={availableLocale.code === $currentLocale.code}
      >
        <bdi lang={availableLocale.code}>{availableLocale.nativeName}</bdi>
      </button>
    {/each}
  </div>
</div>
