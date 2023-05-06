const { ipcMain } = require('electron');
const WebSocket = require('ws');

ipcMain.on('connectWebSocket', (event, { ipAddress, port }) => {
  const websocket = new WebSocket(`ws://${ipAddress}:${port}`);

  websocket.onopen = () => {
    console.log('WebSocket connection opened:', ipAddress, port);
    event.sender.send('websocketStatus', 'Connected to WebSocket server');
  };

  websocket.onerror = (error) => {
    console.error('WebSocket error:', error);
    event.sender.send('websocketStatus', 'Error connecting to WebSocket server');
  };

  websocket.onclose = () => {
    console.log('WebSocket connection closed');
    event.sender.send('websocketStatus', 'WebSocket connection closed');
  };

  websocket.onmessage = (message) => {
    console.log('WebSocket message received:', message);
  };
});
