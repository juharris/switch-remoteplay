import { createStyles, withStyles } from '@material-ui/core'
import React from 'react'
import { SendCommand } from '../../../key-binding/KeyBinding'

const styles = () => createStyles({
	joystickHolder: {
		height: '6rem',
		width: '6rem',
		backgroundColor: '#111',
		borderRadius: '50%',
		margin: '1rem auto',
	},
	joystick: {
		height: '5rem',
		width: '5rem',
		backgroundColor: '#222',
		borderRadius: '50%',
		margin: '1rem auto',
		position: 'relative',
		top: '0.5rem',
	},
	pressed: {
		backgroundColor: '#999',
	}
})


class Joystick extends React.Component<{
	name: string,
	sendCommand: SendCommand,
	x: number, y: number,
	pressed: boolean,
	classes: any,
}> {
	prevX = 0
	prevY = 0
	prevH = 0
	prevV = 0

	constructor(props: any) {
		super(props)

		this.onDrag = this.onDrag.bind(this)
		this.onSelect = this.onSelect.bind(this)
		this.onUnselect = this.onUnselect.bind(this)
		this.preventScroll = this.preventScroll.bind(this)
	}

	private preventScroll(e: any) {
		e.preventDefault()
	}

	private onSelect(e: React.TouchEvent<HTMLDivElement> | React.DragEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement, MouseEvent>) {
		let x, y
		if (e.type.includes('drag')) {
			const event = e as React.DragEvent<HTMLDivElement>
			x = event.clientX
			y = event.clientY
		} else if (e.type === 'mousedown') {
			const event = e as React.MouseEvent<HTMLDivElement, MouseEvent>
			x = event.screenX
			y= event.screenY

			document.addEventListener('mousemove', this.onDrag)
			document.addEventListener('mouseup', this.onUnselect)
		} else {
			const event = e as React.TouchEvent<HTMLDivElement>

			const touch = event.targetTouches[0]
			x = touch.clientX
			y = touch.clientY
		}
		this.prevX = x
		this.prevY = y

		document.addEventListener('touchmove', this.preventScroll, { passive: false })
		e.preventDefault()
	}

	private onDrag(e: React.TouchEvent<HTMLDivElement> | React.DragEvent<HTMLDivElement> | MouseEvent) {
		let x, y
		if (e.type.includes('drag')) {
			const event = e as React.DragEvent<HTMLDivElement>
			x = event.clientX
			y = event.clientY
		} else if (e.type === 'mousemove') {
			const event = e as MouseEvent
			x = event.screenX
			y = event.screenY
		} else {
			const event = e as React.TouchEvent<HTMLDivElement>

			const touch = event.targetTouches[0]
			x = touch.clientX
			y = touch.clientY
		}
		const scale = 16
		const threshold = 0.01
		const h = Math.min(Math.max((x - this.prevX) / scale, -1), 1)
		const v = Math.min(Math.max((y - this.prevY) / scale, -1), 1)
		if (Math.abs(h - this.prevH) > threshold || Math.abs(v - this.prevV) > threshold) {
			// console.log(`${x - this.prevX} => ${h}, ${y - this.prevY} => ${v}`)
			// TODO Pass the updated controller state. so that multiple buttons can be highlighted.
			this.props.sendCommand(`s ${this.props.name} hv ${h.toFixed(3)} ${v.toFixed(3)}`)
		}
		this.prevH = h
		this.prevV = v
		// e.preventDefault()
	}

	private onUnselect(e: React.TouchEvent<HTMLDivElement> | React.DragEvent<HTMLDivElement> | MouseEvent) {
		this.props.sendCommand(`s ${this.props.name} center`)
		document.removeEventListener('touchmove', this.preventScroll)
		document.removeEventListener('mousemove', this.onDrag)
		e.preventDefault()
	}

	render(): React.ReactNode {
		const { classes, x, y } = this.props
		let joystickHolderClassList = classes.joystickHolder
		let joystickClassList = classes.joystick
		const movedThreshold = 0.15
		if (this.props.pressed) {
			joystickHolderClassList += " " + classes.pressed
		}
		if (Math.abs(x) > movedThreshold || Math.abs(y) > movedThreshold) {
			joystickClassList += " " + classes.pressed
		}

		const styles = {
			transform: `translate(${x * 15}px, ${y * 15}px)`,
		}

		return <div className={joystickHolderClassList}>
			<div className={joystickClassList} style={styles}
				onDragStart={this.onSelect}
				onTouchStart={this.onSelect}
				onMouseDown={this.onSelect}
				onDrag={this.onDrag}
				onTouchMove={this.onDrag}
				onDragEnd={this.onUnselect}
				onTouchEnd={this.onUnselect}>
			</div>
		</div>
	}
}

export default withStyles(styles)(Joystick)