export class ServerStore {
	constructor(key) {
		this.key = key
		this._lastStored = undefined
		if (!window.localStorage) {
			throw new Error("Your browser does not support localStorage")
		}
	}

	async save(data) {
		localStorage.setItem(this.key, data)
	}
	async load() {
		return localStorage.getItem(this.key) || { lists: [] }
	}
}