// // components/cannon-ball.js

// AFRAME.registerComponent('cannon-ball', {
//   schema: {
//     target: { type: 'selector' }
//   },
//   init: function() {
//     this.isFired = false;
//     this.ball = this.el;
//     this.interval = null;
//     this.ball.setAttribute('visible', false);

//     this.el.addEventListener('fire', () => {
//       if (!this.isFired) {
//         this.fireBall();
//       }
//     });
//   },

//   fireBall: function() {
//     this.isFired = true;
//     this.ball.setAttribute('visible', true);

//     const cannonEl = this.el.parentNode;
//     const cannonWorldPos = new THREE.Vector3();
//     cannonEl.object3D.getWorldPosition(cannonWorldPos);

//     // Get the cannon's forward direction
//     const direction = new THREE.Vector3();
//     cannonEl.object3D.getWorldDirection(direction);

//     // Debugging: Log the direction before any adjustments
//     console.log("Cannon Forward Direction:", direction);

//     // Optional: Add upward tilt for firing angle
//     // Uncomment the next two lines if you want to tilt the firing angle upwards
//     // direction.y += 0.3; // Adjust this value to control the tilt
//     // direction.normalize(); // Normalize to maintain consistent speed

//     // Define an offset distance to position the ball at the barrel's end
//     const offsetDistance = 1; // Adjust based on your cannon model
//     const startPos = {
//       x: cannonWorldPos.x + direction.x * offsetDistance,
//       y: cannonWorldPos.y + 0.2, // Adjust as needed
//       z: cannonWorldPos.z + direction.z * offsetDistance
//     };
//     this.ball.setAttribute('position', startPos);

//     let time = 0;
//     const gravity = 9.8;

//     if (this.interval) clearInterval(this.interval);

//     this.interval = setInterval(() => {
//       time += 0.05;

//       // Projectile motion calculations
//       const speedMultiplier = 30; // Adjust for forward speed
//       const initialUpwardVelocity = 5; // Adjust for firing angle

//       const newY = startPos.y + (initialUpwardVelocity * time) - (0.5 * gravity * time * time);
//       const distance = speedMultiplier * time;

//       // Calculate new position based on direction
//       const newX = startPos.x + direction.x * distance;
//       const newZ = startPos.z + direction.z * distance;

//       this.ball.setAttribute('position', { x: newX, y: newY, z: newZ });

//       // Debugging: Log the new position
//       console.log(`Ball Position at time ${time.toFixed(2)}s: (${newX.toFixed(2)}, ${newY.toFixed(2)}, ${newZ.toFixed(2)})`);

//       // End condition: when the ball hits the ground or goes too far
//       if (newY <= 0 || distance > 20 || time > 5) { // Adjust max distance/time as needed
//         clearInterval(this.interval);
//         this.interval = null;
//         this.ball.setAttribute('visible', false);
//         this.ball.setAttribute('position', { x: 0, y: 0.2, z: 0 });

//         // Check collision
//         this.checkCollision();
//       }
//     }, 50);
//   },

//   checkCollision: function() {
//     const target = this.data.target;
//     if (!target || target === this.el.parentNode) {
//       console.log("Ignoring self-collision or no target");
//       this.isFired = false;
//       this.el.sceneEl.emit('firing-complete');
//       return;
//     }

//     // Get final ball position
//     const ballWorldPos = new THREE.Vector3();
//     this.ball.object3D.getWorldPosition(ballWorldPos);

//     // Get target position
//     const targetWorldPos = new THREE.Vector3();
//     target.object3D.getWorldPosition(targetWorldPos);

//     // Calculate distance
//     const distance = ballWorldPos.distanceTo(targetWorldPos);
//     const hitThreshold = 1.5; // Adjust based on your scene scale

//     console.log(`Distance to Target: ${distance.toFixed(2)} (Threshold: ${hitThreshold})`);

//     if (distance < hitThreshold) {
//       // Hit detected

//       // Emit hit on hit-feedback plane
//       const isBlueTarget = target.id.includes('blue');
//       const hitPlane = document.querySelector(isBlueTarget ? '#blueHitPlane' : '#greenHitPlane');
//       hitPlane.emit('hit');

//       // Emit hit on target
//       target.emit('hit');

//       // Determine which cannon to hit based on this cannon's id
//       const cannonEl = this.el.parentNode;
//       let cannonToHit;

//       if (cannonEl.id === 'greenCannon') {
//         cannonToHit = document.querySelector('#blueCannon');
//       } else if (cannonEl.id === 'blueCannon') {
//         cannonToHit = document.querySelector('#greenCannon');
//       }

//       if (cannonToHit) {
//         cannonToHit.emit('hit');
//       }

//       // Emit firing-complete after feedback
//       setTimeout(() => {
//         this.el.sceneEl.emit('firing-complete');
//       }, 1000);
//     } else {
//       // Missed the target
//       setTimeout(() => {
//         this.el.sceneEl.emit('firing-complete');
//       }, 500);
//     }

//     this.isFired = false;
//   }
// });