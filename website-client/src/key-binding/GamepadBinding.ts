import { KeyBinding, SendCommand } from "./KeyBinding"
import actions from "./actions"

/**
 * Bindings for a single Gamepad.
 */
export default class GamepadBinding extends KeyBinding {
	buttonValueThreshold = 0.5
	buttonToAction = [
		// Default is to use buttons as they as positioned on a Switch controller.
		actions.b,
		actions.a,
		actions.y,
		actions.x,
		actions.l,
		actions.r,
		actions.zl,
		actions.zr,
		actions.minus,
		actions.plus,
		actions.l_stick,
		actions.r_stick,
		actions.arrowUp,
		actions.arrowDown,
		actions.arrowLeft,
		actions.arrowRight,
		actions.home,
	]

	axisDeltaThreshold = 0.01
	axisToAction = [
		's l h ',
		's l v ',
		's r h ',
		's r v ',
	]

	gamepad: Gamepad
	animationRequest?: number

	constructor(sendCommand: SendCommand, gamepad: Gamepad) {
		super(sendCommand)
		this.gamepad = gamepad

		this.loop = this.loop.bind(this)
	}

	loop(): void {
		const gamepads = navigator.getGamepads ? navigator.getGamepads() : ((navigator as any).webkitGetGamepads ? (navigator as any).webkitGetGamepads : []);
		if (this.gamepad.index < gamepads.length) {
			const gamepad = gamepads[this.gamepad.index]
			const command = this.getCommand(gamepad)
			if (command) {
				this.sendCommand(command)
			}
			this.gamepad = gamepad
		}
		this.animationRequest = requestAnimationFrame(this.loop)
	}

	getCommand(gamepad: Gamepad): string {
		const commands: string[] = []
		for (let i = 0; i < gamepad.buttons.length && i < this.buttonToAction.length; ++i) {
			const button = gamepad.buttons[i]
			const isPressed = button.pressed || button.value > this.buttonValueThreshold
			if (isPressed !== this.gamepad.buttons[i].pressed) {
				commands.push(isPressed ? this.buttonToAction[i].down : this.buttonToAction[i].up)
			}
		}
		for (let i = 0; i < gamepad.axes.length && i < this.axisToAction.length; ++i) {
			const axisValue = gamepad.axes[i]
			if (Math.abs(axisValue - this.gamepad.axes[i]) > this.axisDeltaThreshold) {
				commands.push(this.axisToAction[i] + axisValue.toFixed(2))
			}
		}
		return commands.join('&')
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