import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./sobre.css";

const CORAZON =
  "M12 21s-7.5-4.6-9.6-9.3C.9 8.4 2.7 5 6 5c2 0 3.4 1 4.4 2.5l1.6 2 1.6-2C14.6 6 16 5 18 5c3.3 0 5.1 3.4 3.6 6.7C19.5 16.4 12 21 12 21z";

// Duraciones de cada fase (ms), coordinadas con sobre.css
const T_SOLAPA = 950;
const T_HOJA = 1500;
const T_SALIDA = 1100;

const prefiereMenosMovimiento = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function SobreCarta({ destino = "/carta" }) {
  const navigate = useNavigate();
  const [fase, setFase] = useState("reposo");
  const [velo, setVelo] = useState(false);
  const timers = useRef([]);
  const ref = useRef(null);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const despues = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  function abrir() {
    if (fase !== "reposo") return;

    if (prefiereMenosMovimiento()) {
      setVelo(true);
      despues(() => navigate(destino), 400);
      return;
    }

    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setFase("abriendo");
    despues(() => setFase("subiendo"), T_SOLAPA - 250);
    despues(() => setFase("saliendo"), T_SOLAPA - 250 + T_HOJA);
    despues(() => setVelo(true), T_SOLAPA - 250 + T_HOJA + 350);
    despues(() => navigate(destino), T_SOLAPA - 250 + T_HOJA + T_SALIDA + 600);
  }

  return (
    <>
      <div ref={ref} className="group relative flex flex-col items-center">
        <button
          type="button"
          className="sobre"
          data-fase={fase}
          onClick={abrir}
          disabled={fase !== "reposo"}
          aria-label="Abrir la carta"
        >
          <div className="sobre__inner">
            {/* Interior del sobre */}
            <svg className="sobre__fondo" viewBox="0 0 300 200" aria-hidden="true">
              <defs>
                <linearGradient id="sobre-papel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f6e3e6" />
                  <stop offset="1" stopColor="#efd3d9" />
                </linearGradient>
                <filter id="sobre-grano" x="0" y="0" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
                  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.3  0 0 0 0 0.35  0 0 0 0.07 0" />
                </filter>
              </defs>
              <rect width="300" height="200" rx="6" fill="url(#sobre-papel)" />
            </svg>

            {/* Hoja */}
            <div className="sobre__hoja" aria-hidden="true" />

            {/* Frente del sobre (bolsillo) */}
            <svg className="sobre__frente" viewBox="0 0 300 200" aria-hidden="true">
              <path d="M0 6 Q0 0 6 0 L150 112 L0 200 Z" fill="#f9ebee" />
              <path d="M300 6 Q300 0 294 0 L150 112 L300 200 Z" fill="#f8e7ea" />
              <path d="M0 200 L150 100 L300 200 Z" fill="#fbf0f1" />
              <path d="M0 200 L150 100 L300 200" fill="none" stroke="#f1d3da" strokeWidth="1" />
              <path d="M0 0 L150 112 M300 0 L150 112" fill="none" stroke="#f1d3da" strokeWidth="0.8" />
              <rect width="300" height="200" rx="6" fill="#fff" filter="url(#sobre-grano)" opacity="0.9" />
              <rect x="0.5" y="0.5" width="299" height="199" rx="6" fill="none" stroke="#f3d6de" />
            </svg>

            <span className="sobre__para">Para vos</span>

            {/* Solapa con dos caras para el giro 3D */}
            <div className="sobre__solapa" aria-hidden="true">
              <div className="sobre__cara">
                <svg viewBox="0 0 300 115" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sobre-solapa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#fbeff1" />
                      <stop offset="1" stopColor="#f6dfe4" />
                    </linearGradient>
                  </defs>
                  <path d="M0 6 Q0 0 6 0 L294 0 Q300 0 300 6 L150 115 Z" fill="url(#sobre-solapa)" stroke="#efccd5" strokeWidth="1" strokeLinejoin="round" />
                </svg>
                <span className="sobre__sello">
                  <svg className="sobre__corazon" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="11.5" fill="#f4afc8" opacity="0.35" />
                    <path d={CORAZON} transform="translate(3.6 3.6) scale(0.7)" fill="#ec8fb4" />
                  </svg>
                </span>
              </div>
              <div className="sobre__cara sobre__cara--atras">
                <svg viewBox="0 0 300 115" preserveAspectRatio="none">
                  <path d="M0 6 Q0 0 6 0 L294 0 Q300 0 300 6 L150 115 Z" fill="#efd3d9" stroke="#e9c3cd" strokeWidth="1" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </button>

        <span
          aria-hidden="true"
          className={`mt-6 text-xs font-medium tracking-wide text-blush-400 transition-opacity duration-500 [@media(hover:none)]:opacity-80 ${
            fase === "reposo" ? "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100" : "opacity-0"
          }`}
        >
          Abrir carta
        </span>
      </div>

      <div className="sobre-velo" data-visible={velo} aria-hidden="true" />
    </>
  );
}
