import { TimelineEvent } from '../types';

/**
 * Compares two timeline events by their dates
 * Handles both positive and negative years correctly
 * @param a - First timeline event to compare
 * @param b - Second timeline event to compare
 * @returns Negative if a < b, positive if a > b, 0 if equal
 */
export function compareTimelineEvents(a: TimelineEvent, b: TimelineEvent): number {
  if (!a || !b) {
    throw new Error('Both timeline events must be provided');
  }
  
  // Convert to numbers for comparison
  const yearA = parseInt(a.year);
  const yearB = parseInt(b.year);

  // Compare years first
  if (yearA !== yearB) {
    return yearA - yearB;
  }

  // If years are equal, compare months
  const monthA = a.month ? parseInt(a.month) : 1;
  const monthB = b.month ? parseInt(b.month) : 1;

  if (monthA !== monthB) {
    return monthA - monthB;
  }

  // If months are equal, compare days
  const dayA = a.day ? parseInt(a.day) : 1;
  const dayB = b.day ? parseInt(b.day) : 1;

  return dayA - dayB;
}

/**
 * Sorts timeline events by date
 * @param events - Array of timeline events to sort
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array of timeline events
 */
export function sortTimelineEvents(events: TimelineEvent[], order: 'asc' | 'desc'): TimelineEvent[] {
  if (!Array.isArray(events)) {
    throw new Error('events must be an array');
  }
  if (!['asc', 'desc'].includes(order)) {
    throw new Error('order must be either "asc" or "desc"');
  }
  
  const modifier = order === 'desc' ? -1 : 1;
  return [...events].sort((a, b) => compareTimelineEvents(a, b) * modifier);
} 