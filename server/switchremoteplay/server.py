import asyncio
import logging
import os
import sys

from flask import Flask
from flask_socketio import SocketIO
#from flask_socketio import emit, send

from controller import get_controller, push_button, utils

# Follow the example at https://flask-socketio.readthedocs.io/en/latest/

logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY') or 'asdasdasdf'
# print(app.config['SECRET_KEY'])
socketio = SocketIO(app, cors_allowed_origins='*')

controller = None

@socketio.on('connect')
def test_connect():
    print("Connected")

@socketio.on('disconnect')
def test_disconnect():
    print("Disconnected")

# Handle unnamed events.
@socketio.on('message')
def handle_message(message):
    print('received message: ' + message)

# Handle unnamed events with JSON.
@socketio.on('json')
def handle_json(json):
    print('received json: ' + str(json))

@socketio.on('p')
def handle_press(button):
    print("will press: {}".format(button))
    push_button(controller, button)
    return "PRESSED {}".format(button)

async def _main():
    print("Starting")

    bluetooth_address = sys.argv[1] if len(sys.argv) > 1 else None

    print("Setting up with bluetooth address: {}".format(bluetooth_address))

    global controller
    with utils.get_output(path=None, default=None) as capture_file:
        controller = await get_controller(bluetooth_address, capture_file=capture_file)
        print(controller)
        #import time
        #while True: time.sleep(1)

        await asyncio.create_task(start_server())

async def start_server():
    host = '0.0.0.0'
    # 5000 is the default port.
    port = 5000
    #port = 48668
    print("Running at {}:{}".format(host, port))
    socketio.run(app, host, port)
    print(controller)


async def other():
    import time
    while True:
        time.sleep(1)

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(
        _main()
    )
    print("done")