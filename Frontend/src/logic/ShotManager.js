/* eslint-disable no-mixed-operators */
const SingleShot = require('./shots/SingleShot');

class ShotManager {
  constructor(gameDrawerRef, actionManagerRef) {
    this.gameDrawerRef = gameDrawerRef;
    this.actionManagerRef = actionManagerRef;
    this.gravity = 0.09;
  }
  pushShot({ selectedShot, x, angle, power }) {
    const y = this.gameDrawerRef.getGroundY(x);
    if (selectedShot === 'SingleShot') {
      this.gameDrawerRef.shots.push(new SingleShot(x, y, angle, power / 6, this.gravity, this));
    }
  }

  getGroundY(x) {
    return this.gameDrawerRef.getGroundY(x);
  }
}

module.exports = ShotManager;
