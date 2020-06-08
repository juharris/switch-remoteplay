import React from 'react'
import classes from './Joystick.module.css'

const Joystick: React.FunctionComponent<any> = (props: any) => {
	let classList = classes.Joystick
	if (props.pressed) classList += " " + classes.Pressed
	const styles = {
		transform: `translate(${props.x * 15}px, ${props.y * 15}px)`,
	}
	return <div className={classList} style={styles}></div>
}

export default Joystick