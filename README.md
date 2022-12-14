# pv-bullet-chat

## Development Guidance

### Python
1. Preparation
```
# Install sqlite3
brew install sqlite

# Install python3
brew install python

# Install python dependencies
pip3 install -r ./python/requirements.txt
```
2. Run Function
```
python3 main.py
```
3. Check table content
```
sqlite3 pv-bullet-chat.db "select * from bullets;"
```
4. Call Endpoint

Get Bullet Endpoint

Parameter
- startTime: required, Bullet chat start time
- endTime: required, Bullet chat end time
- batchSize: optional, maximum bullets that endpoint will return. It will set to 10 by default.

Example:
```
curl http://127.0.0.1:8080/bullets\?startTime\=00:00:00\&endTime\=00:00:03

# Response
["{\"user\": \"testUser1\", \"message\": \"This is a sample bullet 1\", \"order\": 1}", "{\"user\": \"testUser2\", \"message\": \"This is a sample bullet 2\", \"order\": 2}", "{\"user\": \"testUser3\", \"message\": \"This is a sample bullet 3\", \"order\": 3}", "{\"user\": \"testUser1\", \"message\": \"This is a sample bullet 4\", \"order\": 4}"]
```

Post Bullet Endpoint

Payload

should be jsons tring consisting of those fields:
'user',
'message',
'video',
'timeline'

Example:
```
mcurl -v -L  POST --header 'Content-Type: application/json' -d @test.json 'http://localhost:8080/bullets'

@test.json format:

{
  "user": "gali",
  "message": "tyotot",
  "video": "videoname",
  "timeline": "12:00:00"

}
```