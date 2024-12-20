AFRAME.registerComponent('health-system', {
  schema: {
    health: { type: 'int', default: 3 }
  },
  init: function () {
    this.health = this.data.health;
    this.healthText = document.createElement('a-entity');
    this.healthText.setAttribute('text', {
      value: `Health: ${this.health}`,
      color: 'red',
      align: 'center',
      width: 8
    });

    // Adjust position and scale so text is clearly visible:
    // Move it above the target and a bit forward if needed
    this.healthText.setAttribute('position', '0 3 0');
    this.healthText.setAttribute('scale', '2 2 2');
    this.el.appendChild(this.healthText);

    this.el.addEventListener('hit', () => {
      this.deductHealth();
  
      const redFeedback = document.querySelector('#redFeedback');
      if (redFeedback) {
        redFeedback.setAttribute('visible', true);
        setTimeout(() => {
          redFeedback.setAttribute('visible', false);
        }, 1000);
      }
    });
  
    this.el.addEventListener('game-over', () => {
      this.showGameOver();
    });
  },
  deductHealth: function () {
    this.health--;
    this.healthText.setAttribute('text', 'value', `Health: ${this.health}`);
    if (this.health <= 0) {
      this.el.emit('game-over');
    }
  },
  showGameOver: function() {
    const isGreen = this.el.id.includes('green');
    const message = isGreen ? "You Won!" : "You Lost!";
    this.healthText.setAttribute('text', 'value', message);
  }
});
