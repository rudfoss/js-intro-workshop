import { StateManager } from "./stateManager.js"

export class App{
	constructor() {
		this.state = new StateManager()

		window.app = this
	}

	render() {

	}

	renderLists() {

	}
	renderList() {

	}
	renderItems() {
		
	}
}

export default () => new App()