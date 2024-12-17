from flask import Flask, render_template, request
from flask_socketio import SocketIO, join_room, leave_room, emit
import subprocess
from dirhash import dirhash

# builds the frontend before servind the app
def buildFrontend():
    try:
        # checks the hash of the front end (check if it has changed)
        # avoids rebuilding the frontend unecessarily.
        frontEndHash = False
        try:
            frontEndHash = open("./pages/hash.txt", 'r')
            frontEndHash = frontEndHash.read()
        except FileNotFoundError: 
            pass
        
        currentHash = dirhash('./ViteFrontend', 'md5')
        if (frontEndHash != currentHash):
            subprocess.call(['npm', 'install'], cwd='./ViteFrontend')
            subprocess.call(['npm', 'run', 'build'], cwd='./ViteFrontend')
            print(" Sucessfully built the front end files.")
            open("./pages/hash.txt", 'w').write(currentHash)
            
    except subprocess.CalledProcessError as e:
        print(e)
        raise SystemExit("Error building the frontend when preparing the server")
        
buildFrontend()    

support_agents = set()
client_requests = {}
active_chats = {}

# prepares the server
app = Flask(__name__,
    static_folder='pages/',
    template_folder='pages/'
)

app.config['SECRET_KEY'] = 'secret!'


@app.route('/<path:path>')
def serve_static(path):
    return app.send_static_file(path)
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/support")
def support():
    return render_template("support/index.html")


#
# our server side post routes
socket = SocketIO(app=app)

@socket.on('connect', namespace='/support')
def handleSupportConnect():
    
    socket.emit('send_message', {
    "user": {
        "name": "User",
        "type": "user"},
    "rawText": "yay",
    "creation": "2024-12-17T01:24:07.442Z"
    })
    #socket.emit('received_message', {})
    pass    


@socket.on("support_logged")
def groupSupport():
    pass


@socket.on("support_joined")
def connectSupport():
    pass
 


@socket.on("request_new_chat")
def notifySupport(user):
    
    newChatInfo = {
        'requester': user,
        'request' : request
    }
    
    socket.emit("chat_started", newChatInfo, namespace='/support')
    
    return;

@socket.on("send_message")
def SyncChatMessages(data):
    #print("New message: " + data["message"])
    socket.emit('received_message', data )
    return



if __name__ == '__main__':
    socket.run(app)





