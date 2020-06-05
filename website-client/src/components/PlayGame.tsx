import { createStyles, withStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import io from 'socket.io-client'
import KeyboardBinding from '../key-binding/KeyboardBinding'

// Can take a Theme as input.
const styles = () => createStyles({
	controller: {
		marginTop: '10px',
	},
	leftButtons: {
		marginLeft: '15%',
	},
	rightButtons: {
	},
	mixerDiv: {
		paddingTop: '10px',
		textAlign: 'center',
	},
	mixerIframe: {
		border: '0px',
		overflow: 'hidden',
		/* Normally the Switch has 1080p: 1920x1080 */
		/* Use low resolution for now since streaming will mainly be low quality for low latency. */
		width: '960px',
		height: '540px',
		maxWidth: '100%',
		maxHeight: '100%',
	},
})

class PlayGame extends React.Component<any, any> {
	constructor(props: Readonly<any>) {
		super(props)
		this.state = {
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
		this.checkSendMode = this.checkSendMode.bind(this)
	}

	componentDidMount(): void {
		// TODO Add Gamepad support.
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
			keyBinding: new KeyboardBinding(this.sendCommand)
		}, () => {
			if (connectNow) {
				this.toggleConnect()
			}
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

	render(): React.ReactNode {
		const { classes } = this.props
		return (<Container>
			<div>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={6}>
						<TextField label="Server Address" name="serverAddress" value={this.state.serverAddress} onChange={this.handleChange} />
						<Button variant="contained" onClick={this.toggleConnect}
							style={{ backgroundColor: this.state.socket && this.state.socket.connected ? red[500] : green[500] }}>
							{this.state.connectButtonText}
						</Button>
						<Typography component="p">
							{this.state.connectionStatus}
						</Typography>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Button name="send-mode-toggle" variant="contained" onClick={this.toggleSendMode} disabled={!this.state.socket || !this.state.socket.connected}
							style={{ backgroundColor: this.state.isInSendMode ? red[500] : green[500] }}>
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
			const { classes } = this.props
			return (<div className={classes.mixerDiv}>
				<iframe className={classes.mixerIframe} title="Mixer Stream" id="mixer-stream" src={`https://mixer.com/embed/player/${this.state.mixerChannel}`}>
				</iframe>
			</div>)
		} else {
			return undefined
		}
	}
}

export default withStyles(styles)(PlayGame)
