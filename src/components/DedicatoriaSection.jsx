export default function DedicatoriaSection({ imagen, parrafos, imagenFinal }) {
  return (
    <article className="animate-fadeIn rounded-3xl border border-blush-200/60 bg-white/70 p-6 shadow-card backdrop-blur-md sm:p-8">
      <img
        src={imagen}
        alt=""
        className="mx-auto max-h-[28rem] w-auto rounded-2xl object-contain shadow-card"
      />

      <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink/70">
        {parrafos.map((parrafo, i) => (
          <p key={i}>{parrafo}</p>
        ))}
      </div>

      {imagenFinal && (
        <img
          src={imagenFinal}
          alt=""
          className="mx-auto mt-6 max-h-[28rem] w-auto rounded-2xl object-contain shadow-card"
        />
      )}
    </article>
  );
}
