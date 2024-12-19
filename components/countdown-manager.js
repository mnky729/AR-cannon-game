AFRAME.registerComponent('countdown-manager', {
    init: function () {
      this.isGreenTurn = true;
      this.countdown = 5;
      this.isRunning = true;
  
      this.greenText = document.querySelector('#greenTimer');
      this.blueText = document.querySelector('#blueTimer');
      this.greenBall = document.querySelector('#greenBall');
      this.blueBall = document.querySelector('#blueBall');
      this.greenCannon = document.querySelector('#greenCannon');
      this.blueCannon = document.querySelector('#blueCannon');
      this.greenTarget = document.querySelector('#greenTarget');
      this.blueTarget = document.querySelector('#blueTarget');
  
      this.greenMarker = document.querySelector('#greenMarker');
      this.blueMarker = document.querySelector('#blueMarker');
      this.startCountdown();

    },

  
    startCountdown: function () {  
      this.countdown = 5;
      const timer = setInterval(() => {
        if (!this.isRunning) {
          clearInterval(timer);
          return;
        }
  
        if (this.isGreenTurn) {
          this.greenText.setAttribute('value', this.countdown.toString());
          this.blueText.setAttribute('value', '');
        } else {
          this.blueText.setAttribute('value', this.countdown.toString());
          this.greenText.setAttribute('value', '');
        }
  
        this.countdown--;
  
        if (this.countdown < 0) {
          clearInterval(timer);
          // If paused mid-countdown
          if (!this.isRunning) return;
  
          this.fireCannonBall(
            this.isGreenTurn ? this.greenBall : this.blueBall,
            this.isGreenTurn ? this.greenCannon : this.blueCannon
          );
  
          setTimeout(() => {
            if (!this.isRunning) return;
            this.isGreenTurn = !this.isGreenTurn;
            this.startCountdown(); // Start next round after firing sequence completes
          }, 500);
        }
      }, 1000);
    },
    fireCannonBall: function (ball, cannon) {
        ball.setAttribute('visible', 'true');
      
        // Ensure transformations are up to date
        this.el.sceneEl.object3D.updateMatrixWorld(true);
      
        const cannonPos = cannon.object3D.position;
        const startPos = {
          x: cannonPos.x,
          y: cannonPos.y + 0.2,
          z: cannonPos.z + 0.9,
        };
      
        ball.setAttribute('position', startPos);
      
        let time = 0;
        const maxTime = 5; // 5 seconds, adjust if needed
      
        // Adjust these parameters to make the ball travel further
        const gravity = 9.8;
        const forwardVelocity = 2; 
        const upwardVelocity = 5; 
      
        const interval = setInterval(() => {
          this.el.sceneEl.object3D.updateMatrixWorld(true);
      
          time += 0.05;
      
          // Calculate new position
          const newX = startPos.x;
          const newY = startPos.y + upwardVelocity * time - 0.5 * gravity * time * time;
          const newZ = startPos.z + forwardVelocity * time;
      
          ball.setAttribute('position', { x: newX, y: newY, z: newZ });
      
          // Debug: Log the position
          console.log(`Ball position: x=${newX} y=${newY} z=${newZ}`);
      
          // If we've exceeded the maxTime, stop the ball anyway
          if (time > maxTime) {
            clearInterval(interval);
            ball.setAttribute('visible', 'false');
            ball.setAttribute('position', { x: 0, y: 0.2, z: 0 });
            return;
          }
      
          // Check collision in world space
          const ballWorldPos = new THREE.Vector3();
          ball.object3D.getWorldPosition(ballWorldPos);
      
          const targets = document.querySelectorAll('.target');
          let hit = false;
          targets.forEach(target => {
            const targetWorldPos = new THREE.Vector3();
            target.object3D.getWorldPosition(targetWorldPos);
      
            const distance = ballWorldPos.distanceTo(targetWorldPos);
            if (distance <= 0.5) {
              target.emit('hit');
              hit = true;
            }
          });
      
          if (hit) {
            clearInterval(interval);
            ball.setAttribute('visible', 'false');
            ball.setAttribute('position', { x: 0, y: 0.2, z: 0 });
          }
      
        }, 50);
      }
      
      
      
      
  });