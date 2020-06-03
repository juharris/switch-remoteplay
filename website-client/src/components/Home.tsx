import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import React from 'react'

export default class Home extends React.Component {
	render(): React.ReactNode {
		return (<Container>
			<Typography variant="h3">Main page</Typography>
		</Container>)
	}
}