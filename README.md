NOT OFFICIALLY SUPPORTED OR INVOLVED WITH NINTENDO IN ANY WAY

This is an independent project.

# Switch Remote Play

| Tests | ![Server](https://github.com/juharris/switch-remoteplay/workflows/Server%20Test/badge.svg) | ![Client](https://github.com/juharris/switch-remoteplay/workflows/Client%20Test/badge.svg) |
| - | - | - |

The goal of this project is to support **easily** playing your Nintendo Switch remotely or locally via another device with a keyboard/mouse/controller/touchscreen.
No hacking of your Switch is required.

Setup:
```
You <===> Website <=====> Server <--Bluetooth--> Switch
            ^                                      |
            |                            video capture via HDMI
            |                                      |
            |                                      v
            '------------------------------ Streaming Server
```                                           

Example [video](https://youtu.be/EIofCEfQA1E) of someone playing my Switch **from another city**.

Example [video](https://youtu.be/TJlWK2HU8Do) of me using an **Xbox controller (that does not have Bluetooth)** to play my Switch.

Example [video](https://youtu.be/viv-B_A-A2o) of recording and running a **macro**.

For more videos, check out this [playlist](https://www.youtube.com/playlist?list=PLfC95bU1D4gpJEM3SYfzaI2e5vD0q7v0z).

# Status
One keyboard layout, gaming controller layout, using you mouse, or touchscreen is supported to map input to the control sticks and the buttons on a Nintendo Switch controller.
I've mainly tested this with Animal Crossing and Mixer - FTL low latency streaming.

# Macros
You can record and run **macros**!
You do not need your Switch's video going through your PC to record and run macros.
Just setting up the server (Linux device with Bluetooth) to send commands via Bluetooth to your nearby Switch is enough.
Then you can record, modify, manage, and **play** your macros from a PC or even your phone.

See the supported commands [here](/server#api).

# Requirements
The host (person setting this up) needs:
* A Nintendo Switch
* A **Linux** machine to host the service and connect via Bluetooth to the Switch (tested with a Raspberry Pi 4B) (a Linux machine is required by the code that actually connects to the Switch via Bluetooth: [joycontrol][joycontrol]). See the [server page](/server) to learn how to set this up.
* (optional) A video capture card to see the video (or just have bad quality and lag by pointing your camera at your Switch and use a video chat app)

The client (your friend) needs:
* A web browser to open the client and send commands
  * You can use the already [hosted client][client] but you may have to enable mixed content for that site in your browser's settings if the server your friend is hosting to connect to their Switch does not use SSL (a link that starts with https).
* A keyboard or **gaming controller** is recommended or just use your mouse/touchscreen for simple stuff
* (optional) See [this folder](/website-client) if you want to customize or run your own client

# Plans
* Support custom key bindings.
* Improve macro support: exporting/importing.
* Default layout options for common controllers.
* Default key binding options for keyboard/mouse for certain games.
* Loadable and exportable key binding configurations.
* Support different streaming services (Mixer - FTL with low latency is supported).
* See [enhancements](https://github.com/juharris/switch-remoteplay/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement) and [help wanted](https://github.com/juharris/switch-remoteplay/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)

# Looking for Help
I'm looking for help with implementing the above plans. Some more specific things:
* Add security options to the service: auth, allowed origins, disabling buttons like Home and screen capture, limiting the number of clients connected.
* Getting the service to run on Windows (hard since the libraries I'm relying on require Linux)
* Improve macro support: a nicer editor
* Improving the client UX
* Mapping controller, keyboards, and mice for game specific controls (once custom bindings are supported)
* Phone apps to talk to the Switch and host the service instead of the a Linux machine.

# Acknowledgements
A very special thank you to [joycontrol][joycontrol] for the very conveninent and full API and the acknowledgements there as well for so much of the great research into how to communicate with the Switch.

[client]: https://jubuntu.eastus.cloudapp.azure.com
[joycontrol]: https://github.com/mart1nro/joycontrol
