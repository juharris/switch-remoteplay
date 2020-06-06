import { KeyBinding, SendCommand } from "./KeyBinding"

export default class GamepadBinding extends KeyBinding {
	gamepad: Gamepad
	animationRequest?: number

	constructor(sendCommand: SendCommand, gamepad: Gamepad) {
		super(sendCommand)
		this.gamepad = gamepad

		this.loop = this.loop.bind(this)
	}

	loop(): void {
		// TODO Keep state and send commands when it changes.		
		// console.debug(this.gamepad.buttons)
		console.debug(this.gamepad.axes)
		this.animationRequest = requestAnimationFrame(this.loop)
	}

	getName(): string {
		return `${this.gamepad.id} (index: ${this.gamepad.index})`
	}

	start(): void {
		console.debug(`${this.getName()}: Starting`)
		this.loop()
	}

	stop(): void {
		console.debug(`${this.getName()}: Stopping`)
		if (this.animationRequest !== undefined) {
			cancelAnimationFrame(this.animationRequest)
		}
	}
}