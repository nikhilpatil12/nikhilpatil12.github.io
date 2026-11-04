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

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0a192f, 2.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.8);
    sunLight.position.set(8, 6, 10);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x64ffda, 1.6);
    rimLight.position.set(-8, -4, -6);
    scene.add(rimLight);

    // Earth Sphere
    const GLOBE_RADIUS = 2.0;
    const textureLoader = new THREE.TextureLoader();
    const atmosTexture = textureLoader.load("./images/earth_atmos.jpg");
    const lightsTexture = textureLoader.load("./images/earth_lights.png");

    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: atmosTexture,
      roughness: 0.7,
      metalness: 0.1,
      emissiveMap: lightsTexture,
      emissive: new THREE.Color(0x64ffda),
      emissiveIntensity: 0.85,
      color: 0x90b8d8,
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
        gl_FragColor = vec4(0.39, 1.0, 0.85, 1.0) * intensity * 0.85;
      }
    `;
    const atmosphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.055, 64, 64);
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

    // Text Sprite Label Helper
    function makeTextSprite(message, subtext) {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 80;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "rgba(10, 25, 47, 0.85)";
      ctx.strokeStyle = "#64ffda";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(4, 4, 248, 72, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 24px monospace";
      ctx.fillStyle = "#64ffda";
      ctx.textAlign = "center";
      ctx.fillText(message, 128, 36);

      ctx.font = "16px monospace";
      ctx.fillStyle = "#8892b0";
      ctx.fillText(subtext, 128, 60);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(0.65, 0.2, 1);
      return sprite;
    }

    // Airport Markers & Radar Beacons
    function createAirportMarker(position, color, labelText, coordsText) {
      const markerGroup = new THREE.Group();
      markerGroup.position.copy(position);

      const normal = position.clone().normalize();
      markerGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      const dotGeo = new THREE.SphereGeometry(0.04, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color: color });
      markerGroup.add(new THREE.Mesh(dotGeo, dotMat));

      const beamGeo = new THREE.CylinderGeometry(0.006, 0.016, 0.38, 8);
      beamGeo.translate(0, 0.19, 0);
      const beamMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.75,
      });
      markerGroup.add(new THREE.Mesh(beamGeo, beamMat));

      const ringGeo = new THREE.RingGeometry(0.025, 0.055, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      markerGroup.add(ring);

      const label = makeTextSprite(labelText, coordsText);
      label.position.set(0, 0.48, 0);
      markerGroup.add(label);

      globeGroup.add(markerGroup);
      return { ring, ringMat, markerGroup };
    }

    const markerRatnagiri = createAirportMarker(
      posRatnagiri,
      0x64ffda,
      "RATNAGIRI",
      "16.99°N 73.31°E"
    );
    const markerLA = createAirportMarker(
      posLA,
      0x64ffda,
      "LOS ANGELES",
      "34.05°N 118.24°W"
    );

    // Great Circle Flight Trajectory Arc
    const flightPoints = [];
    const NUM_SEGMENTS = 140;
    const MAX_ALTITUDE = GLOBE_RADIUS * 0.45;

    for (let i = 0; i <= NUM_SEGMENTS; i++) {
      const t = i / NUM_SEGMENTS;
      const p = new THREE.Vector3().copy(posRatnagiri).lerp(posLA, t).normalize();
      const alt = Math.sin(t * Math.PI) * MAX_ALTITUDE;
      p.multiplyScalar(GLOBE_RADIUS + alt);
      flightPoints.push(p);
    }

    const flightCurve = new THREE.CatmullRomCurve3(flightPoints);

    const curvePoints = flightCurve.getPoints(180);
    const flightPathGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const flightPathMat = new THREE.LineDashedMaterial({
      color: 0x64ffda,
      linewidth: 2,
      scale: 1,
      dashSize: 0.14,
      gapSize: 0.07,
      transparent: true,
      opacity: 0.75,
    });
    const flightPathLine = new THREE.Line(flightPathGeo, flightPathMat);
    flightPathLine.computeLineDistances();
    globeGroup.add(flightPathLine);

    // 3D Supersonic Jet Aircraft
    function createAirplane() {
      const plane = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        metalness: 0.85,
        roughness: 0.2,
      });
      const darkMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.9,
        roughness: 0.3,
      });
      const cyanGlowMat = new THREE.MeshBasicMaterial({ color: 0x64ffda });

      const fuselageGeo = new THREE.ConeGeometry(0.042, 0.28, 14);
      fuselageGeo.rotateX(Math.PI / 2);
      plane.add(new THREE.Mesh(fuselageGeo, bodyMat));

      const canopyGeo = new THREE.BoxGeometry(0.026, 0.022, 0.09);
      canopyGeo.translate(0, 0.024, 0.02);
      plane.add(new THREE.Mesh(canopyGeo, darkMat));

      const wingShape = new THREE.Shape();
      wingShape.moveTo(0, 0.07);
      wingShape.lineTo(0.26, -0.07);
      wingShape.lineTo(0.24, -0.1);
      wingShape.lineTo(0, -0.05);
      wingShape.lineTo(-0.24, -0.1);
      wingShape.lineTo(-0.26, -0.07);
      wingShape.closePath();

      const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
        depth: 0.005,
        bevelEnabled: false,
      });
      wingGeo.rotateX(-Math.PI / 2);
      wingGeo.translate(0, 0.004, -0.01);
      plane.add(new THREE.Mesh(wingGeo, bodyMat));

      const tailFinShape = new THREE.Shape();
      tailFinShape.moveTo(0, -0.05);
      tailFinShape.lineTo(0, 0.09);
      tailFinShape.lineTo(-0.07, 0.09);
      tailFinShape.lineTo(-0.05, -0.05);
      tailFinShape.closePath();

      const finGeo = new THREE.ExtrudeGeometry(tailFinShape, {
        depth: 0.004,
        bevelEnabled: false,
      });
      finGeo.rotateY(Math.PI / 2);
      finGeo.translate(0, 0.016, -0.12);
      plane.add(new THREE.Mesh(finGeo, bodyMat));

      const hStabGeo = new THREE.BoxGeometry(0.13, 0.004, 0.045);
      hStabGeo.translate(0, 0.022, -0.12);
      plane.add(new THREE.Mesh(hStabGeo, bodyMat));

      [-0.072, 0.072].forEach((x) => {
        const engineGeo = new THREE.CylinderGeometry(0.013, 0.013, 0.08, 10);
        engineGeo.rotateX(Math.PI / 2);
        engineGeo.translate(x, -0.014, -0.02);
        plane.add(new THREE.Mesh(engineGeo, darkMat));

        const exhaustGeo = new THREE.CircleGeometry(0.011, 8);
        exhaustGeo.translate(x, -0.014, -0.061);
        plane.add(new THREE.Mesh(exhaustGeo, cyanGlowMat));
      });

      const lightGeo = new THREE.SphereGeometry(0.008, 8, 8);
      const portLight = new THREE.Mesh(
        lightGeo,
        new THREE.MeshBasicMaterial({ color: 0xff3b30 })
      );
      portLight.position.set(-0.25, 0, -0.08);
      plane.add(portLight);

      const stbdLight = new THREE.Mesh(
        lightGeo,
        new THREE.MeshBasicMaterial({ color: 0x34c759 })
      );
      stbdLight.position.set(0.25, 0, -0.08);
      plane.add(stbdLight);

      plane.scale.set(0.95, 0.95, 0.95);
      return plane;
    }

    const airplane = createAirplane();
    globeGroup.add(airplane);

    // Contrail Ribbon
    const CONTRAIL_LENGTH = 35;
    const contrailGeo = new THREE.BufferGeometry();
    const contrailPositions = new Float32Array(CONTRAIL_LENGTH * 3);
    contrailGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(contrailPositions, 3)
    );
    const contrailMat = new THREE.LineBasicMaterial({
      color: 0x64ffda,
      transparent: true,
      opacity: 0.6,
    });
    const contrailLine = new THREE.Line(contrailGeo, contrailMat);
    globeGroup.add(contrailLine);
    const contrailHistory = [];

    // Flight Animation State
    let flightProgress = 0.0;
    let flightDirection = 1;
    let pauseTimer = 0;
    const FLIGHT_SPEED = 0.0016;

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
      const rippleScale = ((time * 1.6) % 2.5) + 1.0;
      const rippleOpacity = Math.max(0, 1.0 - (rippleScale - 1.0) / 1.5);
      markerRatnagiri.ring.scale.set(rippleScale, rippleScale, 1);
      markerRatnagiri.ringMat.opacity = rippleOpacity;
      markerLA.ring.scale.set(rippleScale, rippleScale, 1);
      markerLA.ringMat.opacity = rippleOpacity;

      // Flight progress
      if (pauseTimer > 0) {
        pauseTimer -= delta;
        if (pauseTimer <= 0) {
          flightDirection = -flightDirection;
        }
      } else {
        flightProgress += FLIGHT_SPEED * flightDirection;
        if (flightProgress >= 1.0) {
          flightProgress = 1.0;
          pauseTimer = 2.2;
        } else if (flightProgress <= 0.0) {
          flightProgress = 0.0;
          pauseTimer = 2.2;
        }
      }

      // Airplane positioning along Great Circle curve
      const currentPos = flightCurve.getPointAt(flightProgress);
      airplane.position.copy(currentPos);

      const deltaT = 0.004 * (flightDirection >= 0 ? 1 : -1);
      const nextT = Math.max(0, Math.min(1, flightProgress + deltaT));
      const nextPos = flightCurve.getPointAt(nextT);
      const tangent = nextPos.clone().sub(currentPos).normalize();

      if (tangent.lengthSq() > 0.0001) {
        const lookTarget = currentPos.clone().add(tangent);
        const upVec = currentPos.clone().normalize();
        const matrix = new THREE.Matrix4();
        matrix.lookAt(currentPos, lookTarget, upVec);
        airplane.quaternion.setFromRotationMatrix(matrix);

        const bankAngle =
          Math.sin(flightProgress * Math.PI) *
          0.22 *
          (flightDirection >= 0 ? 1 : -1);
        airplane.rotateZ(bankAngle);
      }

      // Contrail update
      if (pauseTimer <= 0) {
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
