/**
 * Solid primitive for Worldality widget management
 *
 * Handles widget initialization, theme updates, and cleanup.
 * Returns a setter for the button ref.
 */
import { type Accessor, createEffect, onCleanup, onMount } from "solid-js";

import { WorldalityWidget } from "worldality/widget";

import { type Theme, WORLDALITY_CONFIG } from "../constants";

export function useWorldalityWidget(theme: Accessor<Theme>) {
  let buttonRef: HTMLButtonElement | undefined;
  let widget: WorldalityWidget | undefined;
  let detach: (() => void) | undefined;

  onMount(() => {
    widget = new WorldalityWidget({ ...WORLDALITY_CONFIG, theme: theme() });

    if (buttonRef) {
      detach = widget.attachTo(buttonRef);
    }

    onCleanup(() => {
      detach?.();
      widget?.destroy();
    });
  });

  // Update widget when theme changes
  createEffect(() => {
    if (widget) {
      widget.destroy();
      widget = new WorldalityWidget({ ...WORLDALITY_CONFIG, theme: theme() });
      if (buttonRef) {
        detach = widget.attachTo(buttonRef);
      }
    }
  });

  return {
    setButtonRef: (el: HTMLButtonElement) => {
      buttonRef = el;
    },
  };
}
