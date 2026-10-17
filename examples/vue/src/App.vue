<script setup lang="ts">
import { computed } from "vue";

import { useCurrentPage, useLocaleRouting } from "worldality/vue";

import AboutPage from "./pages/about.vue";
import IndexPage from "./pages/index.vue";

const currentPage = useCurrentPage();
const isAboutPage = computed(() => currentPage.value === "about");

useLocaleRouting();
</script>

<template>
  <AboutPage v-if="isAboutPage" />
  <IndexPage v-else />
</template>
