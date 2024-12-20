// sound-manager.js
AFRAME.registerComponent('sound-manager', {
  init: function () {
    this.fireSound = new Audio('./assets/cannon-fire.mp3');
    this.activeSounds = []; // Keep track of currently playing sounds

    this.el.addEventListener('cannon-fired', () => {
      this.playSoundEffect(this.fireSound);
    });

    this.el.addEventListener('countdown', () => {
      const countdownSound = new Audio('./assets/countdown.mp3');
      this.playSoundEffect(countdownSound);
    });

    // Listen for a pause-all-sounds event and pause all active sounds
    this.el.addEventListener('pause-all-sounds', () => {
      this.pauseAllActiveSounds();
    });
  },

  playSoundEffect(sound) {
    sound.currentTime = 0;
    sound.play();
    this.activeSounds.push(sound);

    // Once the sound ends, remove it from activeSounds
    sound.addEventListener('ended', () => {
      const index = this.activeSounds.indexOf(sound);
      if (index !== -1) {
        this.activeSounds.splice(index, 1);
      }
    }, { once: true });
  },

  pauseAllActiveSounds() {
    // Pause all currently active sounds
    this.activeSounds.forEach(sound => {
      if (!sound.paused) {
        sound.pause();
      }
    });
    // If you want to clear them out altogether so they don't resume:
    // this.activeSounds = [];
  }
});
