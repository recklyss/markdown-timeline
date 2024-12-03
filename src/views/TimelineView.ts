import { ItemView, WorkspaceLeaf, Plugin } from 'obsidian';
import { parseTimelineContent } from '../utils/parser';
import { renderTimelineEvents } from '../utils/timeline-renderer';

export const VIEW_TYPE_TIMELINE = "timeline-view";

export class TimelineView extends ItemView {
    constructor(
        leaf: WorkspaceLeaf,
        private plugin: Plugin
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
        const container = this.containerEl.querySelector(".timeline-container") as HTMLElement;
        if (!container) return;

        container.empty();

        const events = parseTimelineContent(content);
        const renderChildren = renderTimelineEvents(container, events, this.plugin);
        renderChildren.forEach(child => this.addChild(child));
    }
} 