/**
 * Vue composable for Worldality widget management
 *
 * Handles widget initialization, theme updates, and cleanup.
 * Returns a ref to attach to the locale button.
 */
import { type Ref, onMounted, onUnmounted, ref, watch } from "vue";
import { WorldalityWidget } from "worldality/widget";

import { type Theme, WORLDALITY_CONFIG } from "../constants";

export function useWorldalityWidget(theme: Ref<Theme>) {
  const buttonRef = ref<HTMLButtonElement | null>(null);
  let widget: WorldalityWidget | null = null;
  let detach: (() => void) | null = null;

  const initWidget = () => {
    if (widget) {
      detach?.();
      widget.destroy();
    }

    widget = new WorldalityWidget({ ...WORLDALITY_CONFIG, theme: theme.value });

    if (buttonRef.value) {
      detach = widget.attachTo(buttonRef.value);
    }
  };

  onMounted(() => {
    initWidget();
  });

  watch(theme, () => {
    initWidget();
  });

  onUnmounted(() => {
    detach?.();
    widget?.destroy();
  });

  return { buttonRef };
}
