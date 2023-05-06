const HtmlModifier = require('./HtmlModifier');

/* eslint-disable class-methods-use-this */
class ActionManager {
  constructor(startGameCallback) {
    this.websocket = null;
    this.uiUpdater = new HtmlModifier();
    this.startGameCallback = startGameCallback;
  }


  connectWebSocket(connectionSuccessCallback) {
    const ipAddress = sessionStorage.getItem('ipAddress');
    const port = sessionStorage.getItem('port');
    const playerName = sessionStorage.getItem('playerName');
    this.websocket = new WebSocket(`ws://${ipAddress}:${port}`);

    this.websocket.onopen = () => {
      console.log('WebSocket connection opened:', ipAddress, port);
      this.setName(playerName);
      connectionSuccessCallback(true);
    };

    this.websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      connectionSuccessCallback(false);
    };

    this.websocket.onclose = () => {
      console.log('WebSocket connection closed');
      connectionSuccessCallback(false);
    };

    this.websocket.onmessage = (event) => {
      this.handleMessage(event.data);
    };
  }

  handleMessage(message) {
    console.log('Received message:', message);
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.type === 'menuInfo') {
      this.uiUpdater.updateBeforeGameMenu(parsedMessage);
    } else if (parsedMessage.type === 'startGame') {
      this.startGameCallback();
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
}

module.exports = ActionManager;
