import { carta } from "../data/carta";
import VolverLink from "../components/VolverLink";
import "../components/hoja-carta.css";
import abrazo from "../assets/abrazo.mp4";

function Pendiente({ children }) {
  return (
    <p className="rounded-2xl border border-dashed border-blush-200 px-5 py-6 text-center text-sm text-ink/40">
      {children}
    </p>
  );
}

export default function CartaParaVos() {
  const { poema, mensaje, firma } = carta;

  return (
    <div className="mx-auto max-w-2xl animate-fadeIn">
      <VolverLink />

      <article className="hoja-carta relative rounded-[4px] px-7 py-12 sm:px-16 sm:py-16">
        <h1 className="text-center text-3xl font-semibold text-ink sm:text-4xl">
          Una carta para vos
        </h1>

        {/* Ilustración de la pareja bailando */}
        <div className="mt-8" data-slot="ilustracion-pareja">
          <video
            src={abrazo}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label="Una pareja bailando abrazada"
            className="mx-auto h-auto w-64 select-none mix-blend-multiply sm:w-72"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent), linear-gradient(to bottom, transparent, #000 5%, #000 95%, transparent)",
              WebkitMaskComposite: "source-in",
              maskImage:
                "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent), linear-gradient(to bottom, transparent, #000 5%, #000 95%, transparent)",
              maskComposite: "intersect",
            }}
          />
        </div>

        {/* Poema */}
        <section className="mt-10" data-slot="poema">
          {poema.versos.length > 0 ? (
            <div className="text-center font-display text-lg leading-relaxed text-ink/80 sm:text-xl">
              {poema.titulo && <h2 className="mb-4 text-xl font-semibold">{poema.titulo}</h2>}
              {poema.versos.map((verso, i) => (
                <p key={i}>{verso}</p>
              ))}
            </div>
          ) : (
            <Pendiente>Acá va el poema.</Pendiente>
          )}
        </section>

        {/* Mensaje */}
        <section className="mt-10 border-t border-blush-200/60 pt-8" data-slot="mensaje">
          {mensaje.length > 0 ? (
            <div className="space-y-5 text-sm leading-relaxed text-ink/70 sm:text-base">
              {mensaje.map((parrafo, i) => (
                <p key={i}>{parrafo}</p>
              ))}
            </div>
          ) : (
            <Pendiente>Acá va tu carta.</Pendiente>
          )}
        </section>

        {/* Firma */}
        <div className="mt-10 text-right" data-slot="firma">
          {firma ? (
            <p className="font-display text-xl italic text-ink/80">{firma}</p>
          ) : (
            <p className="text-sm text-ink/30">— firma</p>
          )}
        </div>
      </article>
    </div>
  );
}
