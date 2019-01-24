import {Item} from "./Item"
import { IList } from "./IList"

export class List{
	public title = ""
	public items: Item[] = []

	public getTitle() {
		return this.title || "<no title>"
	}

	public newItem(text = "") {
		const newItem = new Item()
		newItem.text = text
		this.items.push(newItem)
	}
	removeItem(idx: number) {
		this.items.splice(idx, 1)
	}

	toData() {
		return {
			title: this.title,
			items: this.items.map(item => item.toData())
		}
	}

	static fromData(data: IList) {
		const list = new List()
		list.title = data.title
		list.items = data.items.map(Item.fromData)
		return list
	}
}