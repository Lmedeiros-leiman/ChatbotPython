from flask import Flask, render_template, request
from flask_socketio import SocketIO, join_room, leave_room, emit
from flask_cors import CORS

import random
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


# prepares the server
app = Flask(__name__,
    static_folder='pages/',
    template_folder='pages/'
    
)
app.config['SECRET_KEY'] = 'secret!'
CORS(app)



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
socket = SocketIO(app=app, cors_allowed_origins="*")


# key = Socket ID
# content : user that is connected.
connectedUsers = {}
connectedSupportUsers = {}

# key = UserChatRoom ID
# content = chat message history
# to allow multiple chats we save them to disk and clear the current chat history.
ChatRooms = {}



ServerUser = {
    'name': "Server",
    'type': "server"
}

@socket.on('connect')
def userConnected(connectingUser):
    print(connectingUser)
    
    serverResponse = {
        'user': ServerUser,
        'rawText': "Connected to the server.",
        'creation': 0
    }
    
    if connectingUser['type'] == "support":
        # if we have a support logging in
        connectedSupportUsers[request.sid] = connectingUser
        #join_room(room='supportChannel')
        join_room(room=connectingUser["id"])
        
    socket.emit(event='received_message', data=serverResponse, to=request.sid)
    
    
    pass    

@socket.on("request_support")
def requestSupport():
    
    randomSupportUser = connectedSupportUsers[random.choice(list(connectedSupportUsers.keys()))]
    
    print(randomSupportUser)
    pass


@socket.on("send_message")
def sendMessageToChatRoom(userMessage):
    user = userMessage["user"]
    targetRoom = userMessage["chatRoom"] or user["id"]  # Default to user ID if no chatRoom specified
    
    # checks if the user has a chatRoom for itself
    # aka: checks if its an support user.
    # if it does not exist, join into a room and alert the support user of the new chat.
    if (not ChatRooms.get(targetRoom)):
        # Initialize room if it doesn't exist
        ChatRooms[targetRoom] = {
            'users': [user],
            'history': []
        }
        join_room(room=targetRoom, sid=request.sid)

        # Notify support of the new chat
        socket.emit("chat_started", {"roomID": targetRoom, "requester": user}, to="supportChannel")
        
    # Save message to history
    ChatRooms[targetRoom]['history'].append(userMessage)

    # Send the message to all in the room
    
    
    
    socket.emit('received_message', data=userMessage, to=targetRoom)



if __name__ == '__main__':
    socket.run(app)





