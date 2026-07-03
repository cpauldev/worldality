import { cva } from "class-variance-authority";

import { framePanelVariants } from "./frame";

const frameMiddleVariants = cva(
  "overflow-x-auto rounded-b-none border-b-0 bg-card px-5 py-4",
);

export const codeBlockVariants = cva(
  `${framePanelVariants()} ${frameMiddleVariants()}`,
  {
    variants: {
      variant: {
        default: "",
        compact: "px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const codeTextVariants = cva("wl-code-text font-mono", {
  variants: {
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      warning: "text-amber-600 dark:text-amber-300",
      error: "text-red-600 dark:text-red-300",
    },
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});
