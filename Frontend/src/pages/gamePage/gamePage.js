/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */

const { remote } = require('electron');
const ActionManager = require('../../logic/ActionManager');
const GameDrawer = require('../../logic/GameDrawer');

const actionManager = new ActionManager(startGame);
let gameDrawer = null;

function connectionSucceeded(state) {
  if (state) {
    console.log('Connection succeeded!');
    document.getElementById('socket-success').style.display = 'block';
    document.getElementById('socket-loading').style.display = 'none';
  } else {
    alert('Connection failed!');
    remote.getCurrentWindow().loadFile('src/pages/mainMenu/mainMenu.html');
  }
}

document.getElementById('startGameBtn').addEventListener('click', () => {
  actionManager.sentStartGameMessage();
});

function startGame(map, playerPos){
  const menu = document.getElementById('menu');
  menu.style.display = 'none';
  const gameUI = document.getElementById('duringGameUI');
  gameUI.style.display = 'block';
  console.log(playerPos)
  gameDrawer = new GameDrawer(map, playerPos);
  actionManager.setGameDrawer(gameDrawer);
}

actionManager.connectWebSocket(connectionSucceeded);
