import { Play } from "lucide-react";

export default function VideoButton({ titulo, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between rounded-2xl border border-blush-200/60 bg-white px-5 py-4 text-sm font-medium text-ink shadow-card transition-all hover:-translate-y-0.5 hover:border-blush-300 hover:shadow-soft active:translate-y-0"
    >
      <span className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blush-200/60 text-blush-400 transition-colors group-hover:bg-blush-300/70">
          <Play className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
        </span>
        {titulo}
      </span>
    </a>
  );
}
