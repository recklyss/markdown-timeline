import { MarkdownRenderChild, MarkdownRenderer, Plugin } from 'obsidian';
import { TimelineEvent } from '../types';

export class TimelineEventContent extends MarkdownRenderChild {
    constructor(
        container: HTMLElement,
        private content: string,
        private sourcePath: string,
        private plugin: Plugin
    ) {
        super(container);
    }

    async onload() {
        await MarkdownRenderer.render(
            this.plugin.app,
            this.content,
            this.containerEl,
            this.sourcePath,
            this.plugin
        );
    }
}

export function renderTimelineEvents(
    container: HTMLElement,
    events: TimelineEvent[],
    plugin: Plugin,
    sourcePath = ''
): TimelineEventContent[] {
    const timeline = container.createEl("div", { cls: "timeline" });
    const renderChildren: TimelineEventContent[] = [];
    
    for (const event of events) {
        const eventEl = timeline.createEl("div", { cls: "timeline-event" });
        
        const dateEl = eventEl.createEl("div", { cls: "timeline-date" });
        const year = event.date.split('-')[0];
        dateEl.createEl("span", { cls: "timeline-year", text: year });
        const displayDate = new Date(event.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
        dateEl.createEl("span", { cls: "timeline-month", text: displayDate });
        
        eventEl.createEl("div", { cls: "timeline-point" });
        
        const contentEl = eventEl.createEl("div", { cls: "timeline-content" });
        contentEl.createEl("h3", { text: event.title });
        
        const markdownContent = contentEl.createDiv("timeline-markdown-content");
        const renderChild = new TimelineEventContent(
            markdownContent,
            event.content,
            sourcePath,
            plugin
        );
        renderChildren.push(renderChild);
    }
    
    return renderChildren;
} 