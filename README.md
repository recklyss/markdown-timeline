# Markdown Timeline

Convert markdown files into timeline visualizations within Obsidian.

![Timeline Example](./example.png)

## Features

- Convert markdown content into visual timelines
- Simple and intuitive markdown syntax
- Interactive timeline view with search and sort capabilities
- Customizable styling
- Chronological sorting of events
- Search functionality to filter events by keywords
- Configurable timeline header controls

## Installation

1. Open Obsidian Settings
2. Go to Community Plugins and disable Safe Mode
3. Click Browse and search for "Timeline"
4. Install the plugin and enable it

## Usage

### Basic Timeline Creation

Create a timeline by using a code block with the `timeline` language identifier:

~~~
```timeline
# 2024-03-15
## Event Title
Content
![[some other notes]]
---

# 2023-03
## Event Title
Content
![[some other notes]]
---

# 2024-01-01
## Another Event
More content here
```
~~~

### Syntax Structure

Each timeline event follows this structure:

- `# YYYY-MM-DD` - The date of the event, the year is required, the month and day are optional
- `## Title` - The event title
- Content - The event description, can be markdown content, also support wikilink, try `[[some article]]` and `![[some notes]]`
- `---` - Separator between events

### Timeline Controls

Each timeline includes interactive controls in the header:
- Search box to filter events by keywords (searches in titles and content)
- Sort button to toggle between ascending (oldest first) and descending (newest first) order

### Settings

The plugin settings allow you to:
- Set the default sort order for new timelines
- Show/hide the timeline header controls
- Each timeline maintains its own sort order independently

## Support

If you encounter any issues or have suggestions:
1. Check the [GitHub Issues](https://github.com/recklyss/markdown-timeline/issues)
2. Create a new issue if needed

## License

MIT License - see [LICENSE](LICENSE) file for details

