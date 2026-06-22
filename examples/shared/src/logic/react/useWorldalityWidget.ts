/**
 * React hook for Worldality widget management
 *
 * Handles widget initialization, theme updates, and cleanup.
 * Returns a ref to attach to the locale button.
 */
import { useEffect, useRef } from "react";

import { WorldalityWidget } from "worldality/widget";

import { type Theme, WORLDALITY_CONFIG } from "../constants";

export function useWorldalityWidget(theme: Theme) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const widgetRef = useRef<WorldalityWidget | undefined>(undefined);

  useEffect(() => {
    widgetRef.current = new WorldalityWidget({ ...WORLDALITY_CONFIG, theme });

    if (buttonRef.current) {
      const detach = widgetRef.current.attachTo(buttonRef.current);
      return () => {
        detach();
        widgetRef.current?.destroy();
      };
    }
  }, [theme]);

  return { buttonRef };
}
