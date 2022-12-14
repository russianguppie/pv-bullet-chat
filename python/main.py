import database_init
from flask import Flask, request, jsonify
import json

app = Flask(__name__)

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
    record = json.loads(request.data)
    return jsonify(record)

def init():
    conn = database_init.init_database()
    
if __name__ == '__main__':
    init()
    app.run("", 8080)