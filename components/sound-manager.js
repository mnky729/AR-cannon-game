AFRAME.registerComponent('sound-manager', {
  init: function () {
    this.fireSound = new Audio('./assets/cannon-fire.mp3');

    this.el.addEventListener('cannon-fired', () => {
      this.fireSound.currentTime = 0; // Ensure starts at beginning
      this.fireSound.play();
    });

    this.el.addEventListener('countdown', () => {
      const countdownSound = new Audio('./assets/countdown.mp3');
      countdownSound.play();
    });
  }
});
