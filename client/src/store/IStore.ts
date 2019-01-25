export interface IStore {
	save<T>(data: T): undefined | Promise<undefined>
	load<T>(): undefined | T | Promise<undefined | T>
}