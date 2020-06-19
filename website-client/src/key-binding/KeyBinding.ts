import { ControllerState } from '../components/Controller/ControllerState'

export interface SendCommand {
	(command: string, controllerState?: ControllerState): void
}

export abstract class KeyBinding {
	sendCommand: SendCommand
	controllerState = new ControllerState()

	constructor(sendCommand: SendCommand) {
		this.sendCommand = sendCommand
	}

	abstract getName(): string

	public start(): void {
		console.debug(`${this.getName()}: Starting`)
	}

	public stop(): void {
		console.debug(`${this.getName()}: Stopping`)
	}
}
