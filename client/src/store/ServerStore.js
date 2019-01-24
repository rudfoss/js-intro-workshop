export class ServerStore{
	constructor(key) {
		this.key = key
		this._lastStored = undefined
		this._host = "http://localhost:4242"
	}

	async save(data) {
		const response = await fetch(this._host+"/?id="+this.key, {
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
		const response = await fetch(this._host+"/?id="+this.key)
		if (response.status >= 400) {
			return {lists: []}
		}
		return response.json()
	}
}