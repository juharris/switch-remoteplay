import { createStyles, withStyles } from '@material-ui/core'
import React from 'react'
import { SendCommand } from '../../key-binding/KeyBinding'
import { ControllerState } from './ControllerState'
import { updateState } from './parse-command'

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

		this.onSelect = this.onSelect.bind(this)
		this.onUnselect = this.onUnselect.bind(this)
	}

	private onSelect(e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) {
		const { name, sendCommand, controllerState } = this.props
		const singleCommand = `${name} d`
		updateState(singleCommand, controllerState)
		sendCommand(singleCommand, controllerState)
		e.preventDefault()

	}
	private onUnselect(e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) {
		const { name, sendCommand, controllerState } = this.props
		const singleCommand = `${name} u`
		updateState(singleCommand, controllerState)
		sendCommand(singleCommand, controllerState)
		e.preventDefault()
	}

	render(): React.ReactNode {
		return <div
			className={this.props.className}
			onMouseDown={this.onSelect}
			onTouchStart={this.onSelect}
			onMouseUp={this.onUnselect}
			onTouchEnd={this.onUnselect}
		>
			{this.props.children}
		</div>
	}
}

export default withStyles(styles)(ControllerButton)