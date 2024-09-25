export class UserInputHandler {
	keyDown: { [key: string]: boolean }
	subs: { [key: string]: (...any: any) => any }

	constructor() {
		this.keyDown = {}
		this.subs = {}

		const handleKey = (e: KeyboardEvent, isDown: boolean) => {
			this.keyDown[e.key.toLocaleLowerCase()] = isDown
			console.log("asd", this.keyDown)
		}
		document.addEventListener("keydown", (e => handleKey(e, true)))
		document.addEventListener("keyup", (e => handleKey(e, false)))


		const l = () => {
			this.tick()
			requestAnimationFrame(l)
		}
		l()
	}
	on(key: string, cb: (...any: any) => any) {
		this.subs[key.toLocaleLowerCase()] = cb
	}
	tick() {
		for (const key in this.subs) {
			// console.log(key)
			this.keyDown[key] && this.subs[key]()
		}
	}
}