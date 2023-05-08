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
let fpsCounter = 0;
const groundCanvas = document.createElement('canvas');
groundCanvas.width = 2560;
groundCanvas.height = 1440;
const groundCtx = groundCanvas.getContext('2d');


function GameDrawer(map,players) {
  const ground = new Ground(map);
  this.effects = [];
  this.stars = [];
  this.players = [];

  for (let index = 0; index < players.length; index++) {
    if (players[index] != null && players[index].id != -1) {
      this.players.push(new Tank(players[index].id, ground, groundCanvas, players[index].x, `hsl(${Math.random() * 360}, 100%, 50%)`));
    }
  }

  let counter = Math.floor((Date.now() / 1000));
  let prevcounter = counter;
  for (let index = 0; index < 400; index++) {
    this.stars.push({ x: Math.random() * 2560, y: Math.random() * 800, size: Math.random() * 5, dur: Math.random() * 10 });
  }

  this.updateGround = function () {
    groundCtx.clearRect(0, 0, groundCanvas.width, groundCanvas.height);
    ground.draw(groundCtx);
  };

  this.syncTanks = function (players) {
    for (let index = 0; index < players.length; index++) {
      const player = players[index];
      this.players[index].syncGround(player.x);
    }
  };

  this.updateGround();
  this.update = function () {
    fpsCounter++;
    counter = Math.floor((Date.now() / 1000));
    if (counter !== prevcounter) {
        prevcounter = counter;
        console.log(fpsCounter);
        fpsCounter = 0;
    }


    const c = document.getElementById('gameCanvas');
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    const grad = ctx.createLinearGradient(0, 0, 0, 1440);
    grad.addColorStop(0, '#00111e');
    grad.addColorStop(1, '#01283f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 2560, 1440);
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

    window.requestAnimationFrame(() => this.update());
  };

  window.requestAnimationFrame(() => this.update()); // wrap update function in arrow function to preserve this context
}

module.exports = GameDrawer;
