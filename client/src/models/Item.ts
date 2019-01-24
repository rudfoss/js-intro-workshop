import { IItem } from "./IItem"

export class Item{
	public text = ""
	public done = false
	public doneTime?: Date

	public get isDone() {
		return !!this.done
	}

	public setDone(flag = true) {
		if (flag && !this.done) {
			this.doneTime = new Date()
		}
		this.done = flag
		if (!flag) {
			this.doneTime = undefined
		}
	}
	public toggleDone() {
		this.setDone(!this.isDone)
	}

	public toData() {
		return {
			text: this.text,
			done: this.done,
			doneTime: this.doneTime ? this.doneTime.toISOString() : undefined
		}
	}

	public static fromData(data: IItem) {
		const item = new Item()
		item.text = data.text
		item.done = data.done
		if (data.doneTime) {
			item.doneTime = new Date(Date.parse(data.doneTime))
		}
		return item
	}
}