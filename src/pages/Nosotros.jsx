import VolverLink from "../components/VolverLink";

export default function Nosotros() {
  return (
    <div className="mx-auto max-w-md animate-fadeIn">
      <VolverLink />

      <div className="overflow-hidden rounded-3xl bg-ink shadow-soft">
        <video
          src="/videos/nosotros.mp4"
          controls
          playsInline
          preload="metadata"
          className="mx-auto aspect-[9/16] max-h-[80vh] w-auto"
        />
      </div>
    </div>
  );
}
