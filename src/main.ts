import { DEFAULT_SETTINGS, TimelinePluginSettings } from './types';
import { TimelineView, VIEW_TYPE_TIMELINE } from './views/TimelineView';

import { Plugin } from 'obsidian';
import { TimelineSettingTab } from './settings/SettingsTab';
import { parseTimelineContent } from './utils/parser';
import { renderTimelineEvents, renderError } from './utils/timeline-renderer';
import { sortTimelineEvents } from './utils/dateUtils';

/**
 * Main plugin class for the Markdown Timeline plugin
 * Handles plugin lifecycle, settings, and timeline processing
 */
export default class TimelinePlugin extends Plugin {
    /** Plugin settings configuration */
    settings: TimelinePluginSettings;
    /** Timeline view instance */
    private timelineView: TimelineView | null = null;

    /**
     * Plugin initialization - called when the plugin is loaded
     */
    async onload() {
        await this.loadSettings();

        this.addSettingTab(new TimelineSettingTab(this.app, this));

        this.registerView(
            VIEW_TYPE_TIMELINE,
            (leaf) => (this.timelineView = new TimelineView(leaf, this))
        );

        this.registerMarkdownCodeBlockProcessor('timeline', async (source, el, ctx) => {
            try {
                const container = el.createEl('div', { cls: 'timeline-container' });
                const events = parseTimelineContent(source);
                const sortedEvents = sortTimelineEvents(events, this.settings.timelineOrder);
                const renderChildren = renderTimelineEvents(container, sortedEvents, this, ctx.sourcePath);
                renderChildren.forEach(child => this.addChild(child));
            } catch (error) {
                const container = el.createEl('div', { cls: 'timeline-container' });
                if (error instanceof Error) {
                    renderError(container, {
                        message: error.name === 'TimelineValidationError' ? error.message : 'An error occurred while parsing the timeline',
                        type: 'parse',
                        details: error.message,
                        line: (error as any).line
                    });
                } else {
                    renderError(container, {
                        message: 'An unexpected error occurred',
                        type: 'parse',
                        details: String(error)
                    });
                }
            }
        });
    }

    /**
     * Load plugin settings from Obsidian's data storage
     */
    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    /**
     * Save plugin settings to Obsidian's data storage
     */
    async saveSettings() {
        await this.saveData(this.settings);
    }

    /**
     * Activate the timeline view in the workspace
     */
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