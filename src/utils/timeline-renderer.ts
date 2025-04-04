import {
	MarkdownRenderChild,
	MarkdownRenderer,
	Plugin,
	setIcon,
} from "obsidian";
import { TIMELINE_CLASSES, TIMELINE_ORDER } from "../constants/timeline";

import { TimelineAddButton } from "../components/TimelineAddButton";
import { TimelineEvent, TimelineError, TimelineValidationError } from "../types";
import { TimelineOrderToggle } from "../components/TimelineOrderToggle";
import TimelinePlugin from "../main";
import { TimelineSearch } from "../components/TimelineSearch";
import { formatDate } from "./formatDate";

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

export function renderError(container: HTMLElement, error: TimelineError) {
	const errorEl = container.createEl("div", { cls: "timeline-error" });

	const errorHeader = errorEl.createEl("div", { cls: "timeline-error-header" });
	setIcon(errorHeader.createSpan(), "alert-triangle");
	errorHeader.createSpan({ text: error.message, cls: "timeline-error-message" });

	if (error.details) {
		const errorDetails = errorEl.createEl("div", { cls: "timeline-error-details" });
		errorDetails.createSpan({ text: error.details });

		if (error.line) {
			errorDetails.createEl("div", {
				text: `Line ${error.line}`,
				cls: "timeline-error-line"
			});
		}
	}

	// Add help text based on error type
	const helpText = errorEl.createEl("div", { cls: "timeline-error-help" });
	helpText.createSpan({ text: "Expected format:" });
	const example = helpText.createEl("pre", { cls: "timeline-error-example" });
	example.createSpan({
		text:
			`# 2024-03-21
## Event Title
Event content goes here...

---

# 2024
## Another Event
More content...` });
}

export function renderTimelineEvents(
	container: HTMLElement,
	events: TimelineEvent[],
	plugin: Plugin,
	sourcePath = "",
	initialOrder?: typeof TIMELINE_ORDER.ASC | typeof TIMELINE_ORDER.DESC,
	searchQuery = ""
): TimelineEventContent[] {
	try {
		const currentOrder = initialOrder ?? (plugin as TimelinePlugin).settings.timelineOrder;
		let filteredEvents = events;
		const renderChildren: TimelineEventContent[] = [];

		if ((plugin as TimelinePlugin).settings.showHeaderButtons) {
			const headerEl = container.createEl("div", { cls: TIMELINE_CLASSES.TIMELINE_HEADER });

			const search = new TimelineSearch(headerEl, (newSearchQuery) => {
				container.empty();
				const newRenderChildren = renderTimelineEvents(
					container,
					events,
					plugin,
					sourcePath,
					currentOrder,
					newSearchQuery
				);

				if (plugin instanceof TimelinePlugin) {
					newRenderChildren.forEach((child) => plugin.addChild(child));
				}
			}, searchQuery);

			const orderToggle = new TimelineOrderToggle(headerEl, currentOrder, (newOrder) => {
				container.empty();
				const newRenderChildren = renderTimelineEvents(
					container,
					events,
					plugin,
					sourcePath,
					newOrder,
					search.getCurrentSearch()
				);

				if (plugin instanceof TimelinePlugin) {
					newRenderChildren.forEach((child) => plugin.addChild(child));
				}
			});

			new TimelineAddButton(headerEl, plugin.app, (newEvent) => {
				events.push(newEvent);
				container.empty();
				renderTimelineEvents(container, events, plugin, sourcePath, currentOrder, search.getCurrentSearch());
			}, () => events.map(event => `# ${event.year}${event.month ? '-' + event.month : ''}${event.day ? '-' + event.day : ''}\n## ${event.title}\n${event.content}`).join('\n---\n'));

			filteredEvents = search.filterEvents(events);
			filteredEvents = orderToggle.sortEvents(filteredEvents);
		}

		const timeline = container.createEl("div", { cls: TIMELINE_CLASSES.TIMELINE });

		for (const event of filteredEvents) {
			const eventEl = timeline.createEl("div", { cls: TIMELINE_CLASSES.TIMELINE_EVENT });

			// Create a container for date and point
			const datePointContainer = eventEl.createEl("div", { cls: "timeline-date-point" });
			const dateDisplay = formatDate(event, plugin as TimelinePlugin);
			datePointContainer.createEl("div", { cls: TIMELINE_CLASSES.TIMELINE_DATE, text: dateDisplay });

			datePointContainer.createEl("div", { cls: TIMELINE_CLASSES.TIMELINE_POINT });
			const contentEl = eventEl.createEl("div", { cls: TIMELINE_CLASSES.TIMELINE_CONTENT });
			contentEl.createEl("h3", { text: event.title });
			const markdownContent = contentEl.createDiv(TIMELINE_CLASSES.TIMELINE_MARKDOWN_CONTENT);
			const renderChild = new TimelineEventContent(
				markdownContent,
				event.content,
				sourcePath,
				plugin
			);
			renderChildren.push(renderChild);
		}

		return renderChildren;
	} catch (error) {
		container.empty();
		if (error instanceof Error) {
			renderError(container, {
				message: error.name === 'TimelineValidationError' ? error.message : 'An error occurred while rendering the timeline',
				type: 'render',
				details: error.message,
				line: (error as TimelineValidationError).line
			});
		} else {
			renderError(container, {
				message: 'An unexpected error occurred',
				type: 'render',
				details: String(error)
			});
		}
		return [];
	}
}
