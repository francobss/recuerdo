import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Plane } from "lucide-react";
import Countdown from "./Countdown";

export default function RegresoCard() {
  return (
    <Link
      to="/regreso"
      className="group relative col-span-full overflow-hidden rounded-3xl border border-blush-300/70 bg-white/80 p-6 shadow-card backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-soft sm:p-8"
      aria-label="Ver la cuenta regresiva para el regreso de Valentina"
    >
      <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-blush-200/40 blur-3xl" />
      <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <p className="text-sm font-medium text-blush-400">Cada minuto nos acerca</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
            Tu regreso ya tiene fecha.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/60">
            Desde España hasta Argentina. El 27 de diciembre, a las 08:40, la distancia se termina.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors group-hover:text-blush-400">
            Ver cuánto falta
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>

        <div className="relative rounded-2xl border border-blush-200/70 bg-blush-50/70 p-5 sm:p-6">
          <div className="mb-6 flex items-center justify-between text-xs font-medium text-ink/60">
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-blush-400" />España</span>
            <span className="flex items-center gap-1.5">Argentina<MapPin className="h-3.5 w-3.5 text-blush-400" /></span>
          </div>
          <div className="relative mb-7 h-7">
            <div className="absolute left-1 right-1 top-3 border-t-2 border-dashed border-blush-300" />
            <Plane className="absolute left-0 top-0 h-6 w-6 rotate-90 text-blush-400 animate-planeFlight" strokeWidth={1.8} />
          </div>
          <Countdown compacto />
        </div>
      </div>
    </Link>
  );
}