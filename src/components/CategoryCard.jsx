import { ArrowRight } from "lucide-react";

export default function CategoryCard({ categoria, onVerVideos, textoBoton = "Ver videos" }) {
  const Icono = categoria.icono;

  return (
    <div className="group animate-fadeIn rounded-3xl border border-blush-200/60 bg-white/70 p-6 shadow-card backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blush-200/60 text-blush-400 transition-colors group-hover:bg-blush-300/70">
        <Icono className="h-6 w-6" strokeWidth={1.75} />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-ink">{categoria.nombre}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/60">
        {categoria.descripcion}
      </p>

      <button
        onClick={onVerVideos}
        className="group/btn mt-6 flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-blush-400"
      >
        {textoBoton}
        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
      </button>
    </div>
  );
}
