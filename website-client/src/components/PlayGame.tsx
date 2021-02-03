import { createStyles, withStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Autocomplete from '@material-ui/lab/Autocomplete'
import React from 'react'
import io from 'socket.io-client'
import GamepadBinding from '../key-binding/GamepadBinding'
import KeyboardBinding from '../key-binding/KeyboardBinding'
import Controller from './Controller/Controller'
import { ControllerState } from './Controller/ControllerState'
import { updateState, parseCommand } from './Controller/parse-command'
import MacroRecorder from './Macros/MacroRecorder'
import Macros from './Macros/Macros'

// Can take a Theme as input.
const styles = () => createStyles({
	connectionSection: {
		minHeight: 120,
	},
	serverAddressInput: {
		width: 250,
		maxWidth: '100%'
	},
	controller: {
		marginTop: '10px',
	},
	leftButtons: {
		marginLeft: '15%',
	},
	rightButtons: {
	},
	inputMethodSelect: {
		paddingTop: 20,
		width: 400,
		maxWidth: '100%',
	},
	urlParamsInfo: {
		marginTop: 20,
		marginBottom: 10,
	},
	infoSection: {
		marginTop: '10px',
	},
})

const setupMixedContent = " You may have to enable \"mixed content\" or \"insecure content\" for this connection in your browser's settings if the server your friend is hosting does not have SSL (a link that starts with https). Warning! This is insecure."

class PlayGame extends React.Component<any, any> {
	macroRecorder = new MacroRecorder()

	constructor(props: Readonly<any>) {
		super(props)

		this.checkSendMode = this.checkSendMode.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.handleGamepadConnected = this.handleGamepadConnected.bind(this)
		this.handleGamepadDisconnected = this.handleGamepadDisconnected.bind(this)
		this.handleInputMethodSelection = this.handleInputMethodSelection.bind(this)
		this.onDisconnect = this.onDisconnect.bind(this)
		this.reconnectSwitch = this.reconnectSwitch.bind(this)
		this.sendCommand = this.sendCommand.bind(this)
		this.toggleConnect = this.toggleConnect.bind(this)
		this.toggleSendMode = this.toggleSendMode.bind(this)
		this.updateConnectionStatus = this.updateConnectionStatus.bind(this)

		const controllerState = new ControllerState()
		const inputMethod = new KeyboardBinding(this.sendCommand, controllerState)
		const inputMethodOptions = [
			inputMethod,
		]

		this.state = {
			connectButtonText: "Connect",
			serverAddress: "",
			connectionStatus: undefined,

			isInSendMode: false,
			sendCommandsButtonText: "Start Sending Commands",
			sendModeStatus: undefined,
			status: undefined,

			mixerChannel: undefined,

			socket: undefined,

			inputMethod,
			inputMethodOptions,

			controllerState,
		}
	}

	componentDidMount(): void {
		const queryString = window.location.search
		const urlParams = new URLSearchParams(queryString)

		const serverAddress = urlParams.get('a') || 'http://127.0.0.1:5000'
		const connectNow = urlParams.get('c') === 'true'
		const isInSendMode = urlParams.get('s') === 'true'
		const mixerChannel = urlParams.get('mixerChannel')

		this.setState({
			isInSendMode,
			serverAddress,
			mixerChannel,
		}, () => {
			if (connectNow) {
				this.toggleConnect()
			}
			if (isInSendMode) {
				this.checkSendMode()
			}
		})

		window.addEventListener('gamepadconnected', this.handleGamepadConnected)
		window.addEventListener('gamepaddisconnected', this.handleGamepadDisconnected)
	}

	private handleGamepadConnected(e: any | GamepadEventInit): void {
		console.debug("Gamepad connected at index %d: %s. %d buttons, %d axes.",
			e.gamepad.index, e.gamepad.id,
			e.gamepad.buttons.length, e.gamepad.axes.length)
		this.state.inputMethod.stop()
		const inputMethod = new GamepadBinding(this.sendCommand, this.state.controllerState, e.gamepad)
		const inputMethodOptions = this.state.inputMethodOptions.concat([inputMethod])
		this.setState({
			inputMethod,
			inputMethodOptions,
		}, () => {
			if (this.state.isInSendMode) {
				this.state.inputMethod.start()
			}
		})
	}

	private handleGamepadDisconnected(e: any | GamepadEventInit): void {
		console.debug("Gamepad disconnected at index %d: %s.",
			e.gamepad.index, e.gamepad.id)
		if (this.state.inputMethod && this.state.inputMethod.index === e.gamepad.index) {
			this.state.inputMethod.stop()
		}
		// TODO Remove from input methods.
	}

	private handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({ [event.target.name]: event.target.value })
	}

	private handleInputMethodSelection(event: React.ChangeEvent<any>, newValue: string): void {
		if (this.state.inputMethod !== newValue) {
			this.state.inputMethod.stop()
		}
		this.setState({
			inputMethod: newValue,
		}, () => {
			if (this.state.isInSendMode) {
				this.state.inputMethod.start()
			}
		})
	}

	private updateConnectionStatus(status: string) {
		this.setState({
			connectionStatus: `Connection status: ${status}`
		})
		console.debug(status)
	}

	private onDisconnect() {
		this.updateConnectionStatus("❌ Disconnected")
		if (this.state.socket) {
			// Stop sockets from being kept around and attempting to reconnect when they get disconnected.
			// If we want automatic reconnection then we can just call `toggleConnect` once to start attempting to connect.
			// Once the server has logic to kick clients off after some time, we don't want them to keep attempting to connect by default.
			this.state.socket.destroy()
		}
		this.setState({
			connectButtonText: "Connect",
			socket: undefined,
		})
	}


	private toggleConnect() {
		if (this.state.socket) {
			this.state.socket.disconnect()
			// Call `onDisconnect` here even though it's called `on('disconnect')` because
			// it might not run there if it was never connected.
			this.onDisconnect()
			return
		}
		const address: string = this.state.serverAddress
		const status = `Attempting to connect to "${address}"...${!address.startsWith('https://') ? setupMixedContent : ""}`
		this.updateConnectionStatus(status)
		const socket = io(address)
		this.setState({
			connectButtonText: "Cancel connection attempt",
			socket,
		}, () => {
			socket.on('connect', () => {
				this.updateConnectionStatus("✅ Connected")
				this.setState({
					connectButtonText: "Disconnect",
				})
			})

			socket.on('disconnect', this.onDisconnect)

			socket.on('json', (data: any) => {
				console.debug(data)
			})
		})
	}

	/**
	 * @param command The command the execute.
	 * @param controllerState The current state of the controller. If `undefined`, then the states for the `command` will be automatically determined but the UI might not look right if this method is called concurrently.
	 * @param updateGivenState If `true`, then the passed in state should be updated. Defaults to `false`.
	 */
	// Matches the SendCommand interace.
	private sendCommand(command: string, controllerState?: ControllerState,
		updateGivenState = false) {
		if (command && this.state.socket && this.state.isInSendMode) {
			this.state.socket.emit('p', command)
		}

		// Controller and key bindings should send the state since it should be easy for them to compute it.
		// Running commands from a macro might not send the state.
		if (controllerState !== undefined) {
			if (updateGivenState) {
				updateState(command, controllerState)
			}
			this.setState({
				controllerState,
			})
		} else {
			const controllerStates = parseCommand(command)
			for (let i = 0; i < controllerStates.length; ++i) {
				setTimeout(() => {
					this.setState({
						controllerState: controllerStates[i],
					})
				}, i * 100)
			}
		}
		this.macroRecorder.add(command)
	}

	private toggleSendMode() {
		this.setState({
			isInSendMode: !this.state.isInSendMode
		}, () => {
			this.checkSendMode()
		})
	}

	private checkSendMode() {
		if (this.state.isInSendMode) {
			this.state.inputMethod.start()
			this.setState({
				sendModeStatus: "Send mode: ✅ Enabled",
				sendCommandsButtonText: "Stop Sending Commands",
			})
		} else {
			this.state.inputMethod.stop()
			this.setState({
				sendModeStatus: "Send mode: ❌ Disabled",
				sendCommandsButtonText: "Start Sending Commands",
			})
		}
	}

	private reconnectSwitch() {
		if (!this.state.socket || !this.state.socket.connected) {
			// Should not be possible to get in here since the UI should check it.
			return
		}
		this.state.socket.emit('reconnectController')
	}

	render(): React.ReactNode {
		const { classes } = this.props

		return (<Container>
			<Grid className={classes.connectionSection} container spacing={3}>
				<Grid item xs={12} sm={6}>
					<TextField className={classes.serverAddressInput} label="Server Address" name="serverAddress" value={this.state.serverAddress} onChange={this.handleChange} />
					<Button variant="contained" onClick={this.toggleConnect}
						style={{ backgroundColor: this.state.socket ? red[500] : green[500] }}>
						{this.state.connectButtonText}
					</Button>
					<Typography component="p">
						{this.state.connectionStatus}
					</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Button variant="contained" onClick={this.toggleSendMode} disabled={!this.state.socket || !this.state.socket.connected}
						style={{ backgroundColor: this.state.isInSendMode ? red[500] : green[500] }}>
						{this.state.sendCommandsButtonText}
					</Button>
					<Typography component="p">{this.state.sendModeStatus}</Typography>
					<Typography component="p">{this.state.status}</Typography>
				</Grid>
				{/* The server code for reconnecting doesn't work yet.
				There are details in server.py. */}
				<Grid item xs={12} sm={6} hidden>
					<Typography component="p">Click this button if you want to attempt to redo the pairing of the simulated controller and the Switch.</Typography>
					<Button variant="contained" onClick={this.reconnectSwitch} disabled={!this.state.socket || !this.state.socket.connected}>
						Reconnect Switch
					</Button>
				</Grid>
			</Grid>

			<Typography component="p">
				To use a controller, either select it from the list below or
				connect it to this device and then press any button on it.
			</Typography>
			<Autocomplete
				className={classes.inputMethodSelect}
				id="input-method"
				openOnFocus
				disableClearable
				value={this.state.inputMethod}
				options={this.state.inputMethodOptions || []}
				getOptionLabel={(option: any) => option.getName()}
				onChange={this.handleInputMethodSelection}
				renderInput={(params) => <TextField {...params} label="Input Method" variant="outlined" />}
			/>

			<div className={classes.controller}>
				{this.state.inputMethod.getName() === 'Keyboard' &&
					<div>
						<Typography component="p">
							Keyboard Controls
						</Typography>
						<Typography component="p">
							{"You can click/tap/drag the buttons/sticks below or use these mapped keys:"}
						</Typography>
						<Grid container>
							<Grid className={classes.leftButtons} item container direction="column" xs={4}>
								<Grid item>L: Q, ZL: Shift+Q</Grid>
								<Grid item>-: Z</Grid>
								<Grid item>Left Control Stick: WASD</Grid>
								<Grid item>Arrows: Shift+WASD</Grid>
								<Grid item>Capture: C</Grid>
							</Grid>
							<Grid item container direction="column" xs></Grid>
							<Grid className={classes.rightButtons} item container direction="column" xs={4}>
								<Grid item>R: E, ZR: Shift+E</Grid>
								<Grid item>+: X</Grid>
								<Grid item>X: ▲, Y: ◀, B:▼, A:▶</Grid>
								<Grid item>Right Stick: Shift+▲◀▼▶</Grid>
								<Grid item>Home: V</Grid>
							</Grid>
						</Grid>
					</div>}
				<Controller controllerState={this.state.controllerState}
					sendCommand={this.sendCommand}
					videoStreamProps={{
						mixerChannel: this.state.mixerChannel,
					}} />
			</div>
			<Macros macroRecorder={this.macroRecorder} sendCommand={this.sendCommand} />
			<div className={classes.urlParamsInfo}>
				<Typography variant="h3" >URL Parameters for this page</Typography>
				<Typography component="p">
					a: The server address of the host that will send commands to the Switch.
				</Typography>
				<Typography component="p">
					{"c: Use \"c=true\" to connect to the server automatically."}
					{"Defaults to \"c=false\" to not connect to the server automatically."}
				</Typography>
				<Typography component="p">
					{"s: Use \"s=true\" to enable sending commands automatically."}
					{"Defaults to \"s=false\" to not automatically send commands."}
				</Typography>
				<Typography component="p">
					{"leftStickDeadzone/rightStickDeadzone: Use \"leftStickDeadzone=0.1\" and/or \"rightStickDeadzone=0.1\"to configure size of the deadzone when using a gaming controller."}
					{"This helps prevent drift."}
					{"0 means no deadzone. 1 means the entire space is a deadzone."}
					{"Defaults to 0."}
				</Typography>
				<Typography component="p">
					mixerChannel: The channel name for a Mixer stream to start playing.
				</Typography>
			</div>
			<div className={classes.infoSection}>
				<Typography component="p">
					The original source code for this site can be found at <Link href="https://github.com/juharris/switch-remoteplay" target="_blank">https://github.com/juharris/switch-remoteplay</Link>.
				</Typography>
			</div>
		</Container >)
	}
}

export default withStyles(styles)(PlayGame)
