/**
 * Vue composable for Format API examples
 *
 * Provides reactive state and computed formatted values for all 6 Format API sections.
 */
import { computed, onUnmounted, ref } from "vue";
import { getFormatter, subscribe } from "worldality";

import {
  DISPLAY_NAMES_DEFAULTS,
  FORMAT_INITIAL_STATE,
  FORMAT_LIST_ITEMS,
} from "../constants";
import { detectRelativeTimeUnit } from "../format-handlers";

export function useFormatExamples() {
  // Track locale version to recompute formatter on locale change
  const localeVersion = ref(0);
  const unsubscribe = subscribe(() => {
    localeVersion.value++;
  });
  onUnmounted(unsubscribe);

  const format = computed(() => {
    void localeVersion.value;
    return getFormatter();
  });

  const numberValue = ref(FORMAT_INITIAL_STATE.numberValue);
  const numberProfile = ref<"currency" | "percent" | "decimal">(
    FORMAT_INITIAL_STATE.numberProfile,
  );
  const dateTimeProfile = ref<"short" | "medium" | "long" | "full">(
    FORMAT_INITIAL_STATE.dateTimeProfile,
  );
  const dateTimeRangeProfile = ref<"short" | "medium" | "long" | "full">(
    FORMAT_INITIAL_STATE.dateTimeRangeProfile,
  );
  const relativeTimeSeconds = ref(FORMAT_INITIAL_STATE.relativeTimeSeconds);
  const listType = ref<"conjunction" | "disjunction" | "unit">(
    FORMAT_INITIAL_STATE.listType,
  );
  const displayNamesType = ref<"language" | "region" | "script" | "currency">(
    FORMAT_INITIAL_STATE.displayNamesType,
  );
  const displayNamesCode = ref(FORMAT_INITIAL_STATE.displayNamesCode);

  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const detectedUnit = computed(() =>
    detectRelativeTimeUnit(relativeTimeSeconds.value),
  );

  const numberOptions = computed(() =>
    numberProfile.value === "currency"
      ? ({ style: "currency", currency: "USD" } as Intl.NumberFormatOptions)
      : numberProfile.value,
  );

  const formattedNumber = computed(() =>
    format.value.number(numberValue.value, numberOptions.value),
  );
  const formattedDateTime = computed(() =>
    format.value.dateTime(today, dateTimeProfile.value),
  );
  const formattedDateTimeRange = computed(() =>
    format.value.dateTimeRange(today, nextWeek, dateTimeRangeProfile.value),
  );
  const formattedRelativeTime = computed(() =>
    format.value.relativeTime(relativeTimeSeconds.value),
  );
  const formattedList = computed(() =>
    format.value.list(FORMAT_LIST_ITEMS, { type: listType.value }),
  );
  const formattedDisplayNames = computed(() =>
    format.value.displayNames(displayNamesCode.value, {
      type: displayNamesType.value,
    }),
  );

  function setDisplayNamesType(
    type: "language" | "region" | "script" | "currency",
  ) {
    displayNamesType.value = type;
    displayNamesCode.value = DISPLAY_NAMES_DEFAULTS[type] ?? "";
  }

  return {
    numberValue,
    numberProfile,
    dateTimeProfile,
    dateTimeRangeProfile,
    relativeTimeSeconds,
    listType,
    displayNamesType,
    displayNamesCode,
    setDisplayNamesType,
    today,
    nextWeek,
    detectedUnit,
    numberOptions,
    formattedNumber,
    formattedDateTime,
    formattedDateTimeRange,
    formattedRelativeTime,
    formattedList,
    formattedDisplayNames,
  };
}
