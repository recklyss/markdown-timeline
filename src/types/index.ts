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