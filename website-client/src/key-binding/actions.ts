const maxStick = 'max'
const minStick = 'min'
const centerStick = 'center'

// Keys in here match ControllerState.
export default {
	// Left Stick
	leftStickFullLeft: {
		name: 'leftStick',
		dirName: 'left',
		down: `s l h ${minStick}`,
		up: `s l h ${centerStick}`,
	},
	leftStickFullRight: {
		name: 'leftStick',
		dirName: 'right',
		down: `s l h ${maxStick}`,
		up: `s l h ${centerStick}`,
	},
	leftStickFullUp: {
		name: 'leftStick',
		dirName: 'up',
		down: `s l v ${maxStick}`,
		up: `s l v ${centerStick}`,
	},
	leftStickFullDown: {
		name: 'leftStick',
		dirName: 'down',
		down: `s l v ${minStick}`,
		up: `s l v ${centerStick}`,
	},
	leftStick: {
		name: 'leftStick',
		down: 'l_stick d',
		up: 'l_stick u',
	},

	// Right Stick
	rightStickFullLeft: {
		name: 'rightStick',
		dirName: 'left',
		down: `s r h ${minStick}`,
		up: `s r h ${centerStick}`,
	},
	rightStickFullRight: {
		name: 'rightStick',
		dirName: 'right',
		down: `s r h ${maxStick}`,
		up: `s r h ${centerStick}`,
	},
	rightStickFullUp: {
		name: 'rightStick',
		dirName: 'up',
		down: `s r v ${maxStick}`,
		up: `s r v ${centerStick}`,
	},
	rightStickFullDown: {
		name: 'rightStick',
		dirName: 'down',
		down: `s r v ${minStick}`,
		up: `s r v ${centerStick}`,
	},
	rightStick: {
		name: 'rightStick',
		down: 'r_stick d',
		up: 'r_stick u',
	},

	// Arrows
	arrowLeft: {
		name: 'arrowLeft',
		down: 'left d',
		up: 'left u',
	},
	arrowRight: {
		name: 'arrowRight',
		down: 'right d',
		up: 'right u',
	},
	arrowUp: {
		name: 'arrowUp',
		down: 'up d',
		up: 'up u',
	},
	arrowDown: {
		name: 'arrowDown',
		down: 'down d',
		up: 'down u',
	},

	b: {
		name: 'b',
		down: 'b d',
		up: 'b u',
	},
	x: {
		name: 'x',
		down: 'x d',
		up: 'x u',
	},
	y: {
		name: 'y',
		down: 'y d',
		up: 'y u',
	},
	a: {
		name: 'a',
		down: 'a d',
		up: 'a u',
	},

	l: {
		name: 'l',
		down: 'l d',
		up: 'l u',
	},
	zl: {
		name: 'zl',
		down: 'zl d',
		up: 'zl u',
	},
	r: {
		name: 'r',
		down: 'r d',
		up: 'r u',
	},
	zr: {
		name: 'zr',
		down: 'zr d',
		up: 'zr u',
	},

	minus: {
		name: 'minus',
		down: 'minus d',
		up: 'minus u',
	},
	plus: {
		name: 'plus',
		down: 'plus d',
		up: 'plus u',
	},

	capture: {
		name: 'capture',
		down: 'capture d',
		up: 'capture u',
	},
	home: {
		name: 'home',
		down: 'home d',
		up: 'home u',
	},
}