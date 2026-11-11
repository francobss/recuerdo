import { Gem } from "lucide-react";
import { CATEGORIES, RARITIES } from "../../data/coupons";
import { CATEGORY_VISUALS, couponCode } from "./couponVisuals";

export function RarityGems({ rarity }) {
  const level = RARITIES[rarity]?.level ?? 1;
  return (
    <span className="vale-gems" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <Gem key={index} className={index < level ? "is-on" : ""} strokeWidth={1.6} />
      ))}
    </span>
  );
}

/** Ticket físico del cupón: se usa en el descubrimiento y en el detalle. */
export default function CouponTicket({ coupon, redeemed = false }) {
  const visual = CATEGORY_VISUALS[coupon.category];
  const Icon = visual.icon;

  return (
    <div className="vale-ticket-wrap">
      <article
        className="vale-ticket"
        data-rarity={coupon.rarity}
        data-redeemed={redeemed}
        style={{ "--accent": visual.accent }}
        aria-label={`Cupón ${coupon.title}`}
      >
        <div className="vale-ticket-inner">
          <span className="vale-ticket-corner vale-ticket-corner--tl" aria-hidden="true" />
          <span className="vale-ticket-corner vale-ticket-corner--tr" aria-hidden="true" />
          <header className="vale-ticket-head">
            <span className="vale-stamp" aria-hidden="true">
              <Icon strokeWidth={1.6} />
            </span>
            <span className="vale-ticket-category">{CATEGORIES[coupon.category].label}</span>
          </header>

          <div className="vale-ticket-body">
            <h3 className="vale-ticket-title">{coupon.title}</h3>
            <div className="vale-ticket-rule" aria-hidden="true">
              <span />
              <Icon strokeWidth={1.6} />
              <span />
            </div>
            <p className="vale-ticket-text">{coupon.description}</p>
          </div>

          <footer className="vale-ticket-stub">
            <div className="vale-ticket-rarity">
              <RarityGems rarity={coupon.rarity} />
              <span>{RARITIES[coupon.rarity].label}</span>
            </div>
            <span className="vale-ticket-code">N.º {couponCode(coupon)}</span>
          </footer>
        </div>
        {redeemed && (
          <span className="vale-ticket-seal" aria-label="Canjeado">
            Canjeado
          </span>
        )}
      </article>
    </div>
  );
}
