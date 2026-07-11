<script setup lang="ts">
import { onUnmounted, watch } from "vue";

import { WorldalityWidget } from "worldality/widget";

const props = defineProps<{
  target: HTMLButtonElement | null;
  theme: "light" | "dark";
}>();

let widget: WorldalityWidget | undefined;
let detach: (() => void) | undefined;

watch(
  () => [props.target, props.theme] as const,
  ([target, theme]) => {
    detach?.();
    widget?.destroy();

    if (!target) return;

    widget = new WorldalityWidget({
      position: "bottom-center",
      showSettings: true,
      theme,
    });
    detach = widget.attachTo(target);
  },
  { immediate: true },
);

onUnmounted(() => {
  detach?.();
  widget?.destroy();
});
</script>

<template>
  <span class="hidden" aria-hidden="true" />
</template>
