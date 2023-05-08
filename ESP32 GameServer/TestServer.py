import websocket

# Connect to websocket server
ws = websocket.WebSocket()
ws.connect("ws://192.168.1.30")
print("Connected to websocket server")

# Ask for input and send it to the server
message = input("Enter a message: ")
ws.send(message)

# Wait for response
result = ws.recv()
print("Received: " + result)

# Close connection
ws.close()