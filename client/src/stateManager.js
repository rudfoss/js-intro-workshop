export class StateManager {
	constructor(initialHandlers = [], initialState = {}, initialListeners = []){
		this._handlers = initialHandlers
		this._state = initialState
		this._listeners = initialListeners
	}

	getState() {
		return this._state
	}

	dispatch(action) {
		for (const handler of this._handlers) {
			const nextState = handler(action, this.getState())
			if (!nextState) {
				throw new Error("Handlers must return a new state object")
			}
			this._state = nextState
		}

		for (const listener of this._listeners) {
			listener(this.getState())
		}
	}

	subscribe(listener) {
		this._listeners.push(listener)
	}
}