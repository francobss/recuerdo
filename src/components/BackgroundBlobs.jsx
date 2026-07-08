// Fondo sutil con formas rosas desenfocadas, decorativo y no interactivo.
export default function BackgroundBlobs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blush-200/60 blur-3xl animate-floaty" />
      <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-blush-300/40 blur-3xl animate-floaty [animation-delay:-3s]" />
      <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-blush-200/50 blur-3xl animate-floaty [animation-delay:-1.5s]" />
    </div>
  );
}
