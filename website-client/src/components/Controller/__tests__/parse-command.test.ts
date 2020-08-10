import { ControllerState } from '../ControllerState'
import { updateState, parseCommand } from '../parse-command'

describe('parse-command', () => {
	it('tap button', () => {
		let c1, c2
		for (const buttonName of [
			'l', 'zl',
			'r', 'zr',
			'a', 'b', 'x', 'y',
			'minus', 'plus',
			'home', 'capture',

		]) {
			c1 = new ControllerState();
			(c1 as any)[buttonName].isPressed = true
			c2 = new ControllerState()
			expect(parseCommand(`${buttonName}`)).toStrictEqual([c1, c2])
		}

		c1 = new ControllerState()
		c1.leftStick.isPressed = true
		c2 = new ControllerState()
		expect(parseCommand(`l_stick`)).toStrictEqual([c1, c2])

		c1 = new ControllerState()
		c1.rightStick.isPressed = true
		c2 = new ControllerState()
		expect(parseCommand(`r_stick`)).toStrictEqual([c1, c2])

		c1 = new ControllerState()
		c1.arrowDown.isPressed = true
		c2 = new ControllerState()
		expect(parseCommand(`down`)).toStrictEqual([c1, c2])

		c1 = new ControllerState()
		c1.arrowUp.isPressed = true
		c2 = new ControllerState()
		expect(parseCommand(`up`)).toStrictEqual([c1, c2])

		c1 = new ControllerState()
		c1.arrowRight.isPressed = true
		c2 = new ControllerState()
		expect(parseCommand(`right`)).toStrictEqual([c1, c2])

		c1 = new ControllerState()
		c1.arrowLeft.isPressed = true
		c2 = new ControllerState()
		expect(parseCommand(`left`)).toStrictEqual([c1, c2])
	})

	it('tap with other command', () => {
		const s1 = new ControllerState()
		s1.a.isPressed = true
		s1.b.isPressed = true
		const s2 = new ControllerState()
		s2.b.isPressed = true
		expect(parseCommand(`a&b d`)).toStrictEqual([s1, s2])
	})

	it('tap with other commands and stick', () => {
		const s1 = new ControllerState()
		s1.a.isPressed = true
		s1.y.isPressed = true
		s1.b.isPressed = true
		s1.x.isPressed = true
		s1.leftStick.horizontalValue = 0.6
		const s2 = new ControllerState()
		s2.b.isPressed = true
		s2.x.isPressed = true
		s2.leftStick.horizontalValue = 0.6
		expect(parseCommand(`a&y&b d&x d&s l h 0.6`)).toStrictEqual([s1, s2])
	})

	it('push button', () => {
		let c = new ControllerState()
		for (const buttonName of [
			'l', 'zl',
			'r', 'zr',
			'a', 'b', 'x', 'y',
			'minus', 'plus',
			'home', 'capture',

		]) {
			(c as any)[buttonName].isPressed = true
			expect(parseCommand(`${buttonName} d`)).toStrictEqual([c])
			const updatedState = new ControllerState()
			updateState(`${buttonName} d`, updatedState)
			expect(updatedState).toStrictEqual(c)

			c = new ControllerState()
			expect(parseCommand(`${buttonName} u`)).toStrictEqual([c])
			updateState(`${buttonName} u`, updatedState)
			expect(updatedState).toStrictEqual(c)
		}

		c = new ControllerState()
		c.leftStick.isPressed = true
		expect(parseCommand(`l_stick d`)).toStrictEqual([c])
		c = new ControllerState()
		expect(parseCommand(`l_stick u`)).toStrictEqual([c])

		c.rightStick.isPressed = true
		expect(parseCommand(`r_stick d`)).toStrictEqual([c])
		c = new ControllerState()
		expect(parseCommand(`r_stick u`)).toStrictEqual([c])

		c = new ControllerState()
		c.arrowDown.isPressed = true
		expect(parseCommand(`down d`)).toStrictEqual([c])
		c = new ControllerState()
		expect(parseCommand(`down u`)).toStrictEqual([c])

		c.arrowUp.isPressed = true
		expect(parseCommand(`up d`)).toStrictEqual([c])
		c = new ControllerState()
		expect(parseCommand(`up u`)).toStrictEqual([c])

		c.arrowRight.isPressed = true
		expect(parseCommand(`right d`)).toStrictEqual([c])
		c = new ControllerState()
		expect(parseCommand(`right u`)).toStrictEqual([c])

		c.arrowLeft.isPressed = true
		expect(parseCommand(`left d`)).toStrictEqual([c])
		c = new ControllerState()
		expect(parseCommand(`left u`)).toStrictEqual([c])
	})

	it('move sticks', () => {
		let c = new ControllerState()

		c.leftStick.verticalValue = -1
		expect(parseCommand(`s l up`)).toStrictEqual([c])
		c.leftStick.verticalValue = 1
		expect(parseCommand(`s l down`)).toStrictEqual([c])
		c.leftStick.verticalValue = 0
		c.leftStick.horizontalValue = -1
		expect(parseCommand(`s l left`)).toStrictEqual([c])
		c.leftStick.horizontalValue = 1
		expect(parseCommand(`s l right`)).toStrictEqual([c])
		c.leftStick.horizontalValue = 0
		expect(parseCommand(`s l center`)).toStrictEqual([c])

		c.leftStick.horizontalValue = -1
		expect(parseCommand(`s l h min`)).toStrictEqual([c])
		c.leftStick.horizontalValue = 1
		expect(parseCommand(`s l h max`)).toStrictEqual([c])
		c.leftStick.horizontalValue = 0
		expect(parseCommand(`s l h center`)).toStrictEqual([c])
		c.leftStick.verticalValue = 1
		expect(parseCommand(`s l v min`)).toStrictEqual([c])
		c.leftStick.verticalValue = -1
		expect(parseCommand(`s l v max`)).toStrictEqual([c])
		c.leftStick.verticalValue = 0
		expect(parseCommand(`s l v center`)).toStrictEqual([c])

		c.leftStick.horizontalValue = 0.5
		expect(parseCommand(`s l h 0.5`)).toStrictEqual([c])
		c.leftStick.horizontalValue = -0.5
		expect(parseCommand(`s l h -0.5`)).toStrictEqual([c])
		c.leftStick.horizontalValue = -1
		expect(parseCommand(`s l h -1`)).toStrictEqual([c])
		c.leftStick.horizontalValue = 1
		expect(parseCommand(`s l h +1`)).toStrictEqual([c])
		c.leftStick.horizontalValue = 1
		expect(parseCommand(`s l h 1`)).toStrictEqual([c])
		c.leftStick.horizontalValue = 0
		expect(parseCommand(`s l h 0`)).toStrictEqual([c])
		c.leftStick.verticalValue = 0.5
		expect(parseCommand(`s l v 0.5`)).toStrictEqual([c])
		c.leftStick.verticalValue = -0.5
		expect(parseCommand(`s l v -0.5`)).toStrictEqual([c])
		c.leftStick.verticalValue = -1
		expect(parseCommand(`s l v -1`)).toStrictEqual([c])
		c.leftStick.verticalValue = 1
		expect(parseCommand(`s l v +1`)).toStrictEqual([c])
		c.leftStick.verticalValue = 1
		expect(parseCommand(`s l v 1`)).toStrictEqual([c])
		c.leftStick.verticalValue = 0
		expect(parseCommand(`s l v 0`)).toStrictEqual([c])
		c.leftStick.horizontalValue = 0.5
		c.leftStick.verticalValue = -1
		expect(parseCommand(`s l hv 0.5 -1`)).toStrictEqual([c])
		c.leftStick.horizontalValue = -0.5
		c.leftStick.verticalValue = 1
		expect(parseCommand(`s l hv -0.5 1`)).toStrictEqual([c])
		c.leftStick.horizontalValue = 0
		c.leftStick.verticalValue = 0.5
		expect(parseCommand(`s l hv 0 .5`)).toStrictEqual([c])


		c = new ControllerState()
		c.rightStick.verticalValue = -1
		expect(parseCommand(`s r up`)).toStrictEqual([c])
		c.rightStick.verticalValue = 1
		expect(parseCommand(`s r down`)).toStrictEqual([c])
		c.rightStick.verticalValue = 0
		c.rightStick.horizontalValue = -1
		expect(parseCommand(`s r left`)).toStrictEqual([c])
		c.rightStick.horizontalValue = 1
		expect(parseCommand(`s r right`)).toStrictEqual([c])
		c.rightStick.horizontalValue = 0
		expect(parseCommand(`s r center`)).toStrictEqual([c])

		c.rightStick.horizontalValue = -1
		expect(parseCommand(`s r h min`)).toStrictEqual([c])
		c.rightStick.horizontalValue = 1
		expect(parseCommand(`s r h max`)).toStrictEqual([c])
		c.rightStick.horizontalValue = 0
		expect(parseCommand(`s r h center`)).toStrictEqual([c])
		c.rightStick.verticalValue = 1
		expect(parseCommand(`s r v min`)).toStrictEqual([c])
		c.rightStick.verticalValue = -1
		expect(parseCommand(`s r v max`)).toStrictEqual([c])
		c.rightStick.verticalValue = 0
		expect(parseCommand(`s r v center`)).toStrictEqual([c])

		c.rightStick.horizontalValue = 0.5
		expect(parseCommand(`s r h 0.5`)).toStrictEqual([c])
		c.rightStick.horizontalValue = 0
		c.rightStick.verticalValue = 0.5
		expect(parseCommand(`s r v 0.5`)).toStrictEqual([c])
		c.rightStick.verticalValue = -0.5
		expect(parseCommand(`s r v -0.5`)).toStrictEqual([c])
		c.rightStick.verticalValue = -1
		expect(parseCommand(`s r v -1`)).toStrictEqual([c])
		c.rightStick.verticalValue = 0
		expect(parseCommand(`s r v 0`)).toStrictEqual([c])
		c.rightStick.horizontalValue = 0.5
		c.rightStick.verticalValue = -1
		expect(parseCommand(`s r hv 0.5 -1`)).toStrictEqual([c])
		c.rightStick.horizontalValue = -0.5
		c.rightStick.verticalValue = 1
		expect(parseCommand(`s r hv -0.5 1`)).toStrictEqual([c])
	})


	it('unrecognized', () => {
		expect(parseCommand('junk')).toStrictEqual([new ControllerState()])
	})

	it('combined', () => {
		const c = new ControllerState()
		c.a.isPressed = c.b.isPressed = true
		expect(parseCommand('a d&b d')).toStrictEqual([c])
	})

	it('updateState', () => {
		const c = new ControllerState()
		const expected = new ControllerState()
		updateState('a d', c)
		expected.a.isPressed = true
		expect(c).toStrictEqual(expected)
	})

	it('updateState tap', () => {
		const c = new ControllerState()
		const expected = new ControllerState()
		updateState('x', c)
		// Tapping is not really supported but it should not update the state.
		expect(c).toStrictEqual(expected)
	})

	it('updateState stick d', () => {
		const c = new ControllerState()
		const expected = new ControllerState()
		updateState('l_stick d', c)
		expected.leftStick.isPressed = true
		expect(c).toStrictEqual(expected)
	})

	it('updateState stick move', () => {
		const c = new ControllerState()
		const expected = new ControllerState()
		updateState('s r hv 0.4 -0.5', c)
		expected.rightStick.horizontalValue = 0.4
		expected.rightStick.verticalValue = -0.5
		expect(c).toStrictEqual(expected)
	})

	it('updateState with &', () => {
		const c = new ControllerState()
		const expected = new ControllerState()
		updateState('a d&b d', c)
		expected.a.isPressed = expected.b.isPressed = true
		expect(c).toStrictEqual(expected)
	})
})
