import { createStyles, withStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import SaveIcon from '@material-ui/icons/Save'
import React from 'react'
import { SendCommand } from '../../key-binding/KeyBinding'
import MacroRecorder from './MacroRecorder'

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

			editMacro: "",
		}

		this.addMacro = this.addMacro.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.playLastRecordedMacro = this.playLastRecordedMacro.bind(this)
		this.saveMacro = this.saveMacro.bind(this)
		this.startRecording = this.startRecording.bind(this)
		this.stopRecording = this.stopRecording.bind(this)
	}


	private handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({ [event.target.name]: event.target.value })
	}

	addMacro(): void {
		this.setState({
			editMacro: "[]"
		})
	}

	saveMacro(): void {
		// TODO Save this.state.editMacro
		this.setState({
			editMacro: ""
		})
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
		return new Promise(resolve => setTimeout(resolve, sleepMillis))
	}

	async playLastRecordedMacro(): Promise<void> {
		for (const command of this.props.macroRecorder.currentRecording) {
			const m = /wait (\d+)/.exec(command)
			if (m) {
				const sleepMillis = parseInt(m[1])
				if (sleepMillis > 5) {
					await this.sleep(sleepMillis)
				}
			} else {
				this.props.sendCommand(command)
			}
		}
	}

	render(): React.ReactNode {
		return <div>
			<Typography variant="h3">Macros</Typography>
			<Grid item hidden={!this.state.macroExists}>
				<Tooltip title="Create a new macro" placement="top" >
					<Button
						id="add-macro" onClick={this.addMacro}>
						<AddIcon />
					</Button>
				</Tooltip>
			</Grid>
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
						<Button
							// The id is not used but it's helpful for writing meta-macros and loops to press in the browser's console.
							id="play-macro" onClick={this.playLastRecordedMacro}>
							<span role='img' aria-label="Play the last macro recorded">▶</span>
						</Button>
					</Tooltip>
				</Grid>
			</Grid>
			<div hidden={this.state.editMacro === ""}>
				{/* TODO Get Macro name */}
				<TextareaAutosize name="editMacro" value={this.state.editMacro} aria-label="Macro" onChange={this.handleChange} />
				<Tooltip title="Save macro" placement="top" >
					<Button
						id="save-macro" onClick={this.saveMacro}>
						<SaveIcon />
					</Button>
				</Tooltip>
			</div>
			{/* TODO List saved macros. */}
		</div>
	}
}

export default withStyles(styles)(Macros)
