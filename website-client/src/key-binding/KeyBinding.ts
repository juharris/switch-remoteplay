import { ControllerState } from '../components/Controller/ControllerState'

/**
 * @param command The command the execute.
 * @param controllerState The current state of the controller. If `undefined`, then the states for the `command` will be automatically determined but the UI might not look right if this method is called concurrently.
 * @param updateGivenState If `true`, then the passed in state should be updated. Defaults to `false`.
 */
export interface SendCommand {
	(command: string, controllerState?: ControllerState,
		updateGivenState?: boolean): void
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
