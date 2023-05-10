class BaseExplosion {
  constructor(duration) {
    this.alpha = 1;
    this.destroy = false;
    this.start = Date.now();
    this.particles = [];
    this.duration = duration;
    this.elapsed = 0;
  }

  draw(ctx, frameTime) {
    this.elapsed = Date.now() - this.start;
    ctx.beginPath();
    this.particles.forEach((particle) => {
      ctx.globalAlpha = particle.alpha;
      particle.draw(ctx, frameTime);
      if (particle.destroy === true) {
        this.particles.splice(this.particles.indexOf(particle), 1);
      }
    });

    ctx.globalAlpha = 1;
    ctx.closePath();

    if (Date.now() - this.start > this.duration) {
      this.destroy = true;
    }
  }
}

module.exports = BaseExplosion;
