import argparse
import asyncio
import logging
import os
from typing import Optional

from flask import Flask
from flask_socketio import SocketIO
from flask_socketio import send

from switchremoteplay.controller import SwitchController

# Follow the example at https://flask-socketio.readthedocs.io/en/latest/

logger = logging.getLogger('switchremoteplay')

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY') or 'asdasdasdf'
socketio = SocketIO(app, cors_allowed_origins='*')

controller: Optional[SwitchController] = None
switch_mac_address: Optional[str] = None
controller_type: Optional[str] = None
device_id: Optional[str] = None

reconnect_lock = asyncio.Lock()


@socketio.on('connect')
def connect():
	logger.info("Connected")
	send({'connected': True}, json=True)


@socketio.on('disconnect')
def disconnect():
	logger.info("Disconnected")


# Handle unnamed events.
@socketio.on('message')
def handle_message(message):
	logger.debug("received message: \"%s\"", message)


# Handle unnamed events with JSON.
@socketio.on('json')
def handle_json(json):
	logger.debug("received json: %s", json)


@socketio.on('p')
def handle_press(command):
	logger.debug("Got command: `%s`", command)
	if controller is not None:
		controller.run(command)
		return "DONE `{}`".format(command)
	else:
		logger.debug("Not connected to the Switch.")


# This endpoint doesn't actually work to reset the connection.
# There is an error setting up a new connection:
# ConnectionRefusedError: [Errno 111] Connection refused
# joycontrol.protocol connection_made::112 DEBUG - Connection established.
@socketio.on('reconnectController')
def handle_reconnect_controller():
	logger.debug("Reconnecting controller.")
	# TODO Check permissions.
	asyncio.ensure_future(_handle_reset_controller())


async def _handle_reset_controller():
	async with reconnect_lock:
		global controller
		logger.info("Attempting to connect the controller.")
		del controller
		controller = None
		controller = await SwitchController.get_controller(logger, switch_mac_address,
														   controller=controller_type,
														   device_id=device_id)
		logger.info("Done attempting to connect the controller.")


async def _main():
	parser = argparse.ArgumentParser()
	parser.add_argument('-r', '--switch_mac_address', type=str, default=None,
						help="The Switch console's MAC address. Specify this if you've already paired a Switch console to your server device.")
	parser.add_argument('-c', '--controller_type', type=str, default="PRO_CONTROLLER",
						help="The type of controller to simulate. Either PRO_CONTROLLER, JOYCON_L, or JOYCON_R. Default: PRO_CONTROLLER.")
	parser.add_argument('--service_port', type=int, default=5000,
						help="The port that the socket service should use for connections.\n Default: 5000.")
	parser.add_argument('-d', '--device_id', type=str, default=None,
						help="ID of the Bluetooth adapter. Integer matching the digit in the hci* notation (e.g. hci0, hci1, ...) or Bluetooth MAC address of the adapter in string notation (e.g. \"FF:FF:FF:FF:FF:FF\").")

	parser.add_argument('--log_level', type=str, default=logging.INFO,
						help="The log level. Options are Python log level names. Default: INFO.")

	args = parser.parse_args()

	logger.setLevel(args.log_level)
	SwitchController.configure_log(logger.level)

	logger.info("Starting")
	global switch_mac_address, controller_type, device_id
	switch_mac_address = args.switch_mac_address
	controller_type = args.controller_type
	port = args.service_port
	device_id = args.device_id

	global controller
	try:
		start_server(port)
		# Keep the server running and attempt to reconnect the controller.
		# There must be a better way to do this but this seems to work fine for now.
		while True:
			try:
				if controller is None or not controller.is_connected():
					await _handle_reset_controller()
				await asyncio.sleep(100)
			except:
				logger.exception("Error reconnecting the controller.")
	except:
		logger.exception("Error while starting the service.")
	finally:
		logger.info('Stopping the service...')


def start_server(port):
	host = '0.0.0.0'
	logger.info("Socket service running at %s:%d", host, port)

	l = asyncio.get_running_loop()

	def _start():
		asyncio.set_event_loop(l)
		socketio.run(app, host, port)

	l.run_in_executor(None, _start)


if __name__ == '__main__':
	loop = asyncio.get_event_loop()
	loop.run_until_complete(
		_main()
	)
