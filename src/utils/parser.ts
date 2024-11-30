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
                const dateStr = line.replace('# ', '');
                const dateParts = dateStr.split('-');

                // Always set the year
                currentEvent.year = dateParts[0];

                // Set month and day if they exist
                if (dateParts.length > 1) {
                    currentEvent.month = dateParts[1];
                }
                if (dateParts.length > 2) {
                    currentEvent.day = dateParts[2];
                }

                foundDate = true;
            } else if (!foundTitle && line.startsWith('## ')) {
                currentEvent.title = line.replace('## ', '');
                foundTitle = true;
            } else if (line) {
                contentLines.push(line);
            }
        });

        if (contentLines.length > 0) {
            currentEvent.content = contentLines.join('\n');
        }

        if (currentEvent.year && currentEvent.title) {
            events.push(currentEvent as TimelineEvent);
        }
    });

    // Sort events by date components (newest first)
    return events.sort((a, b) => {
        // Compare years
        const yearDiff = parseInt(b.year) - parseInt(a.year);
        if (yearDiff !== 0) return yearDiff;

        // If years are equal, compare months if they exist
        if (a.month && b.month) {
            const monthDiff = parseInt(b.month) - parseInt(a.month);
            if (monthDiff !== 0) return monthDiff;
        } else if (a.month) {
            return -1; // a has month, b doesn't
        } else if (b.month) {
            return 1;  // b has month, a doesn't
        }

        // If months are equal, compare days if they exist
        if (a.day && b.day) {
            return parseInt(b.day) - parseInt(a.day);
        } else if (a.day) {
            return -1; // a has day, b doesn't
        } else if (b.day) {
            return 1;  // b has day, a doesn't
        }

        return 0; // completely equal
    });
} 