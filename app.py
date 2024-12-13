from flask import Flask, render_template, request
import subprocess

# builds the frontend before servind the app
def buildFrontend():
    subprocess.call(['npm', 'run', 'build'], cwd='./ViteFrontend')
    
buildFrontend()


app = Flask(__name__,
            static_folder='pages/',
            template_folder='pages/')


# serves our static files
@app.route('/<path:path>')
def serve_static(path):
    print(path)
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