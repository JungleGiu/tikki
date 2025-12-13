/**
 * Converts an ISO string or Date object to a format suitable for HTML date input
 * @param timestamp ISO string or Date from Supabase timestamptz
 * @returns YYYY-MM-DD format string for date input
 */
export function timestamptzToDateInput(timestamp: string | Date | null | undefined): string {
  if (!timestamp) return '';

  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error converting timestamp to date input:', error);
    return '';
  }
}

/**
 * Converts a date input value (YYYY-MM-DD) back to ISO string for Supabase storage
 * @param dateInputValue Date input value (YYYY-MM-DD)
 * @param originalTimestamp Optional original timestamp to preserve time portion
 * @returns ISO string ready for Supabase timestamptz column
 */
export function dateInputToTimestamptz(
  dateInputValue: string | null | undefined,
  originalTimestamp?: string | Date
): string {
  if (!dateInputValue) {
    return originalTimestamp
      ? typeof originalTimestamp === 'string'
        ? originalTimestamp
        : originalTimestamp.toISOString()
      : '';
  }

  try {
    // Parse YYYY-MM-DD format (from HTML date input)
    // HTML date inputs return local date, so we need to handle timezone properly
    const [year, month, day] = dateInputValue.split('-').map(Number);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      throw new Error('Invalid date format');
    }

    // Create date at midnight UTC (not local time)
    // This way when stored in Supabase, the date will be preserved as-is
    const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    return date.toISOString();
  } catch (error) {
    console.error('Error converting date input to timestamptz:', error);
    return originalTimestamp
      ? typeof originalTimestamp === 'string'
        ? originalTimestamp
        : originalTimestamp.toISOString()
      : '';
  }
}

/**
 * Formats a timestamptz for display (e.g., "Dec 6, 2025")
 * @param timestamp ISO string or Date from Supabase
 * @returns Formatted date string
 */
export function formatTimestamptzForDisplay(timestamp: string | Date | null | undefined): string {
  if (!timestamp) return '';

  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return '';
  }
}

/**
 * Gets the current timestamp in ISO format suitable for Supabase timestamptz columns
 * @returns ISO string of current time in UTC
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Formats a timestamptz for calendar display (date only, e.g., "Dec 6, 2025")
 * Alias for formatTimestamptzForDisplay for semantic clarity in calendar contexts
 * @param timestamp ISO string or Date from Supabase
 * @returns Formatted date string
 */
export function formatTimestampForCalendar(timestamp: string | Date | null | undefined): string {
  return formatTimestamptzForDisplay(timestamp);
}
