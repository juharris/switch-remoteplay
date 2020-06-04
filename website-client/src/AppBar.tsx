import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import React from 'react'
// import MenuIcon from '@material-ui/icons/Menu';

const styles = ({ spacing }: Theme) => createStyles({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	bar: {
		backgroundColor: '#3d3d3d',
	},
})

class CustomAppBar extends React.Component<WithStyles<typeof styles>> {
	render() {
		const { classes } = this.props

		return (
			<div className={classes.root}>
				<AppBar className={classes.bar} position="static">
					<Toolbar>
						<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
							{/* TODO Make the menu button work. */}
							{/* <MenuIcon /> */}
						</IconButton>

						{/* TODO Hide buttons for mobile. */}
						<Button className={classes.title} color="inherit" href="/">
							<Typography variant="h5">
								Switch Remote Play
							</Typography>
						</Button>

						{/* Buttons with links to other pages can be added here. */}
						{/* <Button color="inherit" href="/exampleLink">Example</Button> */}
					</Toolbar>
				</AppBar>
			</div>
		)
	}
}

export default withStyles(styles)(CustomAppBar)
