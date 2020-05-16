import eventlet
import socketio

sio = socketio.Server()
app = socketio.WSGIApp(sio,
                       # static_files={
    # '/': {'content_type': 'text/html', 'filename': 'index.html'}
# }
                       )
@sio.event
def accepted(sid, data):
    print("accepted")

@sio.event
def handshake(sid, data):
    print("handshake")

@sio.event
def connect(sid, environ):
    print('connect ', sid)

@sio.event
def my_message(sid, data):
    print('message ', data)
    return "OK", 123

@sio.event
def disconnect(sid):
    print('disconnect ', sid)

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', 8888)), app)