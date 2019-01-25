import { Item } from "./Item"

describe("Item", () => {
	it("should be defined", () => {
		expect(Item).toBeDefined()
	})
	it("should set default values for properties", () => {
		const item = new Item()
		expect(item.text).toBe("")
		expect(item._done).toBe(false)
		expect(item._doneTime).toBe(undefined)
	})
})