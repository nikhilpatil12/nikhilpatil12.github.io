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
    // Trigger laser when timeline reaches lower 72% of viewport
    const triggerY = windowHeight * 0.72;
    const totalHeight = rect.height;
    const isAtBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 50;

    let progressPx = 0;
    if (isAtBottom) {
      progressPx = totalHeight;
    } else if (rect.top < triggerY) {
      progressPx = Math.max(0, Math.min(totalHeight, triggerY - rect.top));
    }
    spineProgress.style.height = `${progressPx}px`;

    // Each node activates precisely when the cyan laser reaches its offset
    Object.entries(nodes).forEach(([year, node]) => {
      if (!node) return;
      const nodeRect = node.getBoundingClientRect();
      const nodeOffsetFromContainer = nodeRect.top - rect.top;
      if (progressPx > 0 && progressPx >= nodeOffsetFromContainer - 12) {
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
  window.addEventListener("resize", updateSpine, { passive: true });
  updateSpine();
  setTimeout(updateSpine, 100);

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

// Global safety fallbacks for card hover
window.onCardEnter = function (year) {
  const node = document.getElementById(`node-${year}`);
  if (node) node.classList.add("highlight-pulse");
};
window.onCardLeave = function (year) {
  const node = document.getElementById(`node-${year}`);
  if (node) node.classList.remove("highlight-pulse");
};

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

// --- Three.js 3D Earth Globe & Flight Telemetry ---
async function initThree() {
  const canvasContainer = document.getElementById("canvas-container");
  if (!canvasContainer) return;

  try {
    const THREE = await import("three");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.2, 5.8);

    const canvasbg = document.createElement("canvas");
    canvasbg.setAttribute("id", "canvasbg");
    const rendererbg = new THREE.WebGLRenderer({
      canvas: canvasbg,
      antialias: true,
      alpha: true,
    });
    rendererbg.setSize(window.innerWidth, window.innerHeight);
    rendererbg.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererbg.toneMapping = THREE.ACESFilmicToneMapping;
    rendererbg.toneMappingExposure = 1.25;
    canvasContainer.appendChild(rendererbg.domElement);

    const canvasfront = document.createElement("canvas");
    canvasfront.setAttribute("id", "canvasfront");
    const rendererfront = new THREE.WebGLRenderer({
      canvas: canvasfront,
      antialias: true,
      alpha: true,
    });
    rendererfront.setSize(window.innerWidth, window.innerHeight);
    rendererfront.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasContainer.appendChild(rendererfront.domElement);

    // Group for the Earth globe system
    const globeGroup = new THREE.Group();
    function updateGlobePlacement() {
      if (window.innerWidth >= 992) {
        globeGroup.position.set(1.05, -0.1, 0);
        globeGroup.scale.set(1.0, 1.0, 1.0);
      } else {
        globeGroup.position.set(0, -0.55, -0.4);
        globeGroup.scale.set(0.82, 0.82, 0.82);
      }
    }
    updateGlobePlacement();
    scene.add(globeGroup);

    // Lights (Bright & Cheerful for Cartoon Aesthetic)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(8, 7, 10);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x64ffda, 1.2);
    fillLight.position.set(-8, -4, -6);
    scene.add(fillLight);

    // Cartoon Earth Sphere
    const GLOBE_RADIUS = 2.0;
    const textureLoader = new THREE.TextureLoader();
    const cartoonTexture = textureLoader.load("./images/earth_cartoon.png");
    cartoonTexture.colorSpace = THREE.SRGBColorSpace;

    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: cartoonTexture,
      roughness: 0.55,
      metalness: 0.05,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // Cyan Fresnel Atmosphere Glow
    const atmosphereVertexShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const atmosphereFragmentShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vec3 viewDir = normalize(-vPosition);
        float intensity = pow(0.68 - dot(vNormal, viewDir), 2.2);
        gl_FragColor = vec4(0.39, 1.0, 0.85, 1.0) * intensity * 0.75;
      }
    `;
    const atmosphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.05, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    globeGroup.add(new THREE.Mesh(atmosphereGeo, atmosphereMat));

    // Graticule Lines (Latitude & Longitude)
    const graticuleMat = new THREE.LineBasicMaterial({
      color: 0x64ffda,
      transparent: true,
      opacity: 0.07,
    });
    for (let lat = -60; lat <= 60; lat += 30) {
      const phi = (90 - lat) * (Math.PI / 180);
      const r = GLOBE_RADIUS * 1.002 * Math.sin(phi);
      const y = GLOBE_RADIUS * 1.002 * Math.cos(phi);
      const circleGeo = new THREE.BufferGeometry();
      const pts = [];
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        pts.push(new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta)));
      }
      circleGeo.setFromPoints(pts);
      globeGroup.add(new THREE.Line(circleGeo, graticuleMat));
    }

    // Helper: Lat/Lon (deg) to 3D Cartesian
    function latLonToVector3(lat, lon, radius) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    }

    // Ratnagiri, India (16.9902° N, 73.3120° E)
    const posRatnagiri = latLonToVector3(16.9902, 73.312, GLOBE_RADIUS);
    // Los Angeles, USA (34.0522° N, -118.2437° W)
    const posLA = latLonToVector3(34.0522, -118.2437, GLOBE_RADIUS);

    // Cute Cartoon Airport Markers (Pins & Runways)
    function createCartoonAirport(position, pinColor, title, sub) {
      const group = new THREE.Group();
      group.position.copy(position);

      const normal = position.clone().normalize();
      group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      // Runway strip
      const runwayGeo = new THREE.PlaneGeometry(0.12, 0.32);
      runwayGeo.rotateX(-Math.PI / 2);
      const runwayMat = new THREE.MeshBasicMaterial({
        color: 0x1e293b,
        side: THREE.DoubleSide,
      });
      group.add(new THREE.Mesh(runwayGeo, runwayMat));

      const dashGeo = new THREE.PlaneGeometry(0.012, 0.24);
      dashGeo.rotateX(-Math.PI / 2);
      const dashMat = new THREE.MeshBasicMaterial({
        color: 0x64ffda,
        side: THREE.DoubleSide,
      });
      group.add(new THREE.Mesh(dashGeo, dashMat));

      // 3D Cartoon Pin Head
      const pinHeadGeo = new THREE.SphereGeometry(0.05, 16, 16);
      pinHeadGeo.translate(0, 0.28, 0);
      const pinHeadMat = new THREE.MeshStandardMaterial({
        color: pinColor,
        roughness: 0.3,
        metalness: 0.1,
      });
      group.add(new THREE.Mesh(pinHeadGeo, pinHeadMat));

      // Pin Needle
      const needleGeo = new THREE.CylinderGeometry(0.006, 0.016, 0.26, 8);
      needleGeo.translate(0, 0.13, 0);
      const needleMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.8,
        roughness: 0.2,
      });
      group.add(new THREE.Mesh(needleGeo, needleMat));

      // Radar Ripple
      const rippleGeo = new THREE.RingGeometry(0.03, 0.065, 32);
      rippleGeo.rotateX(-Math.PI / 2);
      const rippleMat = new THREE.MeshBasicMaterial({
        color: 0x64ffda,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
      });
      const ripple = new THREE.Mesh(rippleGeo, rippleMat);
      group.add(ripple);

      // Cute Text Badge
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 72;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "rgba(10, 25, 47, 0.88)";
      ctx.strokeStyle = "#64ffda";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(4, 4, 248, 64, 10);
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 24px monospace";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(title, 128, 34);
      ctx.font = "15px monospace";
      ctx.fillStyle = "#64ffda";
      ctx.fillText(sub, 128, 56);

      const texture = new THREE.CanvasTexture(canvas);
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: texture, transparent: true })
      );
      sprite.scale.set(0.65, 0.18, 1);
      sprite.position.set(0, 0.42, 0);
      group.add(sprite);

      globeGroup.add(group);
      return { ripple, rippleMat };
    }

    const airportRatnagiri = createCartoonAirport(
      posRatnagiri,
      0xff5c5c,
      "RATNAGIRI",
      "16.99°N 73.31°E"
    );
    const airportLA = createCartoonAirport(
      posLA,
      0x38bdf8,
      "LOS ANGELES",
      "34.05°N 118.24°W"
    );

    // Realistic Glideslope & Flight Curve
    function getFlightAltitude(s) {
      const MAX_ALTITUDE = GLOBE_RADIUS * 0.38;
      if (s < 0.02) return 0.005;
      if (s > 0.98) return 0.005;

      const normalizedS = (s - 0.02) / (0.98 - 0.02);
      const sineAlt = Math.sin(normalizedS * Math.PI);
      return Math.pow(sineAlt, 0.85) * MAX_ALTITUDE;
    }

    const flightPoints = [];
    const NUM_SEGMENTS = 160;
    for (let i = 0; i <= NUM_SEGMENTS; i++) {
      const s = i / NUM_SEGMENTS;
      const p = new THREE.Vector3().copy(posRatnagiri).lerp(posLA, s).normalize();
      const alt = getFlightAltitude(s);
      p.multiplyScalar(GLOBE_RADIUS + alt);
      flightPoints.push(p);
    }
    const flightCurve = new THREE.CatmullRomCurve3(flightPoints);

    const curvePoints = flightCurve.getPoints(200);
    const flightPathGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const flightPathMat = new THREE.LineDashedMaterial({
      color: 0x64ffda,
      linewidth: 2,
      scale: 1,
      dashSize: 0.12,
      gapSize: 0.06,
      transparent: true,
      opacity: 0.7,
    });
    const flightPathLine = new THREE.Line(flightPathGeo, flightPathMat);
    flightPathLine.computeLineDistances();
    globeGroup.add(flightPathLine);

    // Cute Chubby Cartoon Commercial Airliner
    function createCartoonAirplane() {
      const plane = new THREE.Group();

      const whiteMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.05,
      });
      const cyanMat = new THREE.MeshStandardMaterial({
        color: 0x64ffda,
        roughness: 0.35,
        metalness: 0.1,
      });
      const darkGlassMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.2,
        metalness: 0.8,
      });
      const engineIntakeMat = new THREE.MeshBasicMaterial({ color: 0x020617 });
      const glowMat = new THREE.MeshBasicMaterial({ color: 0x64ffda });

      // Fuselage: Chubby rounded body
      const bodyGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.26, 16);
      bodyGeo.rotateX(Math.PI / 2);
      plane.add(new THREE.Mesh(bodyGeo, whiteMat));

      // Cute rounded nose cone
      const noseGeo = new THREE.SphereGeometry(0.045, 16, 16);
      noseGeo.scale(1, 0.95, 1.4);
      noseGeo.translate(0, 0, 0.13);
      plane.add(new THREE.Mesh(noseGeo, whiteMat));

      // Tail cone
      const tailConeGeo = new THREE.ConeGeometry(0.045, 0.11, 16);
      tailConeGeo.rotateX(-Math.PI / 2);
      tailConeGeo.translate(0, 0.005, -0.18);
      plane.add(new THREE.Mesh(tailConeGeo, whiteMat));

      // Cheatline stripe (cyan band running down the fuselage)
      const stripeGeo = new THREE.CylinderGeometry(0.046, 0.046, 0.24, 16);
      stripeGeo.rotateX(Math.PI / 2);
      const stripe = new THREE.Mesh(stripeGeo, cyanMat);
      stripe.scale.set(1.01, 0.18, 1);
      plane.add(stripe);

      // Cockpit windshield
      const cockpitGeo = new THREE.SphereGeometry(0.046, 12, 12);
      cockpitGeo.scale(0.85, 0.6, 1.2);
      cockpitGeo.translate(0, 0.018, 0.12);
      plane.add(new THREE.Mesh(cockpitGeo, darkGlassMat));

      // Cute rounded wings
      const wingShape = new THREE.Shape();
      wingShape.moveTo(0, 0.06);
      wingShape.lineTo(0.24, -0.04);
      wingShape.lineTo(0.22, -0.07);
      wingShape.lineTo(0, -0.03);
      wingShape.lineTo(-0.22, -0.07);
      wingShape.lineTo(-0.24, -0.04);
      wingShape.closePath();

      const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
        depth: 0.006,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.002,
        bevelThickness: 0.002,
      });
      wingGeo.rotateX(-Math.PI / 2);
      wingGeo.translate(0, -0.006, 0);
      plane.add(new THREE.Mesh(wingGeo, whiteMat));

      // Vertical Tail Fin
      const finShape = new THREE.Shape();
      finShape.moveTo(0, -0.04);
      finShape.lineTo(0, 0.09);
      finShape.lineTo(-0.07, 0.09);
      finShape.lineTo(-0.04, -0.04);
      finShape.closePath();

      const finGeo = new THREE.ExtrudeGeometry(finShape, {
        depth: 0.005,
        bevelEnabled: false,
      });
      finGeo.rotateY(Math.PI / 2);
      finGeo.translate(0, 0.02, -0.16);
      plane.add(new THREE.Mesh(finGeo, cyanMat));

      // Horizontal Stabilizers
      const hStabGeo = new THREE.BoxGeometry(0.12, 0.004, 0.038);
      hStabGeo.translate(0, 0.022, -0.17);
      plane.add(new THREE.Mesh(hStabGeo, whiteMat));

      // Twin Jet Engines
      [-0.075, 0.075].forEach((x) => {
        const engineGroup = new THREE.Group();
        engineGroup.position.set(x, -0.022, 0);

        const podGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.085, 12);
        podGeo.rotateX(Math.PI / 2);
        engineGroup.add(new THREE.Mesh(podGeo, whiteMat));

        const intakeGeo = new THREE.CircleGeometry(0.014, 12);
        intakeGeo.translate(0, 0, 0.043);
        engineGroup.add(new THREE.Mesh(intakeGeo, engineIntakeMat));

        const exhaustGeo = new THREE.CircleGeometry(0.013, 12);
        exhaustGeo.translate(0, 0, -0.043);
        engineGroup.add(new THREE.Mesh(exhaustGeo, glowMat));

        plane.add(engineGroup);
      });

      // Wingtip lights
      const lightGeo = new THREE.SphereGeometry(0.008, 8, 8);
      const portLight = new THREE.Mesh(
        lightGeo,
        new THREE.MeshBasicMaterial({ color: 0xff3b30 })
      );
      portLight.position.set(-0.23, 0, -0.05);
      plane.add(portLight);

      const stbdLight = new THREE.Mesh(
        lightGeo,
        new THREE.MeshBasicMaterial({ color: 0x34c759 })
      );
      stbdLight.position.set(0.23, 0, -0.05);
      plane.add(stbdLight);

      plane.scale.set(0.9, 0.9, 0.9);
      return plane;
    }

    const airplane = createCartoonAirplane();
    globeGroup.add(airplane);

    // Contrail Ribbon
    const CONTRAIL_LENGTH = 32;
    const contrailGeo = new THREE.BufferGeometry();
    const contrailPositions = new Float32Array(CONTRAIL_LENGTH * 3);
    contrailGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(contrailPositions, 3)
    );
    const contrailMat = new THREE.LineBasicMaterial({
      color: 0x64ffda,
      transparent: true,
      opacity: 0.55,
    });
    const contrailLine = new THREE.Line(contrailGeo, contrailMat);
    globeGroup.add(contrailLine);
    const contrailHistory = [];

    // Flight Animation State (Graceful & Slower)
    let flightProgress = 0.0;
    let flightDirection = 1;
    let pauseTimer = 0;
    const FLIGHT_SPEED = 0.0008; // ~22 seconds per transit

    const Y_RATNAGIRI = -2.85;
    const Y_LA = 0.49;

    // Mouse Tracking Cursor on canvasfront
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
    let mouseX = 0,
      mouseY = 0;
    let scrollParallaxY = 0;

    function onMouseMove(event) {
      targetPosition.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
      targetPosition.unproject(camera);
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
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

    if (window.innerWidth >= 576) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("mousedown", onMouseDown, { passive: true });
      window.addEventListener("mouseup", onMouseUp, { passive: true });
      document.addEventListener("mouseleave", () => {
        mouseX = 0;
        mouseY = 0;
      });
    }

    window.addEventListener(
      "scroll",
      () => {
        scrollParallaxY = window.scrollY * 0.0003;
      },
      { passive: true }
    );

    // Main Render Loop
    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Mouse cursor follower
      const difference = targetPosition.clone().sub(currentPosition);
      const acceleration = difference.multiplyScalar(0.05);
      currentPosition.add(acceleration);
      mouseCircle.position.copy(currentPosition);

      // Radar ripples
      const rippleScale = ((time * 1.5) % 2.5) + 1.0;
      const rippleOpacity = Math.max(0, 1.0 - (rippleScale - 1.0) / 1.5);
      airportRatnagiri.ripple.scale.set(rippleScale, rippleScale, 1);
      airportRatnagiri.rippleMat.opacity = rippleOpacity;
      airportLA.ripple.scale.set(rippleScale, rippleScale, 1);
      airportLA.rippleMat.opacity = rippleOpacity;

      // Flight progress (Graceful, majestic pacing)
      if (pauseTimer > 0) {
        pauseTimer -= delta;
        if (pauseTimer <= 0) {
          flightDirection = -flightDirection;
        }
      } else {
        flightProgress += FLIGHT_SPEED * flightDirection;
        if (flightProgress >= 1.0) {
          flightProgress = 1.0;
          pauseTimer = 3.0; // 3-second gate layover
        } else if (flightProgress <= 0.0) {
          flightProgress = 0.0;
          pauseTimer = 3.0;
        }
      }

      // Airplane positioning along Great Circle curve
      const s = flightProgress;
      const currentPos = flightCurve.getPointAt(s);
      airplane.position.copy(currentPos);

      const deltaT = 0.003 * (flightDirection >= 0 ? 1 : -1);
      const nextT = Math.max(0, Math.min(1, s + deltaT));
      const nextPos = flightCurve.getPointAt(nextT);
      const tangent = nextPos.clone().sub(currentPos).normalize();

      if (tangent.lengthSq() > 0.0001) {
        const lookTarget = currentPos.clone().add(tangent);
        const upVec = currentPos.clone().normalize();
        const matrix = new THREE.Matrix4();
        matrix.lookAt(currentPos, lookTarget, upVec);
        airplane.quaternion.setFromRotationMatrix(matrix);

        // Smooth Glideslope & Realistic Landing Flare:
        // Takeoff: nose pitches up ~10 degrees
        // Final approach: nose flares UP ~12 degrees into runway touchdown (prevents nose diving)
        let flarePitch = 0;
        if (flightDirection === 1) { // Flying to LA
          if (s < 0.12) {
            flarePitch = (1.0 - (s / 0.12)) * 0.18; // Nose up ~10 deg climb
          } else if (s > 0.88 && s < 0.98) {
            const flareFactor = Math.sin(((s - 0.88) / 0.10) * Math.PI);
            flarePitch = flareFactor * 0.22; // Nose flared UP ~12 deg
          }
        } else { // Flying to Ratnagiri
          if (s > 0.88) {
            flarePitch = ((s - 0.88) / 0.12) * 0.18;
          } else if (s < 0.12 && s > 0.02) {
            const flareFactor = Math.sin(((0.12 - s) / 0.10) * Math.PI);
            flarePitch = flareFactor * 0.22;
          }
        }
        airplane.rotateX(flarePitch);

        // Gentle banking into flight curve
        const bankAngle =
          Math.sin(s * Math.PI) *
          0.16 *
          (flightDirection >= 0 ? 1 : -1);
        airplane.rotateZ(bankAngle);
      }

      // Contrail smoke (only emitted when cruising above runway level)
      const currentAlt = getFlightAltitude(s);
      if (pauseTimer <= 0 && currentAlt > 0.03) {
        contrailHistory.unshift(currentPos.clone());
        if (contrailHistory.length > CONTRAIL_LENGTH) contrailHistory.pop();
        const posAttr = contrailGeo.attributes.position;
        for (let i = 0; i < CONTRAIL_LENGTH; i++) {
          const pt = contrailHistory[i] || currentPos;
          posAttr.setXYZ(i, pt.x, pt.y, pt.z);
        }
        posAttr.needsUpdate = true;
      }

      // Globe camera tracking & mouse parallax
      const targetAngleY =
        Y_RATNAGIRI + flightProgress * (Y_LA - Y_RATNAGIRI);
      const targetRotY = targetAngleY + mouseX * 0.15 + scrollParallaxY;
      const targetRotX = 0.22 - mouseY * 0.12;

      globeGroup.rotation.y +=
        (targetRotY - globeGroup.rotation.y) * 0.04;
      globeGroup.rotation.x +=
        (targetRotX - globeGroup.rotation.x) * 0.05;

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
      updateGlobePlacement();
    }
    resizeRenderer();
    window.addEventListener("resize", resizeRenderer);
  } catch (err) {
    console.warn("Three.js Earth Globe initialization failed:", err);
  }
}

initThree();
