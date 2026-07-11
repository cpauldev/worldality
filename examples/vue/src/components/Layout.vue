<script setup lang="ts">
import { useCurrentLocale } from "worldality/vue";

import { provideTheme } from "../composables/useTheme";
import Controls from "./Controls.vue";
import Header from "./Header.vue";

const locale = useCurrentLocale();
provideTheme();
</script>

<template>
  <div
    :dir="locale.direction"
    class="flex min-h-screen items-start bg-background font-sans antialiased"
  >
    <div class="mx-auto w-full max-w-4xl px-4 py-16">
      <Header />
      <main class="space-y-8">
        <Controls />
        <slot />
      </main>
    </div>
  </div>
</template>
