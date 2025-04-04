import { TimelineEvent } from '../types';

/**
 * Compares two timeline events by their dates
 * Handles both positive and negative years correctly
 */
export function compareTimelineEvents(a: TimelineEvent, b: TimelineEvent): number {
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
 * @param events Array of timeline events to sort
 * @param order Sort order ('asc' or 'desc')
 * @returns Sorted array of timeline events
 */
export function sortTimelineEvents(events: TimelineEvent[], order: 'asc' | 'desc'): TimelineEvent[] {
  const modifier = order === 'desc' ? -1 : 1;
  return [...events].sort((a, b) => compareTimelineEvents(a, b) * modifier);
} 