import { Gift, Ticket } from "lucide-react";
import { TOTAL_COUPONS } from "../../data/coupons";
import { capitalize, numberToWords } from "../../data/couponMessages";

export default function CouponHeader({ view, onViewChange, availableCount }) {
  const tabs = [
    { id: "home", label: "Sorpresa", Icon: Gift },
    { id: "collection", label: "Mis cupones", Icon: Ticket },
  ];

  return (
    <header className="vale-header">
      <span className="vale-eyebrow">Para Valentina</span>
      <h1 className="vale-title">La colección de Vale</h1>
      <p className="vale-subtitle">
        {capitalize(numberToWords(TOTAL_COUPONS))} pequeñas sorpresas, una para descubrir cada día.
      </p>

      <nav className="vale-tabs" aria-label="Secciones de la colección">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className="vale-tab"
            aria-current={view === id ? "page" : undefined}
            onClick={() => onViewChange(id)}
          >
            <Icon strokeWidth={1.7} aria-hidden="true" />
            {label}
            {id === "collection" && availableCount > 0 && (
              <span className="vale-tab-badge" aria-label={`${availableCount} disponibles`}>
                {availableCount}
              </span>
            )}
          </button>
        ))}
      </nav>
    </header>
  );
}
