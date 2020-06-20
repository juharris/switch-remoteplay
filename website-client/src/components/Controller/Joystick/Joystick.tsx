import { createStyles, withStyles } from '@material-ui/core'
import React from 'react'

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

const Joystick: React.FunctionComponent<any> = (props: any) => {
	const { classes } = props
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

export default withStyles(styles)(Joystick)