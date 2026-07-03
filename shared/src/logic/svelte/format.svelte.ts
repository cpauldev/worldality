/**
 * Svelte utilities for Format API examples
 *
 * Provides state and derived values for all 6 Format API sections
 * using Svelte 5 runes. Locale reactivity is handled by the component
 * via $effect(() => { $currentLocale; }) — same pattern as icu.svelte.ts.
 */
import { getFormatter } from "worldality";

import {
  DISPLAY_NAMES_DEFAULTS,
  FORMAT_INITIAL_STATE,
  FORMAT_LIST_ITEMS,
} from "../constants";
import { detectRelativeTimeUnit } from "../format-handlers";

export function createFormatExamples() {
  let numberValue = $state(FORMAT_INITIAL_STATE.numberValue);
  let numberProfile = $state<"currency" | "percent" | "decimal">(
    FORMAT_INITIAL_STATE.numberProfile,
  );
  let dateTimeProfile = $state<"short" | "medium" | "long" | "full">(
    FORMAT_INITIAL_STATE.dateTimeProfile,
  );
  let dateTimeRangeProfile = $state<"short" | "medium" | "long" | "full">(
    FORMAT_INITIAL_STATE.dateTimeRangeProfile,
  );
  let relativeTimeSeconds = $state(FORMAT_INITIAL_STATE.relativeTimeSeconds);
  let listType = $state<"conjunction" | "disjunction" | "unit">(
    FORMAT_INITIAL_STATE.listType,
  );
  let displayNamesType = $state<"language" | "region" | "script" | "currency">(
    FORMAT_INITIAL_STATE.displayNamesType,
  );
  let displayNamesCode = $state(FORMAT_INITIAL_STATE.displayNamesCode);

  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  return {
    get numberValue() {
      return numberValue;
    },
    set numberValue(v: number) {
      numberValue = v;
    },
    get numberProfile() {
      return numberProfile;
    },
    set numberProfile(v: "currency" | "percent" | "decimal") {
      numberProfile = v;
    },
    get dateTimeProfile() {
      return dateTimeProfile;
    },
    set dateTimeProfile(v: "short" | "medium" | "long" | "full") {
      dateTimeProfile = v;
    },
    get dateTimeRangeProfile() {
      return dateTimeRangeProfile;
    },
    set dateTimeRangeProfile(v: "short" | "medium" | "long" | "full") {
      dateTimeRangeProfile = v;
    },
    get relativeTimeSeconds() {
      return relativeTimeSeconds;
    },
    get listType() {
      return listType;
    },
    set listType(v: "conjunction" | "disjunction" | "unit") {
      listType = v;
    },
    get displayNamesType() {
      return displayNamesType;
    },
    get displayNamesCode() {
      return displayNamesCode;
    },
    set displayNamesCode(v: string) {
      displayNamesCode = v;
    },

    today,
    nextWeek,

    adjustRelativeTime: (delta: number) => {
      relativeTimeSeconds += delta;
    },

    setDisplayNamesType: (
      type: "language" | "region" | "script" | "currency",
    ) => {
      displayNamesType = type;
      displayNamesCode = DISPLAY_NAMES_DEFAULTS[type] ?? "";
    },

    get detectedUnit() {
      return detectRelativeTimeUnit(relativeTimeSeconds);
    },

    get formattedNumber() {
      return numberProfile === "currency"
        ? getFormatter().number(numberValue, {
            style: "currency",
            currency: "USD",
          })
        : getFormatter().number(numberValue, numberProfile);
    },

    get formattedDateTime() {
      return getFormatter().dateTime(today, dateTimeProfile);
    },

    get formattedDateTimeRange() {
      return getFormatter().dateTimeRange(
        today,
        nextWeek,
        dateTimeRangeProfile,
      );
    },

    get formattedRelativeTime() {
      return getFormatter().relativeTime(relativeTimeSeconds);
    },

    get formattedList() {
      return getFormatter().list(FORMAT_LIST_ITEMS, { type: listType });
    },

    get formattedDisplayNames() {
      return getFormatter().displayNames(displayNamesCode, {
        type: displayNamesType,
      });
    },
  };
}
