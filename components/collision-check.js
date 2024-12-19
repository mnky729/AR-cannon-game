AFRAME.registerComponent('collision-check', {
    schema: {
      targetSelector: { type: 'string', default: '.target' },
      threshold: { type: 'number', default: 0.5 } // Collision distance
    },
    tick: function () {
      // Get the world position of the ball
      const ballWorldPos = new THREE.Vector3();
      this.el.object3D.getWorldPosition(ballWorldPos);
  
      const targets = document.querySelectorAll(this.data.targetSelector);
      targets.forEach((target) => {
        // Get the world position of the target
        const targetWorldPos = new THREE.Vector3();
        target.object3D.getWorldPosition(targetWorldPos);
  
        const distance = ballWorldPos.distanceTo(targetWorldPos);
  
        // Debugging logs
        console.log('Ball position:', ballWorldPos);
        console.log('Target position:', targetWorldPos);
        console.log('Distance:', distance);
  
        if (distance <= this.data.threshold) {
          target.emit('hit');
          this.el.setAttribute('visible', false); // Hide ball on hit
        }
      });
    }
  });