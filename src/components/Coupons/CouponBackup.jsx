import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import CouponModalShell from "./CouponModalShell";

const MAX_FILE_BYTES = 1024 * 1024;

export default function CouponBackup({ stats, onExport, onPreviewImport, onApplyImport }) {
  const fileRef = useRef(null);
  const [pending, setPending] = useState(null); // { state, stats }
  const [feedback, setFeedback] = useState(null); // { kind: "ok" | "error", text }

  function handleExport() {
    const blob = new Blob([onExport()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `coleccion-de-vale-${stamp}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setFeedback({ kind: "ok", text: "Copia descargada. Guardala en un lugar seguro." });
  }

  async function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setFeedback({ kind: "error", text: "El archivo es demasiado grande para ser una copia." });
      return;
    }
    let text;
    try {
      text = await file.text();
    } catch {
      setFeedback({ kind: "error", text: "No se pudo leer el archivo." });
      return;
    }
    const result = onPreviewImport(text);
    if (!result.ok) {
      setFeedback({ kind: "error", text: result.error });
      return;
    }
    setFeedback(null);
    setPending(result);
  }

  function confirmImport() {
    const persisted = onApplyImport(pending.state);
    setPending(null);
    setFeedback(
      persisted
        ? { kind: "ok", text: "Progreso restaurado." }
        : { kind: "error", text: "Se restauró, pero el navegador no permitió guardarlo en este dispositivo." }
    );
  }

  return (
    <details className="vale-backup">
      <summary>Copia de seguridad</summary>
      <div className="vale-backup-body">
        <p>
          Tu progreso se guarda solo en este navegador y en este dispositivo. Si borrás los datos del
          navegador, puede perderse. Descargá una copia de vez en cuando para poder restaurarlo.
        </p>
        <p>
          La espera de 24 horas se calcula con la hora de este dispositivo, así que es parte del juego
          y de la confianza, no una cerradura.
        </p>
        <div className="vale-actions vale-actions--start">
          <button type="button" className="vale-btn vale-btn--ghost vale-btn--sm" onClick={handleExport}>
            <Download strokeWidth={1.7} aria-hidden="true" /> Exportar progreso
          </button>
          <button
            type="button"
            className="vale-btn vale-btn--ghost vale-btn--sm"
            onClick={() => fileRef.current?.click()}
          >
            <Upload strokeWidth={1.7} aria-hidden="true" /> Importar progreso
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="vale-hidden-input"
            onChange={handleFile}
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>
        {feedback && (
          <p className="vale-feedback" data-kind={feedback.kind} role="status">
            {feedback.text}
          </p>
        )}
      </div>

      {pending && (
        <CouponModalShell label="Restaurar progreso" onClose={() => setPending(null)} layer={3} showClose={false}>
          <div className="vale-confirm">
            <h2>¿Restaurar esta copia?</h2>
            <p className="vale-confirm-title">
              {pending.stats.unlocked} de {pending.stats.total} descubiertos, {pending.stats.redeemed} canjeados
            </p>
            <p className="vale-confirm-hint">
              Reemplaza tu progreso actual ({stats.unlocked} descubiertos, {stats.redeemed} canjeados).
            </p>
            <div className="vale-actions">
              <button type="button" className="vale-btn vale-btn--primary" onClick={confirmImport}>
                Restaurar
              </button>
              <button type="button" className="vale-btn vale-btn--ghost" onClick={() => setPending(null)} autoFocus>
                Cancelar
              </button>
            </div>
          </div>
        </CouponModalShell>
      )}
    </details>
  );
}
