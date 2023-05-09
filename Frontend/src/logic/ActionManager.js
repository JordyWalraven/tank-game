const HtmlModifier = require('./HtmlModifier');
const InputManager = require('./InputManager');

/* eslint-disable class-methods-use-this */
class ActionManager {
  constructor(startGameCallback) {
    this.websocket = null;
    this.uiUpdater = new HtmlModifier();
    this.startGameCallback = startGameCallback;
    this.gameDrawer = null;
    this.inputManager = null;
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

  sendMoveMessage(direction) {
    const message = {
      type: 'movePlayer',
      direction,
    };
    this.websocket.send(JSON.stringify(message));
  }

  setGameDrawer(gameDrawer) {
    this.gameDrawer = gameDrawer;
    this.inputManager = new InputManager(this);
  }

}

module.exports = ActionManager;
