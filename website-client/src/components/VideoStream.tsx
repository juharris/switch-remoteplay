import { createStyles, withStyles } from '@material-ui/core'
import React from 'react'

// Normally the Switch has 1080p: 1920x1080
// This is just for the dimensions on the page, the full screen option can be selected.
// A low resolution is fine anyway since streaming will mainly be low quality for low latency.
const height = 440
const width = Math.floor(height * 1920 / 1080)

// Can take a Theme as input.
const styles = () => createStyles({
	mixerDiv: {
		paddingTop: '10px',
		textAlign: 'center',
	},
	mixerIframe: {
		border: '0px',
		overflow: 'hidden',
		width: `${width}px`,
		height: `${height}px`,
		maxWidth: '100%',
		maxHeight: '100%',
	},
})

class VideoStream extends React.Component<any> {
	render(): React.ReactNode {
		const { mixerChannel } = this.props
		if (mixerChannel) {
			// Mixer docs: https://mixer.com/dashboard/channel/customize
			// The Mixer stream seems to start muted, and there does seem to be a way that works to unmute it by default.
			const { classes } = this.props
			return (<div className={classes.mixerDiv}>
				<iframe className={classes.mixerIframe}
					allowFullScreen={true}
					title="Mixer Stream" id="mixer-stream" src={`https://mixer.com/embed/player/${mixerChannel}?disableLowLatency=0`}>
				</iframe>
			</div>)
		} else {
			return (<div></div>)
		}
	}
}

export default withStyles(styles)(VideoStream)
