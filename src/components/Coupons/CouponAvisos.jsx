import { useState } from "react";
import { Bell, BellRing } from "lucide-react";
import { pushSoportado, usePushAvisos } from "../../hooks/usePushAvisos";

export default function CouponAvisos({ nextUnlockAt, isComplete }) {
  const { permiso, suscripto, activar } = usePushAvisos(isComplete ? null : nextUnlockAt);
  const [fallo, setFallo] = useState(false);

  if (!pushSoportado || isComplete) return null;

  if (permiso === "granted" && suscripto) {
    return (
      <p className="vale-subtitle" style={{ textAlign: "center" }}>
        <BellRing size={14} aria-hidden="true" style={{ verticalAlign: "-2px" }} /> Te avisamos cuando haya una sorpresa nueva.
      </p>
    );
  }
  if (permiso === "denied") {
    return (
      <p className="vale-subtitle" style={{ textAlign: "center" }}>
        Los avisos están bloqueados. Podés habilitarlos desde los ajustes del navegador.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <button
        type="button"
        className="vale-btn vale-btn--ghost vale-btn--sm"
        onClick={async () => setFallo(!(await activar()))}
      >
        <Bell aria-hidden="true" /> Avisarme cuando haya sorpresa
      </button>
      {fallo && <p className="vale-subtitle">No se pudo activar. Probá de nuevo.</p>}
    </div>
  );
}
