import * as THREE from "three";

const rnd = (i, s) => {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

function lienzo(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

function aTextura(canvas, { color = true, repetir = false } = {}) {
  const t = new THREE.CanvasTexture(canvas);
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  if (repetir) t.wrapS = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

/** Punto de luz suave, usado para estrellas, polvo y halos. */
export function texturaBrillo() {
  const c = lienzo(64, 64);
  const g = c.getContext("2d");
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.2, "rgba(255,255,255,0.55)");
  gr.addColorStop(0.5, "rgba(255,255,255,0.12)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  return aTextura(c, { color: false });
}

/** Nube de nebulosa: varias manchas difusas de un mismo tono. */
export function texturaNebulosa(rgb, semilla) {
  const S = 256;
  const c = lienzo(S, S);
  const g = c.getContext("2d");
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 16; i++) {
    const a = rnd(i, semilla) * Math.PI * 2;
    const d = rnd(i, semilla + 1) * S * 0.28;
    const x = S / 2 + Math.cos(a) * d;
    const y = S / 2 + Math.sin(a) * d * 0.8;
    const r = S * (0.12 + rnd(i, semilla + 2) * 0.22);
    const al = 0.07 + rnd(i, semilla + 3) * 0.1;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(${rgb},${al})`);
    gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr;
    g.fillRect(0, 0, S, S);
  }
  // borde suave para que no se note el cuadrado
  g.globalCompositeOperation = "destination-in";
  const m = g.createRadialGradient(S / 2, S / 2, S * 0.1, S / 2, S / 2, S / 2);
  m.addColorStop(0, "rgba(0,0,0,1)");
  m.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = m;
  g.fillRect(0, 0, S, S);
  return aTextura(c);
}

/** Superficie del planeta central: bandas y remolinos rosa / violeta / magenta. */
export function texturaCentral(img = null, ancho = 1024) {
  const W = ancho, H = ancho / 2;
  const c = lienzo(W, H);
  const g = c.getContext("2d");
  const base = g.createLinearGradient(0, 0, 0, H);
  base.addColorStop(0, "#7a3df0");
  base.addColorStop(0.35, "#e0489f");
  base.addColorStop(0.55, "#ff8cc6");
  base.addColorStop(0.8, "#c13fb4");
  base.addColorStop(1, "#6a2fc9");
  g.fillStyle = base;
  g.fillRect(0, 0, W, H);

  const cols = ["255,170,220", "160,90,255", "255,90,170", "255,220,240", "120,60,220"];
  for (let i = 0; i < 70; i++) {
    const x = rnd(i, 3) * W;
    const y = H * (0.1 + rnd(i, 4) * 0.8);
    const rx = 60 + rnd(i, 5) * 220;
    const ry = 6 + rnd(i, 6) * 26;
    const col = cols[Math.floor(rnd(i, 7) * cols.length)];
    for (const dx of [-W, 0, W]) {
      g.save();
      g.translate(x + dx, y);
      g.rotate((rnd(i, 8) - 0.5) * 0.25);
      g.scale(1, ry / rx);
      const gr = g.createRadialGradient(0, 0, 0, 0, 0, rx);
      gr.addColorStop(0, `rgba(${col},${0.12 + rnd(i, 9) * 0.2})`);
      gr.addColorStop(1, `rgba(${col},0)`);
      g.fillStyle = gr;
      g.beginPath();
      g.arc(0, 0, rx, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
  }
  if (img) {
    const S = Math.round(H * 0.92);
    const parche = lienzo(S, S);
    const p = parche.getContext("2d");
    const lado = Math.min(img.width, img.height);
    p.drawImage(img, 0, (img.height - lado) * 0.55, lado, lado, 0, 0, S, S);
    p.globalCompositeOperation = "destination-in";
    const m = p.createRadialGradient(S / 2, S / 2, S * 0.3, S / 2, S / 2, S / 2);
    m.addColorStop(0, "rgba(0,0,0,1)");
    m.addColorStop(0.85, "rgba(0,0,0,1)");
    m.addColorStop(1, "rgba(0,0,0,0)");
    p.fillStyle = m;
    p.fillRect(0, 0, S, S);
    for (const u of [0.25, 0.75]) g.drawImage(parche, W * u - S / 2, (H - S) / 2);
  }
  return aTextura(c, { repetir: true });
}

/** Detalle de corazón para marcar el centro. */
export function texturaCorazon() {
  const S = 128;
  const c = lienzo(S, S);
  const g = c.getContext("2d");
  g.translate(S / 2, S / 2 + 6);
  g.shadowColor = "rgba(255,110,190,1)";
  g.shadowBlur = 18;
  g.fillStyle = "#ffd0ea";
  g.beginPath();
  g.moveTo(0, 30);
  g.bezierCurveTo(-52, -4, -28, -42, 0, -16);
  g.bezierCurveTo(28, -42, 52, -4, 0, 30);
  g.fill();
  return aTextura(c);
}

/**
 * Superficie de un planeta de recuerdo: color de base con bandas suaves y la
 * foto en dos "parches" circulares opuestos (así se ve desde cualquier lado).
 * `img` puede ser null mientras la foto carga.
 */
export function texturaPlaneta(img, color, foco = {}, ancho = 1024) {
  const W = ancho, H = ancho / 2;
  const c = lienzo(W, H);
  const g = c.getContext("2d");
  const col = new THREE.Color(color);
  const [r, gg, b] = [col.r, col.g, col.b].map((v) => Math.round(Math.pow(v, 1 / 2.2) * 255));
  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, `rgb(${r * 0.35 | 0},${gg * 0.35 | 0},${b * 0.5 | 0})`);
  bg.addColorStop(0.5, `rgb(${r},${gg},${b})`);
  bg.addColorStop(1, `rgb(${r * 0.3 | 0},${gg * 0.3 | 0},${b * 0.45 | 0})`);
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);
  for (let i = 0; i < 22; i++) {
    g.fillStyle = `rgba(255,255,255,${0.03 + rnd(i, 51) * 0.05})`;
    g.fillRect(0, rnd(i, 52) * H, W, 3 + rnd(i, 53) * 16);
  }

  if (img) {
    const S = Math.round(H * 0.72); // lado del parche
    const parche = lienzo(S, S);
    const p = parche.getContext("2d");
    const lado = Math.min(img.width, img.height);
    const fx = foco.x ?? 0.5;
    const fy = foco.y ?? (img.height > img.width ? 0.38 : 0.5);
    const sx = (img.width - lado) * fx;
    const sy = (img.height - lado) * fy;
    p.drawImage(img, sx, sy, lado, lado, 0, 0, S, S);
    p.globalCompositeOperation = "destination-in";
    const m = p.createRadialGradient(S / 2, S / 2, S * 0.36, S / 2, S / 2, S / 2);
    m.addColorStop(0, "rgba(0,0,0,1)");
    m.addColorStop(0.82, "rgba(0,0,0,1)");
    m.addColorStop(1, "rgba(0,0,0,0)");
    p.fillStyle = m;
    p.fillRect(0, 0, S, S);
    for (const u of [0.25, 0.75]) g.drawImage(parche, W * u - S / 2, (H - S) / 2);
  }
  return aTextura(c);
}

/** Carga una imagen sin bloquear el hilo principal. */
export function cargarImagen(src) {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.decoding = "async";
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = src;
  });
}
