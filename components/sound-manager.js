AFRAME.registerComponent('sound-manager', {
  init: function () {
    const bgMusic = document.createElement('audio');
    bgMusic.src = './assets/background.mp3';
    bgMusic.loop = true;
    bgMusic.play();

    this.fireSound = new Audio('./assets/cannon-fire.mp3');

    this.el.addEventListener('cannon-fired', () => {
      this.fireSound.play();
    });
  }
});
