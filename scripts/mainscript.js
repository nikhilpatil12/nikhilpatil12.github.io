import * as THREE from '../node_modules/three/src/Three.js';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

      // Set up the mouse circle
      const mouseCircleGeometry = new THREE.RingGeometry(0.010, 0.016, 32);
      const mouseCircleMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
      });
      const mouseCircle = new THREE.Mesh(
        mouseCircleGeometry,
        mouseCircleMaterial
      );
      scene.add(mouseCircle);

      // Set up variables for easing
      let targetPosition = new THREE.Vector3();
      let currentPosition = new THREE.Vector3();

      // Update the mouse position on mouse move using easing
      function onMouseMove(event) {
        targetPosition.set(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
          0.5
        );
        targetPosition.unproject(camera);
      }
// Create the particle system
var particleCount = 1000;
var geometry = new THREE.BufferGeometry();
var positions = new Float32Array(particleCount * 3);
var velocities = new Float32Array(particleCount * 3);
var material = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 5,
  map: new THREE.TextureLoader().load("https://threejs.org/examples/textures/sprites/disc.png"),
  blending: THREE.AdditiveBlending,
  depthTest: false,
  transparent: true
});

for (var i = 0; i < positions.length; i += 3) {
  positions[i] = Math.random() * 100 - 50;
  positions[i + 1] = Math.random() * 100 - 50;
  positions[i + 2] = Math.random() * 100 - 50;

  // Add a random velocity to each particle
  velocities[i] = Math.random() - 0.5;
  velocities[i + 1] = Math.random() - 0.5;
  velocities[i + 2] = Math.random() - 0.5;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
var particleSystem = new THREE.Points(geometry, material);
scene.add(particleSystem);

// Add ambient light to the scene
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

function animate() {
    renderer.render(scene, camera);
    for (var i = 0; i < particleCount; i++) {
        // Update the particle position based on its velocity
        positions[i * 3] += velocities[i * 3] * 0.1;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * 0.1;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * 0.1;

        // Check if the particle is out of bounds, and wrap it around if it is
        if (positions[i * 3] > 50) {
        positions[i * 3] = -50;
        } else if (positions[i * 3] < -50) {
        positions[i * 3] = 50;
        }
        if (positions[i * 3 + 1] > 50) {
        positions[i * 3 + 1] = -50;
        } else if (positions[i * 3 + 1] < -50) {
        positions[i * 3 + 1] = 50;
        }      
    }

    // Update the buffer attribute positions
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleSystem.geometry.attributes.position.needsUpdate = true;
    // Update the current position using easing
    const difference = targetPosition.clone().sub(currentPosition);
    const acceleration = difference.multiplyScalar(0.05);
    currentPosition.add(acceleration);
    mouseCircle.position.copy(currentPosition);

    // Request the next frame of the animation loop
    requestAnimationFrame(animate);
}

function onDocumentMouseMove(event) {
// Calculate mouse position in normalized device coordinates
var mouse = new THREE.Vector2(
(event.clientX / window.innerWidth) * 2 - 1,
-(event.clientY / window.innerHeight) * 2 + 1
);

// Update the camera position based on the mouse position
camera.position.x = mouse.x * 20;
camera.position.y = mouse.y * 20;
camera.lookAt(scene.position);
}

document.addEventListener('mousemove', onDocumentMouseMove, false);

animate();
function openNav() {
    document.getElementById("divPopup").style.height = "100%";
    $("#divHamBurgerButton").hide();
    
    // $("#new")[0].style.height = "100%";

    // document.getElementById("new").style.height = "100%";
    // document.getElementById("divSide").style.visibility = "visible";
}
function closeNav() {
    document.getElementById("divPopup").style.height = "0%";
    $("#divHamBurgerButton").show();

    // $("#new")[0].style.height = "0%";

    // document.getElementById("new").style.height = "0%";
    // document.getElementById("divSide").style.visibility = "collapse";

}

window.addEventListener('resize', function(event) {
    if(event.target.outerWidth<576)
        closeNav();
    else
        openNav();
}, true);
// $(document).ready(function() { 
//     closeNav();
    
// });
window.addEventListener('load', 
  function() { 
    if(window.outerWidth<576)
        closeNav();
  }, false);