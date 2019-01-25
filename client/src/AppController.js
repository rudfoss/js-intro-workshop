import { App } from "./models/App.js";
import { findAncestor } from "./utils.js"

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

	renderAList(list, idx) {
		const listEl = document.createElement("li")
		listEl.setAttribute("class", idx === this.model.activeListIdx ? "active" : "")
		listEl.setAttribute("data-listidx", idx)

		const buttonEl = document.createElement("button")
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

	onNewListClick(evt) {
		this.model.newList()
		if (!this.model.getActiveList()) {
			this.model.activeListIdx = 0
		}

		this.renderLists()
	}
	onListClick(evt) {
		const listEl = findAncestor(evt.target, "li")
		const listIdx = parseInt(listEl.getAttribute("data-listidx"), 10)

		if (evt.ctrlKey) {
			const list = this.model.lists[listIdx]
			if (confirm(`Really delete "${list.title}"`)) {
				this.model.removeList(listIdx)
				this.model.activeListIdx = 0
				this.renderLists()
				return
			}
		}

		this.model.activeListIdx = listIdx
		this.renderLists()
	}

	bind() {
		this.container.querySelector("[data-action='new-list']")
			.addEventListener("click", (evt) => this.onNewListClick(evt))

		this.container.querySelector("[data-container='lists']")
			.addEventListener("click", (evt) => this.onListClick(evt))
	}
}