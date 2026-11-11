import { CheckCheck, Gift, Hourglass } from "lucide-react";
import CouponCountdown from "./CouponCountdown";

export default function CouponProgress({ stats, nextUnlockAt, waiting }) {
  const percent = stats.total === 0 ? 0 : Math.round((stats.unlocked / stats.total) * 100);

  return (
    <section className="vale-progress" aria-label="Progreso de la colección">
      <div className="vale-progress-top">
        <span className="vale-progress-label">Tu colección</span>
        <span className="vale-progress-count">
          {stats.unlocked} <small>/ {stats.total}</small>
        </span>
      </div>
      <div
        className="vale-bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={stats.total}
        aria-valuenow={stats.unlocked}
        aria-label="Cupones descubiertos"
      >
        <span style={{ width: `${percent}%` }} />
      </div>

      <div className="vale-stats">
        <div className="vale-stat">
          <Gift strokeWidth={1.6} aria-hidden="true" />
          <strong>{stats.available}</strong>
          <span>{stats.available === 1 ? "disponible" : "disponibles"}</span>
        </div>
        <div className="vale-stat">
          <CheckCheck strokeWidth={1.6} aria-hidden="true" />
          <strong>{stats.redeemed}</strong>
          <span>{stats.redeemed === 1 ? "canjeado" : "canjeados"}</span>
        </div>
      </div>

      {waiting && nextUnlockAt && (
        <div className="vale-next">
          <p>
            <Hourglass strokeWidth={1.6} aria-hidden="true" /> Próximo descubrimiento en
          </p>
          <CouponCountdown targetAt={nextUnlockAt} />
        </div>
      )}
    </section>
  );
}
