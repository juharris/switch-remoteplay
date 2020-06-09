import { createStyles, withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { SendCommand } from '../../key-binding/KeyBinding';
import { ControllerState } from '../Controller/ControllerState';
import MacroRecorder from './MacroRecorder';

const styles = () => createStyles({
})

class Macros extends React.Component<{
	macroRecorder: MacroRecorder,
	sendCommand: SendCommand,
}, any> {
	constructor(props: any) {
		super(props)

		this.state = {
			isRecording: false,
			macroExists: false,
		}

		this.playLastRecordedMacro = this.playLastRecordedMacro.bind(this)
		this.startRecording = this.startRecording.bind(this)
		this.stopRecording = this.stopRecording.bind(this)
	}

	startRecording(): void {
		this.setState({ isRecording: true })
		this.props.macroRecorder.start()
	}

	stopRecording(): void {
		this.props.macroRecorder.stop()
		this.setState({ isRecording: false, macroExists: true, })
	}

	async sleep(sleepMillis: number) {
		return new Promise(resolve => setTimeout(resolve, sleepMillis));
	}

	async playLastRecordedMacro(): Promise<void> {
		for (const c of this.props.macroRecorder.currentRecording) {
			const { command, controllerState } = c
			const m = /wait (\d+)/.exec(command)
			if (m) {
				const sleepMillis = parseInt(m[1])
				if (sleepMillis > 100) {
					const s = Date.now()
					await this.sleep(sleepMillis)
				}
			} else {
				this.props.sendCommand(command, controllerState)
			}
		}
	}

	render(): React.ReactNode {
		return <div>
			<Typography variant="h3">Macros</Typography>
			<Grid container>
				<Grid item hidden={this.state.isRecording}>
					<Tooltip title="Start recording a macro" placement="top">
						<Button onClick={this.startRecording}>
							<span role='img' aria-label="Start recording a macro">🔴</span>
						</Button>
					</Tooltip>
				</Grid>
				<Grid item hidden={!this.state.isRecording}>
					<Tooltip title="Stop recording the macro" placement="top" >
						<Button onClick={this.stopRecording}>
							<span role='img' aria-label="Stop recording the macro">⬛</span>
						</Button>
					</Tooltip>
				</Grid>
				<Grid item hidden={!this.state.macroExists}>
					<Tooltip title="Play the last macro recorded" placement="top" >
						<Button onClick={this.playLastRecordedMacro}>
							<span role='img' aria-label="Play the last macro recorded">▶</span>
						</Button>
					</Tooltip>
				</Grid>
			</Grid>
		</div>
	}
}

export default withStyles(styles)(Macros)
