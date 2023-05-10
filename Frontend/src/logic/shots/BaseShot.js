/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-properties */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-mixed-operators */
class BaseShot {
  constructor(x, y, angle, power, gravity, trailAmount, shotManagerRef) {
    this.x = x;
    this.y = y;
    console.log(angle);
    this.angle = (-angle + 90) * Math.PI / 180;
    this.power = power;
    this.speed = { x: Math.sin(this.angle) * this.power, y: Math.cos(this.angle) * this.power };
    this.gravity = gravity;
    this.destroy = false;
    this.shotManagerRef = shotManagerRef;
    this.trailAmount = trailAmount;
    this.trail = [];
  }

  updatePosition(frameTime) {
    this.x += this.speed.x * frameTime;
    this.y += this.speed.y * frameTime;
    this.speed.y += this.gravity * frameTime;
    this.trail.unshift({ x: this.x, y: this.y });
    if (this.trail.length > this.trailAmount) {
      this.trail.pop();
    }
  }

  calculateDamage(range, damage, players, damageDropoff, damageDropoffRange) {
    const damageList = [];
    for (let index = 0; index < players.length; index++) {
      const distanceToPlayer = Math.sqrt(Math.pow(this.x - players[index].xPos, 2) + Math.pow(this.y - players[index].yPos, 2));
      if (distanceToPlayer < range) {
        let damageToPlayer = damage;
        if (distanceToPlayer > damageDropoffRange) {
          damageToPlayer -= (distanceToPlayer - damageDropoffRange) * damageDropoff;
        }
        if (damageToPlayer > 0) {
          damageList.push({ damage: damageToPlayer, player: players[index].id });
        }
      }
    }
    return damageList;
  }

}


module.exports = BaseShot;
