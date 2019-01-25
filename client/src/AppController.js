import { App } from "./models/App.js";

export class AppController {
	constructor(container) {
		this.model = new App()
		this.store = undefined
		this.container = container || document.body
		window.app = this
	}

	start() {
		this.bind()
		console.log("Application started")
	}

	/**
	 * save/load
	 */

	/**
	 * Repaint
	 */

	/**
	 * Renderers
	 */
	renderAList(list, idx) {
		const listEl = document.createElement("li")
		listEl.setAttribute("class", idx === this.model.activeListIdx ? "active" : "")

		const buttonEl = document.createElement("button")
		buttonEl.setAttribute("data-listidx", idx)
		buttonEl.textContent = list.title
		listEl.appendChild(buttonEl)

		return listEl
	}
	renderLists() { // Renders the list of lists on the side
		const listsContainer = this.container.querySelector("[data-container='lists']")
		listsContainer.innerHTML = ""

		this.model.lists.forEach((list, idx) => {
			listsContainer.appendChild(this.renderAList(list, idx))
		})
	}
	renderActiveList() { // Renders the active list container

	}

	/**
	 * Event handlers
	 */
	onNewListClick(evt) {
		this.model.newList()
		if (!this.model.getActiveList()) {
			this.model.activeListIdx = 0
		}

		this.renderLists()
		this.renderActiveList()
	}

	bind() {
		this.container.querySelector("[data-action='new-list']")
			.addEventListener("click", (evt) => this.onNewListClick(evt))
	}
}