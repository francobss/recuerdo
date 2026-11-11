import { useMemo, useState } from "react";
import { CATEGORIES } from "../../data/coupons";
import CouponCard from "./CouponCard";

const STATUS_FILTERS = [
  { id: "all", label: "Todos" },
  { id: "available", label: "Disponibles" },
  { id: "redeemed", label: "Canjeados" },
];

export default function CouponCollection({ coupons, stats, onOpen, onRedeem }) {
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");

  const visible = useMemo(
    () =>
      coupons.filter((item) => {
        if (category !== "all") {
          // Los no descubiertos no revelan su categoría: se ocultan al filtrar por ella.
          if (item.status === "locked" || item.category !== category) return false;
        }
        if (status === "all") return true;
        return item.status === status;
      }),
    [coupons, status, category]
  );

  return (
    <section className="vale-collection" aria-label="Mis cupones">
      <div className="vale-collection-head">
        <h2>Mis cupones</h2>
        <p>
          {stats.unlocked} de {stats.total} descubiertos
          <span aria-hidden="true"> · </span>
          {stats.redeemed} {stats.redeemed === 1 ? "canjeado" : "canjeados"}
        </p>
      </div>

      <div className="vale-filters" role="group" aria-label="Filtrar por estado">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className="vale-chip"
            aria-pressed={status === filter.id}
            onClick={() => setStatus(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className="vale-filters" role="group" aria-label="Filtrar por categoría">
        <button
          type="button"
          className="vale-chip vale-chip--soft"
          aria-pressed={category === "all"}
          onClick={() => setCategory("all")}
        >
          Todas las categorías
        </button>
        {Object.entries(CATEGORIES).map(([id, info]) => (
          <button
            key={id}
            type="button"
            className="vale-chip vale-chip--soft"
            aria-pressed={category === id}
            onClick={() => setCategory(id)}
          >
            {info.label}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <ul className="vale-grid">
          {visible.map((item) => (
            <CouponCard key={item.id} coupon={item} onOpen={onOpen} onRedeem={onRedeem} />
          ))}
        </ul>
      ) : (
        <p className="vale-empty">
          {stats.unlocked === 0
            ? "Todavía no descubriste ningún cupón. La primera sorpresa te espera."
            : "No hay cupones que coincidan con este filtro."}
        </p>
      )}
    </section>
  );
}
