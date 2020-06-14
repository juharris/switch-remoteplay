export default class MacroRecorder {
	isRecording = false
	lastCommandTime = Date.now()
	currentRecording: string[] = []

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

	add(command: string): void {
		if (this.isRecording) {
			const commandTime = Date.now()
			this.currentRecording.push(
				`wait ${commandTime - this.lastCommandTime}`,
			)
			this.currentRecording.push(command)
			this.lastCommandTime = commandTime
		}
	}
}
