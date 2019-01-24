import { Item } from "./Item"

describe("Item", () => {
	it("should be defined", () => {
		expect(Item).toBeDefined()
	})

	it("should set default values for properties", () => {
		const inst = new Item()
		expect(inst.text).toEqual("")
		expect(inst.done).toEqual(false)
		expect(inst.doneTime).not.toBeDefined()
	})
})