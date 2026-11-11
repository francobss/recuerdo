import { useMemo } from "react";
import { Ticket } from "lucide-react";
import CouponModalShell from "./CouponModalShell";
import CouponTicket from "./CouponTicket";

const PETAL_COUNT = 22;

// Caída delicada de pétalos y destellos: posiciones fijas (sin azar en render).
function Celebration() {
  const petals = useMemo(
    () =>
      Array.from({ length: PETAL_COUNT }, (_, index) => ({
        left: `${(index * 37 + 7) % 100}%`,
        delay: `${((index * 13) % 18) / 10}s`,
        duration: `${5 + ((index * 7) % 30) / 10}s`,
        size: 8 + ((index * 5) % 9),
        tone: index % 3,
      })),
    []
  );

  return (
    <div className="vale-celebration" aria-hidden="true">
      {petals.map((petal, index) => (
        <span
          key={index}
          className="vale-petal"
          data-tone={petal.tone}
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
          }}
        />
      ))}
    </div>
  );
}

export default function CouponReveal({ coupon, onClose, onViewCollection, isLast }) {
  return (
    <CouponModalShell label="Descubriste un cupón" onClose={onClose} tone="dark" showClose={false}>
      <Celebration />
      <div className="vale-reveal">
        <p className="vale-reveal-kicker">{isLast ? "Y el último de la colección" : "Descubriste"}</p>
        <div className="vale-reveal-ticket">
          <CouponTicket coupon={coupon} />
        </div>
        <p className="vale-reveal-note">Ya está guardado en tu colección.</p>
        <div className="vale-actions">
          <button type="button" className="vale-btn vale-btn--primary" onClick={onViewCollection}>
            <Ticket strokeWidth={1.7} aria-hidden="true" /> Ver mis cupones
          </button>
          <button type="button" className="vale-btn vale-btn--ghost-light" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </CouponModalShell>
  );
}
