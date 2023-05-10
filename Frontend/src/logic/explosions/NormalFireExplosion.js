/* eslint-disable max-len */
const BaseExplosion = require('./BaseExplosion');
const ExplosionParticle = require('./ExplosionParticle');

class NormalFireExplosion extends BaseExplosion {
  constructor(x, y, radius, color, particleCount, particleSize, particleSpeed, particleGravity, particleDuration, duration) {
    super(duration);
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.particleCount = particleCount;
    this.particleSize = particleSize;
    this.particleSpeed = particleSpeed;
    this.particleGravity = particleGravity;
    this.particleDuration = particleDuration;
  }

  draw(ctx, frameTime) {
    this.timeLeft = this.duration - this.elapsed;
    if (this.timeLeft - this.particleDuration > 0 && this.particles.length < this.particleCount) {
      const randomHVal = (Math.random() - 0.5) * 30;
      const randomSVal = (Math.random() - 0.5) * 30;
      const randomLVal = (Math.random() - 0.5) * 30;
      this.particles.push(new ExplosionParticle(this.x,
         this.y,
         this.particleSize * Math.random(),
         `hsl(${this.color.h + randomHVal},${this.color.s + randomSVal}%,${this.color.l + randomLVal}%)`,
         this.particleGravity,
         { x: (Math.random() - 0.5) * this.particleSpeed, y: (Math.random() - 0.5) * this.particleSpeed },
         this.particleDuration));
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, (this.elapsed / 200) * this.radius, 0, 2 * Math.PI);
    ctx.shadowBlur = 100;
    ctx.shadowColor = 'white';
    ctx.fillStyle = `hsla(${this.color.h},${this.color.s}%,${this.color.l + 10}%,${1 - (this.elapsed / 200)})`;
    ctx.fill();
    ctx.shadowBlur = 0;
    super.draw(ctx, frameTime);
  }
}

module.exports = NormalFireExplosion;
