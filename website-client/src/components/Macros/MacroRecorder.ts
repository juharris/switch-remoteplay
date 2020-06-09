import { ControllerState } from "../Controller/ControllerState"

export default class MacroRecorder {
	isRecording = false
	lastCommandTime = Date.now()
	currentRecording: { command: string, controllerState: any }[] = []

	start(): void {
		this.currentRecording = []
		this.lastCommandTime = Date.now()
		this.isRecording = true
	}

	stop(): void {
		this.isRecording = false
		console.debug("Recorded macro:")
		console.debug(this.currentRecording)
	}

	add(command: string, controllerState: ControllerState): void {
		if (this.isRecording) {
			const commandTime = Date.now()
			this.currentRecording.push({
				command: `wait ${commandTime - this.lastCommandTime}`,
				controllerState
			})
			this.currentRecording.push({ command, controllerState })
			this.lastCommandTime = commandTime
		}
	}
}
