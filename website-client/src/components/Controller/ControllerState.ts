class ButtonState {
	public isPressed = false
	constructor(other?: ButtonState) {
		if (other !== undefined) {
			this.isPressed = other.isPressed
		}
	}
}

class StickState extends ButtonState {
	/** -1 is left, +1 is right */
	public horizontalValue = 0

	/** -1 is up, +1 is down */
	public verticalValue = 0

	constructor(other?: StickState) {
		super(other)
		if (other !== undefined) {
			this.horizontalValue = other.horizontalValue
			this.verticalValue = other.verticalValue
		}
	}
}

// Member names in here match actions.
class ControllerState {
	// Arrows
	arrowLeft = new ButtonState()
	arrowRight = new ButtonState()
	arrowUp = new ButtonState()
	arrowDown = new ButtonState()

	a = new ButtonState()
	b = new ButtonState()
	x = new ButtonState()
	y = new ButtonState()

	l = new ButtonState()
	zl = new ButtonState()

	r = new ButtonState()
	zr = new ButtonState()

	minus = new ButtonState()
	plus = new ButtonState()

	capture = new ButtonState()
	home = new ButtonState()

	leftStick = new StickState()
	rightStick = new StickState()

	constructor(other?: ControllerState) {
		if (other !== undefined) {
			// Deep copy
			this.arrowLeft = new ButtonState(other.arrowLeft)
			this.arrowRight = new ButtonState(other.arrowRight)
			this.arrowUp = new ButtonState(other.arrowUp)
			this.arrowDown = new ButtonState(other.arrowDown)

			this.a = new ButtonState(other.a)
			this.b = new ButtonState(other.b)
			this.x = new ButtonState(other.x)
			this.y = new ButtonState(other.y)

			this.l = new ButtonState(other.l)
			this.zl = new ButtonState(other.zl)

			this.r = new ButtonState(other.r)
			this.zr = new ButtonState(other.zr)

			this.minus = new ButtonState(other.minus)
			this.plus = new ButtonState(other.plus)

			this.capture = new ButtonState(other.capture)
			this.home = new ButtonState(other.home)

			this.leftStick = new StickState(other.leftStick)
			this.rightStick = new StickState(other.rightStick)
		}
	}
}

export { ControllerState, ButtonState }
