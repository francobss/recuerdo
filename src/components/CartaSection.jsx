export default function CartaSection({ titulo, subtitulo, parrafos, bloques, cita, imagenFinal }) {
  return (
    <article className="animate-fadeIn rounded-3xl border border-blush-200/60 bg-white/70 p-8 shadow-card backdrop-blur-md sm:p-10">
      <h2 className="text-2xl font-semibold text-ink sm:text-3xl">{titulo}</h2>
      {subtitulo && (
        <h3 className="mt-3 text-base font-medium text-blush-400">{subtitulo}</h3>
      )}

      <div className="mt-6 space-y-5 text-sm leading-relaxed text-ink/70">
        {parrafos?.map((parrafo, i) => (
          <p key={i}>{parrafo}</p>
        ))}

        {bloques?.map((bloque, i) => {
          if (bloque.tipo === "imagen" || bloque.tipo === "video") {
            return (
              <img
                key={i}
                src={bloque.src}
                alt=""
                className="mx-auto max-h-96 rounded-2xl object-contain shadow-card"
              />
            );
          }
          return <p key={i}>{bloque.contenido}</p>;
        })}
      </div>

      {cita && (
        <p className="mt-8 border-t border-blush-200/60 pt-6 text-center text-sm italic text-ink/50">
          {cita}
        </p>
      )}

      {imagenFinal && (
        <div className="mt-8 text-center">
          <p className="text-sm text-ink/60">{imagenFinal.leyenda}</p>
          <img
            src={imagenFinal.src}
            alt=""
            className="mx-auto mt-4 max-h-72 rounded-2xl object-contain shadow-card"
          />
        </div>
      )}
    </article>
  );
}
