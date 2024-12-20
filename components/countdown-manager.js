AFRAME.registerComponent('countdown-manager', {
  init: function () {
    this.isGreenTurn = true;
    this.countdown = 5;
    this.isRunning = false;
    this.hasStarted = false;
    this.timer = null;
    this.hasPlayedCountdownThisTurn = false; // New flag

    this.greenText = document.querySelector('#greenTimer');
    this.blueText = document.querySelector('#blueTimer');
    this.greenBall = document.querySelector('#greenBall');
    this.blueBall = document.querySelector('#blueBall');
    this.greenCannon = document.querySelector('#greenCannon');
    this.blueCannon = document.querySelector('#blueCannon');
    this.greenTarget = document.querySelector('#greenTarget');
    this.blueTarget = document.querySelector('#blueTarget');
    this.pauseText = document.querySelector('#pauseText');

    this.backgroundAudio = document.querySelector('#background');
    this.pauseAudio = document.querySelector('#pauseMusic');

    this.greenMarker = document.querySelector('#greenMarker');
    this.blueMarker = document.querySelector('#blueMarker');

    this.greenMarker.addEventListener('markerFound', () => { this.onMarkerFound(); });
    this.greenMarker.addEventListener('markerLost', () => { this.onMarkerLost(); });
    this.blueMarker.addEventListener('markerFound', () => { this.onMarkerFound(); });
    this.blueMarker.addEventListener('markerLost', () => { this.onMarkerLost(); });
  },

  onMarkerFound: function () {
    if (!this.isRunning) {
      this.isRunning = true;
      this.pauseText.setAttribute('visible', false);

      if (!this.pauseAudio.paused) {
        this.pauseAudio.pause();
        this.pauseAudio.currentTime = 0;
      }

      if (!this.hasStarted) {
        this.backgroundAudio.loop = true;
        this.backgroundAudio.play();
        this.hasStarted = true;
      } else {
        if (this.backgroundAudio.paused) {
          this.backgroundAudio.play();
        }
      }

      this.startCountdown();
    }
  },

  // countdown-manager.js 
  onMarkerLost: function () {
    const greenVisible = this.greenMarker && this.greenMarker.object3D.visible;
    const blueVisible = this.blueMarker && this.blueMarker.object3D.visible;

    if (!greenVisible && !blueVisible) {
      this.isRunning = false;
      this.pauseText.setAttribute('visible', true);

      if (!this.backgroundAudio.paused) {
        this.backgroundAudio.pause();
      }

      if (this.pauseAudio.paused) {
        this.pauseAudio.loop = true;
        this.pauseAudio.play();
      }

      // Emit pause-all-sounds event on scene so sound-manager receives it
      this.el.sceneEl.emit('pause-all-sounds');

      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  },


  startCountdown: function () {
    if (!this.isRunning || this.timer) return;

    // Only play the countdown sound if we haven't played it yet this turn
    if (!this.hasPlayedCountdownThisTurn) {
      this.el.sceneEl.emit('countdown');
      this.hasPlayedCountdownThisTurn = true;
    }

    this.timer = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(this.timer);
        this.timer = null;
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

          // Turn changed, reset the flag so we can play countdown sound next turn
          this.hasPlayedCountdownThisTurn = false;

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

      // Collision logic remains the same
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
