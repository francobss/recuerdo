import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PasoNavegador({ total, paso, onAnterior, onSiguiente }) {
  const esPrimero = paso === 0;
  const esUltimo = paso === total - 1;

  return (
    <div className="mt-10 flex items-center justify-between gap-4">
      <button
        onClick={onAnterior}
        disabled={esPrimero}
        className="flex items-center gap-1.5 rounded-full border border-blush-200 px-4 py-2 text-sm font-medium text-ink/70 transition-all hover:border-blush-400 hover:text-ink disabled:pointer-events-none disabled:opacity-0"
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </button>

      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              i === paso ? "bg-blush-400" : "bg-blush-200"
            }`}
          />
        ))}
      </div>

      {esUltimo ? (
        <Link
          to="/"
          className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition-all hover:scale-[1.03] hover:bg-blush-400 active:scale-95"
        >
          Volver al inicio
        </Link>
      ) : (
        <button
          onClick={onSiguiente}
          className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition-all hover:scale-[1.03] hover:bg-blush-400 active:scale-95"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
