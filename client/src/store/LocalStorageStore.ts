import { IStore } from "./IStore"

export class ServerStore implements IStore {
	constructor(public key: string) {
		if (!window.localStorage) {
			throw new Error("Your browser does not support localStorage")
		}
	}

	public save<T>(data: T) {
		localStorage.setItem(this.key, JSON.stringify(data))
	}
	public load<T>(): T | undefined {
		const rawData = localStorage.getItem(this.key)
		if (!rawData) return
		return  JSON.parse(rawData) as T
	}
}