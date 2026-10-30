import SobreCarta from "./SobreCarta";

export default function CartaCard() {
  return (
    <section
      className="relative col-span-full animate-fadeIn rounded-3xl border border-blush-200/70 bg-white/80 p-6 shadow-card backdrop-blur-md sm:p-8"
      aria-label="Una carta para vos"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute -left-10 -bottom-12 h-40 w-40 rounded-full bg-blush-200/40 blur-3xl" />
      </div>
      <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1.05fr]">
        <div className="text-center lg:text-left">
          <p className="text-sm font-medium text-blush-400">Para leer con calma</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
            Una carta para vos
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/60 lg:mx-0">
            Hay cosas que a veces prefiero escribirte.
          </p>
        </div>

        <div className="flex justify-center py-4">
          <SobreCarta destino="/carta" />
        </div>
      </div>
    </section>
  );
}
