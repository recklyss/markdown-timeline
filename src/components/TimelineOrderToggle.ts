import { TIMELINE_ARIA_LABELS, TIMELINE_CLASSES, TIMELINE_ORDER } from "../constants/timeline";

import { TimelineEvent } from "../types";
import { setIcon } from "obsidian";
import { sortTimelineEvents } from "../utils/dateUtils";

/**
 * Component for toggling timeline sort order
 */
export class TimelineOrderToggle {
    private orderButton: HTMLButtonElement;
    private currentOrder: typeof TIMELINE_ORDER.ASC | typeof TIMELINE_ORDER.DESC;

    constructor(
        private container: HTMLElement,
        initialOrder: typeof TIMELINE_ORDER.ASC | typeof TIMELINE_ORDER.DESC,
        private onOrderChange: (order: typeof TIMELINE_ORDER.ASC | typeof TIMELINE_ORDER.DESC) => void
    ) {
        if (!container || !(container instanceof HTMLElement)) {
            throw new Error('container must be a valid HTMLElement');
        }
        if (!Object.values(TIMELINE_ORDER).includes(initialOrder)) {
            throw new Error('initialOrder must be a valid timeline order');
        }
        if (!onOrderChange || typeof onOrderChange !== 'function') {
            throw new Error('onOrderChange must be a valid function');
        }
        
        this.currentOrder = initialOrder;
        this.initializeOrderToggle();
    }

    private initializeOrderToggle() {
        this.orderButton = this.container.createEl("button", {
            cls: TIMELINE_CLASSES.TIMELINE_ORDER_TOGGLE,
        });
        this.updateOrderButton();
        this.setupEventListeners();
    }

    private setupEventListeners() {
        this.orderButton.addEventListener("click", () => {
            this.currentOrder = this.currentOrder === TIMELINE_ORDER.ASC
                ? TIMELINE_ORDER.DESC
                : TIMELINE_ORDER.ASC;
            this.updateOrderButton();
            this.onOrderChange(this.currentOrder);
        });
    }

    private updateOrderButton() {
        this.orderButton.empty();
        setIcon(this.orderButton, this.currentOrder === TIMELINE_ORDER.ASC ? "arrow-up" : "arrow-down");
        this.orderButton.setAttribute(
            "aria-label",
            this.currentOrder === TIMELINE_ORDER.ASC
                ? TIMELINE_ARIA_LABELS.ORDER_ASC
                : TIMELINE_ARIA_LABELS.ORDER_DESC
        );
    }

    public getCurrentOrder(): typeof TIMELINE_ORDER.ASC | typeof TIMELINE_ORDER.DESC {
        return this.currentOrder;
    }

    public sortEvents(events: TimelineEvent[]): TimelineEvent[] {
        return sortTimelineEvents(events, this.currentOrder);
    }
} 