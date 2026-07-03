<script setup lang="ts">
import { useCurrentLocale, useLocaleRouting } from "worldality/vue";

import AppHeader from "./AppHeader.vue";
import Controls from "./Controls.vue";

const locale = useCurrentLocale();

useLocaleRouting();
</script>

<template>
  <div
    :dir="locale.direction"
    class="flex min-h-screen items-start bg-background font-sans antialiased"
  >
    <div class="mx-auto w-full max-w-4xl px-4 py-16">
      <AppHeader />
      <main class="space-y-8">
        <Controls />
        <slot />
      </main>
    </div>
  </div>
</template>
