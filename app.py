from flask import Flask, render_template, request
from flask_socketio import SocketIO
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
        except FileNotFoundError: pass
        
        currentHash = dirhash('./ViteFrontend', 'md5')
        if (frontEndHash != currentHash):
            subprocess.call(['npm', 'run', 'build'], cwd='./ViteFrontend')
            print(f" Sucessfully built the front end files.")
            open("./pages/hash.txt", 'w').write(currentHash)
            
    except subprocess.CalledProcessError as e:
        print(f"Error building the frontend when preparing the server: {e}")
        raise
buildFrontend()    

# prepares the server
app = Flask(__name__,
    static_folder='pages/',
    template_folder='pages/'
)

app.config['SECRET_KEY'] = 'secret!'

# serves our static files
@app.route('/<path:path>')
def serve_static(path):
    return app.send_static_file(path)


#
# our get routes
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/support")
def support():
    return render_template("support/index.html")


#
# our server side post routes
socket = SocketIO(app=app)

@socket.event
def connect():
    print("Client connected")
    socket.emit("client_connected")
    

if __name__ == '__main__':
    socket.run(app)





