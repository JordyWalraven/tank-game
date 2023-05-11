/* eslint-disable global-require */
const HtmlModifier = require('./HtmlModifier');
const InputManager = require('./InputManager');
const ShotManager = require('./ShotManager');
const UIManager = require('./UIManager');

/* eslint-disable class-methods-use-this */
class ActionManager {
  constructor(startGameCallback) {
    this.websocket = null;
    this.uiUpdater = new HtmlModifier();
    this.startGameCallback = startGameCallback;
    this.gameDrawer = null;
    this.inputManager = null;
    this.shotManager = null;
    this.uiManager = null;
  }


  connectWebSocket(connectionSuccessCallback) {
    const ipAddress = localStorage.getItem('ipAddress');
    const port = localStorage.getItem('port');
    const playerName = localStorage.getItem('playerName');
    this.websocket = new WebSocket(`ws://${ipAddress}:${port}`);

    this.websocket.onopen = () => {
      this.setName(playerName);
      connectionSuccessCallback(true);
    };

    this.websocket.onerror = () => {
      connectionSuccessCallback(false);
    };

    this.websocket.onclose = () => {
      connectionSuccessCallback(false);
    };

    this.websocket.onmessage = (event) => {
      this.handleMessage(event.data);
    };
  }

  handleMessage(message) {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.type === 'menuInfo') {
      this.uiUpdater.updateBeforeGameMenu(parsedMessage);
    } else if (parsedMessage.type === 'startGame') {
      this.startGameCallback(parsedMessage.map, parsedMessage.players);
    } else if (parsedMessage.type === 'syncPlayers') {
      this.gameDrawer.syncTanks(parsedMessage.players);
      this.uiManager.updateUI(parsedMessage.players);
    } else if (parsedMessage.type === 'shootShot') {
      this.shotManager.pushShot(parsedMessage.shot);
      // const sound = document.getElementById('tankShot');
      // sound.play();
    } else if (parsedMessage.type === 'playerId') {
      this.uiManager.playerId = parsedMessage.id;
      this.shotManager.playerId = parsedMessage.id;
    } else if (parsedMessage.type === 'syncMap') {
      this.gameDrawer.syncMap(parsedMessage.map);
    }
  }

  setName(name) {
    const message = {
      type: 'setName',
      name,
    };
    this.websocket.send(JSON.stringify(message));
  }

  sendMessage(text) {
    const message = {
      type: 'chat',
      text,
    };
    this.websocket.send(JSON.stringify(message));
  }

  sentStartGameMessage() {
    const message = {
      type: 'startGame',
    };
    this.websocket.send(JSON.stringify(message));
  }

  sendInputMessage(input) {
    const message = {
      type: 'playerInput',
      input,
    };
    this.websocket.send(JSON.stringify(message));
  }

  sendDamageMessage(damages) {
    const message = {
      type: 'doDamage',
      damages,
    };
    this.websocket.send(JSON.stringify(message));
  }

  sendMapPoints(mapPoints) {
    const message = {
      type: 'updateMap',
      mapPoints,
    };
    this.websocket.send(JSON.stringify(message));
  }

  requestPlayerId() {
    const message = {
      type: 'requestId',
    };
    this.websocket.send(JSON.stringify(message));
  }

  setGameDrawer(gameDrawer) {
    this.gameDrawer = gameDrawer;
    this.inputManager = new InputManager(this);
    this.shotManager = new ShotManager(this.gameDrawer, this);
    this.uiManager = new UIManager();
    this.requestPlayerId();
  }

}

module.exports = ActionManager;
