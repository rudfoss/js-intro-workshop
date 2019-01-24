export class Item{
	constructor() {
		this.text = ""
		this.done = false
		this.doneTime = undefined
	}

	get isDone() {
		return !!this.done
	}

	setDone(flag = true) {
		if (flag && !this.done) {
			this.doneTime = new Date()
		}
		this.done = flag
		if (!flag) {
			this.doneTime = undefined
		}
	}
	toggleDone() {
		this.setDone(!this.isDone)
	}

	toData() {
		return {
			text: this.text,
			done: this.done,
			doneTime: this.doneTime ? this.doneTime.toISOString() : undefined
		}
	}

	static fromData(data) {
		const item = new Item()
		item.text = data.text
		item.done = data.done
		if (item.done) {
			item.doneTime = new Date(Date.parse(data.doneTime))
		}
		return item
	}
}