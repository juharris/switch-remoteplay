import { ControllerState } from '../ControllerState'
import { parseCommand } from '../parse-command'

describe('parseCommand', () => {
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
		c1.rightStick.isPressed = true
		c2 = new ControllerState()
		expect(parseCommand(`right`)).toStrictEqual([c1, c2])

		c1 = new ControllerState()
		c1.leftStick.isPressed = true
		c2 = new ControllerState()
		expect(parseCommand(`left`)).toStrictEqual([c1, c2])
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

			c = new ControllerState()
			expect(parseCommand(`${buttonName} u`)).toStrictEqual([c])
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

		c.rightStick.isPressed = true
		expect(parseCommand(`right d`)).toStrictEqual([c])
		c = new ControllerState()
		expect(parseCommand(`right u`)).toStrictEqual([c])

		c.leftStick.isPressed = true
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
		c.rightStick.horizontalValue = -1
		expect(parseCommand(`s r left`)).toStrictEqual([c])
		c.rightStick.horizontalValue = 1
		expect(parseCommand(`s r right`)).toStrictEqual([c])
		c.rightStick.horizontalValue = 0
		expect(parseCommand(`s r center`)).toStrictEqual([c])
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
})
