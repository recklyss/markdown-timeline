import { DEFAULT_SETTINGS, TimelinePluginSettings } from './types';
import { TimelineView, VIEW_TYPE_TIMELINE } from './views/TimelineView';

import { Plugin } from 'obsidian';
import { parseTimelineContent } from './utils/parser';
import { renderTimelineEvents } from './utils/timeline-renderer';
import { sortTimelineEvents } from 'utils/sort';

export default class TimelinePlugin extends Plugin {
    settings: TimelinePluginSettings;
    private timelineView: TimelineView | null = null;

    async onload() {
        await this.loadSettings();

        this.registerView(
            VIEW_TYPE_TIMELINE,
            (leaf) => (this.timelineView = new TimelineView(leaf, this))
        );

        this.registerMarkdownCodeBlockProcessor('timeline', async (source, el, ctx) => {
            const container = el.createEl('div', { cls: 'timeline-container' });
            const events = parseTimelineContent(source);
            const sortedEvents = sortTimelineEvents(events, this.settings.timelineOrder);
            const renderChildren = renderTimelineEvents(container, sortedEvents, this, ctx.sourcePath);
            renderChildren.forEach(child => this.addChild(child));
        });
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async activateView() {
        const { workspace } = this.app;

        let leaf = workspace.getLeavesOfType(VIEW_TYPE_TIMELINE)[0];

        if (!leaf) {
            leaf = workspace.getRightLeaf(false) ?? workspace.getLeaf(false);
            await leaf.setViewState({ type: VIEW_TYPE_TIMELINE });
        }

        workspace.revealLeaf(leaf);
    }
} 