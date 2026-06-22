/**
 * Svelte utilities for Worldality widget management
 *
 * Handles widget initialization, theme updates, and cleanup for Svelte 5.
 */
import { WorldalityWidget } from "worldality/widget";

import { type Theme, WORLDALITY_CONFIG } from "../constants";

export function createWidget(getTheme: () => Theme) {
  let instance: WorldalityWidget | null = null;
  let detach: (() => void) | null = null;
  let buttonRef: HTMLButtonElement | undefined = $state();

  // Initialize widget when button ref is set
  $effect(() => {
    if (buttonRef) {
      // Clean up existing
      if (instance) {
        detach?.();
        instance.destroy();
      }

      // Create new widget
      instance = new WorldalityWidget({
        ...WORLDALITY_CONFIG,
        theme: getTheme(),
      });
      detach = instance.attachTo(buttonRef);
    }

    return () => {
      detach?.();
      instance?.destroy();
    };
  });

  return {
    get buttonRef() {
      return buttonRef;
    },
    set buttonRef(ref: HTMLButtonElement | undefined) {
      buttonRef = ref;
    },
  };
}
