/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
class Tank {
  constructor(id, groundRef, canvasRef, xPos, angle, power, health, color) {
    this.points = [];
    this.xPos = xPos;
    this.id = id;
    this.yPos = 0;
    this.groundRef = groundRef;
    this.canvasRef = canvasRef;
    this.ctx = canvasRef.getContext("2d");
    this.color = color;
    this.angle = angle;
    this.power = power;
    this.health = health;
  }

  syncGround(x) {
    this.xPos = x;
    if (this.xPos > 2557 - 25) {
      this.xPos = 2557 - 25;
    } else if (this.xPos < 25) {
      this.xPos = 25;
    }

    this.yPos = this.groundRef.points[this.xPos].y - 50;
  }

  draw() {
    const point1 = this.groundRef.points[this.xPos - 25].y;
    const point2 = this.groundRef.points[this.xPos + 25].y;
    const terrainAngle = Math.atan2(point2 - point1, 50);

    this.ctx.beginPath();
    this.ctx.save();
    this.ctx.translate(this.xPos, this.yPos + 25);
    this.ctx.rotate(terrainAngle);
    this.ctx.rect(-50, -25, 100, 50);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.restore();
    this.ctx.closePath();
    this.ctx.beginPath();
    this.ctx.save();
    this.ctx.translate(this.xPos, this.yPos);
    this.ctx.rotate(this.angle * (Math.PI / 180));
    this.ctx.rect(0, -7.5, 60, 15);
    this.ctx.fillStyle = "red";
    this.ctx.fill();
    this.ctx.restore();
    this.ctx.closePath();
  }
}

module.exports = Tank;
