/**
 * React hook for Format API examples
 *
 * Provides state, handlers, and pre-computed formatted values
 * for all 6 Format API sections.
 */
import { useState } from "react";

import { useFormatter } from "worldality/react";

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
  const format = useFormatter();

  const [numberValue, setNumberValue] = useState(
    FORMAT_INITIAL_STATE.numberValue,
  );
  const [numberProfile, setNumberProfile] = useState<
    "currency" | "percent" | "decimal"
  >(FORMAT_INITIAL_STATE.numberProfile);
  const [dateTimeProfile, setDateTimeProfile] = useState<
    "short" | "medium" | "long" | "full"
  >(FORMAT_INITIAL_STATE.dateTimeProfile);
  const [dateTimeRangeProfile, setDateTimeRangeProfile] = useState<
    "short" | "medium" | "long" | "full"
  >(FORMAT_INITIAL_STATE.dateTimeRangeProfile);
  const [relativeTimeSeconds, setRelativeTimeSeconds] = useState(
    FORMAT_INITIAL_STATE.relativeTimeSeconds,
  );
  const [listType, setListType] = useState<
    "conjunction" | "disjunction" | "unit"
  >(FORMAT_INITIAL_STATE.listType);
  const [displayNamesType, setDisplayNamesType] = useState<
    "language" | "region" | "script" | "currency"
  >(FORMAT_INITIAL_STATE.displayNamesType);
  const [displayNamesCode, setDisplayNamesCode] = useState(
    FORMAT_INITIAL_STATE.displayNamesCode,
  );

  const relativeTimeHandlers = createRelativeTimeHandlers(
    () => relativeTimeSeconds,
    setRelativeTimeSeconds,
  );
  const displayNamesHandlers = createDisplayNamesHandlers(
    setDisplayNamesType,
    setDisplayNamesCode,
    DISPLAY_NAMES_DEFAULTS,
  );

  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const detectedUnit = detectRelativeTimeUnit(relativeTimeSeconds);

  const numberOptions =
    numberProfile === "currency"
      ? ({ style: "currency", currency: "USD" } as Intl.NumberFormatOptions)
      : numberProfile;

  const formattedNumber = format.number(numberValue, numberOptions);
  const formattedDateTime = format.dateTime(today, dateTimeProfile);
  const formattedDateTimeRange = format.dateTimeRange(
    today,
    nextWeek,
    dateTimeRangeProfile,
  );
  const formattedRelativeTime = format.relativeTime(relativeTimeSeconds);
  const formattedList = format.list(FORMAT_LIST_ITEMS, { type: listType });
  const formattedDisplayNames = format.displayNames(displayNamesCode, {
    type: displayNamesType,
  });

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
