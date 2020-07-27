import React from 'react'

export default function ControllerButton(props: any) {
	const { name, sendCommand, controllerState } = props
	// TODO Update controllerState so that multiple buttons can be highlighted.
	return <div
		onMouseDown={(e: Event) => {
			sendCommand(`${name} d`)
			e.preventDefault()
		}}
		onTouchStart={(e: Event) => {
			sendCommand(`${name} d`)
			e.preventDefault()
		}}
		onMouseUp={(e: Event) => {
			sendCommand(`${name} u`)
			e.preventDefault()
		}}
		onTouchEnd={(e: Event) => {
			sendCommand(`${name} u`)
			e.preventDefault()
		}}
		{...props}
	/>
}