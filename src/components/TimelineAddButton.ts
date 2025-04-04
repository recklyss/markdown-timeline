import { App, Modal, Setting, TFile, setIcon } from "obsidian";

import { TimelineEvent } from "../types";

export class AddEventModal extends Modal {
	private onSubmit: (event: TimelineEvent) => void;
	private getExistingEventsContent: () => string;

	constructor(
		app: App,
		onSubmit: (event: TimelineEvent) => void,
		getExistingEventsContent: () => string
	) {
		super(app);
		this.onSubmit = onSubmit;
		this.getExistingEventsContent = getExistingEventsContent;
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl("h2", { text: "Add New Event" });

		const dateInput = new Setting(contentEl)
			.setName("Date")
			.addText((text) => {
				text.setPlaceholder("YYYY[-MM[-DD]]");
				text.inputEl.style.width = "100%";
			});

		const titleInput = new Setting(contentEl)
			.setName("Title")
			.addText((text) => {
				text.setPlaceholder("Event Title");
				text.inputEl.style.width = "100%";
			});

		const contentInput = new Setting(contentEl)
			.setName("Content")
			.addTextArea((text) => {
				text.setPlaceholder("Markdown Content");
				text.inputEl.style.width = "100%";
				text.inputEl.style.height = "150px";
				text.inputEl.style.resize = "none";
			});

		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText("Add Event")
				.setCta()
				.onClick(() => {
					console.log("Add Event button clicked");
					const dateValue =
						dateInput.settingEl.querySelector("input")?.value || "";
					if (!dateValue) {
						console.error("Date input is empty");
						return;
					}

					// Handle negative years correctly
					let dateParts: string[];
					if (dateValue.startsWith('-')) {
						// For negative years, keep the minus sign with the year
						const yearPart = dateValue.substring(0, dateValue.indexOf('-', 1) === -1 ?
							dateValue.length : dateValue.indexOf('-', 1));
						const restPart = dateValue.substring(yearPart.length);
						dateParts = [yearPart, ...restPart.split('-').filter(p => p)];
					} else {
						dateParts = dateValue.split('-');
					}

					console.log("dateParts", dateParts);
					const formattedDate = `${dateParts[0]}${dateParts[1] ? "-" + dateParts[1] : ""
						}${dateParts[2] ? "-" + dateParts[2] : ""
						}`;

					const titleValue =
						titleInput.settingEl.querySelector("input")?.value ||
						"";
					if (!titleValue) {
						console.error("Title input is empty");
						return;
					}

					const contentValue =
						contentInput.settingEl.querySelector("textarea")
							?.value || "";
					if (!contentValue) {
						console.error("Content input is empty");
						return;
					}

					const newEventContent = `# ${formattedDate}\n## ${titleValue}\n${contentValue}`;
					const toBeWrittenWholeContent = `${newEventContent}\n---\n${this.getExistingEventsContent()}`;
					console.log("New Event Content:", newEventContent);
					this.updateTimelineBlock(newEventContent);
					const newEvent: TimelineEvent = {
						year: dateParts[0],
						month: dateParts[1] ? dateParts[1] : undefined,
						day: dateParts[2] ? dateParts[2] : undefined,
						title: titleValue,
						content: toBeWrittenWholeContent,
					};
					console.log("New Event:", newEvent);
					this.onSubmit(newEvent);
					this.close();
				})
		);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	private updateTimelineBlock(newEventContent: string) {
		const file = this.app.workspace.getActiveFile();
		if (file instanceof TFile) {
			this.app.vault
				.read(file)
				.then((content) => {
					const timelineBlocks = content.match(
						/```timeline[\s\S]*?```/g
					);
					if (!timelineBlocks || timelineBlocks.length === 0) {
						console.error("No timeline blocks found");
						return;
					}

					// For simplicity, let's assume we update the first timeline block
					const updatedBlock = timelineBlocks[0].replace(
						"```timeline",
						`\`\`\`timeline
${newEventContent}
---
`
					);
					const updatedContent = content.replace(
						timelineBlocks[0],
						updatedBlock
					);

					this.app.vault.modify(file, updatedContent);
				})
				.catch((err) => {
					console.error("Error reading file:", err);
				});
		} else {
			console.error("No active file found");
		}
	}
}

export class TimelineAddButton {
	private addButton: HTMLButtonElement;

	constructor(
		private container: HTMLElement,
		private app: App,
		private onAddEvent: (event: TimelineEvent) => void,
		private getExistingEventsContent: () => string
	) {
		this.initializeAddButton();
	}

	private initializeAddButton() {
		this.addButton = this.container.createEl("button", {
			cls: "timeline-add-button",
		});
		this.addButton.textContent = "Add new event";
		setIcon(this.addButton, "plus");
		this.addButton.setAttribute("aria-label", "Add new event");
		this.addButton.addEventListener("click", () =>
			this.openAddEventModal()
		);
	}

	private openAddEventModal() {
		new AddEventModal(
			this.app,
			this.onAddEvent,
			this.getExistingEventsContent
		).open();
	}
}
