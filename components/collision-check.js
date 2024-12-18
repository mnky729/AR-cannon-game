AFRAME.registerComponent('collision-check', {
    init: function () {
        const raycaster = new THREE.Raycaster();
        const ball = this.el;
        const targets = document.querySelectorAll('.target'); // Add class to targets

        ball.addEventListener('animationcomplete', () => {
            targets.forEach(target => {
                raycaster.set(ball.object3D.position, new THREE.Vector3(0, -1, 0)); // Raycast downward
                const intersects = raycaster.intersectObject(target.object3D, true);
                if (intersects.length > 0) {
                    target.emit('hit'); // Trigger hit event
                }
            });
        });
    }
});
