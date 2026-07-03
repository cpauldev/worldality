<script setup lang="ts">
import { Plus } from "lucide-vue-next";

import VueIcon from "./icons/Vue.vue";
</script>

<template>
  <header class="mb-12 flex flex-col items-center gap-4 text-center">
    <div class="flex flex-col items-center gap-2">
      <img
        src="/favicon.svg"
        alt=""
        class="size-11 shrink-0"
        aria-hidden="true"
      />
      <h1 class="text-foreground">Worldality</h1>
      <div class="inline-flex flex-wrap items-center justify-center gap-2">
        <div
          class="body-lg inline-flex min-h-10 min-w-40 items-center justify-center gap-2 px-4 whitespace-nowrap"
          style="background-color: #42b883; color: #ffffff"
        >
          <VueIcon class="size-5" aria-hidden="true" />
          <p>Vue</p>
        </div>
        <div
          class="body-lg inline-flex min-h-10 items-center justify-center gap-1.5 px-3.5 whitespace-nowrap text-white"
          style="background: linear-gradient(135deg, #8f45ff 0%, #6096f1 100%)"
          aria-hidden="true"
        >
          <Plus class="size-3.5 shrink-0" aria-hidden="true" />
          <svg
            class="size-4 shrink-0"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="currentColor"
          >
            <path
              d="M13.056 23.238a.57.57 0 0 1-1.02-.355v-5.202c0-.63-.512-1.143-1.144-1.143H5.148a.57.57 0 0 1-.464-.903l3.777-5.29c.54-.753 0-1.804-.93-1.804H.57a.574.574 0 0 1-.543-.746a.6.6 0 0 1 .08-.157L5.008.78a.57.57 0 0 1 .467-.24h14.589a.57.57 0 0 1 .466.903l-3.778 5.29c-.54.755 0 1.806.93 1.806h5.745c.238 0 .424.138.513.322a.56.56 0 0 1-.063.603z"
            />
          </svg>
          <span>Vite</span>
        </div>
      </div>
    </div>
  </header>
</template>
