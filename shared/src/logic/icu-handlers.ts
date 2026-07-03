/**
 * ICU MessageFormat example handlers
 *
 * Reusable logic for ICU example interactions. These handlers provide
 * consistent behavior across all framework examples for:
 * - Plural count manipulation
 * - Gender selection
 * - Score updates
 * - Notification count manipulation
 */

/**
 * Create handlers for plural example
 * Provides increment, decrement, and reset functions
 */
export function createPluralHandlers<T extends number>(
  _count: T,
  setCount: (value: T | ((prev: T) => T)) => void,
) {
  return {
    increment: () => setCount((prev: T) => (prev + 1) as T),
    decrement: () => setCount((prev: T) => Math.max(0, prev - 1) as T),
    reset: () => setCount(0 as T),
  };
}

/**
 * Create handlers for ordinal rank (min 1, no reset)
 */
export function createOrdinalHandlers<T extends number>(
  _count: T,
  setCount: (value: T | ((prev: T) => T)) => void,
) {
  return {
    increment: () => setCount((prev: T) => (prev + 1) as T),
    decrement: () => setCount((prev: T) => Math.max(1, prev - 1) as T),
  };
}

/**
 * Create handlers for notification count
 * Similar to plural but without reset
 */
export function createNotificationHandlers<T extends number>(
  _count: T,
  setCount: (value: T | ((prev: T) => T)) => void,
) {
  return {
    increment: () => setCount((prev: T) => (prev + 1) as T),
    decrement: () => setCount((prev: T) => Math.max(0, prev - 1) as T),
  };
}

/**
 * Create handlers for score input
 * Handles both slider and text input updates
 */
export function createScoreHandlers<T>(
  setScore: (value: T | ((prev: T) => T)) => void,
) {
  return {
    updateFromInput: (value: string | number) => setScore(Number(value) as T),
  };
}

/**
 * Create handler for username input
 */
export function createUserNameHandler<T>(
  setUserName: (value: T | ((prev: T) => T)) => void,
) {
  return {
    update: (value: string) => setUserName(value as T),
  };
}

/**
 * Create handlers for gender selection
 */
export function createGenderHandlers<T>(
  setGender: (value: T | ((prev: T) => T)) => void,
) {
  return {
    setMale: () => setGender("male" as T),
    setFemale: () => setGender("female" as T),
    setOther: () => setGender("other" as T),
  };
}
