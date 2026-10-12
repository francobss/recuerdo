import VolverLink from "../components/VolverLink";
import { misVideos } from "../data/misVideos";

export default function Videos() {
  return (
    <div className="mx-auto max-w-3xl animate-fadeIn">
      <VolverLink />

      <h1 className="text-3xl font-semibold text-ink sm:text-4xl">Videos para vos</h1>
      <p className="mt-3 max-w-md text-sm text-ink/60">
        Cosas que quise contarte mirándote a la cámara.
      </p>

      <div className="mt-10 grid gap-8">
        {misVideos.map((video) => (
          <article
            key={video.src}
            className="overflow-hidden rounded-3xl border border-blush-200/60 bg-white/75 shadow-card backdrop-blur-md"
          >
            <video
              src={video.src}
              controls
              playsInline
              preload="metadata"
              className="mx-auto aspect-[9/16] max-h-[80vh] w-auto bg-ink"
            />
            <div className="p-5 sm:p-6">
              <p className="text-xs font-medium text-blush-400">{video.fecha}</p>
              <h2 className="mt-1 text-lg font-semibold text-ink">{video.titulo}</h2>
              <p className="mt-1 text-sm text-ink/60">{video.descripcion}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
