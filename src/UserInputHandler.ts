export class UserInputHandler {
	keyDown: { [key: string]: boolean }
	subs: { [key: string]: (...any: any) => any }

	constructor() {
		this.keyDown = {}
		this.subs = {}

		const handleKey = (e: KeyboardEvent, isDown: boolean) => {
			this.keyDown[e.key.toLocaleLowerCase()] = isDown
			console.log("key pressed:", e.key)
		}
		document.addEventListener("keydown", (e => handleKey(e, true)))
		document.addEventListener("keyup", (e => handleKey(e, false)))
	}
	on(key: string, cb: (...any: any) => any) {
		this.subs[key.toLocaleLowerCase()] = cb
	}
	removeAll() {
		console.log("REMOVEALL!")
		for (const key in this.subs) {
			// console.log(key)
			this.keyDown[key] && delete this.keyDown[key]
		}
	}
	tick() {
		for (const key in this.subs) {
			// console.log(key)
			this.keyDown[key] && this.subs[key]()
		}
	}
}