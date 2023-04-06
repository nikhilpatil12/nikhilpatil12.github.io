
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

      // Set up the wireframe mesh
      var planetGeometry = new THREE.IcosahedronGeometry(2, 4);
      var planetMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
      });
      var planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
      scene.add(planetMesh);

      // Set up the mouse position
      var mouseX = 0;
      var mouseY = 0;

      // Add an event listener to update the mouse position on mousemove
      document.addEventListener("mousemove", function (event) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      });

      // Set up the animation loop
      function animate() {
        requestAnimationFrame(animate);

        // Rotate the mesh based on the mouse position
        planetMesh.rotation.x = mouseY;
        planetMesh.rotation.y = mouseX;

        // Render the scene
        renderer.render(scene, camera);
      }
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