AFRAME.registerComponent('countdown-manager', {
    init: function () {
      this.isGreenTurn = true;
      this.countdown = 5;
      this.isRunning = false; // Start paused until a marker is visible
      this.hasStarted = false; // To track if the countdown has ever started
      this.timer = null; // Store the interval timer
  
      this.greenText = document.querySelector('#greenTimer');
      this.blueText = document.querySelector('#blueTimer');
      this.greenBall = document.querySelector('#greenBall');
      this.blueBall = document.querySelector('#blueBall');
      this.greenCannon = document.querySelector('#greenCannon');
      this.blueCannon = document.querySelector('#blueCannon');
      this.greenTarget = document.querySelector('#greenTarget');
      this.blueTarget = document.querySelector('#blueTarget');
      this.pauseText = document.querySelector('#pauseText');
      this.backgroundSound = document.querySelector('#backgroundSound'); // Assuming you have id="backgroundSound" for your a-sound
  
      this.greenMarker = document.querySelector('#greenMarker');
      this.blueMarker = document.querySelector('#blueMarker');
  
      this.greenMarker.addEventListener('markerFound', () => { this.onMarkerFound(); });
      this.greenMarker.addEventListener('markerLost', () => { this.onMarkerLost(); });
      this.blueMarker.addEventListener('markerFound', () => { this.onMarkerFound(); });
      this.blueMarker.addEventListener('markerLost', () => { this.onMarkerLost(); });
    },
  
    onMarkerFound: function () {
      // If the game isn't running, resume or start the countdown
      if (!this.isRunning) {
        this.isRunning = true;
        this.pauseText.setAttribute('visible', false);
  
        // Resume background music if paused
        this.backgroundSound.components.sound.playSound();
  
        // If we never started before, initialize countdown to 5
        if (!this.hasStarted) {
          this.countdown = 5;
          this.hasStarted = true;
        }
  
        this.startCountdown();
      }
    },
  
    onMarkerLost: function () {
      // Check visibility of markers
      const greenVisible = this.greenMarker && this.greenMarker.object3D.visible;
      const blueVisible = this.blueMarker && this.blueMarker.object3D.visible;
  
      if (!greenVisible && !blueVisible) {
        // No markers visible, pause the countdown
        this.isRunning = false;
        // Show paused text
        this.pauseText.setAttribute('visible', true);
        // Pause background sound
        this.backgroundSound.components.sound.pauseSound();
  
        // Clear the countdown timer
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }
    },
  
    startCountdown: function () {
      // If not running or timer already exists, do nothing
      if (!this.isRunning || this.timer) return;
  
      // Create a new interval only if there isn't one
      this.timer = setInterval(() => {
        if (!this.isRunning) {
          clearInterval(this.timer);
          this.timer = null;
          return;
        }
  
        // Update the UI
        if (this.isGreenTurn) {
          this.greenText.setAttribute('value', this.countdown.toString());
          this.blueText.setAttribute('value', '');
        } else {
          this.blueText.setAttribute('value', this.countdown.toString());
          this.greenText.setAttribute('value', '');
        }
  
        this.countdown--;
  
        if (this.countdown < 0) {
          clearInterval(this.timer);
          this.timer = null;
  
          if (!this.isRunning) return;
  
          this.fireCannonBall(
            this.isGreenTurn ? this.greenBall : this.blueBall,
            this.isGreenTurn ? this.greenCannon : this.blueCannon
          );
  
          setTimeout(() => {
            if (!this.isRunning) return;
            this.isGreenTurn = !this.isGreenTurn;
            // Just call startCountdown again to continue the next round
            // No reset of countdown here because after firing, we want a new round starting again at 5
            this.countdown = 5;
            this.startCountdown();
          }, 500);
        }
      }, 1000);
    },
  
    fireCannonBall: function (ball, cannon) {
      if (!this.isRunning) return;
  
      ball.setAttribute('visible', 'true');
      cannon.emit('cannon-fired');
  
      this.el.sceneEl.object3D.updateMatrixWorld(true);
  
      const cannonPos = cannon.object3D.position;
      const startPos = {
        x: cannonPos.x,
        y: cannonPos.y + 0.2,
        z: cannonPos.z + 0.9,
      };
  
      ball.setAttribute('position', startPos);
  
      let time = 0;
  
      const interval = setInterval(() => {
        if (!this.isRunning) {
          clearInterval(interval);
          return;
        }
  
        this.el.sceneEl.object3D.updateMatrixWorld(true);
  
        time += 0.05;
  
        const gravity = 9.8;
        const forwardVelocity = 2;
        const upwardVelocity = 5;
  
        const newX = startPos.x;
        const newY = startPos.y + upwardVelocity * time - 0.5 * gravity * time * time;
        const newZ = startPos.z + forwardVelocity * time;
  
        ball.setAttribute('position', { x: newX, y: newY, z: newZ });
  
        if (newY <= 0) {
          clearInterval(interval);
          ball.setAttribute('visible', 'false');
          ball.setAttribute('position', { x: 0, y: 0.2, z: 0 });
          return;
        }
  
        const ballWorldPos = new THREE.Vector3();
        ball.object3D.getWorldPosition(ballWorldPos);
  
        const targets = document.querySelectorAll('.target');
        let hit = false;
        targets.forEach(target => {
          const targetWorldPos = new THREE.Vector3();
          target.object3D.getWorldPosition(targetWorldPos);
  
          const distance = ballWorldPos.distanceTo(targetWorldPos);
          console.log(`Checking collision. Ball: ${ballWorldPos.x.toFixed(2)}, ${ballWorldPos.y.toFixed(2)}, ${ballWorldPos.z.toFixed(2)} | Target: ${targetWorldPos.x.toFixed(2)}, ${targetWorldPos.y.toFixed(2)}, ${targetWorldPos.z.toFixed(2)} | Distance: ${distance.toFixed(2)}`);
  
          if (distance <= 10) {
            console.log("HIT DETECTED AT LARGE THRESHOLD");
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
  