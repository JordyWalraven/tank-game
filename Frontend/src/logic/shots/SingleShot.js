/* eslint-disable max-len */
/* eslint-disable no-useless-constructor */
const NormalFireExplosion = require("../explosions/NormalFireExplosion");
const BaseShot = require("./BaseShot");

class SingleShot extends BaseShot {
  constructor(x, y, angle, power, gravity, shotManagerRef, isPlayer) {
    super(
      x,
      y - 60,
      angle,
      power,
      gravity,
      30,
      shotManagerRef,
      isPlayer,
      50,
      50
    );
  }

  draw(ctx, frameTime) {
    super.updatePosition(frameTime);
    ctx.beginPath();
    ctx.shadowBlur = 40;
    ctx.shadowColor = "yellow";
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();

    this.trail.forEach((trailObj, i) => {
      ctx.beginPath();
      ctx.arc(
        trailObj.x,
        trailObj.y,
        (this.trailAmount - i) / 2,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = "yellow";
      ctx.globalAlpha = 1 - i / this.trailAmount;
      ctx.fill();
    });
    ctx.closePath();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    if (
      this.x > 2558 ||
      this.x < 1 ||
      this.y > this.shotManagerRef.getGroundY(this.x)
    ) {
      const damages = super.calculateDamage(
        30,
        this.shotManagerRef.gameDrawerRef.players,
        0,
        0
      );
      super.updateMapPoints();
      this.shotManagerRef.actionManagerRef.sendDamageMessage(damages);
      this.shotManagerRef.gameDrawerRef.explosions.push(
        new NormalFireExplosion(
          this.x,
          this.y,
          100,
          { h: 20, s: 100, l: 50 },
          100,
          20,
          5,
          0,
          500,
          700
        )
      );
      this.destroy = true;
    }
  }
}

module.exports = SingleShot;
