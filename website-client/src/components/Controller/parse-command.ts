import { ControllerState } from './ControllerState'

const buttonNames = new Set([
	'l', 'zl',
	'r', 'zr',
	'a', 'b', 'x', 'y',
	'minus', 'plus',
	'l_stick', 'r_stick',
	'home', 'capture',
	'down', 'up', 'left', 'right'])

const buttonNameToStateMember: { [buttonName: string]: string } = {
	l_stick: 'leftStick',
	r_stick: 'rightStick',
	down: 'arrowDown',
	up: 'arrowUp',
	left: 'arrowLeft',
	right: 'arrowRight',
}

/**
 * This should mainly be used for macros.
 *
 * @param command The command to run.
 * @returns The controller states for running the command.
 */
function parseCommand(command: string): ControllerState[] {
	const result = []

	const controllerState = new ControllerState()
	let hasTap = false
	for (let singleCommand of command.split('&')) {
		singleCommand = singleCommand.trim()
		if (buttonNames.has(singleCommand)) {
			const member: string = buttonNameToStateMember[singleCommand] || singleCommand;
			(controllerState as any)[member].isPressed = true
			hasTap = true
		} else {
			const commandParts = singleCommand.split(/\s+/)
			if (commandParts.length < 2) {
				console.warn("Ignoring unrecognized part of command: \"%s\" from \"%s\"", singleCommand, command)
			} else {
				const button = commandParts[0]
				if (button === 's') {
					const stick = commandParts[1]
					let stickState = undefined
					if (stick === 'l') {
						stickState = controllerState.leftStick
					} else if (stick === 'r') {
						stickState = controllerState.rightStick
					}
					if (stickState) {
						if (commandParts.length === 3) {
							const direction = commandParts[2]
							switch (direction) {
								case 'up':
									stickState.verticalValue = -1
									break
								case 'down':
									stickState.verticalValue = 1
									break
								case 'left':
									stickState.horizontalValue = -1
									break
								case 'right':
									stickState.horizontalValue = 1
									break
								case 'center':
									stickState.horizontalValue = stickState.verticalValue = 0
									break
								default:
									console.warn("Ignoring unrecognized direction in: \"%s\" from \"%s\"", singleCommand, command)
							}
						} else if (commandParts.length === 4) {
							const direction = commandParts[2]
							const amount = commandParts[3]
							let stickAmount
							switch (amount) {
								case 'min':
									stickAmount = direction === 'h' ? -1 : +1
									break
								case 'max':
									stickAmount = direction === 'h' ? +1 : -1
									break
								case 'center':
									stickAmount = 0
									break
								default:
									stickAmount = parseFloat(amount)
							}
							if (direction === 'h') {
								stickState.horizontalValue = stickAmount
							} else if (direction === 'v') {
								stickState.verticalValue = stickAmount
							} else {
								console.warn("Ignoring unrecognized direction in: \"%s\" from \"%s\"", singleCommand, command)
							}
						} else if (commandParts.length === 5 && commandParts[2] === 'hv') {
							const horizontalAmount = commandParts[3]
							const verticalAmount = commandParts[4]
							stickState.horizontalValue = parseFloat(horizontalAmount)
							stickState.verticalValue = parseFloat(verticalAmount)
						} else {
							console.warn("Ignoring unrecognized stick command in: \"%s\" from \"%s\"", singleCommand, command)
						}
					} else {
						console.warn("Ignoring unrecognized stick in: \"%s\" from \"%s\"", singleCommand, command)
					}
				} else if (buttonNames.has(button)) {
					const isPressed = commandParts[1] === 'd'
					if (isPressed) {
						(controllerState as any)[buttonNameToStateMember[button] || button].isPressed = true
					}
				} else {
					console.warn("Ignoring unrecognized part of command: \"%s\" from \"%s\"", singleCommand, command)
				}
			}
		}

	}
	result.push(controllerState)
	if (hasTap) {
		result.push(new ControllerState())
	}

	return result
}



export { parseCommand }

