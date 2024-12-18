AFRAME.registerComponent('countdown-manager', {
    init: function () {
      this.isGreenTurn = true;
      this.countdown = 5;
      this.isRunning = false;
  
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
  
      // When a marker is found, start or resume the game
      this.greenMarker.addEventListener('markerFound', () => { this.onMarkerFound(); });
      this.blueMarker.addEventListener('markerFound', () => { this.onMarkerFound(); });
  
      // When a marker is lost, pause the game
      this.greenMarker.addEventListener('markerLost', () => { this.onMarkerLost(); });
      this.blueMarker.addEventListener('markerLost', () => { this.onMarkerLost(); });
    },
  
    onMarkerFound: function() {
      // If the game isn't running, start or resume countdown
      if (!this.isRunning) {
        this.isRunning = true;
        this.startCountdown();
      }
    },
  
    onMarkerLost: function() {
      // If both markers are lost, pause the game
      // Check if at least one marker is still visible
      const greenVisible = this.greenMarker && this.greenMarker.isConnected && this.greenMarker.object3D.visible;
      const blueVisible = this.blueMarker && this.blueMarker.isConnected && this.blueMarker.object3D.visible;
  
      if (!greenVisible && !blueVisible) {
        this.isRunning = false;
      }
    },
  
    startCountdown: function () {
      if (!this.isRunning) return; // If the game got paused, do not run
  
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
        if (!this.isRunning) return;
        ball.setAttribute('visible', 'true');
        cannon.emit('cannon-fired');
      
        const cannonPos = cannon.object3D.position;
        const startPos = {
          x: cannonPos.x,
          y: cannonPos.y + 0.2,
          z: cannonPos.z
        };
        ball.setAttribute('position', startPos);
      
        let time = 0;
        const gravity = 9.8;
        const interval = setInterval(() => {
          if (!this.isRunning) {
            clearInterval(interval);
            ball.setAttribute('visible', 'false');
            return;
          }
      
          time += 0.05;
          // Adjust projectile logic for forward speed and arc:
          let newY = startPos.y + (2 * time) - (0.5 * gravity * time * time);
          let newZ = startPos.z - (0.3 * time * 30);
          let newX = startPos.x;
          ball.setAttribute('position', { x: newX, y: newY, z: newZ });
      
          if (newY <= 0 || newZ < -15) {
            clearInterval(interval);
            ball.setAttribute('visible', 'false');
            ball.setAttribute('position', { x: 0, y: 0.2, z: 0 });
      
            // Determine the target based on turn
            const target = this.isGreenTurn ? this.blueTarget : this.greenTarget;
            const cannonToHit = this.isGreenTurn ? this.blueCannon : this.greenCannon;
      
            // Get final ball world position
            const ballWorldPos = new THREE.Vector3();
            ball.object3D.getWorldPosition(ballWorldPos);
      
            // Get target world position
            const targetWorldPos = new THREE.Vector3();
            target.object3D.getWorldPosition(targetWorldPos);
      
            // Compute distance
            const distance = ballWorldPos.distanceTo(targetWorldPos);
            const hitThreshold = 1.0; // Adjust as needed for your scene scale
      
            if (distance < hitThreshold) {
              // Ball landed close enough to target: consider it a hit
      
              // Identify the correct hit plane
              const isBlueTarget = target.id.includes('blue');
              const hitPlane = document.querySelector(isBlueTarget ? '#blueHitPlane' : '#greenHitPlane');
              hitPlane.emit('hit');
      
              target.emit('hit');
              cannonToHit.emit('hit');
      
              setTimeout(() => {
                this.el.sceneEl.emit('firing-complete');
              }, 1000);
            } else {
              // Missed the target, no hit feedback or health deduction
              setTimeout(() => {
                this.el.sceneEl.emit('firing-complete');
              }, 500);
            }
          }
        }, 50);
      }
  });