export class Item {
	constructor() {
		this.text = ""
		this._done = false
		this._doneTime = undefined
	}

	set done(flag) {
		this._done = flag
		this._doneTime = flag ? new Date() : undefined
	}
	get done() {
		return this._done
	}
	get doneTime() {
		return this._doneTime
	}

	toggleDone() {
		this.done = !this.done
	}

	toData() {
		return {
			text: this.text,
			done: this._done,
			doneTime: this._doneTime ?
				this._doneTime.toISOString() : undefined
		}
	}
	static fromData(data = {}) {
		const inst = new Item()
		inst.text = data.text || ""
		inst._done = !!data.done
		inst._doneTime = data.done ?
			new Date(Date.parse(data.doneTime)) : undefined
		return inst
	}
}