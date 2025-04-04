import { TimelineEvent } from '../types';
import TimelinePlugin from '../main';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Extend dayjs with custom parse format plugin
dayjs.extend(customParseFormat);

/**
 * Formats a date string based on the available parts (year, month, day)
 * Supports negative years and custom format patterns
 */
export function formatDate(event: TimelineEvent, plugin: TimelinePlugin): string {
  const format = plugin.settings.dateFormat || 'YYYY-MM-DD';

  // Get the separator from the format
  const separator = format.match(/[^A-Za-z0-9]+/)?.[0] || '-';

  // First handle month formats to prevent partial replacements
  let monthValue = '';
  if (event.month) {
    const date = dayjs(`2000-${event.month.padStart(2, '0')}-01`);
    if (format.includes('MMMM')) {
      monthValue = date.format('MMMM');
    } else if (format.includes('MMM')) {
      monthValue = date.format('MMM');
    } else if (format.includes('MM')) {
      monthValue = event.month.padStart(2, '0');
    }
  }

  // Create a template object with all parts
  const parts: { [key: string]: string } = {
    YYYY: event.year,
    MMMM: monthValue,
    MMM: monthValue,
    MM: event.month ? event.month.padStart(2, '0') : '',
    DD: event.day ? event.day.padStart(2, '0') : ''
  };

  // Split format into segments
  const segments = format.split(new RegExp(`[${separator}]+`));
  const filledSegments = segments.map(segment => {
    // Replace each known token in the segment
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
  }).filter(Boolean); // Remove empty segments

  // Join non-empty segments with the separator
  return filledSegments.join(separator);
} 