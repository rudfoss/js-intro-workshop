import {List} from "./List.js"

export class App{
	constructor() {
		this.lists = []
		this.activeListIdx = -1
		this.newItemText = ""
	}

	newList() {
		this.lists.push(new List())
	}
	removeList(idx) {
		if (idx < 0) return
		if (idx >= this.lists.length) return
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

	static fromData(data) {
		const app = new App()
		app.lists = (data.lists || []).map(List.fromData)
		app.activeListIdx = data.activeListIdx
		return app
	}
}