<script setup lang="ts">
import { useHead, useRequestHeaders, useRequestURL } from "#imports";

import { bootstrapWorldality } from "worldality/vue";

import "~/app.css";

useHead({
  link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
  meta: [{ name: "theme-color", content: "#ffffff" }],
});

const requestHeaders = useRequestHeaders(["x-pathname", "x-worldality-locale"]);
const requestUrl = useRequestURL();
let worldalityData;

if (import.meta.server) {
  const { resolve } = await import("node:path");
  const { configureServerRuntime, loadSSRTranslations } =
    await import("worldality/server/nuxt");

  configureServerRuntime({
    manifestDir: resolve(process.cwd(), "public"),
  });

  worldalityData = await loadSSRTranslations({
    headers: requestHeaders,
    url: requestUrl.pathname,
  });
}

if (import.meta.server && worldalityData) {
  bootstrapWorldality(worldalityData);
  const { generateWorldalityScript, getWorldalityHtmlAttrs } =
    await import("worldality/server/nuxt");
  const htmlAttrs = getWorldalityHtmlAttrs(worldalityData);

  useHead({
    htmlAttrs,
    script: [
      {
        id: "worldality-ssr",
        innerHTML: generateWorldalityScript(worldalityData),
        tagPosition: "head",
      },
    ],
  });
}
</script>

<template>
  <NuxtPage />
</template>
