AFRAME.registerComponent('hit-feedback', {
    init: function () {
      // Start hidden
      this.el.setAttribute('visible', false);
  
      // Listen for 'hit' events on this entity
      this.el.addEventListener('hit', () => {
        this.showFeedback();
      });
    },
    showFeedback: function() {
      // Show red plane
      this.el.setAttribute('visible', true);
  
      // Hide after 1 second
      setTimeout(() => {
        this.el.setAttribute('visible', false);
      }, 1000);
    }
  });
  