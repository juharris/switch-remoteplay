import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, createStyles, ThemeProvider, withStyles, WithStyles } from '@material-ui/core/styles'
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import 'typeface-roboto'
import './App.css'
import CustomAppBar from './AppBar'
import Home from './components/Home'

const theme = createMuiTheme({
	palette: {
		type: 'dark',
	},
})

// Can take a Theme as input.
const styles = () => createStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		// backgroundColor: palette.background.default,
		// color: palette.primary.main,
	},
})

class App extends React.Component<WithStyles<typeof styles>> {
	render(): React.ReactNode {
		const { classes } = this.props

		return (<Router>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<div className={classes.root}>
					<CustomAppBar />

					{/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
					<Switch>
						<Route path="/">
							<Home />
						</Route>
					</Switch>
				</div>
			</ThemeProvider>
		</Router >)
	}
}

export default withStyles(styles)(App)
