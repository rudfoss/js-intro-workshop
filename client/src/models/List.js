import {Item} from "./Item.js"

export class List{
	constructor() {
		this.title = ""
		this.items = []
	}

	getTitle() {
		return this.title || "<no title>"
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
			title: this.title,
			items: this.items.map(item => item.toData())
		}
	}

	static fromData(data) {
		const list = new List()
		list.title = data.title
		list.items = data.items.map(Item.fromData)
		return list
	}
}