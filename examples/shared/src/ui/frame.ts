import { cva } from "class-variance-authority";

import { createElement } from "./dom";
import { cn } from "./utils";

export interface FrameOptions {
  className?: string;
}

export const frameVariants = cva(
  "bg-muted/72 relative flex flex-col rounded-2xl p-1 *:[[data-slot=frame-panel]+[data-slot=frame-panel]]:mt-1",
);

export const framePanelVariants = cva(
  "relative rounded-xl border bg-background bg-clip-padding p-5 shadow-xs/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
);

export const frameHeaderVariants = cva("flex flex-col px-5 py-4");

export const frameTitleVariants = cva("text-sm font-semibold");

export const frameDescriptionVariants = cva("text-sm text-muted-foreground");

export const frameFooterVariants = cva("px-5 py-4");

export function createFrame(options: FrameOptions = {}): HTMLDivElement {
  return createElement("div", {
    className: cn(frameVariants(), options.className),
    attributes: {
      "data-slot": "frame",
    },
  }) as HTMLDivElement;
}

export function createFramePanel(className = ""): HTMLDivElement {
  return createElement("div", {
    className: cn(framePanelVariants(), className),
    attributes: { "data-slot": "frame-panel" },
  }) as HTMLDivElement;
}

export function createFrameHeader(className = ""): HTMLElement {
  return createElement("header", {
    className: cn(frameHeaderVariants(), className),
    attributes: { "data-slot": "frame-panel-header" },
  });
}

export function createFrameTitle(text: string, className = ""): HTMLDivElement {
  return createElement("div", {
    className: cn(frameTitleVariants(), className),
    textContent: text,
    attributes: { "data-slot": "frame-panel-title" },
  }) as HTMLDivElement;
}

export function createFrameDescription(
  text: string,
  className = "",
): HTMLDivElement {
  return createElement("div", {
    className: cn(frameDescriptionVariants(), className),
    textContent: text,
    attributes: { "data-slot": "frame-panel-description" },
  }) as HTMLDivElement;
}

export function createFrameFooter(className = ""): HTMLElement {
  return createElement("footer", {
    className: cn(frameFooterVariants(), className),
    attributes: { "data-slot": "frame-panel-footer" },
  });
}
