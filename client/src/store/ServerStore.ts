import { IStore } from "./IStore";

export class ServerStore implements IStore {
	protected _host = "http://localhost:4242"

	constructor(public key: string) { }

	public async save<T>(data: T) {
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
	public async load<T>() {
		const response = await fetch(this._host+"/?id="+this.key)
		if (response.status >= 400) return
		const data = await response.json()
		return data as T
	}
}