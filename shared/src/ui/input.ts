import { cva } from "class-variance-authority";

export const inputVariants = cva(
  "w-full min-w-0 rounded-lg border bg-clip-padding text-foreground shadow-xs transition-[border-color,box-shadow,background-color] outline-none disabled:cursor-not-allowed disabled:opacity-60 placeholder:text-muted-foreground/70 focus-visible:ring-[3px] focus-visible:ring-ring/20 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none [&::-ms-clear]:hidden",
  {
    variants: {
      variant: {
        default: "border-border bg-background/90 focus-visible:border-ring/70",
        filled: "border-border bg-secondary/90 focus-visible:border-ring/70",
      },
      size: {
        sm: "h-8 px-2.5 text-sm leading-8",
        md: "h-10 px-3 text-sm leading-10 sm:h-9 sm:leading-9",
        lg: "h-11 px-4 text-base leading-11 sm:h-10 sm:leading-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);
