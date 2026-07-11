<script lang="ts">
  import { onMount } from "svelte";

  import { useTheme } from "$lib/theme.svelte";
  import { createWidget } from "$lib/widget.svelte";
  import {
    ArrowUpRight,
    Globe,
    LoaderCircle,
    Monitor,
    Puzzle,
  } from "@lucide/svelte";
  import {
    CAPABILITY_CTA_CLASS_NAME,
    CAPABILITY_FOOTER_CLASS_NAME,
    CAPABILITY_ICON_FRAME_CLASS_NAME,
    CAPABILITY_IMAGE_CLASS_NAME,
    CAPABILITY_IMAGE_WRAPPER_CLASS_NAME,
    CAPABILITY_OVERLAY_CLASS_NAME,
    CAPABILITY_TILE_CLASS_NAME,
    CARD_ELEVATION_SHADOW_CLASS_NAME,
    CARD_INSET_BORDER_OVERLAY_CLASS_NAME,
    studioPreviewImage,
    widgetPreviewImage,
  } from "example-shared/capability-cards";
  import {
    fetchStudioStatus,
    getInitialStudioStatus,
    getStudioStatusClassName,
  } from "example-shared/studio";
  import { cn } from "example-shared/ui";
  import { currentLocale, t } from "worldality/svelte";

  const theme = useTheme();
  const widget = createWidget(() => theme.value);
  const WORLDALITY_STUDIO_LABEL = "Worldality Studio";
  const WORLDALITY_WIDGET_LABEL = "Worldality Widget";
  const cardClassName = cn(
    CAPABILITY_TILE_CLASS_NAME,
    CARD_ELEVATION_SHADOW_CLASS_NAME,
    CARD_INSET_BORDER_OVERLAY_CLASS_NAME,
  );

  function translateStudioStatusLabel(label: string): string {
    switch (label) {
      case "Checking...":
        return t("Checking...");
      case "Connected":
        return t("Connected");
      case "Starting...":
        return t("Starting...");
      case "Error":
        return t("Error");
      case "Ready to launch":
        return t("Ready to launch");
      case "Unavailable":
        return t("Unavailable");
      default:
        return label;
    }
  }

  let widgetButton: HTMLButtonElement | null = null;
  let studioStatus = $state(getInitialStudioStatus());

  $effect(() => {
    widget.buttonRef = widgetButton ?? undefined;
  });

  onMount(() => {
    let isMounted = true;

    const syncStudioStatus = async () => {
      const nextStatus = await fetchStudioStatus();
      if (isMounted) {
        studioStatus = nextStatus;
      }
    };

    void syncStudioStatus();
    const intervalId = window.setInterval(() => {
      void syncStudioStatus();
    }, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  });
</script>

<div class="grid gap-6 sm:grid-cols-2">
  <a
    href="/worldality"
    target="_blank"
    rel="noreferrer"
    class={cardClassName}
    aria-label={t("Open {studio}", {
      studio: WORLDALITY_STUDIO_LABEL,
    })}
  >
    <div class={CAPABILITY_IMAGE_WRAPPER_CLASS_NAME} aria-hidden="true">
      <img
        src={studioPreviewImage}
        alt=""
        class={CAPABILITY_IMAGE_CLASS_NAME}
      />
    </div>
    <div class={CAPABILITY_OVERLAY_CLASS_NAME} aria-hidden="true"></div>
    <div
      class="relative z-10 flex w-full flex-col items-center justify-center gap-4"
    >
      <div class={CAPABILITY_ICON_FRAME_CLASS_NAME}>
        <Monitor class="text-blue-500" aria-hidden="true" />
      </div>
      <h4 class="text-white">
        {WORLDALITY_STUDIO_LABEL}
      </h4>
      <div class={CAPABILITY_CTA_CLASS_NAME}>
        {t("Open {studio}", { studio: "Studio" })}
        <ArrowUpRight
          class={cn(
            "size-6",
            $currentLocale.direction === "rtl" && "-scale-x-100",
          )}
          aria-hidden="true"
        />
      </div>
    </div>
    <div class={CAPABILITY_FOOTER_CLASS_NAME}>
      <div
        class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center body-sm"
      >
        <span
          class={cn("font-medium", getStudioStatusClassName(studioStatus.tone))}
        >
          {#if studioStatus.isLoading}
            <LoaderCircle
              class="me-1 inline size-3.5 animate-spin align-[-2px]"
              aria-hidden="true"
            />
          {/if}
          {translateStudioStatusLabel(studioStatus.label)}
        </span>
        {#if studioStatus.urlLabel}
          <span class="text-white/48" aria-hidden="true">/</span>
          <bdi class="text-white/72" dir="ltr">
            {studioStatus.urlLabel}
          </bdi>
        {/if}
      </div>
    </div>
  </a>

  <button
    bind:this={widgetButton}
    type="button"
    class={cardClassName}
    aria-label={t("Change language")}
  >
    <div class={CAPABILITY_IMAGE_WRAPPER_CLASS_NAME} aria-hidden="true">
      <img
        src={widgetPreviewImage}
        alt=""
        class={CAPABILITY_IMAGE_CLASS_NAME}
      />
    </div>
    <div class={CAPABILITY_OVERLAY_CLASS_NAME} aria-hidden="true"></div>
    <div
      class="relative z-10 flex w-full flex-col items-center justify-center gap-4"
    >
      <div class={CAPABILITY_ICON_FRAME_CLASS_NAME}>
        <Puzzle class="text-pink-500" aria-hidden="true" />
      </div>
      <h4 class="text-white">
        {WORLDALITY_WIDGET_LABEL}
      </h4>
      <div class={CAPABILITY_CTA_CLASS_NAME}>
        <Globe class="size-6" aria-hidden="true" />
        <bdi class="locale-script" lang={$currentLocale.code}>
          {$currentLocale.nativeName}
        </bdi>
      </div>
    </div>
    <div class={CAPABILITY_FOOTER_CLASS_NAME}>
      <div class="text-center body-sm font-medium text-white/72">
        {t("Change language")}
      </div>
    </div>
  </button>
</div>
