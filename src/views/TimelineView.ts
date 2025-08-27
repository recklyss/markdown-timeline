import { ItemView, WorkspaceLeaf } from 'obsidian';

import TimelinePlugin from '../main';
import { parseTimelineContent } from '../utils/parser';
import { renderTimelineEvents } from '../utils/timeline-renderer';
import { sortTimelineEvents } from '../utils/dateUtils';

export const VIEW_TYPE_TIMELINE = "timeline-view";

/**
 * Timeline view implementation for Obsidian
 * Displays timeline content in a dedicated view
 */
export class TimelineView extends ItemView {
    /** Current timeline content to display */
    private content = '';

    constructor(
        leaf: WorkspaceLeaf,
        private plugin: TimelinePlugin
    ) {
        super(leaf);
        
        if (!plugin) {
            throw new Error('plugin must be provided');
        }
    }

    /**
     * Returns the unique identifier for this view type
     */
    getViewType(): string {
        return VIEW_TYPE_TIMELINE;
    }

    /**
     * Returns the display name for this view
     */
    getDisplayText(): string {
        return "Timeline view";
    }

    /**
     * Called when the view is opened
     */
    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        container.createEl("div", { cls: "timeline-container" });
    }

    /**
     * Sets the timeline content and triggers re-render
     */
    async setContent(content: string) {
        this.content = content;
        await this.renderContent();
    }

    /**
     * Renders the timeline content
     */
    public async renderContent() {
        try {
            const container = this.containerEl.querySelector(".timeline-container") as HTMLElement;
            if (!container) {
                console.warn("Timeline container not found");
                return;
            }

            container.empty();

            const events = parseTimelineContent(this.content);
            const sortedEvents = sortTimelineEvents(events, this.plugin.settings.timelineOrder);
            const renderChildren = renderTimelineEvents(container, sortedEvents, this.plugin);
            renderChildren.forEach(child => this.addChild(child));
        } catch (error) {
            console.error("Error rendering timeline content:", error);
            const container = this.containerEl.querySelector(".timeline-container") as HTMLElement;
            if (container) {
                container.innerHTML = '<div class="timeline-error">Error rendering timeline content</div>';
            }
        }
    }
} 