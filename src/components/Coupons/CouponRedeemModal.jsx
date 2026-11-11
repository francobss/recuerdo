import { useState } from "react";
import { Check } from "lucide-react";
import CouponModalShell from "./CouponModalShell";

export default function CouponRedeemModal({ coupon, onConfirm, onClose }) {
  const [done, setDone] = useState(false);

  function handleConfirm() {
    if (onConfirm(coupon.id)) setDone(true);
    else onClose();
  }

  return (
    <CouponModalShell label="Canjear cupón" onClose={onClose} layer={2} showClose={false}>
      <div className="vale-confirm">
        {done ? (
          <>
            <span className="vale-check" aria-hidden="true">
              <Check strokeWidth={2.2} />
            </span>
            <h2>¡Cupón canjeado!</h2>
            <p>Ahora solo queda disfrutarlo.</p>
            <button type="button" className="vale-btn vale-btn--primary" onClick={onClose} autoFocus>
              Listo
            </button>
          </>
        ) : (
          <>
            <h2>¿Estás segura de que querés canjear este cupón?</h2>
            <p className="vale-confirm-title">{coupon.title}</p>
            <p className="vale-confirm-hint">Una vez canjeado no vuelve a estar disponible.</p>
            <div className="vale-actions">
              <button type="button" className="vale-btn vale-btn--primary" onClick={handleConfirm}>
                Sí, canjear
              </button>
              <button type="button" className="vale-btn vale-btn--ghost" onClick={onClose} autoFocus>
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </CouponModalShell>
  );
}
