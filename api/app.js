const express = require("express");
const ffmpeg = require("ffmpeg");
const fs = require("fs");
const app = express();
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

let players = [];

app.use(cors());

app.get("/canConnect", async (req, res) => {
  res.sendStatus(200);
});

const httpServer = http.createServer(app);
const wss = new WebSocket.Server({ server: httpServer });
let playerId = 0;

wss.on("connection", (socket) => {
  playerId += 1;
  console.log("A user connected");

  // Assign a default name to the socket
  socket.name = "Anonymous";
  socket.id = playerId;

  players.push({
    name: socket.name,
    id: socket.id,
    x: Math.floor(Math.random() * 2500),
    angle: 0,
    power: 0,
    health: 200,
    selectedShot: "SingleShot",
  });

  broadcastMessage(
    JSON.stringify({
      type: "menuInfo",
      names: Array.from(wss.clients).map((client) => client.name),
      playerCount: wss.clients.size,
    })
  );

  socket.on("message", (data) => {
    const message = JSON.parse(data);

    if (message.type === "setName") {
      socket.name = message.name;
      console.log(`User set their name to: ${socket.name}`);
      players.find((player) => player.id === socket.id).name = socket.name;
      broadcastMessage(
        JSON.stringify({
          type: "menuInfo",
          names: Array.from(wss.clients).map((client) => client.name),
          playerCount: wss.clients.size,
        })
      );
      }else if (message.type === "syncMap") {
        

    }
     else if (message.type === "chat") {
      console.log(`Received message from ${socket.name}: ${message.text}`);
      broadcastMessage(
        JSON.stringify({
          type: "chat",
          name: socket.name,
          text: message.text,
        })
      );
    } else if (message.type === "startGame") {
      let maparr = [];
      for (let index = 0; index < 1280; index++) {
        maparr.push({ x: index*2, y: Math.sin(index / 50) * 100 + 700 });
      }
      broadcastMessage(
        JSON.stringify({ type: "startGame", map: maparr, players: players })
      );
    } else if (message.type === "playerInput") {
      const foundPlayer = players.find((player) => player.id === socket.id);
      if (message.input === "moveLeft") {
        foundPlayer.x -= 3;
      } else if (message.input === "moveRight") {
        foundPlayer.x += 3;
      } else if (message.input === "angleLeft") {
        foundPlayer.angle -= 1;
      } else if (message.input === "angleRight") {
        foundPlayer.angle += 1;
      } else if (message.input === "powerUp") {
        if (foundPlayer.power < 100) foundPlayer.power += 1;
      } else if (message.input === "powerDown") {
        if (foundPlayer.power > 0) foundPlayer.power -= 1;
      } else if (message.input === "shoot") {
        const foundPlayer = players.find((player) => player.id === socket.id);
        broadcastMessage(
          JSON.stringify({ type: "shootShot", shot: foundPlayer })
        );
      }
      broadcastMessage(
        JSON.stringify({ type: "syncPlayers", players: players })
      );
    } else if (message.type === "requestId"){
      socket.send(JSON.stringify({type: "playerId", id: socket.id}))
    }
  });

  socket.on("close", () => {
    console.log(`User ${socket.name} disconnected`);
    players = players.filter((player) => player.id !== socket.id);
    broadcastMessage(
      JSON.stringify({
        type: "menuInfo",
        names: Array.from(wss.clients).map((client) => client.name),
        playerCount: wss.clients.size,
      })
    );
  });
});

httpServer.listen(3000, () => {
  console.log("Server listening on port 3000");
});

function broadcastMessage(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
