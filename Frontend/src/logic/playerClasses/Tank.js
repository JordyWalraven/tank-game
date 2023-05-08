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
    if (this.xPos > 2558) {
      this.xPos = 2558;
    }

    this.yPos = this.groundRef.points[this.xPos].y - 50;
  }

  draw() {
    this.syncGround(this.xPos += 1);
    this.ctx.beginPath();
    this.ctx.rect(this.xPos - 50, this.yPos, 100, 50);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }

}

module.exports = Tank;

