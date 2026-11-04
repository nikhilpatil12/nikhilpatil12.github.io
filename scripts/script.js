// --- Navigation Drawer Functions ---
const openNav = () => {
  const popup = document.getElementById("divPopup");
  if (popup) {
    popup.style.height = "100%";
  }
};

const closeNav = () => {
  if (window.innerWidth < 576) {
    const popup = document.getElementById("divPopup");
    if (popup) {
      popup.style.height = "0%";
    }
  }
};

function setupNav() {
  const btnHamBurger = document.getElementById("btnHamBurger");
  const btnClose = document.getElementById("btnClose");
  if (btnHamBurger) {
    btnHamBurger.removeEventListener("click", openNav);
    btnHamBurger.addEventListener("click", openNav);
  }
  if (btnClose) {
    btnClose.removeEventListener("click", closeNav);
    btnClose.addEventListener("click", closeNav);
  }

  const sectionlinks = document.getElementsByClassName("li-nav");
  for (let i = 0; i < sectionlinks.length; i++) {
    sectionlinks[i].removeEventListener("click", closeNav);
    sectionlinks[i].addEventListener("click", closeNav);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
}

window.addEventListener("resize", () => {
  const popup = document.getElementById("divPopup");
  if (!popup) return;
  if (window.innerWidth >= 576) {
    popup.style.height = "";
  } else {
    if (popup.style.height !== "100%") {
      popup.style.height = "0%";
    }
  }
});

// --- Scrollspy & Scroll Animations ---
function setupScrollspy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("#menu a.li-nav");

  if (!sections.length || !navLinks.length) {
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.4,
  };

  let activeSectionId = null;
  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSectionId = entry.target.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("current-section-link");
      const linkHref = link.getAttribute("href");
      const linkSectionId = linkHref ? linkHref.substring(1) : null;

      if (linkSectionId && linkSectionId === activeSectionId) {
        link.classList.add("current-section-link");
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach((section) => {
    observer.observe(section);
  });

  if (navLinks.length > 0 && window.scrollY < 100) {
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
          left_in_observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
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
          right_in_observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll(".slide-in-right").forEach((el) => {
    right_in_observer.observe(el);
  });
}

function setupTimelineAnimation() {
  const timelineContainer = document.getElementById("timelineContainer");
  const spineProgress = document.getElementById("spineProgress");
  if (!timelineContainer || !spineProgress) return;

  const yearBlocks = Array.from(
    document.querySelectorAll("#timelineContainer [data-year]")
  );
  const nodes = {
    2026: document.getElementById("node-2026"),
    2025: document.getElementById("node-2025"),
    2024: document.getElementById("node-2024"),
    2023: document.getElementById("node-2023"),
    2022: document.getElementById("node-2022"),
    2020: document.getElementById("node-2020"),
  };

  let ticking = false;
  function updateSpine() {
    ticking = false;
    const rect = timelineContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const triggerOffset = windowHeight * 0.65;
    const start = rect.top;
    const totalHeight = rect.height;

    let progressPx = 0;
    if (start < triggerOffset) {
      progressPx = Math.min(totalHeight, triggerOffset - start);
    }
    spineProgress.style.height = `${progressPx}px`;

    yearBlocks.forEach((block) => {
      const year = block.getAttribute("data-year");
      const node = nodes[year];
      if (!node) return;
      const nodeRect = node.getBoundingClientRect();
      if (nodeRect.top <= triggerOffset + 20) {
        node.classList.add("active");
      } else {
        node.classList.remove("active");
      }
    });
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateSpine);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateSpine);
  updateSpine();

  // Card hover circuit connectors: pulse that year's node
  const cards = document.querySelectorAll("#timelineContainer .timeline-card");
  cards.forEach((card) => {
    const parentYearBlock = card.closest("[data-year]");
    const year = parentYearBlock
      ? parentYearBlock.getAttribute("data-year")
      : null;
    if (!year || !nodes[year]) return;

    card.addEventListener("mouseenter", () => {
      nodes[year].classList.add("highlight-pulse");
    });
    card.addEventListener("mouseleave", () => {
      nodes[year].classList.remove("highlight-pulse");
    });
  });
}

function initUI() {
  setupNav();
  setupScrollspy();
  setupTimelineAnimation();
}

// Run immediately since script is at bottom of body, and listen to DOMContentLoaded as fallback
initUI();
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initUI);
}

