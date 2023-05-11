class UIManager {
  constructor() {
    this.playerId = 0;
  }

  updateUI(players) {
    console.log(players);
    console.log(this.playerId);
    const player = players.find((player) => player.id === this.playerId);
    console.log(player);
    const powerBar = document.getElementById("playerPower");
    powerBar.innerHTML = `<div style="width:100%; height:${
      100 - player.power
    }%; background-color:#1f1f1f;"></div>`;

    const powerLabel = document.getElementById("powerLabel");
    powerLabel.innerHTML = `Power: ${player.power}`;

    const angleLable = document.getElementById("angleLabel");
    angleLable.innerHTML = `Angle: ${Math.abs(player.angle % 360)}`;
    const angleBar = document.getElementById("rotating-div");
    angleBar.style.transform = `rotate(${player.angle}deg)`;
    // const healthBar = document.getElementById('healthBar');
    // healthBar.value = player.health;
    // const powerBar = document.getElementById('powerBar');
    // powerBar.value = player.power;
    // const angleBar = document.getElementById('angleBar');
    // angleBar.value = player.angle;
  }
}

module.exports = UIManager;
