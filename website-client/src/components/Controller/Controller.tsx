import { createStyles, withStyles } from '@material-ui/core'
import React from 'react'
import Diamond from '../Diamond/Diamond'
import VideoStream from '../VideoStream'
import cssClasses from './Controller.module.css'
import { ControllerState } from './ControllerState'
import Joystick from './Joystick/Joystick'

const styles = () => createStyles({
	controller: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
	},
})

class Controller extends React.Component<any> {
	render(): React.ReactNode {
		const { classes } = this.props
		const controllerState: ControllerState | undefined = this.props.controllerState

		return (
			<div className={classes.controller}>
				<div>
					<div>
						<div
							className={
								cssClasses.LargeButton +
								(controllerState?.l?.isPressed ? " " + cssClasses.Pressed : "")
							}
						>
							<p>L</p>
						</div>
						<div className={cssClasses.Row}>
							<div
								className={
									cssClasses.SmallButton +
									(controllerState?.zl?.isPressed ? " " + cssClasses.Pressed : "")
								}
							>
								<p>ZL</p>
							</div>
							<div
								className={
									cssClasses.Symbol +
									(controllerState?.minus?.isPressed ? " " + cssClasses.PressedAlt : "")
								}
							>
								{/* Slightly wider than a typical minus. */}
								<p>–</p>
							</div>
						</div>
					</div>
					<Joystick
						x={controllerState?.leftStick?.horizontalValue || 0}
						y={controllerState?.leftStick?.verticalValue || 0}
						pressed={controllerState?.leftStick?.isPressed}
					/>
					<Diamond
						buttons={[
							{ symbol: "▶", pressed: controllerState?.arrowRight?.isPressed },
							{ symbol: "▼", pressed: controllerState?.arrowDown?.isPressed },
							{ symbol: "▲", pressed: controllerState?.arrowUp?.isPressed },
							{ symbol: "◀", pressed: controllerState?.arrowLeft?.isPressed },
						]}
					/>
					<div
						className={
							cssClasses.Symbol + " " + cssClasses.capture +
							(controllerState?.capture?.isPressed ? " " + cssClasses.PressedAlt : "")
						}
					>
						<p>■</p>
					</div>
				</div>
				<div className={cssClasses.Middle}>
					<VideoStream {...this.props.videoStreamProps} />
				</div>
				<div>
					<div>
						<div
							className={
								cssClasses.LargeButton +
								(controllerState?.r?.isPressed ? " " + cssClasses.Pressed : "")
							}
						>
							<p>R</p>
						</div>
						<div className={cssClasses.Row}>
							<div
								className={
									cssClasses.Symbol +
									(controllerState?.plus?.isPressed ? " " + cssClasses.PressedAlt : "")
								}
							>
								<p>+</p>
							</div>
							<div
								className={
									cssClasses.SmallButton +
									(controllerState?.zr?.isPressed ? " " + cssClasses.Pressed : "")
								}
							>
								<p>ZR</p>
							</div>
						</div>
					</div>
					<Diamond
						buttons={[
							{ symbol: "a", pressed: controllerState?.a?.isPressed },
							{ symbol: "b", pressed: controllerState?.b?.isPressed },
							{ symbol: "x", pressed: controllerState?.x?.isPressed },
							{ symbol: "y", pressed: controllerState?.y?.isPressed },
						]}
					/>
					<Joystick
						x={controllerState?.rightStick?.horizontalValue || 0}
						y={controllerState?.rightStick?.verticalValue || 0}
						pressed={controllerState?.rightStick?.isPressed}
					/>
					<div
						className={
							cssClasses.Symbol + " " + cssClasses.home +
							(controllerState?.home?.isPressed ? " " + cssClasses.PressedAlt : "")
						}
					>
						<p>●</p>
					</div>
				</div>
			</div>
		)
	}
}

export default withStyles(styles)(Controller)
