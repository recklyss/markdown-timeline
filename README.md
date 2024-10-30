# Obsidian Timeline Plugin

This plugin converts markdown files into timeline visualizations within Obsidian.

## Features

- Convert markdown content into visual timelines
- Simple and intuitive markdown syntax
- Interactive timeline view
- Customizable styling
- Chronological sorting of events

## Installation

1. Open Obsidian Settings
2. Go to Community Plugins and disable Safe Mode
3. Click Browse and search for "Timeline"
4. Install the plugin and enable it

## Usage

### Basic Timeline Creation

Create a timeline by using a code block with the `timeline` language identifier:

```markdown
\```timeline
# 2018-07-21
## My Second job
I left Tonghuashun, find a new job in 51gongjijin. 
I learnt a lot in this company, but this is not a good company, 
the business is going die.

---

# 2017-02-20
## My first job
Move to Hangzhou, joined Tonghuashun. 
This was my first job.
\```
```

### Format Explanation
- `# YYYY-MM-DD`: The date of the event
- `## Title`: The title of the event
- Following lines: The content of the event
- `---`: Separator between events

## License

MIT License - see [LICENSE](LICENSE) file for details

## Contributing

Pull requests are welcome! For major changes, please open [GitHub Issues](https://github.com/recklyss/timeline/issues) first to discuss what you would like to change.

