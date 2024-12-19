AFRAME.registerComponent('collision-check', {
    schema: {
      targetSelector: { type: 'string', default: '.target' },
      threshold: { type: 'number', default: 0.5 } // Collision distance
    },
    tick: function () {
      const ballPos = this.el.object3D.position;
      const targets = document.querySelectorAll(this.data.targetSelector);
      targets.forEach((target) => {
        const targetPos = target.object3D.position;
        const distance = ballPos.distanceTo(targetPos);
        if (distance <= this.data.threshold) {
          target.emit('hit');
          this.el.setAttribute('visible', false); // Hide ball on hit
        }
      });
    }
  });
  