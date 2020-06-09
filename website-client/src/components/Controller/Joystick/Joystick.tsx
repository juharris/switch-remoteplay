import React from 'react'
import classes from './Joystick.module.css'

const Joystick: React.FunctionComponent<any> = (props: any) => {
	let joystickHolderClassList = classes.joystickHolder
	let joystickClassList = classes.joystick
	const movedThreshold = 0.15
	if (props.pressed) {
		joystickHolderClassList += " " + classes.pressed
	}
	if (Math.abs(props.x) > movedThreshold || Math.abs(props.y) > movedThreshold) {
		joystickClassList += " " + classes.pressed
	}

	const styles = {
		transform: `translate(${props.x * 15}px, ${props.y * 15}px)`,
	}
	return <div className={joystickHolderClassList}>
		<div className={joystickClassList} style={styles}>
		</div>
	</div>
}

export default Joystick