import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import io from 'socket.io-client'
import { createStyles, withStyles } from '@material-ui/core'

const maxStick = 'max'
const minStick = 'min'
const centerStick = 'center'
const actions = {
	// Left Stick
	leftStickFullLeft: {
		down: `s l h ${minStick}`,
		up: `s l h ${centerStick}`,
	},
	leftStickFullRight: {
		down: `s l h ${maxStick}`,
		up: `s l h ${centerStick}`,
	},
	leftStickFullUp: {
		down: `s l v ${maxStick}`,
		up: `s l v ${centerStick}`,
	},
	leftStickFullDown: {
		down: `s l v ${minStick}`,
		up: `s l v ${centerStick}`,
	},

	// Right Stick
	rightStickFullLeft: {
		down: `s r h ${minStick}`,
		up: `s r h ${centerStick}`,
	},
	rightStickFullRight: {
		down: `s r h ${maxStick}`,
		up: `s r h ${centerStick}`,
	},
	rightStickFullUp: {
		down: `s r v ${maxStick}`,
		up: `s r v ${centerStick}`,
	},
	rightStickFullDown: {
		down: `s r v ${minStick}`,
		up: `s r v ${centerStick}`,
	},

	// Arrows
	arrowLeft: {
		down: 'left d',
		up: 'left u',
	},
	arrowRight: {
		down: 'right d',
		up: 'right u',
	},
	arrowUp: {
		down: 'up d',
		up: 'up u',
	},
	arrowDown: {
		down: 'down d',
		up: 'down u',
	},

	b: {
		down: 'b d',
		up: 'b u',
	},
	x: {
		down: 'x d',
		up: 'x u',
	},
	y: {
		down: 'y d',
		up: 'y u',
	},
	a: {
		down: 'a d',
		up: 'a u',
	},

	l: {
		down: 'l d',
		up: 'l u',
	},
	zl: {
		down: 'zl d',
		up: 'zl u',
	},
	r: {
		down: 'r d',
		up: 'r u',
	},
	zr: {
		down: 'zr d',
		up: 'zr u',
	},

	minus: {
		down: 'minus d',
		up: 'minus u',
	},
	plus: {
		down: 'plus d',
		up: 'plus u',
	},

	capture: {
		down: 'capture d',
		up: 'capture u',
	},
	home: {
		down: 'home d',
		up: 'home u',
	},
}

const keyMap: any = {
	KeyW: actions.leftStickFullUp,
	KeyS: actions.leftStickFullDown,
	KeyA: actions.leftStickFullLeft,
	KeyD: actions.leftStickFullRight,

	ArrowLeft: actions.y,
	ArrowRight: actions.a,
	ArrowUp: actions.x,
	ArrowDown: actions.b,

	LeftClick: actions.a,
	Space: actions.b,

	KeyQ: actions.l,
	KeyE: actions.r,
	ShiftLeft: {
		isDown: false,
	},
	ShiftRight: {
		isDown: false,
	},

	KeyZ: actions.minus,
	KeyX: actions.plus,

	KeyC: actions.capture,
	KeyV: actions.home,
}

const shiftKeyMap = {
	KeyA: actions.arrowLeft,
	KeyD: actions.arrowRight,
	KeyW: actions.arrowUp,
	KeyS: actions.arrowDown,

	KeyQ: actions.zl,
	KeyE: actions.zr,

	// These used to be activated when Ctrl was pressed
	// but that could cause someone to activate other commands which might close the window.
	ArrowUp: actions.rightStickFullUp,
	ArrowDown: actions.rightStickFullDown,
	ArrowLeft: actions.rightStickFullLeft,
	ArrowRight: actions.rightStickFullRight,
}

// Can take a Theme as input.
const styles = () => createStyles({
	controller: {
		marginTop: '10px',
	},
	leftButtons: {
		marginLeft: '15%',
	},
	rightButtons: {
	}
})

class PlayGame extends React.Component<any, any> {
	constructor(props: Readonly<any>) {
		super(props)
		this.state = {
			isConnected: false,
			isAttemptingToConnect: false,
			connectButtonText: "Connect",
			serverAddress: "",
			connectionStatus: undefined,

			isInSendMode: false,
			sendCommandsButtonText: "Start Sending Commands",
			sendModeStatus: undefined,
			status: undefined,

			mixerChannel: undefined,

			socket: undefined,
		}

		this.onDisconnect = this.onDisconnect.bind(this)
		this.renderVideo = this.renderVideo.bind(this)
		this.sendCommand = this.sendCommand.bind(this)
		this.toggleConnect = this.toggleConnect.bind(this)
		this.toggleSendMode = this.toggleSendMode.bind(this)
		this.updateConnectionStatus = this.updateConnectionStatus.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.handleKey = this.handleKey.bind(this)
		this.checkSendMode = this.checkSendMode.bind(this)
		this.mouseMoveHandler = this.mouseMoveHandler.bind(this)
	}

	componentDidMount(): void {
		// TODO Add Gamepad support.

		// Not used for now.
		// document.addEventListener('mousemove', mouseMoveHandler)

		document.addEventListener('keydown', e => {
			this.handleKey(e, e.code, 'down')
		})
		document.addEventListener('keyup', e => {
			this.handleKey(e, e.code, 'up')
		})

		document.addEventListener('mousedown', (e: MouseEvent) => {
			// TODO Allow if clicking on 'send-mode-toggle'
			// if (e!.target!.name === 'send-mode-toggle') {
			// 	return
			// }
			this.handleKey(e, 'LeftClick', 'down')
		})

		document.addEventListener('mouseup', e => {
			this.handleKey(e, 'LeftClick', 'up')
		})

		const queryString = window.location.search
		const urlParams = new URLSearchParams(queryString)

		const serverAddress = urlParams.get('a') || 'http://127.0.0.1:5000'

		const connectNow = urlParams.get('c') === 'true'
		if (connectNow) {
			this.toggleConnect()
		}

		const isInSendMode = urlParams.get('s') === 'true'

		const mixerChannel = urlParams.get('mixerChannel')

		this.setState({
			isInSendMode,
			serverAddress,
			mixerChannel,
		})
	}

