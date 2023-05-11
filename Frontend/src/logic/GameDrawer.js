/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable eqeqeq */
/* eslint-disable indent */
/* eslint-disable no-mixed-operators */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */


const Ground = require('./Ground');
const Tank = require('./playerClasses/Tank');

const maxY = 1440;
const minY = 0;
const groundCanvas = document.createElement('canvas');
groundCanvas.width = 2560;
groundCanvas.height = 1440;
const groundCtx = groundCanvas.getContext('2d');


function GameDrawer(map, players) {
  const ground = new Ground(map);
  ground.syncGround(map);
  this.shots = [];
  this.stars = [];
  this.players = [];
  this.explosions = [];
  this.counter = 10;

  this.prevExplosionLength = 0;

  for (let index = 0; index < players.length; index++) {
    if (players[index] != null && players[index].id != -1) {
      this.players.push(new Tank(players[index].id, ground, document.getElementById('gameCanvas'), players[index].x, players[index].angle, players[index].power, players[index].health, `hsl(${Math.random() * 360}, 100%, 50%)`));
    }
  }

  let prevFrame = Date.now();
  for (let index = 0; index < 400; index++) {
    this.stars.push({ x: Math.random() * 2560, y: Math.random() * 800, size: Math.random() * 5, dur: Math.random() * 10 });
  }

  this.updateGround = function () {
    groundCtx.clearRect(0, 0, groundCanvas.width, groundCanvas.height);
    ground.draw(groundCtx);
  };


  this.syncMap = function (receivedMap) {
    console.log(receivedMap);
    ground.syncGround(receivedMap);
    this.updateGround();
    this.players.forEach((player) => {
      player.syncGround(player.xPos);
    },
    );
  };


  this.getGroundY = function (x) {
    return ground.points[Math.floor(x)].y;
  };

  this.getGround = function () {
    return ground.points;
  };

  this.syncTanks = function (receivedPlayers) {
    for (let index = 0; index < receivedPlayers.length; index++) {
      const player = receivedPlayers[index];
      const foundPlayer = this.players.find(tank => tank.id == player.id);
      foundPlayer.syncGround(player.x);
      foundPlayer.angle = player.angle;
      foundPlayer.power = player.power;
      foundPlayer.health = player.health;
    }
  };

  this.updateGround();
  this.syncTanks(players);
  this.update = function () {
    const frameTime = Date.now() - prevFrame;
    prevFrame = Date.now();

    const c = document.getElementById('gameCanvas');
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);

    if (this.explosions.length > this.prevExplosionLength) {
      this.counter = 0;
      this.prevExplosionLength = this.explosions.length;
    }

    if (this.explosions.length < this.prevExplosionLength) {
      this.prevExplosionLength = this.explosions.length;
    }

    if (this.explosions.length > this.prevExplosionLength || this.counter < 10) {
       if (this.counter < 10) {
        this.counter++;
      }
      ctx.save();
      ctx.translate(Math.random() * 10, Math.random() * 10);
    }

    const grad = ctx.createLinearGradient(0, 0, 0, 1440);
    grad.addColorStop(0, '#00111e');
    grad.addColorStop(1, '#01283f');
    ctx.fillStyle = grad;
    ctx.fillRect(-100, -100, 2760, 1640);
    for (let index = 0; index < this.stars.length; index++) {
        const star = this.stars[index];
        star.dur += 0.05 * Math.random();
        this.alpha = (Math.sin(star.dur) + 1) / 2;
        if (this.alpha < 0.05) {
            star.x = Math.random() * 2560;
            star.y = Math.random() * 800;
            star.size = Math.random() * 5;
        }
        ctx.fillStyle = `hsla(0, 0%, 100%, ${this.alpha})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    ctx.drawImage(groundCanvas, 0, 0);

    for (let index = 0; index < this.players.length; index++) {
        const player = this.players[index];
        player.draw();
    }

    this.shots.forEach((shot) => {
        shot.draw(ctx, frameTime / 6.9444);
        if (shot.destroy) {
            this.shots.splice(this.shots.indexOf(shot), 1);
        }
    });

    this.explosions.forEach((explosion) => {
        explosion.draw(ctx, frameTime / 6.9444);
        if (explosion.destroy) {
            this.explosions.splice(this.explosions.indexOf(explosion), 1);
        }
    });

    ctx.restore();

    window.requestAnimationFrame(() => this.update());
  };

  window.requestAnimationFrame(() => this.update()); // wrap update function in arrow function to preserve this context
}

module.exports = GameDrawer;
