import { Heart, MapPin, PlaneLanding } from "lucide-react";
import Countdown from "../components/Countdown";
import VolverLink from "../components/VolverLink";

export default function Regreso() {
  return (
    <div className="mx-auto max-w-3xl animate-fadeIn">
      <VolverLink />

      <section className="relative overflow-hidden rounded-3xl border border-blush-200/70 bg-white/75 px-6 py-10 text-center shadow-card backdrop-blur-md sm:px-12 sm:py-14">
        <div className="absolute left-1/2 top-0 h-36 w-72 -translate-x-1/2 rounded-full bg-blush-200/50 blur-3xl" />
        <div className="relative">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blush-200/70 text-blush-400">
            <PlaneLanding className="h-6 w-6" strokeWidth={1.6} />
          </div>
          <p className="mt-5 text-sm font-medium text-blush-400">España <span className="mx-2 text-ink/30">→</span> Argentina</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Espero ansioso tu regreso.</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink/65 sm:text-lg">
            Te extraño. Falta menos para que el aeropuerto deje de ser distancia y vuelva a ser el comienzo de un abrazo.
          </p>

          <div className="mx-auto mt-10 max-w-xl border-y border-blush-200/70 py-7">
            <Countdown />
          </div>

          <p className="mx-auto mt-9 max-w-lg font-display text-xl leading-relaxed text-ink/80 sm:text-2xl">
            "Que el tiempo corra ligero; yo voy a estar acá, guardándote un lugar en cada día hasta que vuelvas."
          </p>
          <div className="mt-7 flex items-center justify-center gap-2 text-sm text-ink/50">
            <MapPin className="h-4 w-4 text-blush-400" />
            27 de diciembre, 08:40
            <Heart className="h-4 w-4 fill-blush-400 text-blush-400" />
          </div>
        </div>
      </section>
    </div>
  );
}