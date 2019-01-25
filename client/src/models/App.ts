import {List} from "./List"
import { IList } from "./IList"
import { IAppData } from "./IAppData";

export class App{
	public lists: List[] = []
	public activeListIdx = -1
	public newItemText = ""

	public newList() {
		this.lists.push(new List())
	}
	public removeList(idx: number) {
		if (idx < 0) return
		if (idx >= this.lists.length) return
		this.lists.splice(idx, 1)
	}
	public getActiveList() {
		return this.lists[this.activeListIdx]
	}

	public toData() {
		return {
			lists: this.lists.map(list => list.toData())
		}
	}

	static fromData(data: IAppData) {
		const app = new App()
		app.lists = (data.lists || []).map(List.fromData)
		return app
	}
}