export class Item{
	constructor() {
		this.title = ""
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

	toData() {
		return {
			title: this.title,
			done: this.done,
			doneTime: this.doneTime.toISOString()
		}
	}

	static fromData(data) {
		const item = new Item()
		item.title = data.title
		item.done = data.done
		if (item.done) {
			item.doneTime = new Date(data.date)
		}
	}
}