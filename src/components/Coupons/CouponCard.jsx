import { Check, Lock } from "lucide-react";
import { CATEGORIES, RARITIES } from "../../data/coupons";
import { CATEGORY_VISUALS } from "./couponVisuals";
import { RarityGems } from "./CouponTicket";

export default function CouponCard({ coupon, onOpen, onRedeem }) {
  if (coupon.status === "locked") {
    return (
      <li className="vale-card vale-card--locked">
        <div className="vale-card-main" aria-label={`Cupón ${coupon.number} sin descubrir`}>
          <Lock strokeWidth={1.5} aria-hidden="true" />
          <span className="vale-card-number">N.º {String(coupon.number).padStart(3, "0")}</span>
          <span className="vale-card-hidden">Sin descubrir</span>
        </div>
      </li>
    );
  }

  const visual = CATEGORY_VISUALS[coupon.category];
  const Icon = visual.icon;
  const redeemed = coupon.status === "redeemed";

  return (
    <li className="vale-card" data-status={coupon.status} style={{ "--accent": visual.accent }}>
      <button type="button" className="vale-card-main" onClick={() => onOpen(coupon.id)}>
        <span className="vale-card-icon" aria-hidden="true">
          <Icon strokeWidth={1.6} />
        </span>
        <span className="vale-card-category">{CATEGORIES[coupon.category].label}</span>
        <span className="vale-card-title">{coupon.title}</span>
        <span className="vale-card-rarity">
          <RarityGems rarity={coupon.rarity} />
          {RARITIES[coupon.rarity].label}
        </span>
        <span className="vale-badge" data-status={coupon.status}>
          {redeemed && <Check strokeWidth={2} aria-hidden="true" />}
          {redeemed ? "Canjeado" : "Disponible"}
        </span>
      </button>
      {!redeemed && (
        <button type="button" className="vale-card-redeem" onClick={() => onRedeem(coupon.id)}>
          Canjear
        </button>
      )}
    </li>
  );
}
