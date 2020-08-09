import { createStyles, withStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import Snackbar from '@material-ui/core/Snackbar'
import { Theme } from '@material-ui/core/styles'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import CancelIcon from '@material-ui/icons/Cancel'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import EditIcon from '@material-ui/icons/Edit'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import SaveIcon from '@material-ui/icons/Save'
import MuiAlert, { AlertProps, Color as ToastColor } from '@material-ui/lab/Alert'
import React from 'react'
import { SendCommand } from '../../key-binding/KeyBinding'
import MacroRecorder from './MacroRecorder'


const styles = (theme: Theme) => createStyles({
	macrosContainer: {
		alignItems: 'stretch',
	},
	macroName: {
		marginLeft: '20px',
		marginBottom: '1em',
	},
	macroCode: {
		whiteSpace: 'pre-wrap',
		wordWrap: 'break-word',
	},
	macroText: {
		backgroundColor: '#222',
		color: '#ddd',
		width: '90%',
		marginLeft: '20px',
	},
	macroItem: {
	},
	macroCard: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
	},
	cardContent: {
		// To keep the card buttons at the bottom of the card.
		display: 'flex',
		flex: '1 0 auto',
		flexDirection: 'column',
	},
	macroCardActions: {
		display: 'flex',
	},
	toast: {
		width: '100%',
		'& > * + *': {
			marginTop: theme.spacing(2),
		},
	},
})

function Alert(props: AlertProps) {
	return <MuiAlert elevation={6} variant="filled" {...props} />
}

class SavedMacro {
	constructor(
		public id: string,
		public name: string,
		public macro: string[]) { }
}

