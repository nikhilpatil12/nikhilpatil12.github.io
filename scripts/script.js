// window.onload = function () {
//   // Hide the preloader once all assets are loaded
//   document.getElementById("preloader").style.display = "none";
// };
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("#menu a.li-nav"); // Target links within the menu

  if (!sections.length || !navLinks.length) {
    console.log("Scrollspy setup failed: Sections or Nav links not found.");
    return;
  }

  const observerOptions = {
    root: null, // relative to viewport
    rootMargin: "0px",
    threshold: 0.4, // Trigger when 40% of the section is visible
  };

  let activeSectionId = null;
  let lastY = window.scrollY;
  const observerCallback = (entries) => {
    // let minTopValue = Infinity;
    let foundIntersecting = false;

    entries.forEach((entry) => {
      const goingUp = window.scrollY < lastY;
      lastY = window.scrollY;
      if (entry.isIntersecting) {
        console.log(
          "Intersected while",
          goingUp ? "scrolling up" : "scrolling down",
        );

        foundIntersecting = true;
        // Find the section whose top is closest to the top of the viewport
        // const top = entry.boundingClientRect.top;
        // Prioritize sections closer to the top, allowing for slight negative values
        // This helps when scrolling up and a section top passes the viewport top slightly
        // if (top >= -100 && top < minTopValue) {
        // minTopValue = top;
        activeSectionId = entry.target.id;
        // }
      }
    });

    // If no section met the criteria (e.g., scrolled past all sections quickly),
    // you might want a fallback or just keep the last active one.
    // For simplicity, we only update if we found a suitable intersecting section.
    console.log("Active Section ID:", activeSectionId); // DEBUG LOG

    // Update navigation links
    navLinks.forEach((link) => {
      link.classList.remove("current-section-link");
      const linkHref = link.getAttribute("href");
      // Check if linkHref is not null and remove the leading '#'
      const linkSectionId = linkHref ? linkHref.substring(1) : null;

      if (linkSectionId && linkSectionId === activeSectionId) {
        console.log("Highlighting:", link.getAttribute("href")); // DEBUG LOG
        link.classList.add("current-section-link");
      }
    });

    // Special case: If scrolled to the very top, highlight 'about' or the first link
    // if (window.scrollY === 0 && navLinks.length > 0) {
    //   navLinks.forEach((link) => link.classList.remove("current-section-link"));
    //   // Assuming the first link corresponds to the top-most section if applicable
    //   const firstLink = document.querySelector('#menu a.li-nav[href^="#"]');
    //   if (firstLink) {
    //     firstLink.classList.add("current-section-link");
    //   }
    // }

    // Special case: If scrolled to the very bottom, highlight 'contact'
    // Check if the bottom of the page is reached
    // if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
    //   // Add a small buffer
    //   navLinks.forEach((link) => link.classList.remove("current-section-link"));
    //   const contactLink = document.querySelector(
    //     '#menu a.li-nav[href="#contact"]',
    //   );
    //   if (contactLink) {
    //     contactLink.classList.add("current-section-link");
    //   }
    // }
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });

  // Initial check in case the page loads mid-way or at the bottom
  // We can trigger the callback logic once manually, but it might be complex
  // without the intersection data. A simpler initial state might be to
  // just highlight the first link by default.
  if (navLinks.length > 0 && window.scrollY < 100) {
    // If near the top on load
    const firstLink = document.querySelector('#menu a.li-nav[href^="#"]');
    if (firstLink) {
      firstLink.classList.add("current-section-link");
    }
  }

  const left_in_observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("opacity-0", "-translate-x-40");
          entry.target.classList.add("opacity-100", "translate-x-0");
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    {
      threshold: 0.4,
    },
  );

  document.querySelectorAll(".slide-in-left").forEach((el) => {
    left_in_observer.observe(el);
  });

  const right_in_observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("opacity-0", "translate-x-40");
          entry.target.classList.add("opacity-100", "translate-x-0");
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    {
      threshold: 0.4,
    },
  );

  document.querySelectorAll(".slide-in-right").forEach((el) => {
    right_in_observer.observe(el);
  });
});

const openNav = () => {
  document.getElementById("divPopup").style.height = "100%";
  // $("#new")[0].style.height = "100%";
  // document.getElementById("new").style.height = "100%";
  // document.getElementById("divSide").style.visibility = "visible";
};
const closeNav = () => {
  if (window.outerWidth < 576) {
    document.getElementById("divPopup").style.height = "0%";
    // $("#new")[0].style.height = "0%";
    // document.getElementById("new").style.height = "0%";
    // document.getElementById("divSide").style.visibility = "collapse";
  } else {
    document.getElementById("divHamBurgerButton").style.display = "none";
  }
};
window.addEventListener(
  "resize",
  function (event) {
    if (event.target.outerWidth < 576) closeNav();
    else openNav();
  },
  true,
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

      // Add the mouse move event listener to the window
      window.addEventListener("mousemove", onMouseMove, false);

      // Add the mouse down and up event listeners to the window
      window.addEventListener("mousedown", onMouseDown, false);
      window.addEventListener("mouseup", onMouseUp, false);
    }
  },
  false,
);
import * as THREE from "three";
// Set up the scene, camera, and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = 5; // Create the first canvas
const canvasbg = document.createElement("canvas");
canvasbg.setAttribute("id", "canvasbg");
const rendererbg = new THREE.WebGLRenderer({
  canvas: canvasbg,
  antialias: true,
});

