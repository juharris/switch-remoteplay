import { KeyBinding, SendCommand } from "./KeyBinding"

export default class GamepadBinding extends KeyBinding {
	getName(): string {
		return "Gamepad"
	}

	start(): void {
		throw new Error("Method not implemented.");
	}

	stop(): void {
		throw new Error("Method not implemented.");
	}
}