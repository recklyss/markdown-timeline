import {
	MarkdownRenderChild,
	MarkdownRenderer,
	Plugin,
	setIcon,
} from "obsidian";
import { TIMELINE_CLASSES, TIMELINE_ORDER } from "../constants/timeline";

import { TimelineEvent } from "../types";
import { TimelineOrderToggle } from "../components/TimelineOrderToggle";
import TimelinePlugin from "../main";
import { TimelineSearch } from "../components/TimelineSearch";

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
	sourcePath = "",
	initialOrder?: typeof TIMELINE_ORDER.ASC | typeof TIMELINE_ORDER.DESC,
	searchQuery = ""
): TimelineEventContent[] {
	let currentOrder = initialOrder ?? (plugin as TimelinePlugin).settings.timelineOrder;
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

		filteredEvents = search.filterEvents(events);
		filteredEvents = orderToggle.sortEvents(filteredEvents);
	}

	const timeline = container.createEl("div", { cls: TIMELINE_CLASSES.TIMELINE });

	for (const event of filteredEvents) {
		const eventEl = timeline.createEl("div", { cls: TIMELINE_CLASSES.TIMELINE_EVENT });
		const dateEl = eventEl.createEl("div", { cls: TIMELINE_CLASSES.TIMELINE_DATE });
		dateEl.createEl("span", { cls: TIMELINE_CLASSES.TIMELINE_YEAR, text: event.year });

		if (event.month) {
			const monthDisplay = new Intl.DateTimeFormat("en-US", {
				month: "short",
			}).format(new Date(2000, parseInt(event.month) - 1));

			const dateDisplay = event.day
				? `${monthDisplay} ${event.day}`
				: monthDisplay;

			dateEl.createEl("span", {
				cls: TIMELINE_CLASSES.TIMELINE_MONTH,
				text: dateDisplay,
			});
		}

		eventEl.createEl("div", { cls: TIMELINE_CLASSES.TIMELINE_POINT });
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
}
