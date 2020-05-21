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


@socketio.on('connect')
def test_connect():
	print("Connected")
	send({'connected': True}, json=True)


@socketio.on('disconnect')
def test_disconnect():
	print("Disconnected")


# Handle unnamed events.
@socketio.on('message')
def handle_message(message):
	print("received message: " + message)


# Handle unnamed events with JSON.
@socketio.on('json')
def handle_json(json):
	print("received json: " + str(json))


@socketio.on('p')
def handle_press(command):
	logger.debug("Got command: `%s`", command)
	controller.run(command)
	return "DONE `{}`".format(command)


async def _main():
	logger.info("Starting")
	parser = argparse.ArgumentParser()
	parser.add_argument('-r', '--switch_mac_address', type=str, default=None,
						help="The Switch console's MAC address. Specify this if you've already paired a Switch console to your server device.")

	args = parser.parse_args()
	switch_mac_address = args.switch_mac_address

	global controller
	try:
		controller = await SwitchController.get_controller(logger, switch_mac_address)
		start_server()
		# Keep the server running.
		# There must be a better way to do this but this seems to work fine for now.
		while True:
			await asyncio.sleep(60)
	finally:
		logger.info('Stopping the service...')


def start_server():
	host = '0.0.0.0'
	# 5000 is the default port.
	port = 5000
	# port = 48668
	print("Running at {}:{}".format(host, port))

	l = asyncio.get_running_loop()

	def _start():
		asyncio.set_event_loop(l)
		socketio.run(app, host, port)

	l.run_in_executor(None, _start)


if __name__ == '__main__':
	logger.setLevel(logging.INFO)
	loop = asyncio.get_event_loop()
	loop.run_until_complete(
		_main()
	)
	print("done")
