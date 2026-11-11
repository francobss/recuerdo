import { Heart } from "lucide-react";

const SPARKLES = [
  { left: "6%", top: "12%", size: 14, delay: "0s" },
  { left: "90%", top: "20%", size: 10, delay: "1.2s" },
  { left: "16%", top: "82%", size: 9, delay: "2.1s" },
  { left: "84%", top: "78%", size: 15, delay: "0.6s" },
  { left: "50%", top: "-4%", size: 8, delay: "1.7s" },
];

/**
 * Sobre central. `opening` dispara la animación; el botón queda deshabilitado
 * mientras se abre o cuando todavía no corresponde un nuevo descubrimiento.
 */
export default function CouponEnvelope({ canDiscover, opening, onDiscover, message }) {
  const disabled = !canDiscover || opening;

  return (
    <section className="vale-stage" aria-label="Tu sorpresa">
      <div className="vale-env-area" data-opening={opening}>
        {SPARKLES.map((sparkle, index) => (
          <span
            key={index}
            className="vale-sparkle"
            aria-hidden="true"
            style={{
              left: sparkle.left,
              top: sparkle.top,
              width: sparkle.size,
              height: sparkle.size,
              animationDelay: sparkle.delay,
            }}
          />
        ))}

        <div className="vale-env-float">
          <div className="vale-env" aria-hidden="true">
            <div className="vale-env-back" />
            <div className="vale-env-letter">
              <span />
              <span />
              <span />
            </div>
            <div className="vale-env-front" />
            <div className="vale-env-flap" />
            <div className="vale-env-seal">
              <Heart strokeWidth={1.8} fill="currentColor" />
            </div>
          </div>
        </div>
        <div className="vale-env-shadow" aria-hidden="true" />
      </div>

      <p className="vale-message">{message}</p>

      <button
        type="button"
        className="vale-btn vale-btn--primary vale-btn--lg"
        onClick={onDiscover}
        disabled={disabled}
      >
        {opening ? "Abriendo…" : "Descubrir mi sorpresa"}
      </button>
    </section>
  );
}
