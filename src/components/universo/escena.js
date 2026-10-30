import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  cargarImagen,
  texturaBrillo,
  texturaCentral,
  texturaCorazon,
  texturaNebulosa,
  texturaPlaneta,
} from "./texturas";

const RADIO_CENTRO = 6;
const POLAR_HOME = 1.18;
const AZIMUT_HOME = 0.5;
const ARRIBA = new THREE.Vector3(0, 1, 0);

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const suave = (dt, tasa) => 1 - Math.exp(-dt * tasa);
const gauss = () => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

/* ---------- Materiales con shader ---------- */

function materialAtmosfera(color, { p = 2, k = 1.6 } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uP: { value: p }, uK: { value: k } },
    vertexShader: `varying vec3 vN; varying vec3 vV;
      void main(){ vN = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uP; uniform float uK; varying vec3 vN; varying vec3 vV;
      void main(){ float i = pow(clamp(-dot(vN, vV), 0.0, 1.0), uP) * uK;
        gl_FragColor = vec4(uColor * i, i); }`,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
}

function materialPuntos(uTime, uPR, { atenua = false, escala = 300, alfa = 1 } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime, uPR,
      uAtenua: { value: atenua ? 1 : 0 },
      uEscala: { value: escala },
      uAlfa: { value: alfa },
    },
    vertexShader: `attribute float aTam; attribute float aFase; attribute vec3 aColor;
      uniform float uTime; uniform float uPR; uniform float uAtenua; uniform float uEscala;
      varying vec3 vC; varying float vA;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float tw = 0.7 + 0.3 * sin(uTime * (0.6 + aFase) + aFase * 40.0);
        float s = aTam * uPR * tw;
        if (uAtenua > 0.5) s *= uEscala / max(-mv.z, 1.0);
        gl_PointSize = clamp(s, 0.0, 64.0);
        vC = aColor; vA = tw;
        gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform float uAlfa; varying vec3 vC; varying float vA;
      void main(){ float d = length(gl_PointCoord - 0.5);
        float a = pow(smoothstep(0.5, 0.0, d), 1.6) * uAlfa * vA;
        gl_FragColor = vec4(vC * a, a); }`,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
}

