class InputManager {
  constructor(actionHandler) {
    this.canvasRef = document.getElementById('gameCanvas');

    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
    this.actionHandler = actionHandler;
    this.keyPressed = {
      65: false, // 'a' key
      68: false, // 'd' key
      37: false, // left arrow
      39: false, // right arrow
      38: false, // up arrow
      40: false, // down arrow
      32: false, // spacebar
    };
    this.POLLRATE = 60;
    this.loopActive = false;
    this.loopShouldStop = false;
  }

  handleKeyDown(event) {
    let correctKey = false;
    if (event.keyCode === 65) {
      // 'a' key
      this.actionHandler.sendInputMessage('moveLeft');
      this.keyPressed[65] = true;
      correctKey = true;
      event.preventDefault();
    } else if (event.keyCode === 68) {
      // 'd' key
      this.keyPressed[68] = true;
      this.actionHandler.sendInputMessage('moveRight');
      correctKey = true;
      event.preventDefault();
    } else if (event.keyCode === 37) {
      // left arrow
      this.actionHandler.sendInputMessage('angleLeft');
      event.preventDefault();
    } else if (event.keyCode === 39) {
      // right arrow
      this.actionHandler.sendInputMessage('angleRight');
      event.preventDefault();
    } else if (event.keyCode === 38) {
      // up arrow
      this.actionHandler.sendInputMessage('powerUp');
      event.preventDefault();
    } else if (event.keyCode === 40) {
      // down arrow
      this.actionHandler.sendInputMessage('powerDown');
      event.preventDefault();
    } else if (event.keyCode === 32) {
      // spacebar
      this.actionHandler.sendInputMessage('shoot');
      event.preventDefault();
    }

    if (!this.loopActive && correctKey) {
      this.scheduleCheckKeys();
    }
  }

  handleKeyUp(event) {
    let correctKey = false;
    if (event.keyCode === 65) {
      // 'a' key
      correctKey = true;
      this.keyPressed[65] = false;
      event.preventDefault();
    } else if (event.keyCode === 68) {
      // 'd' key
      correctKey = true;
      this.keyPressed[68] = false;
      event.preventDefault();
    }

    if (!this.loopActive && correctKey) {
      this.scheduleCheckKeys();
    }
  }

  scheduleCheckKeys() {
    const animate = () => {
      this.checkKeys();
      setTimeout(() => {
        if (!this.loopShouldStop) {
          animate();
        } else {
          this.loopActive = false;
        }
      }, 1000 / this.POLLRATE);
    };
    this.loopActive = true;
    animate();
  }


  checkKeys() {
    if (this.keyPressed[65]) {
      // 'a' key
      this.loopShouldStop = false;
      this.actionHandler.sendInputMessage('moveLeft');
    } else if (this.keyPressed[68]) {
      // 'd' key
      this.loopShouldStop = false;
      this.actionHandler.sendInputMessage('moveRight');
    } else {
      this.loopShouldStop = true;
    }
  }
}

module.exports = InputManager;
