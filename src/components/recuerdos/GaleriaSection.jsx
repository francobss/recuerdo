export default function GaleriaSection({ titulo, descripcion, items, videoFinal }) {
  return (
    <article className="animate-fadeIn">
      <h2 className="text-2xl font-semibold text-ink sm:text-3xl">{titulo}</h2>
      <p className="mt-3 text-sm leading-relaxed text-ink/60">{descripcion}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <figure
            key={i}
            className="overflow-hidden rounded-3xl border border-blush-200/60 bg-white shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-soft"
          >
            <img src={item.src} alt="" className="h-56 w-full object-cover" />
            {item.fecha && (
              <figcaption className="px-4 py-3 text-xs text-ink/40">{item.fecha}</figcaption>
            )}
          </figure>
        ))}
      </div>

      {videoFinal && (
        <img
          src={videoFinal}
          alt=""
          className="mx-auto mt-8 max-h-96 rounded-3xl object-contain shadow-card"
        />
      )}
    </article>
  );
}