function crearPuntos(n, rellenar, material) {
  const pos = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  const tam = new Float32Array(n);
  const fase = new Float32Array(n);
  const tmp = { x: 0, y: 0, z: 0, c: [1, 1, 1], s: 1 };
  for (let i = 0; i < n; i++) {
    rellenar(i, tmp);
    pos.set([tmp.x, tmp.y, tmp.z], i * 3);
    col.set(tmp.c, i * 3);
    tam[i] = tmp.s;
    fase[i] = Math.random();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
  g.setAttribute("aTam", new THREE.BufferAttribute(tam, 1));
  g.setAttribute("aFase", new THREE.BufferAttribute(fase, 1));
  const p = new THREE.Points(g, material);
  p.frustumCulled = false;
  return p;
}

/* ---------- Escena ---------- */

export class EscenaUniverso {
  constructor({ canvas, planetas, orbitas, imagenCentro, movil, reducir, etiquetaCentro, etiquetaHover, onTap, onInteraccion, onListo }) {
    this.canvas = canvas;
    this.movil = movil;
    this.reducir = reducir;
    this.etiquetaCentro = etiquetaCentro;
    this.etiquetaHover = etiquetaHover;
    this.cb = { onTap, onInteraccion, onListo };
    this.t = 0;
    this.sucio = true;
    this.vivo = true;
    this.modo = "intro"; // intro | libre | enfocando | vuelo
    this.vuelo = null;
    this.foco = null;
    this.previo = null;
    this.hover = null;
    this.ultimaAccion = performance.now();
    this.interactuo = false;
    this.tapOk = false;
    this.punteros = new Map();
    this.recursos = [];
    this.cuerpos = [];
    this.layoutLateral = () => false;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !movil,
      powerPreference: "high-performance",
    });
    this.pr = Math.min(window.devicePixelRatio || 1, movil ? 1.75 : 2);
    this.renderer.setPixelRatio(this.pr);
    this.renderer.setClearColor(0x02000a, 1);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(movil ? 62 : 52, 1, 0.1, 1800);
    this.uTime = { value: 0 };
    this.uPR = { value: this.pr };

    this.construir(planetas, orbitas);
    this.crearControles();
    this.escuchar();

    this.ro = new ResizeObserver(() => this.redimensionar());
    this.ro.observe(canvas.parentElement);
    this.redimensionar();
    this.irAHomeInstantaneo(true);
    this.cargarFotos(planetas);
    this.cargarCentro(imagenCentro);

    this.reloj = new THREE.Clock();
    this.ft = [];
    this.raf = requestAnimationFrame(this.bucle);
  }

  reg(obj) {
    this.recursos.push(obj);
    return obj;
  }

  /* ----- Construcción ----- */
  construir(planetas, orbitas) {
    const { scene, movil } = this;
    const brillo = this.reg(texturaBrillo());
    this.texBrillo = brillo;

    scene.add(new THREE.AmbientLight(0x7a56c0, 1.15));
    const luz = new THREE.PointLight(0xffa6d8, 9, 0, 0);
    scene.add(luz);

    this.geoEsfera = this.reg(new THREE.SphereGeometry(1, movil ? 32 : 56, movil ? 20 : 36));
    this.geoAtm = this.reg(new THREE.SphereGeometry(1, 28, 18));

    // Estrellas de fondo
    const colores = [[1, 1, 1], [0.8, 0.86, 1], [1, 0.78, 0.92]];
    this.estrellas = crearPuntos(movil ? 1500 : 3800, (i, o) => {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(520 + Math.random() * 380);
      o.x = v.x; o.y = v.y; o.z = v.z;
      const r = Math.random();
      o.c = colores[r < 0.7 ? 0 : r < 0.88 ? 1 : 2].map((c) => c * (0.5 + Math.random() * 0.5));
      o.s = r > 0.985 ? 6 : 1.6 + Math.random() * 2.2;
    }, this.reg(materialPuntos(this.uTime, this.uPR)));
    this.estrellas.renderOrder = -3;
    scene.add(this.estrellas);

    // Nebulosas (sprites enormes con profundidad real)
    const paleta = ["140,70,255", "230,60,170", "255,120,190", "80,60,210"];
    this.nebulosas = new THREE.Group();
    const nNeb = movil ? 6 : 9;
    for (let i = 0; i < nNeb; i++) {
      const tex = this.reg(texturaNebulosa(paleta[i % paleta.length], i * 7 + 1));
      const mat = this.reg(new THREE.SpriteMaterial({
        map: tex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
        opacity: 0.55 + Math.random() * 0.35, rotation: Math.random() * 6,
      }));
      const s = new THREE.Sprite(mat);
      const dir = new THREE.Vector3(Math.random() - 0.5, (Math.random() - 0.5) * 0.9, Math.random() - 0.5).normalize();
      s.position.copy(dir.multiplyScalar(260 + Math.random() * 170));
      s.scale.setScalar(300 + Math.random() * 260);
      s.renderOrder = -2;
      this.nebulosas.add(s);
    }
    scene.add(this.nebulosas);

    // Disco de galaxia en espiral
    const matGal = this.reg(materialPuntos(this.uTime, this.uPR, { atenua: true, escala: 260, alfa: 0.75 }));
    this.galaxia = crearPuntos(movil ? 5000 : 12000, (i, o) => {
      const r = 5 + Math.pow(Math.random(), 0.75) * 80;
      const brazo = (i % 3) * ((Math.PI * 2) / 3);
      const ang = brazo + r * 0.12 + gauss() * (0.14 + r * 0.004);
      o.x = Math.cos(ang) * r + gauss() * 0.5;
      o.z = Math.sin(ang) * r + gauss() * 0.5;
      o.y = gauss() * (0.5 + (1 - r / 90) * 0.9);
      const k = r / 85;
      o.c = k < 0.3 ? [1, 0.82, 0.95] : k < 0.65 ? [1, 0.45, 0.78] : [0.58, 0.4, 1];
      o.c = o.c.map((c) => c * (0.5 + Math.random() * 0.5));
      o.s = 0.9 + Math.random() * 1.4;
    }, matGal);
    this.galaxia.renderOrder = -1;
    scene.add(this.galaxia);

    // Polvo cósmico
    const matPolvo = this.reg(materialPuntos(this.uTime, this.uPR, { atenua: true, escala: 300, alfa: 0.9 }));
    this.polvo = crearPuntos(movil ? 260 : 700, (i, o) => {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(8 + Math.pow(Math.random(), 0.6) * 70);
      o.x = v.x; o.y = v.y * 0.55; o.z = v.z;
      o.c = (Math.random() > 0.5 ? [1, 0.55, 0.85] : [0.7, 0.5, 1]).map((c) => c * (0.6 + Math.random() * 0.4));
      o.s = 1.6 + Math.random() * 2.4;
    }, matPolvo);
    scene.add(this.polvo);

    // Órbitas sutiles
    for (const [i, radio] of orbitas.entries()) {
      const pts = [];
      for (let a = 0; a < 160; a++) {
        const th = (a / 160) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(th) * radio, 0, Math.sin(th) * radio));
      }
      const g = this.reg(new THREE.BufferGeometry().setFromPoints(pts));
      const m = this.reg(new THREE.LineBasicMaterial({
        color: i % 2 ? 0xb98cff : 0xff8ac4, transparent: true, opacity: 0.16,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      scene.add(new THREE.LineLoop(g, m));
    }

    this.construirCentro();
    this.construirPlanetas(planetas);
  }

  construirCentro() {
    const { scene, movil } = this;
    const g = new THREE.Group();
    this.centro = { grupo: g, radio: RADIO_CENTRO, pos: new THREE.Vector3(), centro: true };

    const tex = this.reg(texturaCentral());
    this.centroTex = tex;
    const mat = this.reg(new THREE.MeshStandardMaterial({
      map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.85, roughness: 0.55, metalness: 0,
    }));
    this.centroMat = mat;
    this.centroMesh = new THREE.Mesh(this.geoEsfera, mat);
    this.centroMesh.scale.setScalar(RADIO_CENTRO);
    g.add(this.centroMesh);

    for (const [esc, col, k, p] of [[1.22, 0xff7cc4, 2.6, 1.8], [1.75, 0x9a5cff, 1.5, 2.4]]) {
      const a = new THREE.Mesh(this.geoAtm, this.reg(materialAtmosfera(col, { p, k })));
      a.scale.setScalar(RADIO_CENTRO * esc);
      g.add(a);
    }

    // Halo volumétrico pulsante
    this.centroHalo = new THREE.Sprite(this.reg(new THREE.SpriteMaterial({
      map: this.texBrillo, color: 0xff5fb8, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.55,
    })));
    this.centroHalo.scale.setScalar(RADIO_CENTRO * 9);
    g.add(this.centroHalo);

    // Anillo luminoso que lo identifica como centro
    const anillo = new THREE.Mesh(
      this.reg(new THREE.TorusGeometry(RADIO_CENTRO * 1.75, 0.045, 8, 160)),
      this.reg(new THREE.MeshBasicMaterial({ color: 0xffa6d8, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false }))
    );
    anillo.rotation.x = Math.PI / 2 + 0.38;
    anillo.rotation.z = -0.25;
    g.add(anillo);
    this.anillo = anillo;

    // Partículas en órbita
    const mp = this.reg(materialPuntos(this.uTime, this.uPR, { atenua: true, escala: 300, alfa: 1 }));
    const crearAnillo = (n, r0, r1) => crearPuntos(n, (i, o) => {
      const a = Math.random() * Math.PI * 2, r = r0 + Math.random() * (r1 - r0);
      o.x = Math.cos(a) * r; o.z = Math.sin(a) * r; o.y = gauss() * 0.45;
      o.c = (Math.random() > 0.4 ? [1, 0.6, 0.88] : [0.75, 0.55, 1]);
      o.s = 1.4 + Math.random() * 2.6;
    }, mp);
    this.anillosPart = [crearAnillo(movil ? 220 : 520, RADIO_CENTRO * 1.4, RADIO_CENTRO * 2.2), crearAnillo(movil ? 120 : 300, RADIO_CENTRO * 2.5, RADIO_CENTRO * 3.1)];
    this.anillosPart.forEach((a) => { a.rotation.x = 0.38; g.add(a); });

    // Corazón flotante
    this.corazon = new THREE.Sprite(this.reg(new THREE.SpriteMaterial({
      map: this.reg(texturaCorazon()), transparent: true, depthWrite: false,
    })));
    this.corazon.scale.setScalar(2.6);
    this.corazon.position.set(0, RADIO_CENTRO * 1.75 + 1.2, 0);
    g.add(this.corazon);

    scene.add(g);
    this.cuerpos.push(this.centro);
  }

  construirPlanetas(planetas) {
    this.planetas = planetas.map((d, i) => {
      const radio = d.size ?? 2.4;
      const grupo = new THREE.Group();
      const color = d.color ?? "#ff8ac4";
      const tex = this.reg(texturaPlaneta(null, color, d.focus, 256));
      const mat = this.reg(new THREE.MeshStandardMaterial({
        map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.38, roughness: 0.7, metalness: 0,
      }));
      const mesh = new THREE.Mesh(this.geoEsfera, mat);
      mesh.scale.setScalar(radio);
      grupo.add(mesh);

      const atm = new THREE.Mesh(this.geoAtm, this.reg(materialAtmosfera(color, { p: 2.2, k: 1.5 })));
      atm.scale.setScalar(radio * 1.28);
      grupo.add(atm);

      const halo = new THREE.Sprite(this.reg(new THREE.SpriteMaterial({
        map: this.texBrillo, color, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.4,
      })));
      halo.scale.setScalar(radio * 5.2);
      grupo.add(halo);

      const pos = new THREE.Vector3(d.position.x, d.position.y, d.position.z);
      grupo.position.copy(pos);
      grupo.scale.setScalar(this.reducir ? 1 : 0.001);
      this.scene.add(grupo);

      const R = Math.hypot(pos.x, pos.z);
      const p = {
        data: d, grupo, mesh, mat, tex, halo, atm, radio,
        pos, R, y: pos.y, ang: Math.atan2(pos.z, pos.x),
        vel: 0.022 / Math.sqrt(Math.max(R, 8) / 16),
        idx: i, fase: i * 1.7, aparece: this.reducir ? 1 : 0, yaw: 0, brillo: 0,
      };
      this.cuerpos.push(p);
      return p;
    });
  }

  async cargarCentro(src) {
    if (!src) return;
    try {
      const img = await cargarImagen(src);
      if (!this.vivo) return;
      const vieja = this.centroTex;
      this.centroTex = this.reg(texturaCentral(img, this.movil ? 1024 : 1536));
      this.centroMat.map = this.centroTex;
      this.centroMat.emissiveMap = this.centroTex;
      this.centroMat.needsUpdate = true;
      vieja?.dispose();
      this.sucio = true;
    } catch {
      /* queda la superficie sin foto */
    }
  }

  /** Carga las fotos de a dos, las más cercanas primero. */
  async cargarFotos(planetas) {
    const cola = [...this.planetas].sort((a, b) => a.R - b.R);
    const ancho = this.movil ? 768 : 1024;
    const trabajador = async () => {
      while (cola.length && this.vivo) {
        const p = cola.shift();
        try {
          const img = await cargarImagen(p.data.image);
          if (!this.vivo) return;
          const nueva = texturaPlaneta(img, p.data.color ?? "#ff8ac4", p.data.focus, ancho);
          nueva.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
          const vieja = p.tex;
          p.tex = nueva;
          p.mat.map = nueva;
          p.mat.emissiveMap = nueva;
          p.mat.needsUpdate = true;
          vieja.dispose();
          this.sucio = true;
        } catch {
          /* la foto sigue disponible en el panel aunque falle la textura */
        }
      }
    };
    await Promise.all([trabajador(), trabajador()]);
    if (this.vivo) this.cb.onListo?.();
  }

  crearControles() {
    const c = new OrbitControls(this.camera, this.canvas);
    c.enableDamping = true;
    c.dampingFactor = 0.07;
    c.rotateSpeed = this.movil ? 0.75 : 0.6;
    c.zoomSpeed = 0.85;
    c.panSpeed = 0.7;
    c.screenSpacePanning = true;
    c.minDistance = 9;
    c.maxDistance = 125;
    c.minPolarAngle = 0.12;
    c.maxPolarAngle = Math.PI - 0.12;
    c.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
    c.autoRotate = !this.reducir;
    c.autoRotateSpeed = 0.3;
    c.enabled = false;
    c.addEventListener("start", () => {
      this.ultimaAccion = performance.now();
      if (!this.interactuo) {
        this.interactuo = true;
        this.cb.onInteraccion?.();
      }
    });
    c.addEventListener("end", () => (this.ultimaAccion = performance.now()));
    c.addEventListener("change", () => (this.sucio = true));
    this.controles = c;
  }

  /* ----- Eventos de puntero (selección) ----- */
  escuchar() {
    const el = this.canvas;
    this.onDown = (e) => {
      this.punteros.set(e.pointerId, { x: e.clientX, y: e.clientY, t: performance.now() });
      this.tapOk = this.punteros.size === 1;
      this.ultimaAccion = performance.now();
    };
    this.onMove = (e) => {
      const p = this.punteros.get(e.pointerId);
      if (p) {
        if (Math.hypot(e.clientX - p.x, e.clientY - p.y) > 9) this.tapOk = false;
      } else if (e.pointerType === "mouse" && this.modo === "libre") {
        this.setHover(this.elegir(e.clientX, e.clientY));
      }
    };
    this.onUp = (e) => {
      const p = this.punteros.get(e.pointerId);
      this.punteros.delete(e.pointerId);
      if (p && this.tapOk && performance.now() - p.t < 600 && this.modo === "libre") {
        const cuerpo = this.elegir(e.clientX, e.clientY);
        if (cuerpo) this.cb.onTap?.(cuerpo);
      }
      if (!this.punteros.size) this.tapOk = false;
    };
    this.onLeave = () => this.setHover(null);
    el.addEventListener("pointerdown", this.onDown, { passive: true });
    el.addEventListener("pointermove", this.onMove, { passive: true });
    el.addEventListener("pointerup", this.onUp, { passive: true });
    el.addEventListener("pointercancel", this.onUp, { passive: true });
    el.addEventListener("pointerleave", this.onLeave, { passive: true });
  }

  /** Selecciona por proyección en pantalla: tolerante con el dedo en celulares. */
  elegir(cx, cy) {
    const r = this.canvas.getBoundingClientRect();
    const x = cx - r.left, y = cy - r.top;
    const tanH = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const minimo = this.movil ? 36 : 24;
    let mejor = null, mejorScore = Infinity;
    const v = new THREE.Vector3();
    for (const c of this.cuerpos) {
      if (!c.centro && c.aparece < 0.9) continue;
      v.copy(c.pos).applyMatrix4(this.camera.matrixWorldInverse);
      const prof = -v.z;
      if (prof < 0.5) continue;
      v.copy(c.pos).project(this.camera);
      const sx = (v.x * 0.5 + 0.5) * r.width;
      const sy = (-v.y * 0.5 + 0.5) * r.height;
      const rpx = (c.radio * r.height) / (2 * tanH * prof);
      const d = Math.hypot(sx - x, sy - y);
      if (d > Math.max(rpx * 1.15, minimo)) continue;
      const score = d <= rpx ? prof - 1e5 : d + 1e3; // superficie real primero, luego el más cercano al toque
      if (score < mejorScore) { mejorScore = score; mejor = c; }
    }
    return mejor;
  }

  setHover(c) {
    if (c === this.hover) return;
    this.hover = c;
    this.canvas.style.cursor = c ? "pointer" : "";
    const e = this.etiquetaHover;
    if (e) {
      e.textContent = c ? (c.centro ? "" : c.data.name ?? "") : "";
      e.dataset.on = c && !c.centro && c.data.name ? "1" : "0";
    }
    this.sucio = true;
  }

  /* ----- Cámara ----- */
  posHome() {
    const aspecto = this.camera.aspect;
    const tanH = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const necesito = this.movil ? 30 : 44;
    const d = clamp(necesito / (Math.min(aspecto, 1.8) * tanH), 55, 118);
    return new THREE.Vector3().setFromSphericalCoords(d, POLAR_HOME, AZIMUT_HOME);
  }

  irAHomeInstantaneo(lejos = false) {
    const p = this.posHome();
    this.camera.position.copy(lejos && !this.reducir ? p.clone().multiplyScalar(2.1).add(new THREE.Vector3(0, 40, 0)) : p);
    this.controles.target.set(0, 0, 0);
    this.camera.lookAt(0, 0, 0);
    this.sucio = true;
  }

  volarA(pos, target, { tasa = 1.6, alFin } = {}) {
    this.modo = "vuelo";
    this.controles.enabled = false;
    this.vuelo = { pos: pos.clone(), target: target.clone(), tasa: this.reducir ? 40 : tasa, alFin };
  }

  entrar() {
    this.volarA(this.posHome(), new THREE.Vector3(), {
      tasa: 0.75,
      alFin: () => this.liberar(),
    });
  }

  liberar() {
    this.modo = "libre";
    this.vuelo = null;
    this.foco = null;
    this.controles.enabled = true;
    this.controles.update();
    this.ultimaAccion = performance.now();
    this.sucio = true;
  }

  volverVista() {
    if (this.modo === "intro") return;
    this.foco = null;
    this.previo = null;
    this.setHover(null);
    this.volarA(this.posHome(), new THREE.Vector3(), { alFin: () => this.liberar() });
  }

  seleccionarId(id) {
    this.seleccionar(this.planetas.find((p) => p.data.id === id));
  }

  /** Acerca la cámara al planeta y lo mantiene encuadrado mientras orbita. */
  seleccionar(cuerpo) {
    if (this.modo === "intro" || !cuerpo) return;
    if (this.modo === "libre") {
      this.previo = { pos: this.camera.position.clone(), target: this.controles.target.clone() };
    }
    this.setHover(null);
    this.controles.enabled = false;
    const dir = this.camera.position.clone().sub(cuerpo.pos);
    dir.y = clamp(dir.y / Math.max(dir.length(), 1e-3), -0.45, 0.55) * dir.length();
    dir.normalize();
    const dist = cuerpo.radio * (cuerpo.centro ? 3.4 : this.movil ? 6.2 : 4.9);
    this.foco = { cuerpo, dir, dist };
    this.modo = "enfocando";
    this.vuelo = null;
    this.sucio = true;
  }

  cerrarFoco() {
    if (this.modo !== "enfocando") return;
    const previo = this.previo ?? { pos: this.posHome(), target: new THREE.Vector3() };
    this.foco = null;
    this.previo = null;
    this.volarA(previo.pos, previo.target, { tasa: 1.9, alFin: () => this.liberar() });
  }

  desplazamiento(foco) {
    // Corre el encuadre para que el planeta quede libre del panel (lateral o inferior).
    const tanH = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const adelante = foco.dir.clone().negate();
    const derecha = adelante.clone().cross(ARRIBA).normalize();
    const arriba = derecha.clone().cross(adelante).normalize();
    const mitadAlto = foco.dist * tanH;
    if (this.layoutLateral()) {
      const ancho = this.canvas.clientWidth, alto = this.canvas.clientHeight;
      const px = Math.min(420, ancho * 0.4) / 2; // el planeta queda en el centro del espacio libre
      return derecha.multiplyScalar(((px / (ancho / 2)) * mitadAlto * (ancho / alto)));
    }
    return arriba.multiplyScalar(-mitadAlto * 0.46);
  }

  /* ----- Bucle ----- */
  bucle = () => {
    if (!this.vivo) return;
    this.raf = requestAnimationFrame(this.bucle);
    const dt = Math.min(this.reloj.getDelta(), 0.1);
    const animando = !this.reducir;
    const enMovimiento = this.modo === "vuelo" || this.modo === "enfocando" || this.modo === "intro";
    if (!animando && !this.sucio && !enMovimiento) return;
    this.sucio = false;
    if (animando) this.t += dt;
    this.uTime.value = this.t;
    this.actualizar(dt, animando);
    this.actualizarCamara(dt);
    this.actualizarEtiquetas();
    this.renderer.render(this.scene, this.camera);
    this.vigilarRendimiento(dt);
  };

  actualizar(dt, animando) {
    const t = this.t;
    if (animando) {
      this.galaxia.rotation.y += dt * 0.006;
      this.polvo.rotation.y -= dt * 0.01;
      this.estrellas.rotation.y += dt * 0.0012;
      this.nebulosas.rotation.y += dt * 0.0015;
      this.anillosPart[0].rotation.y += dt * 0.16;
      this.anillosPart[1].rotation.y -= dt * 0.1;
      this.anillo.rotation.z += dt * 0.05;
    }
    // La foto del centro mira siempre hacia quien explora, con un vaivén lento.
    {
      const objetivo = Math.atan2(this.camera.position.x, this.camera.position.z) + Math.sin(t * 0.2) * 0.12;
      const d = Math.atan2(Math.sin(objetivo - this.centroMesh.rotation.y), Math.cos(objetivo - this.centroMesh.rotation.y));
      this.centroMesh.rotation.y += d * suave(dt, 1.5);
    }
    const pulso = 0.5 + 0.5 * Math.sin(t * 1.3);
    const sel = this.foco?.cuerpo;
    this.centroMat.emissiveIntensity = 0.72 + pulso * 0.28 + (sel?.centro ? 0.25 : 0);
    this.centroHalo.material.opacity = 0.42 + pulso * 0.2 + (sel?.centro ? 0.2 : 0);
    this.centroHalo.scale.setScalar(RADIO_CENTRO * (8.4 + pulso * 1.4));
    this.corazon.position.y = RADIO_CENTRO * 1.75 + 1.2 + Math.sin(t * 1.1) * 0.25;

    for (const p of this.planetas) {
      if (animando) {
        p.ang += dt * p.vel;
        p.pos.set(Math.cos(p.ang) * p.R, p.y + Math.sin(t * 0.4 + p.fase) * 0.25, Math.sin(p.ang) * p.R);
        p.grupo.position.copy(p.pos);
        if (p.aparece < 1) p.aparece = clamp(p.aparece + (this.t > 0.6 + p.idx * 0.18 ? dt * 0.8 : 0), 0, 1);
        const e = 1 - Math.pow(1 - p.aparece, 3);
        p.grupo.scale.setScalar(Math.max(e, 0.001));
      }
      // La foto mira hacia afuera con un vaivén suave; al seleccionarlo, hacia la cámara.
      let objetivo;
      if (sel === p) objetivo = Math.atan2(this.camera.position.x - p.pos.x, this.camera.position.z - p.pos.z);
      else objetivo = Math.atan2(p.pos.x, p.pos.z) + Math.sin(t * 0.25 + p.fase) * 0.5;
      let d = objetivo - p.yaw;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      p.yaw += d * (sel === p ? suave(dt, 3) : 1);
      p.mesh.rotation.y = p.yaw;

      const objB = sel === p ? 1 : this.hover === p ? 0.7 : 0;
      p.brillo += (objB - p.brillo) * suave(dt, 5);
      p.halo.material.opacity = 0.3 + 0.1 * Math.sin(t * 1.2 + p.fase) + p.brillo * 0.5;
      p.halo.scale.setScalar(p.radio * (5.2 + p.brillo * 1.8));
      p.mat.emissiveIntensity = 0.38 + p.brillo * 0.35;
      p.mesh.scale.setScalar(p.radio * (1 + p.brillo * 0.07));
    }
  }

  actualizarCamara(dt) {
    const cam = this.camera;
    const c = this.controles;
    if (this.modo === "libre") {
      // Reposo: giro lento hasta que vuelva a tocar la pantalla
      c.autoRotate = !this.reducir && performance.now() - this.ultimaAccion > 6000;
      if (c.target.length() > 45) c.target.setLength(45);
      c.update();
      if (cam.position.length() > 170) cam.position.setLength(170);
      for (const b of this.cuerpos) {
        const min = b.radio * 1.7 + 1;
        const d = cam.position.distanceTo(b.pos);
        if (d < min) cam.position.copy(b.pos).add(cam.position.clone().sub(b.pos).setLength(min));
      }
    } else if (this.modo === "enfocando") {
      const f = this.foco;
      const desp = this.desplazamiento(f);
      const objTarget = f.cuerpo.pos.clone().add(desp);
      const objCam = objTarget.clone().add(f.dir.clone().multiplyScalar(f.dist));
      const k = suave(dt, this.reducir ? 40 : 2.4);
      cam.position.lerp(objCam, k);
      c.target.lerp(objTarget, k);
      cam.lookAt(c.target);
    } else if (this.modo === "vuelo" && this.vuelo) {
      const v = this.vuelo;
      const k = suave(dt, v.tasa);
      cam.position.lerp(v.pos, k);
      c.target.lerp(v.target, k);
      cam.lookAt(c.target);
      if (cam.position.distanceTo(v.pos) < 0.25 && c.target.distanceTo(v.target) < 0.15) {
        cam.position.copy(v.pos);
        c.target.copy(v.target);
        cam.lookAt(c.target);
        const fin = v.alFin;
        this.vuelo = null;
        fin?.();
      }
    }
  }

  actualizarEtiquetas() {
    const el = this.etiquetaCentro;
    const v = new THREE.Vector3();
    const proyectar = (x, y, z) => {
      v.set(x, y, z).project(this.camera);
      return v.z < 1 ? [(v.x * 0.5 + 0.5) * this.canvas.clientWidth, (-v.y * 0.5 + 0.5) * this.canvas.clientHeight] : null;
    };
    if (el) {
      const p = proyectar(0, RADIO_CENTRO * 1.75 + 3.4, 0);
      if (p && this.modo !== "enfocando") {
        el.style.transform = `translate3d(${p[0]}px,${p[1]}px,0) translate(-50%,-100%)`;
        el.style.opacity = this.modo === "intro" ? 0 : 1;
      } else el.style.opacity = 0;
    }
    const h = this.etiquetaHover;
    if (h && this.hover && !this.hover.centro) {
      const p = proyectar(this.hover.pos.x, this.hover.pos.y + this.hover.radio * 1.5, this.hover.pos.z);
      if (p) h.style.transform = `translate3d(${p[0]}px,${p[1]}px,0) translate(-50%,-100%)`;
    }
  }

  /** Si el dispositivo va justo, baja la resolución de render. */
  vigilarRendimiento(dt) {
    this.ft.push(dt);
    if (this.ft.length < 90) return;
    const prom = this.ft.reduce((a, b) => a + b, 0) / this.ft.length;
    this.ft.length = 0;
    if (prom > 0.026 && this.pr > 1) {
      this.pr = Math.max(1, this.pr - 0.25);
      this.renderer.setPixelRatio(this.pr);
      this.uPR.value = this.pr;
      this.redimensionar();
    }
  }

  redimensionar() {
    const host = this.canvas.parentElement;
    const w = host.clientWidth || 1, h = host.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.sucio = true;
  }

  dispose() {
    this.vivo = false;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    const el = this.canvas;
    el.removeEventListener("pointerdown", this.onDown);
    el.removeEventListener("pointermove", this.onMove);
    el.removeEventListener("pointerup", this.onUp);
    el.removeEventListener("pointercancel", this.onUp);
    el.removeEventListener("pointerleave", this.onLeave);
    this.controles.dispose();
    for (const p of this.planetas) p.tex.dispose();
    for (const r of this.recursos) r.dispose?.();
    for (const g of [this.estrellas, this.galaxia, this.polvo, ...this.anillosPart]) g.geometry.dispose();
    this.renderer.dispose();
  }
}
