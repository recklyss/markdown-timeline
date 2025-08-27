/**
 * CSS class names used for timeline styling
 */
export const TIMELINE_CLASSES = {
    TIMELINE: 'timeline',
    TIMELINE_HEADER: 'timeline-header',
    TIMELINE_SEARCH: 'timeline-search',
    TIMELINE_SEARCH_BUTTON: 'timeline-search-button',
    TIMELINE_ORDER_TOGGLE: 'timeline-order-toggle',
    TIMELINE_EVENT: 'timeline-event',
    TIMELINE_DATE: 'timeline-date',
    TIMELINE_POINT: 'timeline-point',
    TIMELINE_CONTENT: 'timeline-content',
    TIMELINE_MARKDOWN_CONTENT: 'timeline-markdown-content'
};

/**
 * Timeline sort order constants
 */
export const TIMELINE_ORDER = {
    ASC: 'asc' as const,
    DESC: 'desc' as const
};

/**
 * Accessibility labels for timeline UI elements
 */
export const TIMELINE_ARIA_LABELS = {
    SEARCH_BUTTON: 'Search events',
    ORDER_ASC: 'Sorted oldest first',
    ORDER_DESC: 'Sorted newest first'
}; 