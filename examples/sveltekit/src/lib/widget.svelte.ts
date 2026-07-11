import { onMount } from "svelte";

import type { WorldalityWidget } from "worldality/widget";

import type { Theme } from "./theme.svelte";

export function createWidget(getTheme: () => Theme) {
  let instance: WorldalityWidget | undefined;
  let detach: (() => void) | undefined;
  let buttonRef = $state<HTMLButtonElement>();
  let Widget = $state<typeof WorldalityWidget>();

  onMount(() => {
    void import("worldality/widget").then(({ WorldalityWidget }) => {
      Widget = WorldalityWidget;
    });
  });

  $effect(() => {
    if (!buttonRef || !Widget) return;
    detach?.();
    instance?.destroy();
    instance = new Widget({
      position: "bottom-center",
      showSettings: true,
      theme: getTheme(),
    });
    detach = instance.attachTo(buttonRef);
    return () => {
      detach?.();
      instance?.destroy();
    };
  });
  return {
    get buttonRef() {
      return buttonRef;
    },
    set buttonRef(value: HTMLButtonElement | undefined) {
      buttonRef = value;
    },
  };
}
