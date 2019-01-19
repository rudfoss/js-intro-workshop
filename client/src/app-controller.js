import {App} from "./models/App.js"

export class AppController{
	constructor(container) {
		window.app = this
		this.model = new App()
		this.container = container || document.body

		this.bind()
		this.renderLists()
		this.renderActiveList()
	}

	onNewListClick() {
		this.model.newList()
		if (!this.model.getActiveList()) {
			this.model.activeListIdx = this.model.lists.length -1
			this.renderActiveList()
			this.container.querySelector("[data-field='list-title']").focus()
		}
		this.renderLists()
	}
	onListTitleChange(evt) {
		const value = evt.target.value
		const activeList = this.model.getActiveList()
		activeList.title = value
		this.renderLists()
	}
	onListClick(evt) {
		const listIdx = parseInt(evt.target.getAttribute("data-listidx"), 10)
		this.model.activeListIdx = listIdx
		this.renderLists()
		this.renderActiveList()
	}
	
	onNewItemKey(evt) {
		evt.preventDefault()
		if (evt.key === "Enter") {
			this.spawnNewItemInActiveList()
		}
	}
	onNewItemClick(evt) {
		this.spawnNewItemInActiveList()
		evt.preventDefault()
	}
	spawnNewItemInActiveList() {
		const field = this.container.querySelector("[data-field='new-item']")
		const text = field.value
		this.model.getActiveList().newItem(text)
		this.renderActiveList()
		field.focus()
		field.select()

		this.renderActiveListItems()
	}

	renderLists() {
		const listContainer = this.container.querySelector("[data-container='lists']")
		listContainer.innerHTML = ""

		for (let i=0; i<this.model.lists.length; i++) {
			const list = this.model.lists[i]
			
			const liEl = document.createElement("li")
			if (this.model.activeListIdx === i) {
				liEl.classList.add("active")
			}
			
			const buttonEl = document.createElement("button")
			buttonEl.setAttribute("data-listidx", i)
			buttonEl.textContent = list.getTitle()

			liEl.appendChild(buttonEl)
			listContainer.appendChild(liEl)
		}
	}
	renderActiveList() {
		const activeListContainer = this.container.querySelector("[data-container='active-list']")
		const activeList = this.model.getActiveList()
		if (!activeList) {
			activeListContainer.classList.add("no-active-list")
			this.renderActiveListItems()
			return
		}

		activeListContainer.classList.remove("no-active-list")
		activeListContainer.querySelector("[data-field='list-title']").value = activeList.title
		this.renderActiveListItems()
	}
	renderActiveListItems() {
		const activeList = this.model.getActiveList()
		const itemContainer = this.container.querySelector("[data-container='items']")
		const archivedItemContainer = this.container.querySelector("[data-container='completed-items']")

		if (!activeList) {
			itemContainer.innerHTML = ""
			archivedItemContainer.innerHTML = ""
		}


	}
	renderItem(item, archived = false) {
		const itemEl = document.createElement("li")
		itemEl.classList.add("item")
		if (archived) itemEl.classList.add("archived")

		const doneCheckbox = document.createElement("input")
		doneCheckbox.setAttribute("type", "checkbox")
		doneCheckbox.setAttribute("data-field")
	}

	bind() {
		this.container.querySelector("[data-action='new-list']").addEventListener('click', (evt) => this.onNewListClick(evt))
		this.container.querySelector("[data-action='list-click']").addEventListener('click', (evt) => this.onListClick(evt))
		this.container.querySelector("[data-field='list-title']").addEventListener('input', (evt) => this.onListTitleChange(evt))

		this.container.querySelector("[data-field='new-item']").addEventListener("keyup", (evt) => this.onNewItemKey(evt))
	}
}

export default () => new AppController()