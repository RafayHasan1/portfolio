// 3D "agent network": nodes on a sphere, signals travelling between them,
// and a wireframe core in the middle. Built with three.js.
import * as THREE from 'three';

function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.25, 'rgba(255,255,255,.85)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export function startHeroScene(container) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 8.2);

  const world = new THREE.Group();
  scene.add(world);
  const tex = dotTexture();

  // --- Nodes on a Fibonacci sphere ---
  const N = 110, R = 2.6;
  const nodes = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = Math.PI * (3 - Math.sqrt(5)) * i;
    const jitter = 1 + (Math.sin(i * 12.9898) * 0.5) * 0.12;
    nodes.push(new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(R * jitter));
  }
  const nodePos = new Float32Array(N * 3);
  const nodeCol = new Float32Array(N * 3);
  const cBlue = new THREE.Color('#4ea1ff'), cCyan = new THREE.Color('#5ef0ff'), cViolet = new THREE.Color('#9a8cff');
  nodes.forEach((v, i) => {
    nodePos.set([v.x, v.y, v.z], i * 3);
    const c = i % 9 === 0 ? cViolet : i % 4 === 0 ? cCyan : cBlue;
    nodeCol.set([c.r, c.g, c.b], i * 3);
  });
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
  nodeGeo.setAttribute('color', new THREE.BufferAttribute(nodeCol, 3));
  world.add(new THREE.Points(nodeGeo, new THREE.PointsMaterial({
    size: 0.16, map: tex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  })));

  // --- Edges: connect each node to its 3 nearest neighbours ---
  const edges = [];
  const adj = nodes.map(() => []);
  const seen = new Set();
  nodes.forEach((a, i) => {
    nodes.map((b, j) => [j, a.distanceToSquared(b)]).filter(([j]) => j !== i)
      .sort((p, q) => p[1] - q[1]).slice(0, 3)
      .forEach(([j]) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) return;
        seen.add(key);
        adj[i].push(edges.length); adj[j].push(edges.length);
        edges.push([i, j]);
      });
  });
  const linePos = new Float32Array(edges.length * 6);
  edges.forEach(([i, j], k) => {
    linePos.set([nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z], k * 6);
  });
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  world.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
    color: '#3f7fd6', transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false
  })));

  // --- Signals: bright points walking the graph ---
  const S = 46;
  const signals = Array.from({ length: S }, (_, k) => ({
    from: (k * 7) % N, edge: adj[(k * 7) % N][0], t: Math.random(), speed: 0.35 + Math.random() * 0.5
  }));
  const sigPos = new Float32Array(S * 3);
  const sigGeo = new THREE.BufferGeometry();
  sigGeo.setAttribute('position', new THREE.BufferAttribute(sigPos, 3));
  world.add(new THREE.Points(sigGeo, new THREE.PointsMaterial({
    size: 0.13, map: tex, color: '#bff6ff', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  })));
  const tmp = new THREE.Vector3();
  function stepSignals(dt) {
    signals.forEach((s, k) => {
      s.t += dt * s.speed;
      if (s.t >= 1) {
        const [a, b] = edges[s.edge];
        s.from = a === s.from ? b : a;
        const options = adj[s.from];
        s.edge = options[Math.floor(Math.random() * options.length)];
        s.t = 0;
      }
      const [a, b] = edges[s.edge];
      const to = a === s.from ? b : a;
      tmp.lerpVectors(nodes[s.from], nodes[to], s.t);
      sigPos.set([tmp.x, tmp.y, tmp.z], k * 3);
    });
    sigGeo.attributes.position.needsUpdate = true;
  }
  stepSignals(0);

  // --- Core: wireframe icosahedron + glow ---
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.95, 1),
    new THREE.MeshBasicMaterial({ color: '#6fb6ff', wireframe: true, transparent: true, opacity: 0.55 })
  );
  world.add(core);
  const inner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.55, 0),
    new THREE.MeshBasicMaterial({ color: '#9a8cff', wireframe: true, transparent: true, opacity: 0.7 })
  );
  world.add(inner);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: tex, color: '#3d8bff', transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false
  }));
  glow.scale.set(3.6, 3.6, 1);
  world.add(glow);

  // --- Orbit ring with a travelling dot ---
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.15, 0.006, 8, 160),
    new THREE.MeshBasicMaterial({ color: '#5ef0ff', transparent: true, opacity: 0.35 })
  );
  ring.rotation.set(1.2, 0.35, 0);
  scene.add(ring);
  const orbiter = new THREE.Sprite(new THREE.SpriteMaterial({
    map: tex, color: '#5ef0ff', blending: THREE.AdditiveBlending, depthWrite: false
  }));
  orbiter.scale.set(0.32, 0.32, 1);
  ring.add(orbiter);

  // --- Interaction ---
  const pointer = { x: 0, y: 0 };
  const onMove = (e) => {
    const r = container.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
  };
  window.addEventListener('pointermove', onMove);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w < 480 ? 9.6 : 8.2;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  let visible = true, raf = 0, last = performance.now(), time = 0;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(container);

  const render = (now) => {
    raf = requestAnimationFrame(render);
    if (!visible) { last = now; return; }
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now; time += dt;
    world.rotation.y += dt * 0.12;
    world.rotation.x += (pointer.y * 0.35 - world.rotation.x) * 0.04;
    world.position.x += (pointer.x * 0.25 - world.position.x) * 0.04;
    core.rotation.x -= dt * 0.3; core.rotation.y -= dt * 0.22;
    inner.rotation.y += dt * 0.6;
    const pulse = 1 + Math.sin(time * 2.2) * 0.06;
    glow.scale.set(3.6 * pulse, 3.6 * pulse, 1);
    orbiter.position.set(Math.cos(time * 0.7) * 3.15, Math.sin(time * 0.7) * 3.15, 0);
    stepSignals(dt);
    renderer.render(scene, camera);
  };

  if (reduce) {
    world.rotation.set(0.25, 0.6, 0);
    renderer.render(scene, camera);
  } else {
    raf = requestAnimationFrame(render);
  }

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect(); io.disconnect();
    window.removeEventListener('pointermove', onMove);
    scene.traverse((o) => { o.geometry?.dispose(); o.material?.dispose?.(); });
    tex.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
