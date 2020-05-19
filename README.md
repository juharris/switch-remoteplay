NOT OFFICALLY SUPPORTED OR INVOLVED WITH NINTENDO IN ANY WAY

This is an independent project.

# switch-remoteplay

The goal of this project is to support playing your Nintendo Switch remotely or locally via your PC keyboard/mouse/controller.

Example [video](https://www.youtube.com/watch?v=TBqZRA1OZPU).

# Status
One keyboard layout is supported to map keys on a keyboard to control the control sticks and some of the keys on a Nintendo Switch. I've mainly tested this with Animal Crossing. This is very much a messy work in progress right now but you can indeed play your Switch remotely with support for a few buttons.

# Requirements
* Nintendo Switch
* Linux machine to host the service and connect via Bluetooth to the Switch (tested with a Raspberry Pi 4B)
* A web browser to open the client and send commands
* A normal keyboard
* (optional) video capture card to see the video (or just have bad quality in a video chat app)

# Plans
* Support gaming controllers.
* Support custom keyboard layouts.
* Show the video in the client.
* Support recording and running macros.
* Phone apps to talk to the Switch and host the service instead of the a Linux machine.

# Looking for Help
I'm looking for help with implementing the above plans. Some more specific things:
* Porting client.html to React/TypeScript (I'll probably do this myself)
* Add security options to the service: auth, allowed origins, disabling buttons like Home and screen capture, limiting the number of clients connected.
* Getting the service to run on Windows (hard since the libraries I'm relying on require Linux)
* Improving the client UX (this can wait until it's refactored)

# Issues
* Be careful not to press Ctrl+W (LStick Up + A) while playing! (will get addressed eventually)

# Acknowledgements
A very special thank you to https://github.com/mart1nro/joycontrol for the very conveninent and full API and the acknowledgements there as well for so much of the great research into how to communicate with the Switch.
