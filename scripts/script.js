window.addEventListener(
  "resize",
  function (event) {
    if (event.target.outerWidth < 576) closeNav();
    else openNav();
  },
  true
);
window.addEventListener(
  "load",
  function () {
    if (window.outerWidth < 576) {
      closeNav();
    } else {
      // Add an event listener to update the mouse position on mousemove
      document.addEventListener("mousemove", function (event) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      });
      // Reset the mouse position when the mouse leaves the canvas
      document.addEventListener("mouseleave", function (event) {
        mouseX = 0;
        mouseY = 0;
      });
    }
  },
  false
);

// Set up the scene, camera, and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up the background mesh
var planeGeometry = new THREE.PlaneGeometry(200, 400);
var planeMaterial = new THREE.MeshBasicMaterial({
  color: 0x282828,
});
var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.position.z -= 50;
scene.add(planeMesh);

// Set up the wireframe mesh
var planetGeometry = new THREE.IcosahedronGeometry(2, 2);
// var planetMaterial = new THREE.MeshBasicMaterial({
//   color: 0x0d6efd,
//   // wireframe: true,
// });
const planetMaterial = new THREE.MeshPhongMaterial({
  color: 0x0000ff, // base color of the material
  specular: 0xfaaaff, // color of the specular highlight
  shininess: 5, // controls the size and sharpness of the specular highlight
  wireframe: true,
});
// const planetMaterial = new THREE.MeshPhysicalMaterial({
//   color: 0x0000ff, // base color of the material
//   metalness: 0.1, // controls the amount of metal-like reflection
//   roughness: 0, // controls the amount of roughness on the surface
//   clearcoat: 1, // controls the thickness and intensity of the clearcoat layer
//   clearcoatRoughness: 0.25, // controls the roughness of the clearcoat layer
//   wireframe: true,
// });

var planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

scene.add(planetMesh);

const directionallight = new THREE.DirectionalLight(0xffffff, 1);
directionallight.position.set(10, 0, 0); // set the direction of the light
scene.add(directionallight);

const ambientlight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientlight);

// Set up the mouse position
var mouseX = 0;
var mouseY = 0;

// Set up the animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the planetMesh based on the mouse position
  if (mouseX != 0 && mouseY != 0) {
    planetMesh.rotation.x = mouseY;
    planetMesh.rotation.y = mouseX;
  } else {
    planetMesh.rotation.x += 0.005;
    planetMesh.rotation.y += 0.008;
  }
  // Render the scene
  renderer.render(scene, camera);
}
animate();
