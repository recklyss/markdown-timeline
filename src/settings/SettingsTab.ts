import { App, PluginSettingTab, Setting } from 'obsidian';

import TimelinePlugin from '../main';

/**
 * Settings tab for the Timeline plugin
 * Provides user interface for configuring plugin options
 */
export class TimelineSettingTab extends PluginSettingTab {
    /** Reference to the main plugin instance */
    plugin: TimelinePlugin;

    constructor(app: App, plugin: TimelinePlugin) {
        super(app, plugin);
        
        if (!plugin) {
            throw new Error('plugin must be provided');
        }
        
        this.plugin = plugin;
    }

    /**
     * Displays the settings interface
     */
    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Timeline Settings' });

        new Setting(containerEl)
            .setName('Default sort order')
            .setDesc('Choose the default sort order for timeline events')
            .addDropdown(dropdown => dropdown
                .addOption('asc', 'Ascending (oldest first)')
                .addOption('desc', 'Descending (newest first)')
                .setValue(this.plugin.settings.timelineOrder)
                .onChange(async (value) => {
                    this.plugin.settings.timelineOrder = value as 'asc' | 'desc';
                    await this.plugin.saveSettings();
                })
            );

        new Setting(containerEl)
            .setName('Date format')
            .setDesc('Customize how dates are displayed in the timeline. Use YYYY for year, MM for month, DD for day. Supports negative years.')
            .addText(text => text
                .setPlaceholder('YYYY-MM-DD')
                .setValue(this.plugin.settings.dateFormat)
                .onChange(async (value) => {
                    this.plugin.settings.dateFormat = value || 'YYYY-MM-DD';
                    await this.plugin.saveSettings();
                })
            );

        new Setting(containerEl)
            .setName('Show header buttons')
            .setDesc('Show or hide the operation buttons in timeline headers')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showHeaderButtons)
                .onChange(async (value) => {
                    this.plugin.settings.showHeaderButtons = value;
                    await this.plugin.saveSettings();
                })
            );
    }
} 