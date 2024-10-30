import { TimelineEvent } from '../types';

export function parseTimelineContent(content: string): TimelineEvent[] {
    const events: TimelineEvent[] = [];
    const sections = content.split('---').filter(section => section.trim());

    sections.forEach(section => {
        const lines = section.trim().split('\n');
        const currentEvent: Partial<TimelineEvent> = {};
        const contentLines: string[] = [];
        
        let foundDate = false;
        let foundTitle = false;

        lines.forEach(line => {
            line = line.trim();
            if (!foundDate && line.startsWith('# ')) {
                const fullDate = line.replace('# ', '');
                currentEvent.date = fullDate;
                currentEvent.year = fullDate.split('-')[0];
                foundDate = true;
            } else if (!foundTitle && line.startsWith('## ')) {
                currentEvent.title = line.replace('## ', '');
                foundTitle = true;
            } else if (line) {
                // Everything else goes to content, including additional # and ##
                contentLines.push(line);
            }
        });

        if (contentLines.length > 0) {
            currentEvent.content = contentLines.join('\n');
        }

        if (currentEvent.date && currentEvent.title) {
            events.push(currentEvent as TimelineEvent);
        }
    });

    // Sort events by date (newest first)
    return events.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        // Sort in descending order (newest first)
        return dateB.getTime() - dateA.getTime();
    });
} 