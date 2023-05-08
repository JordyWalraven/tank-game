/* eslint-disable no-plusplus */
class Ground {
  constructor() {
    this.points = [];

    for (let i = 1; i < 512; i++) {
      this.points.push({ x: i * 5, y: 600 });
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let index = 0; index < this.points.length; index++) {
      const point = this.points[index];
      point.y = Math.max(Math.min(point.y, 1152), 100);
      ctx.lineTo(point.x, point.y);
    }
      // Stroke the path to draw the curve
    ctx.lineTo(2560, 1440);
    ctx.lineTo(0, 1440);
    ctx.lineTo(this.points[0].x, this.points[0].y);
    const grad = ctx.createLinearGradient(0, 0, 0, 1440);
    grad.addColorStop(0, '#81d63d');
    grad.addColorStop(1, '#1c2017');
    ctx.fillStyle = grad;
    ctx.fill();
  }
  }

module.exports = Ground;
