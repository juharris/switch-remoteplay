NOT OFFICIALLY SUPPORTED OR INVOLVED WITH NINTENDO IN ANY WAY

This is an independent project.

# Switch Remoteplay

The goal of this project is to support **easily** playing your Nintendo Switch remotely or locally via another device with a keyboard/mouse/controller/touchscreen.
No hacking of your Switch is required.

Plan (not finished yet, see the [Status](#Status) section below):
```
You <===> Website <=====> Server <--Bluetooth--> Switch
            ^                                      |
            |                            video capture via HDMI
            |                                      |
            |                                      v
            '------------------------------ Streaming Server
```                                           

Example [video](https://www.youtube.com/watch?v=TBqZRA1OZPU).

# Status
One keyboard layout is supported to map keys on a keyboard to control the control sticks and some of the keys on a Nintendo Switch.
I've mainly tested this with Animal Crossing.
This is very much a messy work in progress right now but you can indeed play your Switch remotely with support for a few buttons.
No streaming to the client has been set up yet.
I've only tested with streaming in a video chat app and pointing the camera at the Switch.

A [fork of this repo](https://github.com/nuiofrd/switch-remoteplay) is working on a better client-side UI with support for binding custom keys and selecting a controller layout to use as input.
I'm hoping to merge that soon (before June 2020).

# Requirements
The host (person setting this up) needs:
* Nintendo Switch
* Linux machine to host the service and connect via Bluetooth to the Switch (tested with a Raspberry Pi 4B)
* (optional) video capture card to see the video (or just have bad quality and lag in a video chat app)

The client (your friend) needs:
* A web browser to open the client and send commands
* A normal keyboard (support for controllers, touch screens, and a mouse are planned)

# Plans
* Support gaming controllers.
* Support custom key bindings.
* Show the video in the client website.
* **Support recording and running macros**.
* Default layout options for common controllers.
* Default key binding options for keyboard/mouse for certain games.
* Loadable and exportable key binding configurations.
* Phone apps to talk to the Switch and host the service instead of the a Linux machine (I won't do this but I hope someone else does).

# Looking for Help
I'm looking for help with implementing the above plans. Some more specific things:
* Porting client.html to React/TypeScript (already started in a fork)
* Add security options to the service: auth, allowed origins, disabling buttons like Home and screen capture, limiting the number of clients connected.
* Getting the service to run on Windows (hard since the libraries I'm relying on require Linux)
* Improving the client UX (this can wait until it's refactored)
* Phone app instead of a Linux machine

# Setup
See:
* [server](/server): a service to run on a device near your Switch (full API docs are there)
* [client](/website-client): a website for your friends to "connect" to your Switch

# Issues
* Be careful not to press Ctrl+W (LStick Up + A) while playing! (will get addressed eventually)

# Acknowledgements
A very special thank you to https://github.com/mart1nro/joycontrol for the very conveninent and full API and the acknowledgements there as well for so much of the great research into how to communicate with the Switch.