// --- Three.js Background & Interactive Animation ---
async function initThree() {
  const canvasContainer = document.getElementById("canvas-container");
  if (!canvasContainer) return;

  try {
    const THREE = await import("three");
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const canvasbg = document.createElement("canvas");
    canvasbg.setAttribute("id", "canvasbg");
    const rendererbg = new THREE.WebGLRenderer({
      canvas: canvasbg,
      antialias: true,
    });
    rendererbg.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.appendChild(rendererbg.domElement);

    const canvasfront = document.createElement("canvas");
    canvasfront.setAttribute("id", "canvasfront");
    const rendererfront = new THREE.WebGLRenderer({
      canvas: canvasfront,
      antialias: true,
      alpha: true,
    });
    rendererfront.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.appendChild(rendererfront.domElement);

    const planeGeometry = new THREE.PlaneGeometry(200, 400);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x0a192f });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.position.z -= 50;
    scene.add(planeMesh);

    const planetGeometry = new THREE.IcosahedronGeometry(2, 2);
    const planetMaterial = new THREE.MeshPhongMaterial({
      color: 0x64ffda,
      specular: 0x000000,
      shininess: 5,
      wireframe: true,
    });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    scene.add(planetMesh);

    const directionallight = new THREE.DirectionalLight(0x000, 1);
    directionallight.position.set(10, -10, 0);
    scene.add(directionallight);

    const directionallight2 = new THREE.DirectionalLight(0x000, 1);
    directionallight2.position.set(10, 10, 0);
    scene.add(directionallight2);

    const ambientlight = new THREE.AmbientLight(0xffffff, 0.99);
    scene.add(ambientlight);

    const scenefront = new THREE.Scene();
    scenefront.background = null;

    const mouseCircleGeometry = new THREE.RingGeometry(0.01, 0.012, 32);
    const mouseCircleMaterial = new THREE.MeshBasicMaterial({
      color: 0xccd6f6,
      transparent: true,
      opacity: 0.5,
    });
    const mouseCircle = new THREE.Mesh(mouseCircleGeometry, mouseCircleMaterial);
    scenefront.add(mouseCircle);

    let targetPosition = new THREE.Vector3();
    let currentPosition = new THREE.Vector3();

    function onMouseMove(event) {
      targetPosition.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
      targetPosition.unproject(camera);
    }

    function onMouseDown() {
      mouseCircleMaterial.opacity = 0.5;
      mouseCircleGeometry.dispose();
      mouseCircle.geometry = new THREE.CircleGeometry(0.01, 32);
    }

    function onMouseUp() {
      mouseCircleMaterial.opacity = 0.5;
      mouseCircleGeometry.dispose();
      mouseCircle.geometry = new THREE.RingGeometry(0.01, 0.012, 32);
    }

    let mouseX = 0;
    let mouseY = 0;

    function animate() {
      requestAnimationFrame(animate);

      const difference = targetPosition.clone().sub(currentPosition);
      const acceleration = difference.multiplyScalar(0.05);
      currentPosition.add(acceleration);
      mouseCircle.position.copy(currentPosition);

      mouseX != 0 && mouseY != 0
        ? (planetMesh.rotation.x = mouseY)
        : (planetMesh.rotation.x += 0.005);
      mouseX != 0 && mouseY != 0
        ? (planetMesh.rotation.y = mouseX)
        : (planetMesh.rotation.y += 0.008);
      mouseX = 0;
      mouseY = 0;

      rendererbg.render(scene, camera);
      rendererfront.render(scenefront, camera);
    }
    animate();

    function resizeRenderer() {
      const width = canvasContainer.offsetWidth;
      const height = canvasContainer.offsetHeight;
      rendererbg.setSize(width, height);
      rendererfront.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    resizeRenderer();
    window.addEventListener("resize", resizeRenderer);

    // Only attach cursor tracking on desktop
    if (window.innerWidth >= 576) {
      document.addEventListener("mousemove", (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      });
      document.addEventListener("mouseleave", () => {
        mouseX = 0;
        mouseY = 0;
      });
      window.addEventListener("mousemove", onMouseMove, false);
      window.addEventListener("mousedown", onMouseDown, false);
      window.addEventListener("mouseup", onMouseUp, false);
    }
  } catch (err) {
    console.warn("Three.js WebGL canvas initialization skipped or failed:", err);
  }
}

initThree();
