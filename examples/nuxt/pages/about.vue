<script setup lang="ts">
import { useHead } from "#imports";

import About from "../components/About.vue";
import AppLayout from "../components/AppLayout.vue";

useHead({
  title: "Worldality - Nuxt Example",
});
</script>

<template>
  <AppLayout>
    <About />
  </AppLayout>
</template>
