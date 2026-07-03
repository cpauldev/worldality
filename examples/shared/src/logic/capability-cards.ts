import studioPreviewImage from "../assets/green-field-sky.webp";
import widgetPreviewImage from "../assets/violet-coral-petals.webp";

export const CARD_ELEVATION_SHADOW_CLASS_NAME =
  "[box-shadow:0_56px_72px_-16px_#00275008,0_32px_32px_-16px_#00275008,0_6px_12px_-3px_#0027500a]";

export const CARD_INSET_BORDER_OVERLAY_CLASS_NAME =
  "after:pointer-events-none after:absolute after:inset-0 after:z-20 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_#0027500a]";

export const CAPABILITY_TILE_CLASS_NAME =
  "group relative flex min-h-80 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-0 px-6 py-8 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950";

export const CAPABILITY_IMAGE_WRAPPER_CLASS_NAME =
  "absolute -inset-4 scale-105 overflow-hidden";

export const CAPABILITY_IMAGE_CLASS_NAME = "size-full object-cover blur-sm";

export const CAPABILITY_OVERLAY_CLASS_NAME =
  "absolute inset-0 bg-linear-to-t from-black/64 via-black/32 to-black/8 transition-colors duration-300 ease-out group-hover:from-black/76 group-hover:via-black/42 group-hover:to-black/16 group-focus-visible:from-black/76 group-focus-visible:via-black/42 group-focus-visible:to-black/16";

export const CAPABILITY_ICON_FRAME_CLASS_NAME =
  "pointer-events-none flex size-12 items-center justify-center rounded-xl bg-zinc-950 ring-1 ring-white/14 ring-inset shadow-[0_0_0_1px_rgba(255,255,255,0.12)] [&_svg:not([class*='size-'])]:size-7";

export const CAPABILITY_CTA_CLASS_NAME =
  "h5 inline-flex items-center justify-center gap-2 rounded-lg bg-white/92 px-4 py-2 font-sans text-zinc-950 shadow-xl";

export const CAPABILITY_FOOTER_CLASS_NAME = "absolute inset-x-4 bottom-5 z-10";

export const THEME_TOGGLE_CLASS_NAME = "example-theme-toggle !bg-transparent";

export { studioPreviewImage, widgetPreviewImage };
