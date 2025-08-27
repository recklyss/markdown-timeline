/**
 * Configuration settings for the Timeline plugin
 */
export interface TimelinePluginSettings {
    /** Default view to display */
    defaultView: string;
    /** Sort order for timeline events */
    timelineOrder: 'asc' | 'desc';
    /** Whether to show header operation buttons */
    showHeaderButtons: boolean;
    /** Date format pattern for displaying dates */
    dateFormat: string;
}

export const DEFAULT_SETTINGS: TimelinePluginSettings = {
    defaultView: 'timeline',
    timelineOrder: 'asc',
    showHeaderButtons: true,
    dateFormat: 'YYYY-MM-DD'
};

/**
 * Represents a single timeline event
 */
export interface TimelineEvent {
    /** Year of the event (supports negative years for BC) */
    year: string;
    /** Month of the event (1-12, optional) */
    month?: string;
    /** Day of the event (1-31, optional) */
    day?: string;
    /** Title/name of the event */
    title: string;
    /** Content/description of the event in markdown */
    content: string;
}

/**
 * Error information for timeline operations
 */
export interface TimelineError {
    /** Human-readable error message */
    message: string;
    /** Type of error that occurred */
    type: 'parse' | 'validation' | 'render';
    /** Additional error details */
    details?: string;
    /** Line number where the error occurred */
    line?: number;
}

/**
 * Custom error class for timeline validation failures
 */
export class TimelineValidationError extends Error {
    constructor(
        message: string,
        public type: TimelineError['type'] = 'validation',
        public details?: string,
        public line?: number
    ) {
        super(message);
        this.name = 'TimelineValidationError';
    }
} 