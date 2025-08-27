import { TimelineEvent } from '../types';
import TimelinePlugin from '../main';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Extend dayjs with custom parse format plugin
dayjs.extend(customParseFormat);

/**
 * Formats a date string based on the available parts (year, month, day)
 * Supports negative years and custom format patterns
 * @param event - Timeline event containing date information
 * @param plugin - Plugin instance for accessing settings
 * @returns Formatted date string according to plugin settings
 */
export function formatDate(event: TimelineEvent, plugin: TimelinePlugin): string {
  if (!event) {
    throw new Error('event must be provided');
  }
  if (!plugin) {
    throw new Error('plugin must be provided');
  }
  
  const format = plugin.settings.dateFormat || 'YYYY-MM-DD';
  const separator = getFormatSeparator(format);
  const monthValue = getMonthValue(event.month, format);
  const parts = createDateParts(event, monthValue);
  
  const segments = format.split(new RegExp(`[${separator}]+`));
  const filledSegments = segments.map(segment => processFormatSegment(segment, parts, monthValue));
  
  return filledSegments.filter(Boolean).join(separator);
}

/**
 * Extracts the separator character from the date format
 */
function getFormatSeparator(format: string): string {
  return format.match(/[^A-Za-z0-9]+/)?.[0] || '-';
}

/**
 * Gets the formatted month value based on the format pattern
 */
function getMonthValue(month: string | undefined, format: string): string {
  if (!month) return '';
  
  const date = dayjs(`2000-${month.padStart(2, '0')}-01`);
  if (format.includes('MMMM')) {
    return date.format('MMMM');
  } else if (format.includes('MMM')) {
    return date.format('MMM');
  } else if (format.includes('MM')) {
    return month.padStart(2, '0');
  }
  return '';
}

/**
 * Creates a parts object for date formatting
 */
function createDateParts(event: TimelineEvent, monthValue: string): { [key: string]: string } {
  return {
    YYYY: event.year,
    MMMM: monthValue,
    MMM: monthValue,
    MM: event.month ? event.month.padStart(2, '0') : '',
    DD: event.day ? event.day.padStart(2, '0') : ''
  };
}

/**
 * Processes a single format segment, replacing tokens with actual values
 */
function processFormatSegment(segment: string, parts: { [key: string]: string }, monthValue: string): string {
  let result = segment;

  // Handle month formats first (longest to shortest)
  if (result.includes('MMMM') && monthValue) {
    result = result.replace('MMMM', monthValue);
  } else if (result.includes('MMM') && monthValue) {
    result = result.replace('MMM', monthValue);
  } else if (result.includes('MM') && parts.MM) {
    result = result.replace('MM', parts.MM);
  }

  // Handle other tokens
  if (result.includes('YYYY')) {
    if (!parts.YYYY) return '';
    result = result.replace('YYYY', parts.YYYY);
  }
  if (result.includes('DD')) {
    if (!parts.DD) return '';
    result = result.replace('DD', parts.DD);
  }

  // If the segment still contains any of our tokens, it means we couldn't replace them
  if (/YYYY|MM(MM?)?|DD/.test(result)) {
    return '';
  }

  return result;
} 