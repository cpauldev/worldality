<script setup lang="ts">
import { useHead } from "#imports";

import AppLayout from "../components/AppLayout.vue";
import Home from "../components/Home.vue";

useHead({
  title: "Worldality - Nuxt Example",
});
</script>

<template>
  <AppLayout>
    <Home />
  </AppLayout>
</template>
