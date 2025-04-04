#!/bin/bash -eu

npm run build
cp main.js test_vault/.obsidian/plugins/markdown-timeline
cp styles.css test_vault/.obsidian/plugins/markdown-timeline/
