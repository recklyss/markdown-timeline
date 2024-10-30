import { TimelineEvent } from '../types';

export function parseTimelineContent(content: string): TimelineEvent[] {
    const events: TimelineEvent[] = [];
    const sections = content.split('---').filter(section => section.trim());

    sections.forEach(section => {
        const lines = section.trim().split('\n');
        let currentEvent: Partial<TimelineEvent> = {};

        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('# ')) {
                currentEvent.year = line.replace('# ', '');
            } else if (line.startsWith('## ')) {
                currentEvent.date = line.replace('## ', '');
            } else if (line.startsWith('### ')) {
                currentEvent.title = line.replace('### ', '');
            } else if (line && !line.startsWith('#')) {
                currentEvent.content = (currentEvent.content || '') + line + '\n';
            }
        });

        if (currentEvent.year && currentEvent.date) {
            events.push(currentEvent as TimelineEvent);
        }
    });

    return events.sort((a, b) => {
        const yearDiff = parseInt(b.year) - parseInt(a.year);
        if (yearDiff !== 0) return yearDiff;
        return b.date.localeCompare(a.date);
    });
} 