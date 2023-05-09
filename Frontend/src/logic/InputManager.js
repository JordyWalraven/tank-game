class InputManager {
  constructor(actionHandler) {
    this.canvasRef = document.getElementById('gameCanvas');

    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
    this.actionHandler = actionHandler;
    this.keyPressed = {
      65: false, // 'a' key
      68: false, // 'd' key
    };
    this.POLLRATE = 60;
    this.loopActive = false;
    this.loopShouldStop = false;
  }

  handleKeyDown(event) {
    if (event.keyCode === 65) {
      // 'a' key
      this.actionHandler.sendMoveMessage('left');
      this.keyPressed[65] = true;
      event.preventDefault();
    } else if (event.keyCode === 68) {
      // 'd' key
      this.actionHandler.sendMoveMessage('right');
      this.keyPressed[68] = true;
      event.preventDefault();
    }
    if (!this.loopActive) {
      this.scheduleCheckKeys();
    }
  }

  handleKeyUp(event) {
    if (event.keyCode === 65) {
      // 'a' key
      this.keyPressed[65] = false;
      event.preventDefault();
    } else if (event.keyCode === 68) {
      // 'd' key
      this.keyPressed[68] = false;
      event.preventDefault();
    }
    if (!this.loopActive) {
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
      this.actionHandler.sendMoveMessage('left');
    } else if (this.keyPressed[68]) {
      // 'd' key
      this.loopShouldStop = false;
      this.actionHandler.sendMoveMessage('right');
    } else {
      this.loopShouldStop = true;
    }
  }
}

module.exports = InputManager;
