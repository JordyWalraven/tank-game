/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
class HtmlModifier {

  updateBeforeGameMenu(menuInfo) {
    const playerCount = menuInfo.names.length;
    const names = menuInfo.names;
    const playerList = document.getElementById('playerNames');
    const playerCountElement = document.getElementById('playerCount');
    playerCountElement.innerHTML = `Amount of players : ${playerCount}`;
    playerList.innerHTML = '';
    for (let i = 0; i < playerCount; i++) {
      const player = document.createElement('li');
      player.innerHTML = names[i];
      playerList.appendChild(player);
    }
  }

    }

module.exports = HtmlModifier;

