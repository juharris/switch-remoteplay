import os

from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit

# Follow the example at https://flask-socketio.readthedocs.io/en/latest/

print("Setting up")
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
socketio = SocketIO(app, cors_allowed_origins='*')

print(socketio)
print(type(socketio))

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
def handle_press(key):
    print("will press: {}".format(key))
    # TODO Send to joycontrol
    return "PRESSED {}".format(key)    

if __name__ == '__main__':
    print("Starting")
    socketio.run(app)
