import React from 'react'

export default function ControllerButton(props: any) {
    const { name, sendCommand } = props
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