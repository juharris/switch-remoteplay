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
		actions.leftStick,
		actions.rightStick,
		actions.arrowUp,
		actions.arrowDown,
		actions.arrowLeft,
		actions.arrowRight,
		actions.home,
	]

	axisDeltaThreshold = 0.01
	axisToAction = [
		{ name: 'leftStick', dirName: 'horizontalValue', command: 's l h ', },
		{ name: 'leftStick', dirName: 'verticalValue', command: 's l v ', },
		{ name: 'rightStick', dirName: 'horizontalValue', command: 's r h ', },
		{ name: 'rightStick', dirName: 'verticalValue', command: 's r v ', },
	]

	gamepad: Gamepad
	animationRequest?: number

	constructor(sendCommand: SendCommand, gamepad: Gamepad) {
		super(sendCommand)
		this.gamepad = gamepad

		this.loop = this.loop.bind(this)
	}

	loop(): void {
		try {
			const gamepads = navigator.getGamepads ? navigator.getGamepads() : ((navigator as any).webkitGetGamepads ? (navigator as any).webkitGetGamepads : [])
			if (this.gamepad.index < gamepads.length) {
				const gamepad = gamepads[this.gamepad.index]
				const command = this.getCommand(gamepad)
				if (command) {
					this.sendCommand(command, this.controllerState)
				}
				this.gamepad = gamepad
			}
			this.animationRequest = requestAnimationFrame(this.loop)
		} catch (err) {
			// Sometimes a gamepad disconnecting can cause an error.
			console.warn(err)
			this.stop()
		}
	}

	getCommand(gamepad: Gamepad): string {
		const commands: string[] = []
		for (let i = 0; i < gamepad.buttons.length && i < this.buttonToAction.length; ++i) {
			const button = gamepad.buttons[i]
			const isPressed = button.pressed || button.value > this.buttonValueThreshold
			if (isPressed !== this.gamepad.buttons[i].pressed) {
				const action = this.buttonToAction[i]
				commands.push(isPressed ? action.down : action.up);
				(this.controllerState as any)[action.name].isPressed = isPressed
			}
		}
		for (let i = 0; i < gamepad.axes.length && i < this.axisToAction.length; ++i) {
			const axisValue = gamepad.axes[i]
			if (Math.abs(axisValue - this.gamepad.axes[i]) > this.axisDeltaThreshold) {
				const action = this.axisToAction[i]
				commands.push(action.command + axisValue.toFixed(2));
				(this.controllerState as any)[action.name][action.dirName] = axisValue
			}
		}
		return commands.join('&')
	}

	getName(): string {
		return `${this.gamepad.id} (index: ${this.gamepad.index})`
	}

	start(): void {
		super.start()
		this.loop()
	}

	stop(): void {
		super.stop()
		if (this.animationRequest !== undefined) {
			cancelAnimationFrame(this.animationRequest)
		}
	}
}