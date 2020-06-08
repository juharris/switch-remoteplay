import actions from './actions'
import { KeyBinding } from './KeyBinding'

/**
 * Keyboard bindings. No mouse control.
 */
export default class KeyboardBinding extends KeyBinding {
	keyMap: any = {
		KeyW: actions.leftStickFullUp,
		KeyS: actions.leftStickFullDown,
		KeyA: actions.leftStickFullLeft,
		KeyD: actions.leftStickFullRight,

		ArrowLeft: actions.y,
		ArrowRight: actions.a,
		ArrowUp: actions.x,
		ArrowDown: actions.b,

		LeftClick: actions.a,
		Space: actions.b,

		KeyQ: actions.l,
		KeyE: actions.r,
		ShiftLeft: {
			isDown: false,
		},
		ShiftRight: {
			isDown: false,
		},

		KeyZ: actions.minus,
		KeyX: actions.plus,

		KeyC: actions.capture,
		KeyV: actions.home,
	}

	shiftKeyMap = {
		KeyA: actions.arrowLeft,
		KeyD: actions.arrowRight,
		KeyW: actions.arrowUp,
		KeyS: actions.arrowDown,

		KeyQ: actions.zl,
		KeyE: actions.zr,

		// These used to be activated when Ctrl was pressed
		// but that could cause someone to activate other commands which might close the window.
		ArrowUp: actions.rightStickFullUp,
		ArrowDown: actions.rightStickFullDown,
		ArrowLeft: actions.rightStickFullLeft,
		ArrowRight: actions.rightStickFullRight,
	}

	getName(): string {
		return "Keyboard"
	}

	start: () => void = () => {
		super.start()
		document.addEventListener('keydown', this.handleKeyDown)
		document.addEventListener('keyup', this.handleKeyUp)

		// No mouse control is used in this class but another class can be set up to do it.
		// It would be tricky to do in general and should probably be specific to the game.
		// document.addEventListener('mousemove', mouseMoveHandler)
		// document.addEventListener('mousedown', (e: MouseEvent) => {
		//     // TODO Allow if clicking on 'send-mode-toggle'
		//     // if (e!.target!.name === 'send-mode-toggle') {
		//     // 	return
		//     // }
		//     this.handleKey(e, 'LeftClick', 'down')
		// })

		// document.addEventListener('mouseup', e => {
		//     this.handleKey(e, 'LeftClick', 'up')
		// })

	}

	stop(): void {
		super.stop()
		document.removeEventListener('keydown', this.handleKeyDown)
		document.removeEventListener('keyup', this.handleKeyUp)
	}

	handleKeyDown: (e: KeyboardEvent) => void = (e: KeyboardEvent) => {
		this.handleKey(e, e.code, 'down')
	}

	handleKeyUp: (e: KeyboardEvent) => void = (e: KeyboardEvent) => {
		this.handleKey(e, e.code, 'up')
	}


	// Keeping in case we want to handle something on mouse movement later.
	// private mouseMoveHandler(e: MouseEvent) {
	// 	// Top left of the page is 0, 0.
	// 	const newX = e.pageX
	// 	const newY = e.pageY
	// 	if (currentMousePos.x !== undefined) {
	// 		let dX = newX - currentMousePos.x
	// 		let dY = currentMousePos.y - newY

	// 		if (Math.abs(dX) >= mouseSensitivityX) {
	// 			currentMousePos.x = newX
	// 		} else {
	// 			dX = 0
	// 		}
	// 		if (Math.abs(dY) >= mouseSensitivityY) {
	// 			currentMousePos.y = newY
	// 		} else {
	// 			dY = 0
	// 		}
	// 		if (Math.abs(dX) > 0 && Math.abs(dY) > 0) {
	// 			// console.debug(dX,dY)
	// 		}
	// 	} else {
	// 		currentMousePos.x = newX
	// 		currentMousePos.y = newY
	// 	}
	// }

	private handleKey(e: KeyboardEvent | MouseEvent, keyName: string, keyDirection: string) {
		let keyMapping: any = this.keyMap

		if (keyName in keyMapping) {
			keyMapping[keyName].isDown = keyDirection === 'down'
		}

		if ((keyMapping.ShiftLeft.isDown || keyMapping.ShiftRight.isDown) && keyName in this.shiftKeyMap) {
			keyMapping = this.shiftKeyMap
		}

		const command = keyMapping[keyName]
		if (command) {
			this.sendCommand(command[keyDirection], this.controllerState!)
			e.preventDefault()
		} else if (e.type === 'keydown') {
			console.debug(`Pressed ${(e as KeyboardEvent).code}.`)
		}
	}
}
