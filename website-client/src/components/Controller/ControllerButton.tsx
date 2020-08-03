import { createStyles, withStyles } from '@material-ui/core'
import React from 'react'
import { SendCommand } from '../../key-binding/KeyBinding'
import { ControllerState } from './ControllerState'

const styles = () => createStyles({
})

class ControllerButton extends React.Component<{
	name: string,
	sendCommand: SendCommand,
	controllerState: ControllerState,
	classes: any,
	className: string,
}> {
	constructor(props: any) {
		super(props)

		// this.onDrag = this.onDrag.bind(this)
		// this.onSelect = this.onSelect.bind(this)
		// this.onUnselect = this.onUnselect.bind(this)
		// this.preventScroll = this.preventScroll.bind(this)
	}

	render(): React.ReactNode {
		const { name, sendCommand, controllerState } = this.props
		// TODO Update controllerState so that multiple buttons can be highlighted.
		return <div
			onMouseDown={(e: Event) => {
				sendCommand(`${name} d`)
				e.preventDefault()
			}}
			onTouchStart={(e: Event) => {
				sendCommand(`${name} d`)
				e.preventDefault()
			}}
			onMouseUp={(e: Event) => {
				sendCommand(`${name} u`)
				e.preventDefault()
			}}
			onTouchEnd={(e: Event) => {
				sendCommand(`${name} u`)
				e.preventDefault()
			}}
			{...this.props}
		/>
	}
}

export default withStyles(styles)(ControllerButton)