import { MarkdownRenderChild, MarkdownRenderer, Plugin, setIcon } from 'obsidian';

import { TimelineEvent } from '../types';
import TimelinePlugin from '../main';

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
    sourcePath = '',
    initialOrder?: 'asc' | 'desc'
): TimelineEventContent[] {
    // Create header container
    const headerEl = container.createEl("div", { cls: "timeline-header" });
    
    // Initialize this timeline's order from the passed order or default settings
    let currentOrder = initialOrder ?? (plugin as TimelinePlugin).settings.timelineOrder;
    
    // Create order toggle button
    const orderButton = headerEl.createEl("button", { cls: "timeline-order-toggle" });
    updateOrderButton(orderButton, currentOrder);
    
    orderButton.addEventListener("click", () => {
        // Toggle order for this timeline only
        currentOrder = currentOrder === 'asc' ? 'desc' : 'asc';
        
        // Re-render with new order
        container.empty();
        const newRenderChildren = renderTimelineEvents(container, events, plugin, sourcePath, currentOrder);
        
        // Add the new children to the plugin
        if (plugin instanceof TimelinePlugin) {
            newRenderChildren.forEach(child => plugin.addChild(child));
        }
    });

    const timeline = container.createEl("div", { cls: "timeline" });
    const renderChildren: TimelineEventContent[] = [];

    // Sort events based on this timeline's current order
    const sortedEvents = [...events].sort((a, b) => {
        const aDate = new Date(`${a.year}-${a.month || '01'}-${a.day || '01'}`);
        const bDate = new Date(`${b.year}-${b.month || '01'}-${b.day || '01'}`);
        const modifier = currentOrder === 'asc' ? 1 : -1;
        return (aDate.getTime() - bDate.getTime()) * modifier;
    });

    for (const event of sortedEvents) {
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

function updateOrderButton(button: HTMLElement, order: 'asc' | 'desc') {
    button.empty();
    setIcon(button, order === 'asc' ? 'arrow-up' : 'arrow-down');
    button.setAttribute('aria-label', order === 'asc' ? 'Sorted oldest first' : 'Sorted newest first');
} 