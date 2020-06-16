import { createStyles, withStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CancelIcon from '@material-ui/icons/Cancel'
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
	macroName: {
		marginLeft: '20px',
		marginBottom: '1em',
	},
	macroText: {
		backgroundColor: '#222',
		color: '#ddd',
		width: '90%',
		marginLeft: '20px',
	},
})

class Macros extends React.Component<{
	macroRecorder: MacroRecorder,
	sendCommand: SendCommand,
	classes: any,
}, any> {
	constructor(props: any) {
		super(props)

		this.state = {
			isRecording: false,
			macroExists: false,

			macroName: "",
			editMacro: "",

			savedMacros: [],
		}

		this.addMacro = this.addMacro.bind(this)
		this.cancelEditMacro = this.cancelEditMacro.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.playLastRecordedMacro = this.playLastRecordedMacro.bind(this)
		this.saveMacro = this.saveMacro.bind(this)
		this.startRecording = this.startRecording.bind(this)
		this.stopRecording = this.stopRecording.bind(this)
	}

	componentDidMount() {
		// TODO Load saved macros.
	}

	private handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		this.setState({ [event.target.name]: event.target.value })
	}

	addMacro(): void {
		this.setState({
			macroName: "",
			editMacro: "[]"
		})
	}

	saveMacro(): void {
		// TODO Validate name and macro
		// TODO Save this.state.editMacro
		// See https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB

		// TODO Handle names for other browsers (from https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
		const indexedDB = window.indexedDB
		const IDBTransaction = window.IDBTransaction
		const IDBKeyRange = window.IDBKeyRange

		const request = indexedDB.open('macros', 1);
		request.onerror = function (event: Event) {
			console.error("Could not open the macro database.")
			console.error(event)
		}
		const macro = JSON.parse(this.state.editMacro)
		request.onsuccess = (event: Event) => {
			const db: IDBDatabase = (event?.target as any).result
			const transaction = db.transaction('macro', 'readwrite')
			// TODO
			// transaction.onerror = reject
			const dataStore = transaction.objectStore('macro')
			const request = dataStore.add({
				id: 'TODO Make new id',
				macro: JSON.parse(macro)
			})
			// request.onerror = reject
			request.onsuccess = () => {
				this.setState({
					editMacro: ""
				})
			}
		}

		request.onupgradeneeded = function (event: Event) {
			const db: IDBDatabase = (event?.target as any).result
			db.createObjectStore('macro', { keyPath: 'id' })
		}
	}

	cancelEditMacro(): void {
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
		const { classes } = this.props

		return <div>
			<Typography variant="h3">Macros</Typography>
			<Grid container>
				<Grid item >
					<Tooltip title="Create a new macro" placement="top" >
						<Button
							id="add-macro" onClick={this.addMacro}>
							<AddIcon />
						</Button>
					</Tooltip>
				</Grid>
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
				<div>
					<TextField className={classes.macroName} label="Macro Name" name="macroName" value={this.state.macroName} onChange={this.handleChange} />
				</div>
				<div>
					<TextareaAutosize className={classes.macroText} name="editMacro" value={this.state.editMacro} aria-label="Macro" onChange={this.handleChange} />
				</div>
				<Grid container>
					<Grid item>
						<Tooltip title="Cancel editting macro" placement="top" >
							<Button
								id="cancel-edit-macro" onClick={this.cancelEditMacro}>
								<CancelIcon />
							</Button>
						</Tooltip>
					</Grid>
					<Grid item>
						<Tooltip title="Save macro" placement="top" >
							<Button
								id="save-macro" onClick={this.saveMacro}>
								<SaveIcon />
							</Button>
						</Tooltip>
					</Grid>
				</Grid>
			</div>
			{/* TODO List saved macros. */}
		</div>
	}
}

export default withStyles(styles)(Macros)
