import { App } from "./models/App.js";
import { findAncestor } from "./utils.js"

export class AppController {
	constructor(store, container) {
		this.model = new App()
		this.store = store
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
		const activeListContainer = this.container
			.querySelector("[data-container='active-list']")
		const activeList = this.model.getActiveList()

		if (!activeList) {
			activeListContainer.classList.add("no-active-list")
			return
		}

		activeListContainer.classList.remove("no-active-list")
		activeListContainer.querySelector("[data-field='list-title']")
			.value = activeList.getRealTitle()
		this.renderActiveListItems()
	}
	renderItem(item, idx) {
		const itemEl = document.createElement("li")
		itemEl.setAttribute("data-itemid", idx)
		itemEl.classList.add("item")
		if (item.done) itemEl.classList.add("archived")

		const doneContainer = document.createElement("span")
		doneContainer.classList.add("item-done-container")
		const doneCheckboxEl = document.createElement("input")
		doneCheckboxEl.setAttribute("type", "checkbox")
		doneCheckboxEl.checked = item.done
		doneCheckboxEl.setAttribute("data-field", "done-checkbox")
		doneContainer.appendChild(doneCheckboxEl)
		itemEl.appendChild(doneContainer)

		const textInputEl = document.createElement("input")
		textInputEl.setAttribute("type", "text")
		textInputEl.setAttribute("data-field", "existing-item")
		textInputEl.value = item.text
		itemEl.appendChild(textInputEl)

		const removeButtonEl = document.createElement("button")
		removeButtonEl.setAttribute("data-action", "remove-item")
		removeButtonEl.textContent = "x"
		itemEl.appendChild(removeButtonEl)

		return itemEl
	}
	renderActiveListItems() {
		const itemContainer = this.container.querySelector("[data-container='items']")
		const completedItemContainer = this.container
			.querySelector("[data-container='completed-items']")
		const activeList = this.model.getActiveList()
		
		if (!activeList) {
			return
		}

		itemContainer.innerHTML = ""
		completedItemContainer.innerHTML = ""

		activeList.items.forEach((item, idx) => {
			const itemEl = this.renderItem(item, idx)
			if (item.done) {
				completedItemContainer.appendChild(itemEl)
				return
			}
			itemContainer.appendChild(itemEl)
		})
	}

	makeNewItemInActiveList() {
		const newItemEl = this.container.querySelector("[data-field='new-item']")
		const {value} = newItemEl
		if (!value) return

		this.model.getActiveList().newItem(value)
		newItemEl.focus()
		newItemEl.select()
		this.renderActiveListItems()
	}

	onNewListClick(evt) {
		this.model.newList()
		if (!this.model.getActiveList()) {
			this.model.activeListIdx = 0
			this.renderActiveList()
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
				this.renderActiveList()
				return
			}
		}

		this.model.activeListIdx = listIdx
		this.renderLists()
		this.renderActiveList()
	}
	onListTitleChange(evt) {
		const {value} = evt.target
		const activeList = this.model.getActiveList()
		activeList.title = value
		this.renderLists()
	}

	onNewItemKey(evt) {
		if (evt.key === "Enter") {
			this.makeNewItemInActiveList()
		}
	}
	onNewItemClick(evt) {
		this.makeNewItemInActiveList()
	}

	onItemListClick(evt) {
		const {target} = evt
		if (target.matches("[data-action='remove-item']")){
			const liEl = findAncestor(target, "[data-itemid]")
			const itemId = parseInt(liEl.getAttribute("data-itemid"), 10)
			this.model.getActiveList().removeItem(itemId)
			this.renderActiveListItems()
		}
	}
	onItemListChange(evt) {
		const {target} = evt
		if (target.matches("[data-field]")) {
			const itemId = parseInt(
				findAncestor(target, "[data-itemid]").getAttribute("data-itemid"), 10)

			if (target.matches("[data-field='existing-item']")) {
				const {value} = target
				this.model.getActiveList().items[itemId].text = value
			} else {
				this.model.getActiveList().items[itemId].done = target.checked
				this.renderActiveListItems()
			}
		}
	}

	bind() {
		this.container.querySelector("[data-action='new-list']")
			.addEventListener("click", (evt) => this.onNewListClick(evt))
		this.container.querySelector("[data-container='lists']")
			.addEventListener("click", (evt) => this.onListClick(evt))
		this.container.querySelector("[data-field='list-title']")
			.addEventListener("input", (evt) => this.onListTitleChange(evt))
		
		this.container.querySelector("[data-field='new-item']")
			.addEventListener("keyup", (evt) => this.onNewItemKey(evt))
		this.container.querySelector("[data-action='new-item']")
			.addEventListener("click", (evt) => this.onNewItemClick(evt))

		this.container.querySelector("[data-container='item-lists']")
			.addEventListener("click", (evt) => this.onItemListClick(evt))
		this.container.querySelector("[data-container='item-lists']")
			.addEventListener("input", (evt) => this.onItemListChange(evt))
	}
}