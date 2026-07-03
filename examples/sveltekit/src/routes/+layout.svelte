<script lang="ts">
  import { browser } from "$app/environment";
  import { bootstrapWorldality, enableRouting } from "worldality";

  import AppHeader from "../lib/AppHeader.svelte";
  import Controls from "../lib/Controls.svelte";

  import "../app.css";

  let { data, children } = $props();

  const worldalityData = $derived(data.worldalityData);
  const currentLocale = $derived(worldalityData.currentLocale);
  const direction = $derived(
    worldalityData.localeMetadata[worldalityData.currentLocale]?.dir ?? "ltr",
  );

  function syncWorldality(state = data.worldalityData) {
    bootstrapWorldality(state);
  }

  if (!browser) {
    syncWorldality();
  }

  $effect(() => {
    syncWorldality(worldalityData);
    document.documentElement.lang = currentLocale;
    document.documentElement.dir = direction;
    enableRouting();
  });
</script>

<svelte:head>
  <meta
    name="description"
    content="Interactive examples of Worldality internationalization with SvelteKit"
  />
  {@html "<scr" + "ipt>" + data.worldalityScript + "</scr" + "ipt>"}
</svelte:head>

<div
  lang={currentLocale}
  dir={direction}
  class="flex min-h-screen items-start bg-background font-sans antialiased"
>
  <div class="mx-auto w-full max-w-4xl px-4 py-16">
    <AppHeader />
    <main class="space-y-8">
      <Controls />
      {@render children?.()}
    </main>
  </div>
</div>
