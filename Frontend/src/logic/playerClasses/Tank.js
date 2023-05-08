/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
class Tank {
  constructor(tankId, groundRef, canvasRef, xPos, color) {
    this.points = [];
    this.xPos = xPos;
    this.tankId = tankId;
    this.yPos = 0;
    this.groundRef = groundRef;
    this.canvasRef = canvasRef;
    this.ctx = canvasRef.getContext('2d');
    this.color = color;
  }

  syncGround(x) {
    this.xPos = x;
    if (this.xPos > 2558 - 25) {
      this.xPos = 2558 - 25;
    }

    this.yPos = this.groundRef.points[this.xPos].y - 50;
  }

  draw() {
    let point1 = this.groundRef.points[this.xPos-25].y;
    let point2 = this.groundRef.points[this.xPos+25].y;
    let angle = Math.atan2(point2 - point1, 50);

    this.ctx.beginPath();
    this.ctx.save();
    this.ctx.translate(this.xPos, this.yPos+25);
    this.ctx.rotate(angle);
    this.ctx.rect(-50, -25, 100, 50);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.restore();
  }

}

module.exports = Tank;

