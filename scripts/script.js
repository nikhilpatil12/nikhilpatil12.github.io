import { GLOBE_DOTS } from "./globe_dots.js";

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
// Ensure legacy palette preference is cleared so the signature Navy & Cyan palette stays pure
try {
  localStorage.removeItem("portfolio_palette");
} catch (e) {}

const THEME_CYAN = 0x64ffda;

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
      if (window.innerWidth >= 1200) {
        globeGroup.position.set(1.48, -0.05, 0);
        globeGroup.scale.set(0.96, 0.96, 0.96);
      } else if (window.innerWidth >= 992) {
        globeGroup.position.set(1.30, -0.05, 0);
        globeGroup.scale.set(0.88, 0.88, 0.88);
      } else {
        globeGroup.position.set(0, -0.90, -0.5);
        globeGroup.scale.set(0.72, 0.72, 0.72);
      }
    }
    updateGlobePlacement();
    globeGroup.rotation.set(0.10, -2.85, 0);
    scene.add(globeGroup);

    // Deep Space Starfield Background
    const starCount = 1400;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const primaryColor = new THREE.Color(THEME_CYAN);
    const whiteColor = new THREE.Color(0xffffff);
    const paleBlueColor = new THREE.Color(0x93c5fd);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3 + 0] = (Math.random() - 0.5) * 45;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      starPositions[i * 3 + 2] = -5 - Math.random() * 25;

      const rnd = Math.random();
      let c;
      if (rnd < 0.65) {
        c = whiteColor;
      } else if (rnd < 0.85) {
        c = paleBlueColor;
      } else {
        c = primaryColor;
      }
      starColors[i * 3 + 0] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Theme detection: Cyber (default, high contrast & aesthetic) vs Cartoon (?theme=cartoon)
    const urlParams = new URLSearchParams(window.location.search);
    const isCartoon = urlParams.get("theme") === "cartoon";

    // Lights
    const ambientLight = new THREE.AmbientLight(
      isCartoon ? 0xffffff : 0x0a192f,
      isCartoon ? 1.4 : 2.2
    );
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(8, 7, 10);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(THEME_CYAN, isCartoon ? 1.2 : 1.6);
    fillLight.position.set(-8, -4, -6);
    scene.add(fillLight);

    // Base Ocean Sphere - Deep Matte Obsidian Navy
    const GLOBE_RADIUS = 2.0;
    const oceanGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const oceanMaterial = new THREE.MeshStandardMaterial({
      color: 0x071324,
      roughness: 0.85,
      metalness: 0.15,
    });
    const oceanMesh = new THREE.Mesh(oceanGeometry, oceanMaterial);
    globeGroup.add(oceanMesh);

    // Mathematical Dot Matrix for Continents (GitHub-style Data Globe)
    const scaledPositions = new Float32Array(GLOBE_DOTS.length);
    const dotRadius = GLOBE_RADIUS * 1.002;
    for (let i = 0; i < GLOBE_DOTS.length; i++) {
      scaledPositions[i] = GLOBE_DOTS[i] * dotRadius;
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.BufferAttribute(scaledPositions, 3));

    // Circular sprite texture for smooth, crisp circular dots
    const dotCanvas = document.createElement("canvas");
    dotCanvas.width = 32;
    dotCanvas.height = 32;
    const dctx = dotCanvas.getContext("2d");
    dctx.beginPath();
    dctx.arc(16, 16, 13, 0, Math.PI * 2);
    dctx.fillStyle = "#ffffff";
    dctx.fill();
    const dotTexture = new THREE.CanvasTexture(dotCanvas);

    const dotMat = new THREE.PointsMaterial({
      size: 0.038,
      map: dotTexture,
      color: new THREE.Color(THEME_CYAN),
      transparent: true,
      alphaTest: 0.05,
      opacity: 0.95,
    });
    const dotCloud = new THREE.Points(dotGeo, dotMat);
    globeGroup.add(dotCloud);

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
      uniform vec3 uColor;
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vec3 viewDir = normalize(-vPosition);
        float intensity = pow(0.68 - dot(vNormal, viewDir), 2.2);
        gl_FragColor = vec4(uColor, 1.0) * intensity * 0.75;
      }
    `;
    const atmosphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.05, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(THEME_CYAN) },
      },
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
        color: THEME_CYAN,
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
      sprite.position.set(0.35, 0.45, 0); // Offset to side of runway so landing aircraft is fully visible
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

    // Realistic Glideslope & Flight Curve (Tight, sleek cruise altitude)
    function getFlightAltitude(s) {
      const MAX_ALTITUDE = GLOBE_RADIUS * 0.16; // Sleek, majestic cruise altitude (~0.32 units)
      const MIN_ALTITUDE = 0.062; // Keeps airplane belly safely above runway surface
      if (s < 0.02) return MIN_ALTITUDE;
      if (s > 0.98) return MIN_ALTITUDE;

      const normalizedS = (s - 0.02) / (0.98 - 0.02);
      const sineAlt = Math.sin(normalizedS * Math.PI);
      return MIN_ALTITUDE + Math.pow(sineAlt, 0.85) * (MAX_ALTITUDE - MIN_ALTITUDE);
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

    // Global Aviation & Data Network (Secondary Global Arcs)
    const NETWORK_HUBS = {
      mumbai: [19.076, 72.8777],
      dubai: [25.2048, 55.2708],
      london: [51.5074, -0.1278],
      newyork: [40.7128, -74.006],
      sanfrancisco: [37.7749, -122.4194],
      tokyo: [35.6762, 139.6503],
      singapore: [1.3521, 103.8198],
      sydney: [-33.8688, 151.2093],
    };

    const NETWORK_ROUTES = [
      ["mumbai", "dubai"],
      ["dubai", "london"],
      ["london", "newyork"],
      ["newyork", "sanfrancisco"],
      ["sanfrancisco", "tokyo"],
      ["tokyo", "singapore"],
      ["singapore", "mumbai"],
      ["singapore", "sydney"],
    ];

    const networkArcMats = [];
    const networkPulses = [];

    NETWORK_ROUTES.forEach(([fromKey, toKey], index) => {
      const p1 = latLonToVector3(NETWORK_HUBS[fromKey][0], NETWORK_HUBS[fromKey][1], GLOBE_RADIUS);
      const p2 = latLonToVector3(NETWORK_HUBS[toKey][0], NETWORK_HUBS[toKey][1], GLOBE_RADIUS);

      const pts = [];
      const numPts = 50;
      for (let i = 0; i <= numPts; i++) {
        const t = i / numPts;
        const pt = new THREE.Vector3().copy(p1).lerp(p2, t).normalize();
        const arcAlt = Math.sin(t * Math.PI) * (GLOBE_RADIUS * 0.14);
        pt.multiplyScalar(GLOBE_RADIUS + arcAlt);
        pts.push(pt);
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const curvePts = curve.getPoints(70);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(curvePts);
      const arcMat = new THREE.LineDashedMaterial({
        color: THEME_CYAN,
        scale: 1,
        dashSize: 0.08,
        gapSize: 0.05,
        transparent: true,
        opacity: 0.35,
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      arcLine.computeLineDistances();
      globeGroup.add(arcLine);
      networkArcMats.push(arcMat);

      // Light pulse particle traveling along each network arc
      const pulseGeo = new THREE.SphereGeometry(0.016, 8, 8);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: THEME_CYAN,
        transparent: true,
        opacity: 0.9,
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      globeGroup.add(pulseMesh);
      networkArcMats.push(pulseMat);

      networkPulses.push({
        curve,
        mesh: pulseMesh,
        speed: 0.06 + (index % 4) * 0.025,
        offset: index * 0.14,
      });
    });

    // Aerospace Telemetry Orbital Ring
    const orbitalRadius = GLOBE_RADIUS * 1.30;
    const ringPts = [];
    for (let i = 0; i <= 120; i++) {
      const theta = (i / 120) * Math.PI * 2;
      ringPts.push(
        new THREE.Vector3(
          orbitalRadius * Math.cos(theta),
          0,
          orbitalRadius * Math.sin(theta)
        )
      );
    }
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPts);
    const ringMat = new THREE.LineDashedMaterial({
      color: THEME_CYAN,
      dashSize: 0.15,
      gapSize: 0.09,
      transparent: true,
      opacity: 0.35,
    });
    const orbitalRing = new THREE.Line(ringGeo, ringMat);
    orbitalRing.computeLineDistances();
    orbitalRing.rotation.x = Math.PI * 0.28;
    orbitalRing.rotation.z = Math.PI * 0.15;
    globeGroup.add(orbitalRing);

    // Orbiting Micro-Satellite
    const satelliteGroup = new THREE.Group();
    const satBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.03, 0.03),
      new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.85, roughness: 0.15 })
    );
    satelliteGroup.add(satBody);

    const panelMat = new THREE.MeshBasicMaterial({ color: 0x1d4ed8 });
    const leftPanel = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.003, 0.026), panelMat);
    leftPanel.position.set(-0.055, 0, 0);
    satelliteGroup.add(leftPanel);
    const rightPanel = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.003, 0.026), panelMat);
    rightPanel.position.set(0.055, 0, 0);
    satelliteGroup.add(rightPanel);

    const satBeaconMat = new THREE.MeshBasicMaterial({ color: 0xff3b30 });
    const satBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 8), satBeaconMat);
    satBeacon.position.set(0, 0.02, 0);
    satelliteGroup.add(satBeacon);

    orbitalRing.add(satelliteGroup);

    // Cute Chubby Cartoon Commercial Airliner
    function createCartoonAirplane() {
      const plane = new THREE.Group();

      const whiteMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.05,
      });
      const cyanMat = new THREE.MeshStandardMaterial({
        color: THEME_CYAN,
        roughness: 0.35,
        metalness: 0.1,
      });

      const darkGlassMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.2,
        metalness: 0.8,
      });
      const engineIntakeMat = new THREE.MeshBasicMaterial({ color: 0x020617 });
      const glowMat = new THREE.MeshBasicMaterial({
        color: THEME_CYAN,
      });

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

      plane.scale.set(1.12, 1.12, 1.12);
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
    window.flightProgress = 0.0;
    window.flightDirection = 1;
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

    // Motion Accessibility (WCAG 2.3.3)
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Scroll Fade-Out: Fades 3D globe as user scrolls past hero into About/Skills/Projects
    function updateScrollFade() {
      const scrollDist = window.scrollY;
      const fadeThreshold = window.innerHeight * 0.75;
      const fade = Math.max(0, 1.0 - scrollDist / fadeThreshold);
      const baseMobileOpacity = 0.5;
      const targetOpacity =
        window.innerWidth < 992
          ? (fade * baseMobileOpacity).toFixed(3)
          : fade.toFixed(3);
      if (canvasContainer) {
        canvasContainer.style.opacity = targetOpacity;
      }
    }
    updateScrollFade();

    window.addEventListener(
      "scroll",
      () => {
        scrollParallaxY = window.scrollY * 0.0003;
        updateScrollFade();
      },
      { passive: true }
    );

    // Main Render Loop
    let clock = new THREE.Clock();

    function animate() {
      if (!prefersReducedMotion) {
        requestAnimationFrame(animate);
      }
      const delta = prefersReducedMotion ? 0 : clock.getDelta();
      const time = prefersReducedMotion ? 0 : clock.getElapsedTime();

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
          window.flightDirection = -window.flightDirection;
        }
      } else {
        window.flightProgress += FLIGHT_SPEED * window.flightDirection;
        if (window.flightProgress >= 1.0) {
          window.flightProgress = 1.0;
          pauseTimer = 3.0; // 3-second gate layover
        } else if (window.flightProgress <= 0.0) {
          window.flightProgress = 0.0;
          pauseTimer = 3.0;
        }
      }

      // Airplane positioning along Great Circle curve
      const s = Math.max(0.0001, Math.min(0.9999, window.flightProgress));
      const currentPos = flightCurve.getPointAt(s);
      airplane.position.copy(currentPos);

      // Tangent vector along curve (points from Ratnagiri to LA)
      const curveTangent = flightCurve.getTangentAt(s).normalize();

      // Heading direction:
      // While at gate layover, in first 1.5s stay facing arrival; in last 1.5s rotate on tarmac to face departure
      let effectiveDirection = window.flightDirection;
      if (pauseTimer > 0 && pauseTimer <= 1.5) {
        effectiveDirection = -window.flightDirection;
      }

      // If flying to LA (effectiveDirection >= 0), forward = curveTangent
      // If flying to Ratnagiri (effectiveDirection < 0), forward = -curveTangent
      const forward = (effectiveDirection >= 0 ? curveTangent : curveTangent.clone().negate()).normalize();
      const surfaceNormal = currentPos.clone().normalize();

      // Right-handed orthonormal frame:
      // right wing (+X) = surfaceNormal x forward
      const right = new THREE.Vector3().crossVectors(surfaceNormal, forward).normalize();
      // roof / fin (+Y) = forward x right
      const actualUp = new THREE.Vector3().crossVectors(forward, right).normalize();

      const matrix = new THREE.Matrix4();
      matrix.makeBasis(right, actualUp, forward);
      airplane.quaternion.setFromRotationMatrix(matrix);

      // Realistic Pitch (takeoff climb & landing flare):
      // In aircraft local frame: negative rotateX tilts nose UP (+Y)
      let flareAngle = 0;
      if (effectiveDirection >= 0) { // Flying towards LA
        if (s < 0.12) {
          flareAngle = (1.0 - (s / 0.12)) * 0.18; // Nose UP ~10 deg climb
        } else if (s > 0.88 && s < 0.99) {
          const flareFactor = Math.sin(((s - 0.88) / 0.11) * Math.PI);
          flareAngle = flareFactor * 0.22; // Nose flared UP ~12 deg
        }
      } else { // Flying towards Ratnagiri
        if (s > 0.88) {
          flareAngle = ((s - 0.88) / 0.12) * 0.18; // Nose UP ~10 deg climb
        } else if (s < 0.12 && s > 0.01) {
          const flareFactor = Math.sin(((0.12 - s) / 0.11) * Math.PI);
          flareAngle = flareFactor * 0.22; // Nose flared UP ~12 deg
        }
      }
      if (flareAngle !== 0) {
        airplane.rotateX(-flareAngle); // Negative X-rotation pitches nose UP
      }

      // Gentle banking into flight curve
      if (pauseTimer <= 0) {
        const bankAngle = Math.sin(s * Math.PI) * 0.14 * (effectiveDirection >= 0 ? 1 : -1);
        airplane.rotateZ(bankAngle);
      }

      // Contrail smoke (emitted from engine exhausts at aircraft tail)
      const currentAlt = getFlightAltitude(s);
      if (pauseTimer <= 0 && currentAlt > 0.08) {
        // Tail is at local -Z (-0.16)
        const tailPos = airplane.localToWorld(new THREE.Vector3(0, -0.015, -0.16));
        contrailHistory.unshift(tailPos.clone());
        if (contrailHistory.length > CONTRAIL_LENGTH) contrailHistory.pop();
        const posAttr = contrailGeo.attributes.position;
        for (let i = 0; i < CONTRAIL_LENGTH; i++) {
          const pt = contrailHistory[i] || currentPos;
          posAttr.setXYZ(i, pt.x, pt.y, pt.z);
        }
        posAttr.needsUpdate = true;
      } else {
        contrailHistory.length = 0;
      }

      // Dynamic Globe Camera Tracking: Keep airplane centered in focus
      const norm = currentPos.clone().normalize();
      const horizDist = Math.hypot(norm.x, norm.z);
      // Bring airplane to the front-facing meridian (facing viewer +Z):
      const rawTargetRotY = -Math.atan2(norm.x, norm.z);
      // Bring airplane to ideal vertical eye level (pleasing 3D perspective):
      const DESIRED_ELEVATION = 0.20; // ~11.5 degrees
      const targetRotX = Math.atan2(norm.y, horizDist) - DESIRED_ELEVATION - mouseY * 0.12;

      // Shortest circular difference for smooth continuous Y-rotation
      let diffY =
        ((rawTargetRotY + mouseX * 0.15 + scrollParallaxY) - globeGroup.rotation.y) %
        (Math.PI * 2);
      if (diffY > Math.PI) diffY -= Math.PI * 2;
      if (diffY < -Math.PI) diffY += Math.PI * 2;

      globeGroup.rotation.y += diffY * 0.05;
      globeGroup.rotation.x += (targetRotX - globeGroup.rotation.x) * 0.05;

      // Starfield subtle mouse parallax
      if (starField) {
        starField.position.x = mouseX * 0.4;
        starField.position.y = mouseY * 0.3;
      }

      // Orbiting micro-satellite
      if (satelliteGroup) {
        const satAngle = time * 0.35;
        satelliteGroup.position.set(
          orbitalRadius * Math.cos(satAngle),
          0,
          orbitalRadius * Math.sin(satAngle)
        );
        satelliteGroup.rotation.y = -satAngle + Math.PI / 2;
        satBeaconMat.opacity = Math.sin(time * 6) > 0 ? 1.0 : 0.2;
      }

      // Animate light pulses along secondary global flight arcs
      if (networkPulses) {
        networkPulses.forEach((pulse) => {
          const t = ((time * pulse.speed + pulse.offset) % 1.0);
          const pos = pulse.curve.getPointAt(t);
          pulse.mesh.position.copy(pos);
        });
      }

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
