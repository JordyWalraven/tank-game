const express = require('express');
const ffmpeg = require('ffmpeg');
const fs = require('fs');
const app = express();
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

let players = [];

app.use(cors());

app.get('/canConnect', async (req, res) => {
  res.sendStatus(200);
});

const httpServer = http.createServer(app);
const wss = new WebSocket.Server({ server: httpServer });
let playerId = 0;

wss.on('connection', (socket) => {
  playerId += 1;
  console.log('A user connected');

  // Assign a default name to the socket
  socket.name = 'Anonymous';
  socket.id = playerId;

  players.push({name: socket.name, id: socket.id, x: wss.clients.size == 1 ? 300 : 2000});

  broadcastMessage(JSON.stringify({
    type: 'menuInfo',
    names: Array.from(wss.clients).map((client) => client.name),
    playerCount: wss.clients.size
  }))

  socket.on('message', (data) => {
    const message = JSON.parse(data);

    if (message.type === 'setName') {
      socket.name = message.name;
      console.log(`User set their name to: ${socket.name}`);
      players.find((player) => player.id === socket.id).name = socket.name;
      broadcastMessage(JSON.stringify({
        type: 'menuInfo',
        names: Array.from(wss.clients).map((client) => client.name),
        playerCount: wss.clients.size
      }))

    } else if (message.type === 'chat') {
      console.log(`Received message from ${socket.name}: ${message.text}`);
      broadcastMessage(JSON.stringify({
        type: 'chat',
        name: socket.name,
        text: message.text,
      }));
    } else if (message.type === 'startGame') {
      let maparr = [];
      for (let index = 0; index < 2560; index++) {
        maparr.push({x: index, y: Math.sin(index/100) *100 + 700})
      }
      broadcastMessage(JSON.stringify({type: 'startGame', map:maparr , players: players}))
    } else if (message.type === "movePlayer"){
      message.direction === "left" ? players.find((player) => player.id === socket.id).x -= 3 : players.find((player) => player.id === socket.id).x += 3;
      broadcastMessage(JSON.stringify({type: "syncPlayers", players: players}))
    }
  });

  socket.on('close', () => {
    console.log(`User ${socket.name} disconnected`);
    players = players.filter((player) => player.id !== socket.id);
    broadcastMessage(JSON.stringify({
      type: 'menuInfo',
      names: Array.from(wss.clients).map((client) => client.name),
      playerCount: wss.clients.size
    }))
  });
});

httpServer.listen(3000, () => {
  console.log('Server listening on port 3000');
});

function broadcastMessage(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}