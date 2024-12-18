AFRAME.registerComponent('hit-feedback', {
    init: function () {
      this.el.setAttribute('visible', false);
      this.el.addEventListener('hit', () => {
        this.showFeedback();
      });
    },
    showFeedback: function() {
      this.el.setAttribute('visible', true);
      setTimeout(() => {
        this.el.setAttribute('visible', false);
      }, 1000);
    }
  });