# Server

# Setup
This code relies on [joycontrol][joycontrol] for sending commands via Bluetooth to your Switch.
For information and troubleshooting on pairing controllers: see [joycontrol][joycontrol].

Install dependencies required by [joycontrol][joycontrol]:
```bash
sudo apt install python3-dbus libhidapi-hidraw0
```

For this code, in this server folder:

Note that `sudo` is used to run the server and so it needs to be used to install the dependencies.
I believe it's needed by joycontrol for using Bluetooth because it restarts the Bluetooth service if there are issues connecting.
```bash
sudo pip3 install -e .
```

# Start
```bash
sudo SECRET_KEY='something random-ish' python3 switchremoteplay/server.py
```
Append `-r <Switch MAC address>` to reconnect to an already paired Switch. For example `-r 6E:A3:63:B9:CE:92`.

To see more configuration options, run:
```bash
sudo python3 switchremoteplay/server.py --help
```

You can change the controller type, the port used by the socket service, and the log level.

# Networking Setup
The client webpage in your browser will need to know the address of the server.

## Same Network
You will need the local IP address or hostname of your device running the server.
Your public IP address will likely not work.
On linux, you can run `hostname` and you should get what you need.
For example, on a Rapsberry Pi, it my just be "raspberrypi".
Once the server has started, you can enter http://raspberrypi:5000 (5000 for the default port) as the "Server Address" on the client page.
If you just have the local network IP address (usually starts with `192.168`), then enter that as the server address, for example: `http://192.168.2.17:5000`.

## Over the Internet
Do this if you are connecting to a server on another network, for example, your friend's Switch and server device at their house.
The person with the Switch and running the server will need to find their public IP address.
One way to do this is for this person to open https://ifconfig.me and check what is says for "IP Address".
They will also have to make sure to set up "port forwarding" in their router settings so that requests from outside of their local network get mapped to the server.

You might be able to avoid port forwarding if you use [ngrok](https://ngrok.com/) but it might not be as secure and will likely reduce speed.

# API
This sections discusses the format of commands that the server expects.
This section is useful for developers and people writing macros.

## Macros
Most of these commands are supported in macros by the client (website).

Note that the examples below use single quotes, `'`, as a convention to emphasize that they are code meant to be interpreted by a machine.
You can also use double quotes, `"` since macros are [JSON](https://www.json.org) lists.
It is fine to use single quotes when writing macros since they will be converted to double quotes when saved.

Example macro:
```json
["s l up", "wait 200", "a d", "wait 200", "a u", "wait 200", "s l center"]
```

## Developer Notes
The service uses a socket to connect to the client.
Events are emitted as strings to the `'p'` (Press) handler.

Normally I like very clear APIs with verbose objects but I haven't worked directly with sockets much and I think you're supposed to keep requests very short so I've set up requests to be very short strings.
It will also be easier this way for people to write macros.

## Buttons
### Press a single button:
These single letter command put the button in the pushed state, wait a few milliseconds, and then puts the button in the not pushed state.
Honestly you don't really need this except maybe for simple macros since if you're mapping real controller input you should be setting buttons in the pressed/unpressed state to support holding down a button.

All buttons are supported:
```
'l', 'zl',
'r', 'zr',
'a', 'b', 'x', 'y',
'minus', 'plus',
'r_stick', 'l_stick',
'home', 'capture',
'down', 'up', 'right', 'left'
```

### Set a button in the pressed/unpressed state:
Format: `<button> <up/down>`.
* PRESSED/DOWN: `d`.
* UNPRESSED/UP: `u`

Example: push A down with `'a d'` and then let it back up with `'a u'`.

All buttons are supported:
```
'l', 'zl',
'r', 'zr',
'a', 'b', 'x', 'y',
'minus', 'plus',
'r_stick', 'l_stick',
'home', 'capture',
'down', 'up', 'right', 'left'
```

## Sticks
You can press in the control sticks for the button functions as explained above.

Example: push the left stick in with `'l_stick d'` and stop with `'l_stick u'`.

### Moving the sticks
For convenience with macros: `s <stick> <direction>`
* stick: left: `l` or right: `r`
* direction: `up`, `down`, `left`, `right`, or `center`

Example: move the right stick to the left with `'s r left'` and then set it back to center with `'s r center'`. 

For moving by a specific amount: `s <stick> <direction> <amount>`
* stick: left: `l` or right: `r`
* direction: horizontal: `h` or vertical: `v`
* amount:
  * For your convenience with writing easy to read macros/code:
    * UP/RIGHT: `max`
    * DOWN/LEFT: `min`
    * back to the calibrated center: `center`
  * For convenience with matching the [JavaScript Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/)
a decimal number between `-1.0` and `1.0`:
    * UP/LEFT: `-1.0` (yes `-1.0` is UP, this is how the Gamepad API works)
    * DOWN/RIGHT: `1.0`
    * back to the calibrated center: `0` 

Examples:
* Push the left stick up all the way: `'s l v max'`, then let go of it and set it back to it's center position with: `'s l v center'`.
* Push the right stick halfway to the right: `'s r h 0.5'`.

Angling the sticks: `s <stick> hv <horizontal amount> <vertical amount>`

Example: Push the right stick halfway to the right and halfway up: `'s r hv 0.5 -0.5'`.

Example: Push the left stick halfway to the right and halfway down: `'s l hv 0.5 0.5'`.

## Wait
This is mainly for macros.
This server itself will not recognize `wait` commands.
There is an ongoing discussion [here](https://github.com/juharris/switch-remoteplay/issues/8).

Format: `wait <time in milliseconds>`

Example: Do not send any input for 300ms: `'wait 300'`.

The amount of time must be an integer.

## Sending Multiple Commands

### Simultaneous
To run multiple commands at the same time: join commands with `&`.
This is supported in macros.

Example: Press A and B down: `'a d&b d'`

Do **not** use single press command like just `'a'`. 
It might seems like it works but the behavior is not guaranteed.

### Sequence
Run one command after another: join commands with `,`.
This is not guaranteed to work with macros since it is not really needed because you can just split up the command: `["a,b"]` should be: `["a", "b"]`.
This takes precedence over `&`.
I.e. first the command is split on `,`, then on `&`.

Example: Press A, then wait, then B, then wait, let them both go: `'a d,wait 200,b d,wait 200,a u&b u'`.

# Testing
```bash
sudo pip3 install -e .[test]
sudo pytest
```

[joycontrol]: https://github.com/mart1nro/joycontrol
