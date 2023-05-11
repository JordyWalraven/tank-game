/* eslint-disable no-plusplus */
class Ground {

  syncGround(receivedPoints) {
    this.points = [];
    for (let index = 0; index < receivedPoints.length - 1; index++) {
      this.points.push({ x: receivedPoints[index].x, y: receivedPoints[index].y });
      const interpolatedY = (receivedPoints[index].y + receivedPoints[index + 1].y) / 2;
      this.points.push({ x: receivedPoints[index].x + 1, y: interpolatedY });
    }

    console.log(this.points);

  }

  returnMap() {
    const map = [];
    for (let index = 0; index < this.points.length; index++) {
      if (index % 2 === 0) {
        const point = this.points[index];
        map.push({ x: point.x, y: point.y });
      }
    }
    return map;
  }


  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.points[0].x - 100, this.points[0].y);
    for (let index = 0; index < this.points.length; index++) {
      const point = this.points[index];
      point.y = Math.max(Math.min(point.y, 1152), 100);
      ctx.lineTo(point.x, point.y);
    }
      // Stroke the path to draw the curve
    ctx.lineTo(2660, 1440);
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
