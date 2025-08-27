import { TimelineEvent, TimelineValidationError } from '../types';

/**
 * Validates date components for timeline events
 * @param year - Year string to validate
 * @param month - Optional month string to validate
 * @param day - Optional day string to validate
 * @param lineNumber - Line number for error reporting
 * @throws TimelineValidationError if date validation fails
 */
function validateDate(year: string, month?: string, day?: string, lineNumber?: number) {
  if (!year || typeof year !== 'string') {
    throw new TimelineValidationError(
      'Invalid year parameter',
      'validation',
      'Year must be a non-empty string',
      lineNumber
    );
  }
  
  const yearNum = parseInt(year);
  if (isNaN(yearNum)) {
    throw new TimelineValidationError(
      'Invalid year format',
      'validation',
      `Year "${year}" is not a valid number`,
      lineNumber
    );
  }

    if (month) {
        const monthNum = parseInt(month);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            throw new TimelineValidationError(
                'Invalid month format',
                'validation',
                `Month "${month}" should be between 1 and 12`,
                lineNumber
            );
        }

        if (day) {
            const dayNum = parseInt(day);
            // Use absolute year for date validation since negative years aren't supported by Date
            const absYear = Math.abs(yearNum);
            const daysInMonth = new Date(absYear, monthNum, 0).getDate();
            if (isNaN(dayNum) || dayNum < 1 || dayNum > daysInMonth) {
                throw new TimelineValidationError(
                    'Invalid day format',
                    'validation',
                    `Day "${day}" is not valid for month ${month}`,
                    lineNumber
                );
            }
        }
    }
}

/**
 * Parses markdown content into timeline events
 * @param content - Raw markdown content to parse
 * @returns Array of parsed timeline events
 * @throws TimelineValidationError if parsing fails
 */
export function parseTimelineContent(content: string): TimelineEvent[] {
    validateContentNotEmpty(content);
    
    const sections = content.split('---').filter(section => section.trim());
    validateSectionsExist(sections);
    
    const events: TimelineEvent[] = [];
    let currentLineNumber = 1;
    
    sections.forEach(section => {
        const event = parseTimelineSection(section, currentLineNumber);
        events.push(event);
        currentLineNumber += section.split('\n').length + 1; // Account for separator
    });

    return events;
}

/**
 * Validates that the content is not empty
 */
function validateContentNotEmpty(content: string): void {
    if (!content.trim()) {
        throw new TimelineValidationError(
            'Empty timeline content',
            'parse',
            'Please provide some timeline events'
        );
    }
}

/**
 * Validates that at least one section exists
 */
function validateSectionsExist(sections: string[]): void {
    if (sections.length === 0) {
        throw new TimelineValidationError(
            'No timeline events found',
            'parse',
            'Timeline should contain at least one event separated by ---'
        );
    }
}

/**
 * Parses a single timeline section into a TimelineEvent
 */
function parseTimelineSection(section: string, startLineNumber: number): TimelineEvent {
    const lines = section.trim().split('\n');
    const currentEvent: Partial<TimelineEvent> = {};
    const contentLines: string[] = [];

    let foundDate = false;
    let foundTitle = false;
    let currentLineNumber = startLineNumber;

    lines.forEach(line => {
        line = line.trim();
        if (!foundDate && line.startsWith('# ')) {
            parseDateLine(line, currentEvent, currentLineNumber);
            foundDate = true;
        } else if (!foundTitle && line.startsWith('## ')) {
            parseTitleLine(line, currentEvent, currentLineNumber);
            foundTitle = true;
        } else if (line) {
            contentLines.push(line);
        }
        currentLineNumber++;
    });

    validateRequiredFields(foundDate, foundTitle, contentLines.length, startLineNumber);
    
    currentEvent.content = contentLines.join('\n');
    return currentEvent as TimelineEvent;
}

/**
 * Parses a date line and extracts year, month, day
 */
function parseDateLine(line: string, currentEvent: Partial<TimelineEvent>, lineNumber: number): void {
    const dateStr = line.replace('# ', '');
    const dateParts = parseDateString(dateStr);
    
    if (dateParts.length === 0 || dateParts.length > 3) {
        throw new TimelineValidationError(
            'Invalid date format',
            'parse',
            'Date should be in format: # [-]YYYY[-MM[-DD]], supports negative years for BC events',
            lineNumber
        );
    }

    currentEvent.year = dateParts[0];
    if (dateParts.length > 1) {
        currentEvent.month = dateParts[1];
    }
    if (dateParts.length > 2) {
        currentEvent.day = dateParts[2];
    }

    validateDate(
        currentEvent.year,
        currentEvent.month,
        currentEvent.day,
        lineNumber
    );
}

/**
 * Parses a date string, handling negative years correctly
 */
function parseDateString(dateStr: string): string[] {
    if (dateStr.startsWith('-')) {
        // For negative years, keep the minus sign with the year
        const yearPart = dateStr.substring(0, dateStr.indexOf('-', 1) === -1 ?
            dateStr.length : dateStr.indexOf('-', 1));
        const restPart = dateStr.substring(yearPart.length);
        return [yearPart, ...restPart.split('-').filter(p => p)];
    } else {
        return dateStr.split('-');
    }
}

/**
 * Parses a title line
 */
function parseTitleLine(line: string, currentEvent: Partial<TimelineEvent>, lineNumber: number): void {
    currentEvent.title = line.replace('## ', '').trim();
    if (!currentEvent.title) {
        throw new TimelineValidationError(
            'Empty title',
            'parse',
            'Event title cannot be empty',
            lineNumber
        );
    }
}

/**
 * Validates that all required fields are present
 */
function validateRequiredFields(foundDate: boolean, foundTitle: boolean, contentLength: number, startLine: number): void {
    if (!foundDate) {
        throw new TimelineValidationError(
            'Missing date',
            'parse',
            'Each event must start with a date (# YYYY[-MM[-DD]])',
            startLine
        );
    }

    if (!foundTitle) {
        throw new TimelineValidationError(
            'Missing title',
            'parse',
            'Each event must have a title (## Title)',
            startLine
        );
    }

    if (contentLength === 0) {
        throw new TimelineValidationError(
            'Missing content',
            'parse',
            'Each event must have some content',
            startLine
        );
    }
} 