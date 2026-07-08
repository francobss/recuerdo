import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { recuerdos } from "../data/recuerdos";
import CartaSection from "../components/recuerdos/CartaSection";
import GaleriaSection from "../components/recuerdos/GaleriaSection";

export default function Recuerdos() {
  const [paso, setPaso] = useState(0);
  const vista = recuerdos[paso];
  const esPrimero = paso === 0;
  const esUltimo = paso === recuerdos.length - 1;

  return (
    <div className="mx-auto max-w-2xl animate-fadeIn">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink/60 transition-colors hover:text-blush-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al inicio
      </Link>

      {vista.tipo === "carta" ? <CartaSection {...vista} /> : <GaleriaSection {...vista} />}

      <div className="mt-10 flex items-center justify-between gap-4">
        <button
          onClick={() => setPaso((p) => Math.max(0, p - 1))}
          disabled={esPrimero}
          className="flex items-center gap-1.5 rounded-full border border-blush-200 px-4 py-2 text-sm font-medium text-ink/70 transition-all hover:border-blush-400 hover:text-ink disabled:pointer-events-none disabled:opacity-0"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </button>

        <div className="flex gap-2">
          {recuerdos.map((_, i) => (
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
            onClick={() => setPaso((p) => Math.min(recuerdos.length - 1, p + 1))}
            className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition-all hover:scale-[1.03] hover:bg-blush-400 active:scale-95"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
