import database_init
from flask import Flask, request, jsonify
import json

app = Flask(__name__)

@app.route('/', methods=['GET'])
def welcome():
    return json.dumps({'name': 'gali',
                       'email': 'mengxiw@outlook.com'})

@app.route('/', methods=['POST'])
def update_record():
    record = json.loads(request.data)
    return jsonify(record)

def init():
    conn = database_init.init_database()
    
if __name__ == '__main__':
    main()
    app.run("", 8080)