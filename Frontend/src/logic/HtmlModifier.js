/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
class HtmlModifier {

  updateBeforeGameMenu(menuInfo) {
    const playerCount = menuInfo.names.length;
    let playerAmount = 0;
    for (let index = 0; index < playerCount; index++) {
      if (menuInfo.names[index] !== '') {
        playerAmount++;
      }
    }
    const names = menuInfo.names;
    const playerList = document.getElementById('playerNames');
    const playerCountElement = document.getElementById('playerCount');
    playerCountElement.innerHTML = `Amount of players : ${playerAmount}`;
    playerList.innerHTML = '';
    for (let i = 0; i < playerCount; i++) {
      if (names[i] !== '') {
        const player = document.createElement('li');
        player.innerHTML = names[i];
        playerList.appendChild(player);
      }
    }
  }

}

module.exports = HtmlModifier;

