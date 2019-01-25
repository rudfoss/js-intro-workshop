import {App} from "./models/App"
import {findAncestor, debounce} from "./utils"
import { IStore } from "./store/IStore"
import { IAppData } from "./models/IAppData"
import { Item } from "./models/Item";

export class AppController{
	public model = new App()
	public container: HTMLElement

	constructor(
		public store: IStore,
		container?: HTMLElement
	) {
		(window as any).app = this
		this.container = container || document.body
	}

	protected _saveDebounced = debounce(() => this.save(), 250)
	protected _save = () => {
		document.title = "Saving..."
		this._saveDebounced()
	}

	protected _onNewListClick() {
		this.model.newList()
		if (!this.model.getActiveList()) {
			this.model.activeListIdx = this.model.lists.length -1
			this._renderActiveList()
			const listTitleEl = this.container.querySelector<HTMLInputElement>("[data-field='list-title']")
			listTitleEl!.focus()
		}
		this._renderLists()
	}
	protected _onListTitleChange(evt: Event) {
		const value = (evt.target as HTMLInputElement).value
		const activeList = this.model.getActiveList()
		activeList.title = value
		this._renderLists()
	}
	protected _onListClick(evt: MouseEvent) {
		const listIdx = parseInt((evt.target as HTMLElement).getAttribute("data-listidx")!, 10)
		this.model.activeListIdx = listIdx
		document.title = this.model.getActiveList().title
		this._renderLists()
		this._renderActiveList()
	}
	protected _onItemListClick(evt: MouseEvent) {
		const target = evt.target as HTMLElement
		if (target.matches("[data-action='remove-item']")) { // Clicked remove
			const itemContainer = findAncestor(target, "[data-itemid]")
			if (!itemContainer) {
				console.log(target)
				throw new Error("Unable to find item container. Check that an ancestor of target matches '[data-item]'.")
			}
			const itemId = parseInt(itemContainer.getAttribute("data-itemid")!, 10)
			this.model.getActiveList().removeItem(itemId)
			this._renderActiveListItems()
			this._save()
		} else if (evt.altKey) { // Clicked anywhere inside li (not on remove)
			const liEl = findAncestor(target, "[data-itemid]")
			if (!liEl) return
			const itemId = parseInt(liEl.getAttribute("data-itemid")!, 10)
			this.model.getActiveList().items[itemId].toggleDone()
			this._renderActiveListItems()
			this._save()
		}
	}
	protected _onItemListChange(evt: Event) {
		const target = evt.target as HTMLInputElement
		if (target.matches("[data-field")) {
			const itemContainer = findAncestor(target, "[data-itemid]")
			if (!itemContainer) {
				console.log(target)
				throw new Error("Unable to find item container. Check that an ancestor of target matches '[data-item]'.")
			}
			const itemId = parseInt(itemContainer.getAttribute("data-itemid")!, 10)
			
			if (target.matches("[data-field='done-checkbox']")) {
				this.model.getActiveList().items[itemId].setDone(target.checked)
				this._renderActiveListItems()
			} else if (target.matches("[data-field='existing-item']")) {
				this.model.getActiveList().items[itemId].text = target.value
			}
			this._save()
		}
	}
	protected _onNewItemKey(evt: KeyboardEvent) {
		evt.preventDefault()
		if (evt.key === "Enter") {
			this._makeNewItemInActiveList()
		}
	}
	protected _onNewItemClick(evt: MouseEvent) {
		this._makeNewItemInActiveList()
		evt.preventDefault()
	}

	public async save() {
		await this.store.save(this.model.toData())
		document.title = this.model.getActiveList().title
	}
	public async load() {
		const data = await this.store.load<IAppData>()
		this.model = App.fromData(data || {lists: []})
		if (this.model.lists.length > 0) {
			this.model.activeListIdx = 0
		}
		document.title = this.model.getActiveList().title
		this.repaint()
	}

	protected _makeNewItemInActiveList() {
		const field = this.container.querySelector<HTMLInputElement>("[data-field='new-item']")!
		const text = field.value
		if (!text) return
		this.model.getActiveList().newItem(text)
		this._renderActiveList()
		field.focus()
		field.select()

		this._save()
		this._renderActiveListItems()
	}

	protected _renderLists() {
		const listContainer = this.container.querySelector<HTMLUListElement>("[data-container='lists']")!
		listContainer.innerHTML = ""

		for (let i=0; i<this.model.lists.length; i++) {
			const list = this.model.lists[i]
			
			const liEl = document.createElement("li")
			if (this.model.activeListIdx === i) {
				liEl.classList.add("active")
			}
			
			const buttonEl = document.createElement("button")
			buttonEl.setAttribute("data-listidx", i+"")
			buttonEl.textContent = list.getTitle()

			liEl.appendChild(buttonEl)
			listContainer.appendChild(liEl)
		}
	}
	protected _renderActiveList() {
		const activeListContainer = this.container.querySelector("[data-container='active-list']")
		if (!activeListContainer) throw new Error("No active list container found")

		const activeList = this.model.getActiveList()
		if (!activeList) {
			activeListContainer.classList.add("no-active-list")
			this._renderActiveListItems()
			return
		}

		activeListContainer.classList.remove("no-active-list")
		activeListContainer.querySelector<HTMLInputElement>("[data-field='list-title']")!.value = activeList.title
		this._renderActiveListItems()
	}
	protected _renderActiveListItems() {
		const activeList = this.model.getActiveList()
		const itemContainer = this.container.querySelector("[data-container='items']")!
		const archivedItemContainer = this.container.querySelector("[data-container='completed-items']")!

		itemContainer.innerHTML = ""
		archivedItemContainer.innerHTML = ""

		if (!activeList) {
			return
		}

		activeList.items.forEach((item, idx) => {
			const itemEl = this._renderItem(item, idx)
			if (item.isDone) {
				archivedItemContainer.appendChild(itemEl)
				return
			}
			itemContainer.appendChild(itemEl)
		})
	}
	protected _renderItem(item: Item, idx: number) {
		const itemEl = document.createElement("li")
		itemEl.setAttribute("data-itemid", idx+"")
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

	public repaint() {
		this._renderLists()
		this._renderActiveList()
		this._renderActiveListItems()
	}

	protected _bind() {
		this.container.querySelector("[data-action='new-list']")!.addEventListener('click', (evt) => this._onNewListClick())
		this.container.querySelector("[data-action='list-click']")!.addEventListener('click', (evt) => this._onListClick(evt as MouseEvent))
		this.container.querySelector("[data-field='list-title']")!.addEventListener('input', (evt) => this._onListTitleChange(evt))

		this.container.querySelector("[data-field='new-item']")!.addEventListener("keyup", (evt) => this._onNewItemKey(evt as KeyboardEvent))
		this.container.querySelector("[data-action='new-item']")!.addEventListener("click", (evt) => this._onNewItemClick(evt as MouseEvent))

		this.container.querySelector("[data-container='item-lists']")!.addEventListener("click", (evt) => this._onItemListClick(evt as MouseEvent))
		this.container.querySelector("[data-container='item-lists']")!.addEventListener("input", (evt) => this._onItemListChange(evt))
	}

	public async start() {
		this._bind()
		await this.load()
		this.repaint()
	}
}