rendererbg.setSize(window.innerWidth, window.innerHeight);
document.getElementById("canvas-container").appendChild(rendererbg.domElement);

// Create the second canvas
const canvasfront = document.createElement("canvas");
canvasfront.setAttribute("id", "canvasfront");
const rendererfront = new THREE.WebGLRenderer({
  canvas: canvasfront,
  antialias: true,
  alpha: true,
});
rendererfront.setSize(window.innerWidth, window.innerHeight);
document
  .getElementById("canvas-container")
  .appendChild(rendererfront.domElement);

// Set up the background mesh
var planeGeometry = new THREE.PlaneGeometry(200, 400);
var planeMaterial = new THREE.MeshBasicMaterial({
  color: 0x0a192f,
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
  color: 0x64ffda, // base color of the material
  specular: 0x000000, // color of the specular highlight
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

const directionallight = new THREE.DirectionalLight(0x000, 1);
directionallight.position.set(10, -10, 0); // set the direction of the light
scene.add(directionallight);
const directionallight2 = new THREE.DirectionalLight(0x000, 1);
directionallight2.position.set(10, 10, 0); // set the direction of the light
scene.add(directionallight2);

const ambientlight = new THREE.AmbientLight(0xffffff, 0.99);
scene.add(ambientlight);

var scenefront = new THREE.Scene();
// Set the background of the scene to null to make it transparent
scenefront.background = null;
// Set up the mouse circle
const mouseCircleGeometry = new THREE.RingGeometry(0.01, 0.012, 32);
const mouseCircleMaterial = new THREE.MeshBasicMaterial({
  color: 0xccd6f6,
  transparent: true,
  opacity: 0.5,
});
const mouseCircle = new THREE.Mesh(mouseCircleGeometry, mouseCircleMaterial);
scenefront.add(mouseCircle);

// Set up variables for easing and click handling
let targetPosition = new THREE.Vector3();
let currentPosition = new THREE.Vector3();
let isMouseDown = false;

// Update the mouse position on mouse move using easing
function onMouseMove(event) {
  targetPosition.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1,
    0.5,
  );
  targetPosition.unproject(camera);
}

// Change the mouse circle to a solid circle on mouse down
function onMouseDown() {
  isMouseDown = true;
  mouseCircleMaterial.opacity = 0.5;
  mouseCircleGeometry.dispose();
  mouseCircle.geometry = new THREE.CircleGeometry(0.01, 32);
}

// Change the mouse circle back to a ring on mouse up
function onMouseUp() {
  isMouseDown = false;
  mouseCircleMaterial.opacity = 0.5;
  mouseCircleGeometry.dispose();
  mouseCircle.geometry = new THREE.RingGeometry(0.01, 0.012, 32);
}
// Set up the mouse position
var mouseX = 0;
var mouseY = 0;

// Set up the animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update the current position using easing
  const difference = targetPosition.clone().sub(currentPosition);
  const acceleration = difference.multiplyScalar(0.05);
  currentPosition.add(acceleration);
  mouseCircle.position.copy(currentPosition);

  // Rotate the planetMesh based on the mouse position
  mouseX != 0 && mouseY != 0
    ? (planetMesh.rotation.x = mouseY)
    : (planetMesh.rotation.x += 0.005);
  mouseX != 0 && mouseY != 0
    ? (planetMesh.rotation.y = mouseX)
    : (planetMesh.rotation.y += 0.008);
  mouseX = 0;
  mouseY = 0;
  // Render the scene
  rendererbg.render(scene, camera);
  // Render the scene
  rendererfront.render(scenefront, camera);
}
animate();

const canvasContainer = document.getElementById("canvas-container");
function resizeRenderer() {
  // setTimeout(function () {
  const width = canvasContainer.offsetWidth;
  const height = canvasContainer.offsetHeight;
  rendererbg.setSize(width, height);
  rendererfront.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  // }, 0);
}

resizeRenderer();
window.addEventListener("resize", resizeRenderer);
document.getElementById("btnHamBurger").addEventListener("click", openNav);
document.getElementById("btnClose").addEventListener("click", closeNav);
const sectionlinks = document.getElementsByClassName("li-nav");
for (let i = 0; i < sectionlinks.length; i++)
  sectionlinks[i].addEventListener("click", closeNav);
