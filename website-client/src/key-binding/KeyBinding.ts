export interface SendCommand {
	(command: string): void
}

export abstract class KeyBinding {
	sendCommand: SendCommand

	constructor(sendCommand: SendCommand) {
		this.sendCommand = sendCommand
	}

	abstract destroy(): void
}
