import os

from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit

# Follow the example at https://flask-socketio.readthedocs.io/en/latest/

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
socketio = SocketIO(app)


@socketio.on('connect')
def test_connect():
	print("Connected")
	emit('my response', {'data': 'Connected'})

@socketio.on('disconnect')
def test_disconnect():
	print('Client disconnected')

# Handle unnamed events.
@socketio.on('message')
def handle_message(message):
	print('received message: ' + message)

# Handle unnamed events with JSON.
@socketio.on('json')
def handle_json(json):
	print('received json: ' + str(json))

@socketio.on('my event')
def handle_my_custom_event(json):
	print('received json: ' + str(json))

if __name__ == '__main__':
	socketio.run(app)
