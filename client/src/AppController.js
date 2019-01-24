import {App} from "./models/App.js"
import {findAncestor, debounce} from "./utils.js"

export class AppController{
	constructor(store, container) {
		window.app = this
		this.model = new App()
		this.store = store
		this.container = container || document.body

		this.saveDebounced = debounce(() => this.save(), 250)
		this._save = () => {
			document.title = "Saving..."
			this.saveDebounced()
		}
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
		this._save()
		this.renderLists()
	}
	onListClick(evt) {
		const listIdx = parseInt(evt.target.getAttribute("data-listidx"), 10)
		this.model.activeListIdx = listIdx
		document.title = this.model.getActiveList().title
		this.renderLists()
		this.renderActiveList()
	}
	onItemListClick(evt) {
		const target = evt.target
		if (target.matches("[data-action='remove-item']")) { // Clicked remove
			const itemContainer = findAncestor(target, "[data-itemid]")
			if (!itemContainer) {
				console.log(target)
				throw new Error("Unable to find item container. Check that an ancestor of target matches '[data-item]'.")
			}
			const itemId = parseInt(itemContainer.getAttribute("data-itemid"), 10)
			this.model.getActiveList().removeItem(itemId)
			this.renderActiveListItems()
			this._save()
		} else if (evt.altKey) { // Clicked anywhere inside li (not on remove)
			const liEl = findAncestor(target, "[data-itemid]")
			if (!liEl) return
			const itemId = parseInt(liEl.getAttribute("data-itemid"), 10)
			this.model.getActiveList().items[itemId].toggleDone()
			this.renderActiveListItems()
			this._save()
		}
	}
	onItemListChange(evt) {
		const target = evt.target
		if (target.matches("[data-field")) {
			const itemContainer = findAncestor(target, "[data-itemid]")
			if (!itemContainer) {
				console.log(target)
				throw new Error("Unable to find item container. Check that an ancestor of target matches '[data-item]'.")
			}
			const itemId = parseInt(itemContainer.getAttribute("data-itemid"), 10)
			
			if (target.matches("[data-field='done-checkbox']")) {
				this.model.getActiveList().items[itemId].setDone(target.checked)
				this.renderActiveListItems()
			} else if (target.matches("[data-field='existing-item']")) {
				this.model.getActiveList().items[itemId].text = target.value
			}
			this._save()
		}
	}
	onNewItemKey(evt) {
		evt.preventDefault()
		if (evt.key === "Enter") {
			this.makeNewItemInActiveList()
		}
	}
	onNewItemClick(evt) {
		this.makeNewItemInActiveList()
		evt.preventDefault()
	}

	async save() {
		await this.store.save(this.model.toData())
		document.title = this.model.getActiveList().title
	}
	async load() {
		const data = await this.store.load()
		this.model = App.fromData(data)
		if (this.model.lists.length > 0) {
			this.model.activeListIdx = 0
		}
		document.title = this.model.getActiveList().title
		this.repaint()
	}

	makeNewItemInActiveList() {
		const field = this.container.querySelector("[data-field='new-item']")
		const text = field.value
		if (!text) return
		this.model.getActiveList().newItem(text)
		this.renderActiveList()
		field.focus()
		field.select()

		this._save()
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

		itemContainer.innerHTML = ""
		archivedItemContainer.innerHTML = ""

		if (!activeList) {
			return
		}

		activeList.items.forEach((item, idx) => {
			const itemEl = this.renderItem(item, idx)
			if (item.isDone) {
				archivedItemContainer.appendChild(itemEl)
				return
			}
			itemContainer.appendChild(itemEl)
		})
	}
	renderItem(item, idx) {
		const itemEl = document.createElement("li")
		itemEl.setAttribute("data-itemid", idx)
		itemEl.classList.add("item")
		if (item.isDone) itemEl.classList.add("archived")

		const doneContainer = document.createElement("span")
		doneContainer.classList.add("item-done-container")
		const doneCheckbox = document.createElement("input")
		doneCheckbox.setAttribute("type", "checkbox")
		doneCheckbox.checked = item.isDone
		doneCheckbox.setAttribute("data-field", "done-checkbox")
		doneContainer.appendChild(doneCheckbox)
		itemEl.appendChild(doneContainer)

		const textInput = document.createElement("input")
		textInput.setAttribute("type", "text")
		textInput.setAttribute("data-field", "existing-item")
		textInput.value = item.text
		itemEl.appendChild(textInput)

		const removeButton = document.createElement("button")
		removeButton.setAttribute("data-action", "remove-item")
		removeButton.textContent = "x"
		itemEl.appendChild(removeButton)

		return itemEl
	}

	repaint() {
		this.renderLists()
		this.renderActiveList()
		this.renderActiveListItems()
	}

	bind() {
		this.container.querySelector("[data-action='new-list']").addEventListener('click', (evt) => this.onNewListClick(evt))
		this.container.querySelector("[data-action='list-click']").addEventListener('click', (evt) => this.onListClick(evt))
		this.container.querySelector("[data-field='list-title']").addEventListener('input', (evt) => this.onListTitleChange(evt))

		this.container.querySelector("[data-field='new-item']").addEventListener("keyup", (evt) => this.onNewItemKey(evt))
		this.container.querySelector("[data-action='new-item']").addEventListener("click", (evt) => this.onNewItemClick(evt))

		this.container.querySelector("[data-container='item-lists']").addEventListener("click", (evt) => this.onItemListClick(evt))
		this.container.querySelector("[data-container='item-lists']").addEventListener("input", (evt) => this.onItemListChange(evt))
	}

	async start() {
		this.bind()
		await this.load()
		this.repaint()
	}
}