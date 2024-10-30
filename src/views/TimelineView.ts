import { ItemView, WorkspaceLeaf } from 'obsidian';
import { parseTimelineContent } from '../utils/parser';

export const VIEW_TYPE_TIMELINE = "timeline-view";

export class TimelineView extends ItemView {
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType(): string {
        return VIEW_TYPE_TIMELINE;
    }

    getDisplayText(): string {
        return "Timeline View";
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        container.createEl("div", { cls: "timeline-container" });
    }

    async setContent(content: string) {
        const container = this.containerEl.querySelector(".timeline-container");
        if (!container) return;

        container.empty();
        
        const events = parseTimelineContent(content);
        const timeline = container.createEl("div", { cls: "timeline" });
        
        events.forEach(event => {
            const eventEl = timeline.createEl("div", { cls: "timeline-event" });
            
            const dateEl = eventEl.createEl("div", { cls: "timeline-date" });
            dateEl.createEl("span", { cls: "timeline-year", text: event.year });
            const displayDate = new Date(event.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            dateEl.createEl("span", { cls: "timeline-month", text: displayDate });
            
            eventEl.createEl("div", { cls: "timeline-point" });
            
            const contentEl = eventEl.createEl("div", { cls: "timeline-content" });
            contentEl.createEl("h3", { text: event.title });
            contentEl.createEl("p", { text: event.content });
        });
    }
} 