import { TimelineEvent } from '../types';

export function sortTimelineEvents(events: TimelineEvent[], order: 'asc' | 'desc'): TimelineEvent[] {
    return [...events].sort((a, b) => {
        const aDate = new Date(`${a.year}-${a.month || '01'}-${a.day || '01'}`);
        const bDate = new Date(`${b.year}-${b.month || '01'}-${b.day || '01'}`);
        const modifier = order === 'asc' ? 1 : -1;
        return (aDate.getTime() - bDate.getTime()) * modifier;
    });
} 