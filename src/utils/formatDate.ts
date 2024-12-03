import { TimelineEvent } from '../types';

export function formatDate(event: TimelineEvent): string {
  const parts: string[] = [event.year];

  if (event.month) {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    parts.push(monthNames[parseInt(event.month) - 1]);

    if (event.day) {
      parts.push(event.day);
    }
  }

  return parts.join(' ');
} 