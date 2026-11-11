import { Crown, Ticket } from "lucide-react";
import { TOTAL_COUPONS } from "../../data/coupons";
import { numberToWords } from "../../data/couponMessages";

export default function CouponComplete({ onViewCollection }) {
  const words = numberToWords(TOTAL_COUPONS);

  return (
    <section className="vale-complete" aria-label="Colección completa">
      <span className="vale-complete-crown" aria-hidden="true">
        <Crown strokeWidth={1.4} />
      </span>
      <h2>¡Colección completa!</h2>
      <p>
        {words.charAt(0).toUpperCase() + words.slice(1)} sorpresas, {words} excusas para seguir
        creando momentos lindos.
      </p>
      <button type="button" className="vale-btn vale-btn--primary" onClick={onViewCollection}>
        <Ticket strokeWidth={1.7} aria-hidden="true" /> Ver mis cupones
      </button>
    </section>
  );
}
