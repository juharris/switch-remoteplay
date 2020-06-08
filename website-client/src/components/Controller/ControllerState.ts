class ButtonState {
	public isPressed = false
}

class StickState extends ButtonState {
	/** -1 is left, +1 is right */
	public horizontalValue = 0

	/** -1 is up, +1 is down */
	public verticalValue = 0
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
}

export { ControllerState, ButtonState }
