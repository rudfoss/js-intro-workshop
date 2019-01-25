export class ServerStore {
	constructor(key) {
		this.key = key
		this._host = "http://localhost:1337/"
	}

	async save(data) {
		const response = await fetch(this._host+this.key, {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})

		return response.json()
	}
	async load() {
		const response = await fetch(this._host+this.key)
		if (response.status >= 400) {
			return {lists:[]}
		}
		return response.json()
	}
}