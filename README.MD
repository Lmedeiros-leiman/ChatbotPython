# Installing and running

This application runs under python 3.12.7, check the requirements.txt file for specific versions.

to run the app you need to create a virtual python enviroment and install its dependencies by running the following command on your terminal with this folder as the root:

```bash
python -m venv ./venv
source venv/bin/activate # venv/Scripts/activate for windows
pip install -r requirements.txt

# initiates the server locally.
flask run

# alternativelly run this command to execute the server in debug mode:
# flask --app app.py --debug run
```


# Socket flow:

- Connect : When the user sucessfully connects to the web socket. No chat is yet initiated and the user will be prompted by a bot before connecting with a human user.
- chat_connect : The user connects to a chat
- chat_end : When the user support person ends the chat session (disconects) OR the user leaves.
- Disconect : When the use disconects from the chat
- viewed : When the user has viewed the chat history.
- chat_message : when a new message gets sent