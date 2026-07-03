/**
 * Solid primitive for Format API examples
 *
 * Provides signals, handlers, and derived values for all 6 Format API sections.
 */
import { createMemo, createSignal } from "solid-js";
import { getFormatter } from "worldality";
import { useCurrentLocale } from "worldality/solid";

import {
  DISPLAY_NAMES_DEFAULTS,
  FORMAT_INITIAL_STATE,
  FORMAT_LIST_ITEMS,
} from "../constants";
import {
  createDisplayNamesHandlers,
  createRelativeTimeHandlers,
  detectRelativeTimeUnit,
} from "../format-handlers";

export function useFormatExamples() {
  // Subscribe to locale changes so format recomputes on locale switch
  const locale = useCurrentLocale();

  const [numberValue, setNumberValue] = createSignal(
    FORMAT_INITIAL_STATE.numberValue,
  );
  const [numberProfile, setNumberProfile] = createSignal<
    "currency" | "percent" | "decimal"
  >(FORMAT_INITIAL_STATE.numberProfile);
  const [dateTimeProfile, setDateTimeProfile] = createSignal<
    "short" | "medium" | "long" | "full"
  >(FORMAT_INITIAL_STATE.dateTimeProfile);
  const [dateTimeRangeProfile, setDateTimeRangeProfile] = createSignal<
    "short" | "medium" | "long" | "full"
  >(FORMAT_INITIAL_STATE.dateTimeRangeProfile);
  const [relativeTimeSeconds, setRelativeTimeSeconds] = createSignal(
    FORMAT_INITIAL_STATE.relativeTimeSeconds,
  );
  const [listType, setListType] = createSignal<
    "conjunction" | "disjunction" | "unit"
  >(FORMAT_INITIAL_STATE.listType);
  const [displayNamesType, setDisplayNamesType] = createSignal<
    "language" | "region" | "script" | "currency"
  >(FORMAT_INITIAL_STATE.displayNamesType);
  const [displayNamesCode, setDisplayNamesCode] = createSignal(
    FORMAT_INITIAL_STATE.displayNamesCode,
  );

  const relativeTimeHandlers = createRelativeTimeHandlers(
    relativeTimeSeconds,
    (v) => setRelativeTimeSeconds(v),
  );
  const displayNamesHandlers = createDisplayNamesHandlers(
    (t) => setDisplayNamesType(t),
    (c) => setDisplayNamesCode(c),
    DISPLAY_NAMES_DEFAULTS,
  );

  // format reacts to locale changes
  const format = createMemo(() => {
    void locale();
    return getFormatter();
  });

  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const detectedUnit = createMemo(() =>
    detectRelativeTimeUnit(relativeTimeSeconds()),
  );

  const numberOptions = createMemo(() =>
    numberProfile() === "currency"
      ? ({ style: "currency", currency: "USD" } as Intl.NumberFormatOptions)
      : numberProfile(),
  );

  const formattedNumber = createMemo(() =>
    format().number(numberValue(), numberOptions()),
  );
  const formattedDateTime = createMemo(() =>
    format().dateTime(today, dateTimeProfile()),
  );
  const formattedDateTimeRange = createMemo(() =>
    format().dateTimeRange(today, nextWeek, dateTimeRangeProfile()),
  );
  const formattedRelativeTime = createMemo(() =>
    format().relativeTime(relativeTimeSeconds()),
  );
  const formattedList = createMemo(() =>
    format().list(FORMAT_LIST_ITEMS, { type: listType() }),
  );
  const formattedDisplayNames = createMemo(() =>
    format().displayNames(displayNamesCode(), { type: displayNamesType() }),
  );

  return {
    numberValue,
    setNumberValue,
    numberProfile,
    setNumberProfile,
    dateTimeProfile,
    setDateTimeProfile,
    dateTimeRangeProfile,
    setDateTimeRangeProfile,
    relativeTimeSeconds,
    listType,
    setListType,
    displayNamesType,
    setDisplayNamesType,
    displayNamesCode,
    setDisplayNamesCode,
    relativeTimeHandlers,
    displayNamesHandlers,
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
