/* eslint-disable no-mixed-operators */
class ExplosionParticle {
  constructor(x, y, radius, color, gravity, speed, duration) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.gravity = gravity;
    this.speed = speed;
    this.duration = duration;
    this.elapsed = 0;
    this.destroy = false;
    this.start = Date.now();
    this.fadeTime = duration / 5;
  }

  draw(ctx, frameTime) {
    this.x += this.speed.x * frameTime;
    this.y += this.speed.y * frameTime;
    this.speed.y += this.gravity * frameTime;

    this.elapsed = Date.now() - this.start;
    this.alpha = 1 - (this.elapsed - this.fadeTime * 4) / this.fadeTime;
    ctx.beginPath();
    ctx.shadowBlur = 40;
    ctx.shadowColor = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.closePath();
    ctx.shadowBlur = 0;

    if (Date.now() - this.start > this.duration) {
      this.destroy = true;
    }
  }
}

module.exports = ExplosionParticle;
