import {Item} from "./Item.js"

export class List{
	constructor() {
		this._title = ""
		this.items = []
	}

	get title() {
		return this._title || "<no title>"
	}
	set title(value) {
		this._title = value
	}
	get realTitle() {
		return this._title
	}

	newItem(text = "") {
		const newItem = new Item()
		newItem.text = text
		this.items.push(newItem)
	}
	removeItem(idx) {
		this.items.splice(idx, 1)
	}

	toData() {
		return {
			title: this._title,
			items: this.items.map(item => item.toData())
		}
	}

	static fromData(data) {
		const list = new List()
		list._title = data.title
		list.items = data.items.map(Item.fromData)
		return list
	}
}