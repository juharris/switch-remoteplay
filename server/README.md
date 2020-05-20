# Server

# Setup
Follow the setup instructions for [joycontrol][joycontrol].

For this code, in this server folder:

Note that `sudo` is used to run the server and so it needs to be used to install the dependencies.
I believe it's needed by joycontrol for using Bluetooth because it restarts the Bluetooth service if there are issues connecting.
```bash
sudo pip3 install -e .
```

# Start
Ideally we'll use server.py to start it but for now:
```bash
# Append '-r <Switch MAC address>' to reconnect to an already paired Switch.
SECRET_KEY='something random-ish' sudo python3 switchremoteplay/run_controller_cli.py PRO_CONTROLLER
```

# API
The service uses a socket to connect to the client.
Events are emitted as strings to `'p'` (Press).
I recommend starting the server as a `PRO_CONTROLLER` as shown above for the start command but you can look at [joycontrol][joycontrol] and experiment with other options.

Normally I like very clear APIs with verbose objects but I haven't worked directly with sockets much and I think you're supposed to keep requests very short so I've set up requests to be very short.

Here are the events as strings that the API handles: 
## Buttons
### Press a single button:
These single letter command put the button in the pushed state, wait a few milliseconds, and then puts the button in the not pushed state.
Honestly you don't really need this except maybe for simple macros since if you're mapping real controller input you should be setting buttons in the pressed/unpressed state to support holding down a button.

| Switch Button | String |
|---------------|--------|
| L             | `'l'` |
| R             | `'r'` |
| A             | `'a'` |
| B             | `'b'` |
| X             | `'x'` |
| Y             | `'y'` |

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
You can press the control sticks for the button functions as explained above.
Example: push the left stick down with `'l_stick d'` and stop with `'l_stick u'`.

For moving the sticks: `s <stick> <direction> <amount>`
* stick: `l` or `r`
* direction: horizontal: `h` or vertical: `v`
* amount: `max`, `min`, `center` (planned support for a decimal number between `-1.0` and `1.0`, down to up or left to right)

Examples:
* Push the left stick up all the way: `s l v max`, then let go of it and set it back to it's center position with: `s l v center`.
* (not supported yet) Push the right stick halfway to the right: `s r h 0.5`.

Angling the sticks (not supported yet): `s <stick> hv <h amount> <v amount>`
Example: Push the right stick halfway up and halfway to the right: `s r hv 0.5 0.5`.

# Wait
(not supported yet)

Format: `wait <time in milliseconds>`

# Sending Multiple Commands
(not supported yet)

At the same time: join commands with `&`

Example: Press A and B down: `'a d&b d'`

* In sequence: join commands with `,`

Example: Press A, then wait, then B, then wait, let them both go: `'a d,wait 200,b d,wait 200,a u&b u'`.

# Testing
(there are no tests yet)
```bash
sudo pip3 install -e .[test]
sudo pytest
```

[joycontrol]: https://github.com/mart1nro/joycontrol
