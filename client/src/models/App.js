import { List } from "./List.js"

export class App {
	constructor() {
		this.lists = []
		this.activeListIdx = -1
	}

	newList() {
		this.lists.push(new List())
	}
	removeList(idx) {
		if (idx >= this.lists.length) throw new Error("Out of bounds")
		this.lists.splice(idx, 1)
	}

	getActiveList() {
		return this.lists[this.activeListIdx]
	}

	toData() {
		return {
			lists: this.lists.map(list => list.toData())
		}
	}
	static fromData(data = {}) {
		const inst = new App()
		inst.lists = (data.lists || []).map(List.fromData)
		return inst
	}
}