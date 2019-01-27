export interface IStore {
	save<T>(data: T): any | Promise<any>
	load<T>(): undefined | T | Promise<undefined | T>
}