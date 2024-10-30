import { TimelineEvent } from '../types';

export function parseTimelineContent(content: string): TimelineEvent[] {
    const events: TimelineEvent[] = [];
    const sections = content.split('---').filter(section => section.trim());

    sections.forEach(section => {
        const lines = section.trim().split('\n');
        const currentEvent: Partial<TimelineEvent> = {};

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

    // Sort events by date (newest first)
    return events.sort((a, b) => {
        // Convert to comparable dates
        const dateA = new Date(`${a.year}-${a.date}`);
        const dateB = new Date(`${b.year}-${b.date}`);
        
        // Sort in descending order (newest first)
        return dateB.getTime() - dateA.getTime();
    });
} 