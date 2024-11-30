import { MarkdownRenderChild, MarkdownRenderer, Plugin } from 'obsidian';
import { TimelineEvent } from '../types';
import { formatDate } from './formatDate';

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
        dateEl.createEl("span", { cls: "timeline-year", text: event.year });

        if (event.month) {
            const monthDisplay = new Intl.DateTimeFormat('en-US', { month: 'short' })
                .format(new Date(2000, parseInt(event.month) - 1));

            const dateDisplay = event.day
                ? `${monthDisplay} ${event.day}`
                : monthDisplay;

            dateEl.createEl("span", { cls: "timeline-month", text: dateDisplay });
        }

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