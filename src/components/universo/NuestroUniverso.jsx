import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Orbit, Volume2, VolumeX } from "lucide-react";
import { centro, musica, planetas, orbitas, textos } from "../../data/universo";
import { EscenaUniverso } from "./escena";
import PanelRecuerdo from "./PanelRecuerdo";
import "./nuestro-universo.css";

const CLAVE_INTRO = "poemav_universo_intro";

function leerIntroVista() {
  try {
    return localStorage.getItem(CLAVE_INTRO) === "1";
  } catch {
    return false;
  }
}

export default function NuestroUniverso({ onSalir }) {
  const canvasRef = useRef(null);
  const escenaRef = useRef(null);
  const audioRef = useRef(null);
  const centroRef = useRef(null);
  const hoverRef = useRef(null);
  const timers = useRef([]);

  const [error, setError] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [intro, setIntro] = useState(() => !leerIntroVista());
  const [entrado, setEntrado] = useState(false);
  const [interactuo, setInteractuo] = useState(false);
  const [item, setItem] = useState(null); // contenido del panel (se conserva durante la salida)
  const [abierto, setAbierto] = useState(false);
  const [sonando, setSonando] = useState(false);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  // Bloquea el scroll del documento mientras dura la experiencia.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const abrirCuerpo = useCallback((cuerpo) => {
    if (!cuerpo || !escenaRef.current) return;
    escenaRef.current.seleccionar(cuerpo);
    setItem(
      cuerpo.centro
        ? { name: centro.titulo, message: centro.mensaje }
        : cuerpo.data
    );
    setAbierto(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const movil = window.matchMedia("(max-width: 820px), (pointer: coarse)").matches;
    let escena;
    try {
      escena = new EscenaUniverso({
        canvas,
        planetas,
        orbitas,
        imagenCentro: centro.imagen,
        movil,
        reducir,
        etiquetaCentro: centroRef.current,
        etiquetaHover: hoverRef.current,
        onTap: abrirCuerpo,
        onInteraccion: () => setInteractuo(true),
      });
    } catch {
      setError(true);
      return;
    }
    escena.layoutLateral = () => window.innerWidth >= 820 && window.innerHeight >= 480;
    escenaRef.current = escena;

    // Primer cuadro y luego el vuelo de entrada.
    later(() => {
      setCargando(false);
      escena.entrar();
      later(() => setEntrado(true), reducir ? 200 : 4200);
    }, 450);

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      escena.dispose();
      escenaRef.current = null;
    };
  }, [abrirCuerpo]);

  // Mensaje de bienvenida: se muestra unos segundos la primera vez.
  useEffect(() => {
    if (!intro) return;
    const t = setTimeout(() => cerrarIntro(), 7000);
    return () => clearTimeout(t);
  }, [intro]);

  function cerrarIntro() {
    setIntro(false);
    try {
      localStorage.setItem(CLAVE_INTRO, "1");
    } catch {
      /* sin almacenamiento: se mostrará de nuevo, no es grave */
    }
  }

  const cerrarPanel = useCallback(() => {
    escenaRef.current?.cerrarFoco();
    setAbierto(false);
  }, []);

  // Se conserva el contenido durante la animación de salida y luego se libera.
  useEffect(() => {
    if (abierto) return;
    const t = setTimeout(() => setItem(null), 500);
    return () => clearTimeout(t);
  }, [abierto]);

  function volverVista() {
    setAbierto(false);
    escenaRef.current?.volverVista();
  }

  // ---------- Música (solo con gesto del usuario) ----------
  function alternarMusica() {
    if (!musica.src) return;
    if (!audioRef.current) {
      const a = new Audio(musica.src);
      a.loop = true;
      a.volume = musica.volumen;
      audioRef.current = a;
    }
    const a = audioRef.current;
    if (a.paused) a.play().then(() => setSonando(true)).catch(() => setSonando(false));
    else {
      a.pause();
      setSonando(false);
    }
  }
  useEffect(() => () => audioRef.current?.pause(), []);

  if (error) {
    return (
      <div className="uni3 uni3--error">
        <p>Este dispositivo no puede mostrar el universo en 3D.</p>
        <button type="button" className="uni3-ctl" onClick={onSalir}>
          <ArrowLeft size={16} aria-hidden="true" />
          Volver
        </button>
      </div>
    );
  }

  const mostrarIndicador = entrado && !interactuo && !abierto && !intro;

  return (
    <div className="uni3" data-panel={abierto ? "1" : "0"}>
      <div className="uni3__escena">
        <canvas ref={canvasRef} className="uni3__canvas" aria-label="Universo en 3D. Arrastrá para explorar y tocá un planeta para ver un recuerdo." />
        <div ref={centroRef} className="uni3-etq uni3-etq--centro" aria-hidden="true">
          <span>♥</span> {centro.etiqueta}
        </div>
        <div ref={hoverRef} className="uni3-etq uni3-etq--hover" data-on="0" aria-hidden="true" />
      </div>

      {/* Alternativa por teclado / lector de pantalla */}
      <ul className="uni3-lista" aria-label="Recuerdos">
        <li>
          <button type="button" onClick={() => abrirCuerpo(escenaRef.current?.centro)}>
            {centro.titulo}
          </button>
        </li>
        {planetas.map((p) => (
          <li key={p.id}>
            <button type="button" onClick={() => abrirCuerpo(escenaRef.current?.planetas.find((c) => c.data.id === p.id))}>
              {p.name ?? `Recuerdo ${p.id}`}
            </button>
          </li>
        ))}
      </ul>

      <header className="uni3-top">
        <button type="button" className="uni3-ctl" onClick={onSalir}>
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Salir</span>
        </button>
        <button
          type="button"
          className="uni3-ctl uni3-ctl--icono"
          onClick={alternarMusica}
          disabled={!musica.src}
          aria-pressed={sonando}
          aria-label={sonando ? "Silenciar música" : "Activar música"}
          title={musica.src ? "" : "Agregá musica.mp3 en src/assets/universo"}
        >
          {sonando ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>
      </header>

      <button
        type="button"
        className="uni3-ctl uni3-ctl--vista"
        data-oculto={!entrado || abierto}
        onClick={volverVista}
        aria-label="Volver a la vista general del universo"
      >
        <Orbit size={17} aria-hidden="true" />
        <span>Vista general</span>
      </button>

      <p className="uni3-indicador" data-on={mostrarIndicador ? "1" : "0"}>
        {textos.indicador}
      </p>

      {intro && (
        <div className="uni3-intro" role="status">
          <p>{textos.intro}</p>
          <button type="button" onClick={cerrarIntro}>{textos.introBoton}</button>
        </div>
      )}

      <PanelRecuerdo item={item} abierto={abierto} onCerrar={cerrarPanel} />

      <div className="uni3-carga" data-oculto={!cargando} aria-hidden={!cargando}>
        Preparando el universo…
      </div>
    </div>
  );
}
