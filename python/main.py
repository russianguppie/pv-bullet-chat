import database_init
from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)
conn = database_init.init_database()

@app.route('/bullets', methods=['GET'])
def get_bullets():
    rsp = []
    for i in range(10):
        bullet_json = json.dumps(
            {'user': 'remoteUser',
             'message': 'sampe message ' + str(i),
             'order': i}
        )
        rsp.append(bullet_json)
        
    return json.dumps(rsp)

@app.route('/', methods=['POST'])
def update_record():
    bulletChatJson = json.loads(request.data)
    record = (
    bulletChatJson['user'],
    bulletChatJson['message'],
    bulletChatJson['video'],
    bulletChatJson['timeline']
    )
    database_init.create_bullet(conn, record)
    return {'status': 'great success',
            'record': record}

if __name__ == '__main__':
    app.run("", 8080)