import { TIMELINE_ARIA_LABELS, TIMELINE_CLASSES } from "../constants/timeline";

import { TimelineEvent } from "../types";
import { setIcon } from "obsidian";

export class TimelineSearch {
    private searchEl: HTMLInputElement;
    private searchButton: HTMLButtonElement;
    private currentSearch: string;

    constructor(
        private container: HTMLElement,
        private onSearch: (searchQuery: string) => void,
        initialSearchQuery: string = ""
    ) {
        this.currentSearch = initialSearchQuery;
        this.initializeSearch();
    }

    private initializeSearch() {
        this.searchEl = this.container.createEl("input", {
            cls: TIMELINE_CLASSES.TIMELINE_SEARCH,
            attr: { 
                type: "text",
                placeholder: "Search events...",
                value: this.currentSearch
            }
        });

        this.searchButton = this.container.createEl("button", {
            cls: TIMELINE_CLASSES.TIMELINE_SEARCH_BUTTON,
        });
        setIcon(this.searchButton, "search");
        this.searchButton.setAttribute("aria-label", TIMELINE_ARIA_LABELS.SEARCH_BUTTON);

        this.setupEventListeners();
    }

    private setupEventListeners() {
        this.searchButton.addEventListener("click", () => this.performSearch());
        this.searchEl.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                this.performSearch();
            }
        });
    }

    private performSearch() {
        this.currentSearch = this.searchEl.value;
        this.onSearch(this.currentSearch);
    }

    public getCurrentSearch(): string {
        return this.currentSearch;
    }

    public filterEvents(events: TimelineEvent[]): TimelineEvent[] {
        if (!this.currentSearch) return events;
        
        const searchLower = this.currentSearch.toLowerCase();
        return events.filter(event => 
            event.title.toLowerCase().includes(searchLower) ||
            event.content.toLowerCase().includes(searchLower)
        );
    }
} 