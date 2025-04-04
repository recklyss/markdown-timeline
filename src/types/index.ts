export interface TimelinePluginSettings {
    defaultView: string;
    timelineOrder: 'asc' | 'desc';
    showHeaderButtons: boolean;
}

export const DEFAULT_SETTINGS: TimelinePluginSettings = {
    defaultView: 'basic',
    timelineOrder: 'asc',
    showHeaderButtons: true
};

export interface TimelineEvent {
    year: string;
    month?: string;
    day?: string;
    title: string;
    content: string;
}

export interface TimelineError {
    message: string;
    type: 'parse' | 'validation' | 'render';
    details?: string;
    line?: number;
}

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