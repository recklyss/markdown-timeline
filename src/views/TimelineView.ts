import { ItemView, WorkspaceLeaf } from 'obsidian';

import TimelinePlugin from '../main';
import { parseTimelineContent } from '../utils/parser';
import { renderTimelineEvents } from '../utils/timeline-renderer';
import { sortTimelineEvents } from '../utils/dateUtils';

export const VIEW_TYPE_TIMELINE = "timeline-view";

export class TimelineView extends ItemView {
    private content = '';

    constructor(
        leaf: WorkspaceLeaf,
        private plugin: TimelinePlugin
    ) {
        super(leaf);
    }

    getViewType(): string {
        return VIEW_TYPE_TIMELINE;
    }

    getDisplayText(): string {
        return "Timeline view";
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        container.createEl("div", { cls: "timeline-container" });
    }

    async setContent(content: string) {
        this.content = content;
        await this.renderContent();
    }

    public async renderContent() {
        const container = this.containerEl.querySelector(".timeline-container") as HTMLElement;
        if (!container) return;

        container.empty();

        const events = parseTimelineContent(this.content);
        const sortedEvents = sortTimelineEvents(events, this.plugin.settings.timelineOrder);
        const renderChildren = renderTimelineEvents(container, sortedEvents, this.plugin);
        renderChildren.forEach(child => this.addChild(child));
    }
} 