export interface TimelinePluginSettings {
    defaultView: string;
}

export const DEFAULT_SETTINGS: TimelinePluginSettings = {
    defaultView: 'basic'
};

export interface TimelineEvent {
    year: string;
    month?: string;
    day?: string;
    title: string;
    content: string;
} 