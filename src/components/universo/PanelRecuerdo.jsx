import { useEffect, useRef } from "react";
import { Heart, X } from "lucide-react";

/**
 * Panel de un recuerdo: tarjeta lateral en pantallas anchas y bottom sheet en
 * celulares (se cierra también deslizándolo hacia abajo).
 */
export default function PanelRecuerdo({ item, abierto, onCerrar }) {
  const hojaRef = useRef(null);
  const cerrarRef = useRef(null);
  const arrastre = useRef(null);

  useEffect(() => {
    if (!abierto) return;
    const previo = document.activeElement;
    const t = setTimeout(() => cerrarRef.current?.focus({ preventScroll: true }), 350);
    const onKey = (e) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      previo?.focus?.({ preventScroll: true });
    };
  }, [abierto, onCerrar]);

  if (!item) return null;

  // Deslizar el asa hacia abajo para cerrar (solo se ve en celulares).
  const onDown = (e) => {
    arrastre.current = { y: e.clientY, dy: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    hojaRef.current.style.transition = "none";
  };
  const onMove = (e) => {
    if (!arrastre.current) return;
    arrastre.current.dy = Math.max(0, e.clientY - arrastre.current.y);
    hojaRef.current.style.transform = `translateY(${arrastre.current.dy}px)`;
  };
  const onUp = () => {
    if (!arrastre.current) return;
    const { dy } = arrastre.current;
    arrastre.current = null;
    hojaRef.current.style.transition = "";
    hojaRef.current.style.transform = "";
    if (dy > 80) onCerrar();
  };

  return (
    <aside
      ref={hojaRef}
      className="uni3-panel"
      data-abierto={abierto}
      role="dialog"
      aria-label={item.name ?? "Recuerdo"}
    >
      <div
        className="uni3-panel__asa"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        aria-hidden="true"
      >
        <span />
      </div>

      <button ref={cerrarRef} type="button" className="uni3-panel__x" onClick={onCerrar} aria-label="Cerrar recuerdo">
        <X size={18} />
      </button>

      <div className="uni3-panel__cuerpo">
        {item.image ? (
          <figure className="uni3-panel__foto">
            <img src={item.image} alt="" aria-hidden="true" className="uni3-panel__foto-fondo" />
            <img src={item.image} alt={item.name ?? "Foto del recuerdo"} className="uni3-panel__foto-img" />
          </figure>
        ) : (
          <div className="uni3-panel__sello" aria-hidden="true">
            <Heart size={26} fill="currentColor" />
          </div>
        )}

        {item.date && <time className="uni3-panel__fecha">{item.date}</time>}
        {item.name && <h2 className="uni3-panel__titulo">{item.name}</h2>}
        <p className="uni3-panel__mensaje">{item.message}</p>
      </div>
    </aside>
  );
}
