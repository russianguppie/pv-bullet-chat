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