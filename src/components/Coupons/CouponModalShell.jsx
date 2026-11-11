import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/**
 * Contenedor accesible para los diálogos del módulo: cierra con Escape o al
 * tocar el fondo, bloquea el scroll y devuelve el foco al cerrarse.
 * Se renderiza en document.body, así que reaplica la clase `vale`.
 */
export default function CouponModalShell({
  label,
  onClose,
  children,
  layer = 1,
  tone = "light",
  showClose = true,
  closeOnBackdrop = true,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    function onKey(event) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [onClose]);

  return createPortal(
    <div
      className="vale vale-overlay"
      data-tone={tone}
      style={{ zIndex: 60 + layer }}
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="vale-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
      >
        {showClose && (
          <button type="button" className="vale-dialog-close" onClick={onClose} aria-label="Cerrar">
            <X strokeWidth={1.8} />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}
