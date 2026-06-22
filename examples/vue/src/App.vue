<script setup lang="ts">
import { useCurrentPage, useLocaleRouting } from "worldality/vue";

import AboutPage from "./pages/about.vue";
import IndexPage from "./pages/index.vue";

const currentPage = useCurrentPage();

useLocaleRouting();
</script>

<template>
  <AboutPage v-if="currentPage === 'about'" />
  <IndexPage v-else />
</template>
