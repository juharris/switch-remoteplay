import { ControllerState } from "./ControllerState"

const buttonNames = new Set([
	'l', 'zl',
	'r', 'zr',
	'a', 'b', 'x', 'y',
	'minus', 'plus',
	'l_stick', 'r_stick',
	'home', 'capture',
	'down', 'up', 'left', 'right'])

const buttonNameToStateMember: any = {
	l_stick: 'leftStick',
	r_stick: 'rightStick',
	down: 'rightStick',
	up: 'rightStick',
	left: 'rightStick',
	right: 'rightStick',
}

function parseCommand(command: string): ControllerState[] {
	const result = []

	const controllerState = new ControllerState()
	for (let singleCommand of command.split('&')) {
		singleCommand = singleCommand.trim()
		if (buttonNames.has(singleCommand)) {
			(controllerState as any)[buttonNameToStateMember[singleCommand] || singleCommand].isPressed = true
		} else {
			const commandParts = singleCommand.split(/\s*/)
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
							// TODO
						} else if (commandParts.length === 4) {
							const direction = commandParts[2]
							const amount = commandParts[3]
							// TODO
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

	return result
}



export { parseCommand }