	private handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({ [event.target.name]: event.target.value })
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
			isConnected: false,
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
		const address = this.state.serverAddress
		const status = `Attempting to connect to "${address}"...`
		this.updateConnectionStatus(status)
		const socket = io(address)
		this.setState({
			connectButtonText: "Cancel connection attempt",
			isAttemptingToConnect: true,
			socket,
		}, () => {
			socket.on('connect', () => {
				this.updateConnectionStatus("✅ Connected")
				this.setState({
					isConnected: true,
					connectButtonText: "Disconnect",
					isAttemptingToConnect: false,
				})
			})

			socket.on('disconnect', this.onDisconnect)

			socket.on('json', (data: any) => {
				console.debug(data)
			})
		})
	}

	private sendCommand(command: string) {
		if (!command || !this.state.socket || !this.state.isInSendMode) {
			return
		}
		this.setState({
			status: `Status:  emitting ${command}`
		})
		this.state.socket.emit('p', command, (data: string) => {
			this.setState({
				status: `Status: responded: ${data}`
			})
		})
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
			this.setState({
				sendModeStatus: "Send mode: ✅ Enabled",
				sendCommandsButtonText: "Stop Sending Commands",
			})
		} else {
			this.setState({
				sendModeStatus: "Send mode: ❌ Disabled",
				sendCommandsButtonText: "Start Sending Commands",
			})
		}
	}

	private handleKey(e: KeyboardEvent | MouseEvent, keyName: string, keyDirection: string) {
		if (!this.state.isInSendMode) {
			return
		}

		let keyMapping: any = keyMap

		if (keyName in keyMap) {
			keyMap[keyName].isDown = keyDirection === 'down'
		}

		if ((keyMap.ShiftLeft.isDown || keyMap.ShiftRight.isDown) && keyName in shiftKeyMap) {
			keyMapping = shiftKeyMap
		}

		const command = keyMapping[keyName]
		if (command) {
			this.sendCommand(command[keyDirection])
			e.preventDefault()
		} else if (e.type === 'keydown') {
			console.debug(`Pressed ${(e as KeyboardEvent).code}.`)
		}
	}

	// Keeping in case we want to handle something on mouse movement later.
	private mouseMoveHandler(e: MouseEvent) { // eslint-disable-line @typescript-eslint/no-unused-vars
		// Top left of the page is 0, 0.
		// const newX = e.pageX
		// const newY = e.pageY
		// if (currentMousePos.x !== undefined) {
		// 	let dX = newX - currentMousePos.x
		// 	let dY = currentMousePos.y - newY

		// 	if (Math.abs(dX) >= mouseSensitivityX) {
		// 		currentMousePos.x = newX
		// 	} else {
		// 		dX = 0
		// 	}
		// 	if (Math.abs(dY) >= mouseSensitivityY) {
		// 		currentMousePos.y = newY
		// 	} else {
		// 		dY = 0
		// 	}
		// 	if (Math.abs(dX) > 0 && Math.abs(dY) > 0) {
		// 		// console.debug(dX,dY)
		// 	}
		// } else {
		// 	currentMousePos.x = newX
		// 	currentMousePos.y = newY
		// }
	}

	render(): React.ReactNode {
		const { classes } = this.props
		return (<Container>
			<div>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={6}>
						<TextField label="Server Address" name="serverAddress" value={this.state.serverAddress} onChange={this.handleChange} />
						<Button variant="contained" color="primary" onClick={this.toggleConnect}>{this.state.connectButtonText}</Button>
						<Typography component="p">{this.state.connectionStatus}</Typography>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Button name="send-mode-toggle" variant="contained" color="primary" onClick={this.toggleSendMode} disabled={!this.state.isConnected}>
							{this.state.sendCommandsButtonText}
						</Button>
						<Typography component="p">{this.state.sendModeStatus}</Typography>
						<Typography component="p">{this.state.status}</Typography>
					</Grid>
				</Grid>
			</div>
			{this.renderVideo()}
			{/* TODO Use Controller from https://github.com/nuiofrd/switch-remoteplay/tree/master/switch-rp-client/src */}

			<div className={classes.controller}>
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

				<img width="941px" height="800px"
					src="https://upload.wikimedia.org/wikipedia/commons/0/0a/Nintendo_Switch_Joy-Con_Grip_Controller.png"
					alt="Nintendo Switch Controller" />
			</div>
			<div>
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
					mixerChannel: The channel name for a Mixer stream to start playing.
				</Typography>
			</div>
		</Container >)
	}

	private renderVideo(): React.ReactNode {
		if (this.state.mixerChannel) {
			// Mixer docs: https://mixer.com/dashboard/channel/customize
			// The Mixer stream seems to start muted, and there does seem to be a way that works to unmute it by default.
			return (<div>
				<div className="mixer-stream">
					<iframe title="Mixer Stream" id="mixer-stream" className="mixer-stream" src={`https://mixer.com/embed/player/${this.state.mixerChannel}`}>
					</iframe>
				</div>
			</div>)
		} else {
			return undefined
		}
	}
}

export default withStyles(styles)(PlayGame)
