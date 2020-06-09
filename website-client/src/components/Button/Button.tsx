import React from 'react'
import classes from './Button.module.css'

const Button: React.FunctionComponent<any> = (props: any) => {
	let classList = classes.Button
	if (props.button.pressed) classList += " " + classes.Pressed
	return (
		<div className={classList}>
			<h1>{props.button.symbol}</h1>
		</div>
	)
}

export default Button
