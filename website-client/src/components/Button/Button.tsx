import React from 'react'
import ControllerButton from '../Controller/ControllerButton'
import classes from './Button.module.css'

const Button: React.FunctionComponent<any> = (props: any) => {
	let classList = classes.Button
	if (props.button.pressed) {
		classList += " " + classes.Pressed
	}
	return <ControllerButton
		name={props.button.name} sendCommand={props.button.sendCommand}
		className={classList}>
		<h1>{props.button.symbol}</h1>
	</ControllerButton>
}

export default Button
