const maxStick = 'max'
const minStick = 'min'
const centerStick = 'center'

export default {
	// Left Stick
	leftStickFullLeft: {
		down: `s l h ${minStick}`,
		up: `s l h ${centerStick}`,
	},
	leftStickFullRight: {
		down: `s l h ${maxStick}`,
		up: `s l h ${centerStick}`,
	},
	leftStickFullUp: {
		down: `s l v ${maxStick}`,
		up: `s l v ${centerStick}`,
	},
	leftStickFullDown: {
		down: `s l v ${minStick}`,
		up: `s l v ${centerStick}`,
	},

	// Right Stick
	rightStickFullLeft: {
		down: `s r h ${minStick}`,
		up: `s r h ${centerStick}`,
	},
	rightStickFullRight: {
		down: `s r h ${maxStick}`,
		up: `s r h ${centerStick}`,
	},
	rightStickFullUp: {
		down: `s r v ${maxStick}`,
		up: `s r v ${centerStick}`,
	},
	rightStickFullDown: {
		down: `s r v ${minStick}`,
		up: `s r v ${centerStick}`,
	},

	// Arrows
	arrowLeft: {
		down: 'left d',
		up: 'left u',
	},
	arrowRight: {
		down: 'right d',
		up: 'right u',
	},
	arrowUp: {
		down: 'up d',
		up: 'up u',
	},
	arrowDown: {
		down: 'down d',
		up: 'down u',
	},

	b: {
		down: 'b d',
		up: 'b u',
	},
	x: {
		down: 'x d',
		up: 'x u',
	},
	y: {
		down: 'y d',
		up: 'y u',
	},
	a: {
		down: 'a d',
		up: 'a u',
	},

	l: {
		down: 'l d',
		up: 'l u',
	},
	zl: {
		down: 'zl d',
		up: 'zl u',
	},
	r: {
		down: 'r d',
		up: 'r u',
	},
	zr: {
		down: 'zr d',
		up: 'zr u',
	},

	minus: {
		down: 'minus d',
		up: 'minus u',
	},
	plus: {
		down: 'plus d',
		up: 'plus u',
	},

	capture: {
		down: 'capture d',
		up: 'capture u',
	},
	home: {
		down: 'home d',
		up: 'home u',
	},
}