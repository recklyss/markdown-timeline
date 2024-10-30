export interface TimelinePluginSettings {
    defaultView: string;
}

export const DEFAULT_SETTINGS: TimelinePluginSettings = {
    defaultView: 'basic'
};

export interface TimelineEvent {
    year: string;
    date: string;
    title: string;
    content: string;
} 