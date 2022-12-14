import database_init
import db_operation
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import sys

app = Flask(__name__)
CORS(app)
conn = database_init.init_database()

BULLET_DEFAULT_BATCH_SIZE = 10

@app.route('/bullets', methods=['GET'])
def get_bullets():
    
    size_limit = request.args.get('batchSize', BULLET_DEFAULT_BATCH_SIZE, type=int)
    start_time = request.args.get('startTime')
    end_time = request.args.get('endTime')
    print(f"startTime: {start_time}", file=sys.stderr)
    print(f"endTime: {end_time}", file=sys.stderr)
    
    info = (start_time, end_time, size_limit)
    db_rows = db_operation.query_bullet(conn, info)
    
    rsp = []
    ct = 0
    for r in db_rows:
        ct += 1
        bullet_json = json.dumps(
            {'user': r[1],
             'message': r[2],
             'order': ct
             }
        )
        rsp.append(bullet_json)
        
    return json.dumps(rsp)

@app.route('/bullets', methods=['POST'])
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