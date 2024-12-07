export interface TimelinePluginSettings {
    defaultView: string;
    timelineOrder: 'asc' | 'desc';
}

export const DEFAULT_SETTINGS: TimelinePluginSettings = {
    defaultView: 'basic',
    timelineOrder: 'asc'
};

export interface TimelineEvent {
    year: string;
    month?: string;
    day?: string;
    title: string;
    content: string;
} 