class Macros extends React.Component<{
	macroRecorder: MacroRecorder,
	sendCommand: SendCommand,
	classes: any,
}, any> {
	private db?: IDBDatabase

	constructor(props: any) {
		super(props)

		this.state = {
			isRecording: false,
			macroExists: false,

			isToastOpen: false,
			toastMessage: "",
			toastSeverity: "",

			macroName: "",
			editMacro: "",

			savedMacros: [],
		}

		this.addMacro = this.addMacro.bind(this)
		this.cancelEditMacro = this.cancelEditMacro.bind(this)
		this.closeToast = this.closeToast.bind(this)
		this.deleteMacro = this.deleteMacro.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.openToast = this.openToast.bind(this)
		this.playMacro = this.playMacro.bind(this)
		this.playLastRecordedMacro = this.playLastRecordedMacro.bind(this)
		this.saveMacro = this.saveMacro.bind(this)
		this.startRecording = this.startRecording.bind(this)
		this.stopRecording = this.stopRecording.bind(this)
	}

	componentDidMount() {
		const indexedDB = window.indexedDB
		const request = indexedDB.open('macros', 1)
		request.onerror = (event: Event) => {
			this.openToast("Could not open the macro database. See the Console for more details.", 'error')
			console.error("Could not open the macro database.")
			console.error(event)
		}

		request.onupgradeneeded = function (event: Event) {
			const db: IDBDatabase = (event?.target as any).result
			db.createObjectStore('macro', { keyPath: 'id', autoIncrement: true, })
		}

		request.onsuccess = (event: Event) => {
			this.db = (event?.target as any).result

			this.loadSavedMacros()
		}
	}

	private openToast(toastMessage: string, toastSeverity: ToastColor): void {
		this.setState({
			isToastOpen: true,
			toastMessage,
			toastSeverity,
		})
	}

	private closeToast(event?: React.SyntheticEvent, reason?: string) {
		if (reason === 'clickaway') {
			return
		}

		this.setState({
			isToastOpen: false,
		})
	}

	private loadSavedMacros() {
		if (this.db === undefined) {
			// Shouldn't happen.
			this.openToast("Error loading macros. See the Console for more details.", 'error')
			console.error("The macro database has not been loaded yet. Please try again.")
			return
		}
		const transaction = this.db.transaction('macro', 'readonly')
		transaction.onerror = (event: Event) => {
			this.openToast("Error loading macros. See the Console for more details.", 'error')
			console.error(event)
		}
		const dataStore = transaction.objectStore('macro')
		const getRequest = dataStore.getAll()
		getRequest.onerror = (event: Event) => {
			this.openToast("Error loading macros. See the Console for more details.", 'error')
			console.error(event)
		}

		getRequest.onsuccess = () => {
			this.setState({
				savedMacros: getRequest.result,
			})
		}
	}

	private handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		this.setState({ [event.target.name]: event.target.value })
	}

	private startEditingMacro(id: string | undefined, name: string, macro: string[]) {
		this.setState({
			editMacroId: id,
			macroName: name,
			editMacro: JSON.stringify(macro, null, 4),
		})
	}

	private addMacro(): void {
		this.startEditingMacro(undefined, "", ["a d", "wait 350", "a u"])
	}

	private parseMacro(macro: string): string[] {
		// More validation and cleaning can be done here.
		macro = macro.replace(/'/g, "\"")
		return JSON.parse(macro)
	}

	private saveMacro(): void {
		let macro: string[]
		try {
			macro = this.parseMacro(this.state.editMacro)
		} catch (err) {
			this.openToast("The macro is invalid. See the Console for more details.", 'error')
			console.error("Invalid macro:")
			console.error(err)
			return
		}
		const name = this.state.macroName

		if (this.db === undefined) {
			this.openToast("The macro database has not been loaded yet. Please try again.", 'error')
			console.error("The macro database has not been loaded yet. Please try again.")
			return
		}

		const transaction = this.db.transaction('macro', 'readwrite')
		transaction.onerror = (event: Event) => {
			this.openToast("Error saving the macro. See the Console for more details.", 'error')
			console.error(event)
		}
		const dataStore = transaction.objectStore('macro')
		let request
		if (this.state.editMacroId !== undefined) {
			request = dataStore.put({
				id: this.state.editMacroId,
				name,
				macro,
			})
		} else {
			request = dataStore.add({
				name,
				macro,
			})
		}
		request.onerror = (event: Event) => {
			this.openToast("Error saving the macro. See the Console for more details.", 'error')
			console.error(event)
		}
		request.onsuccess = () => {
			this.loadSavedMacros()
			this.setState({
				macroName: "",
				editMacro: "",
			})
			this.openToast("Saved", 'success')
		}
	}

	private deleteMacro(macroId: string): void {
		if (this.db === undefined) {
			this.openToast("The macro database has not been loaded yet. Please try again.", 'error')
			console.error("The macro database has not been loaded yet. Please try again.")
			return
		}

		const transaction = this.db.transaction('macro', 'readwrite')
		transaction.onerror = (event: Event) => {
			this.openToast("Error deleting the macro. See the Console for more details.", 'error')
			console.error(event)
		}
		const dataStore = transaction.objectStore('macro')
		const deleteRequest = dataStore.delete(macroId)
		deleteRequest.onerror = (event: Event) => {
			this.openToast("Error deleting the macro. See the Console for more details.", 'error')
			console.error(event)
		}
		deleteRequest.onsuccess = () => {
			this.loadSavedMacros()
			this.cancelEditMacro()
			this.openToast("Deleted the macro", 'info')
		}
	}

	private cancelEditMacro(): void {
		this.setState({
			editMacro: ""
		})
	}

	private startRecording(): void {
		this.setState({ isRecording: true })
		this.props.macroRecorder.start()
		this.openToast("Recording macro", 'info')
	}

	private stopRecording(): void {
		this.props.macroRecorder.stop()
		this.startEditingMacro(undefined, "", this.props.macroRecorder.currentRecording)
		this.setState({ isRecording: false, macroExists: true, })
		this.openToast("Stopped recording macro", 'info')
	}

	async sleep(sleepMillis: number) {
		return new Promise(resolve => setTimeout(resolve, sleepMillis))
	}

	async playMacro(macro: string[]) {
		this.openToast("Playing macro", 'info')
		// TODO Keep a controller state and update it.
		// Can't just call `updateState` since a macro could have a putton tap that `updateState` does not handle.
		for (const command of macro) {
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
		this.openToast("Done playing macro", 'info')
	}

	async playLastRecordedMacro(): Promise<void> {
		return this.playMacro(this.props.macroRecorder.currentRecording)
	}

	render(): React.ReactNode {
		const { classes } = this.props

		return <div>
			<Snackbar open={this.state.isToastOpen} autoHideDuration={6000} onClose={this.closeToast}>
				<Alert onClose={this.closeToast} severity={this.state.toastSeverity}>
					{this.state.toastMessage}
				</Alert>
			</Snackbar>
			<Typography variant="h3">Macros</Typography>
			<Grid container>
				<Grid item>
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
							<PlayArrowIcon />
						</Button>
					</Tooltip>
				</Grid>
			</Grid>
			<div hidden={this.state.editMacro === ""}>
				<Typography component="p">
					Write a macro below.
					The latest supported commands can be found <Link target="_blank" href="https://github.com/juharris/switch-remoteplay/blob/master/server/README.md#api">here</Link>.
				</Typography>
				<Typography component="p">
					The macro should be a valid <Link target="_blank" href="https://www.json.org">JSON list</Link>.
					For example:
				</Typography>
				<pre className={classes.macroCode}>{'["s l up", "wait 200", "a d", "wait 350", "a u", "wait 200", "s l center"]'}</pre>
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
					<Grid item hidden={this.state.editMacroId === undefined}>
						<Tooltip title="Delete this macro" placement="top" >
							<Button
								id="delete-macro" onClick={() => this.deleteMacro(this.state.editMacroId)}>
								<DeleteForeverIcon style={{ color: red[500] }} />
							</Button>
						</Tooltip>
					</Grid>
					<Grid item>
						<Tooltip title="Save macro" placement="top" >
							<Button color="primary"
								id="save-macro" onClick={this.saveMacro}>
								<SaveIcon style={{ color: green[500] }} />
							</Button>
						</Tooltip>
					</Grid>
				</Grid>
			</div>
			<Grid container spacing={1} className={classes.macrosContainer}>
				{this.state.savedMacros.map((savedMacro: SavedMacro) => {
					const maxLength = 90
					let macroText = JSON.stringify(savedMacro.macro)
					if (macroText.length > maxLength) {
						macroText = macroText.slice(0, maxLength - 10) + "..."
					}
					return <Grid item key={savedMacro.id}
						className={classes.macroItem}
						xs={12} sm={4} md={3}>
						<Card className={classes.macroCard}>
							<CardContent className={classes.cardContent}>
								<Typography variant="h5" component="h5">
									{savedMacro.name}
								</Typography>
								<pre color="textSecondary" className={classes.macroCode}>{macroText}</pre>
								{/* <Typography component="p" color="textSecondary">
								</Typography> */}
							</CardContent>
							<CardActions className={classes.macroCardActions}>
								<Tooltip title="Edit macro" placement="top" >
									<Button
										id={`edit-${savedMacro.id}`}
										onClick={() => this.startEditingMacro(savedMacro.id, savedMacro.name, savedMacro.macro)}>
										<EditIcon />
									</Button>
								</Tooltip>
								<Tooltip title="Play macro" placement="top" >
									<Button
										// The id is not used but it's helpful for writing
										// meta-macros and loops to press in the browser's console.
										id={`play-${savedMacro.id}`}
										onClick={() => this.playMacro(savedMacro.macro)}>
										<PlayArrowIcon />
									</Button>
								</Tooltip>
							</CardActions>
						</Card>
					</Grid>
				}
				)}
			</Grid>
		</div>
	}
}

export default withStyles(styles)(Macros)
