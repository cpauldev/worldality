<script setup lang="ts">
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
import { useTheme } from "example-shared/vue/useTheme";
import { useWorldalityWidget } from "example-shared/vue/useWorldalityWidget";
import {
  ArrowUpRight,
  Globe,
  LoaderCircle,
  Monitor,
  Puzzle,
} from "lucide-vue-next";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { t, useCurrentLocale } from "worldality/vue";

const WORLDALITY_STUDIO_LABEL = "Worldality Studio";
const WORLDALITY_WIDGET_LABEL = "Worldality Widget";
const locale = useCurrentLocale();
const { theme } = useTheme();
const widget = useWorldalityWidget(theme);
const studioStatus = ref(getInitialStudioStatus());
const cardClassName = cn(
  CAPABILITY_TILE_CLASS_NAME,
  CARD_ELEVATION_SHADOW_CLASS_NAME,
  CARD_INSET_BORDER_OVERLAY_CLASS_NAME,
);
const studioStatusLabel = computed(() => {
  locale.value.code;
  switch (studioStatus.value.label) {
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
      return studioStatus.value.label;
  }
});

let studioStatusIntervalId: number | undefined;

const syncStudioStatus = async () => {
  studioStatus.value = await fetchStudioStatus();
};

onMounted(() => {
  void syncStudioStatus();
  studioStatusIntervalId = window.setInterval(() => {
    void syncStudioStatus();
  }, 5000);
});

onUnmounted(() => {
  if (studioStatusIntervalId !== undefined) {
    window.clearInterval(studioStatusIntervalId);
  }
});
</script>

<template>
  <div class="grid gap-6 sm:grid-cols-2">
    <a
      href="/worldality"
      target="_blank"
      rel="noreferrer"
      :class="cardClassName"
      :aria-label="(locale.code, t('Open {studio}', { studio: WORLDALITY_STUDIO_LABEL }))"
    >
      <div :class="CAPABILITY_IMAGE_WRAPPER_CLASS_NAME" aria-hidden="true">
        <img
          :src="studioPreviewImage"
          alt=""
          :class="CAPABILITY_IMAGE_CLASS_NAME"
        />
      </div>
      <div :class="CAPABILITY_OVERLAY_CLASS_NAME" aria-hidden="true" />
      <div
        class="relative z-10 flex w-full flex-col items-center justify-center gap-4"
      >
        <div :class="CAPABILITY_ICON_FRAME_CLASS_NAME">
          <Monitor class="text-blue-500" aria-hidden="true" />
        </div>
        <h4 class="text-white">{{ WORLDALITY_STUDIO_LABEL }}</h4>
        <div :class="CAPABILITY_CTA_CLASS_NAME">
          {{ (locale.code, t("Open {studio}", { studio: "Studio" })) }}
          <ArrowUpRight
            class="size-6"
            :class="locale.direction === 'rtl' && '-scale-x-100'"
            aria-hidden="true"
          />
        </div>
      </div>
      <div :class="CAPABILITY_FOOTER_CLASS_NAME">
        <div
          class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center body-sm"
        >
          <span
            :class="
              cn('font-medium', getStudioStatusClassName(studioStatus.tone))
            "
          >
            <LoaderCircle
              v-if="studioStatus.isLoading"
              class="me-1 inline size-3.5 animate-spin align-[-2px]"
              aria-hidden="true"
            />
            {{ studioStatusLabel }}
          </span>
          <span
            v-if="studioStatus.urlLabel"
            class="text-white/48"
            aria-hidden="true"
          >/</span>
          <bdi
            v-if="studioStatus.urlLabel"
            class="text-white/72"
            dir="ltr"
          >
            {{ studioStatus.urlLabel }}
          </bdi>
        </div>
      </div>
    </a>

    <button
      type="button"
      :ref="
        (node) => {
          widget.buttonRef.value = node as HTMLButtonElement | null;
        }
      "
      :class="cardClassName"
      :aria-label="(locale.code, t('Change language'))"
    >
      <div :class="CAPABILITY_IMAGE_WRAPPER_CLASS_NAME" aria-hidden="true">
        <img
          :src="widgetPreviewImage"
          alt=""
          :class="CAPABILITY_IMAGE_CLASS_NAME"
        />
      </div>
      <div :class="CAPABILITY_OVERLAY_CLASS_NAME" aria-hidden="true" />
      <div
        class="relative z-10 flex w-full flex-col items-center justify-center gap-4"
      >
        <div :class="CAPABILITY_ICON_FRAME_CLASS_NAME">
          <Puzzle class="text-pink-500" aria-hidden="true" />
        </div>
        <h4 class="text-white">{{ WORLDALITY_WIDGET_LABEL }}</h4>
        <div :class="CAPABILITY_CTA_CLASS_NAME">
          <Globe class="size-6" aria-hidden="true" />
          <bdi class="locale-script" :lang="locale.code">
            {{ locale.nativeName }}
          </bdi>
        </div>
      </div>
      <div :class="CAPABILITY_FOOTER_CLASS_NAME">
        <div class="text-center body-sm font-medium text-white/72">
          {{ (locale.code, t("Change language")) }}
        </div>
      </div>
    </button>
  </div>
</template>
