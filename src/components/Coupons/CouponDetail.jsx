import { CalendarCheck, Sparkles } from "lucide-react";
import CouponModalShell from "./CouponModalShell";
import CouponTicket from "./CouponTicket";
import { formatDateTime } from "./couponVisuals";

export default function CouponDetail({ coupon, onClose, onRedeem }) {
  const redeemed = coupon.status === "redeemed";

  return (
    <CouponModalShell label={`Cupón ${coupon.title}`} onClose={onClose}>
      <div className="vale-detail">
        <CouponTicket coupon={coupon} redeemed={redeemed} />

        <ul className="vale-detail-dates">
          <li>
            <Sparkles strokeWidth={1.6} aria-hidden="true" />
            Descubierto el {formatDateTime(coupon.unlockedAt)}
          </li>
          {redeemed && (
            <li>
              <CalendarCheck strokeWidth={1.6} aria-hidden="true" />
              Canjeado el {formatDateTime(coupon.redeemedAt)}
            </li>
          )}
        </ul>

        {redeemed ? (
          <p className="vale-detail-note">Este cupón ya fue canjeado y queda guardado en tu colección.</p>
        ) : (
          <button type="button" className="vale-btn vale-btn--primary" onClick={() => onRedeem(coupon.id)}>
            Canjear
          </button>
        )}
      </div>
    </CouponModalShell>
  );
}
