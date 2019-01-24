export interface IStore {
	save<T>(data: T): void | Promise<void>
	load<T>(): void | T | Promise<void | T>
}