import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function CorazonCard() {
  return (
    <div className="mt-10 flex justify-center">
      <Link
        to="/nosotros"
        aria-label="Nosotros, una vez más"
        className="group flex h-24 w-24 items-center justify-center rounded-full border border-blush-200/60 bg-white/70 shadow-card backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
      >
        <Heart
          className="h-9 w-9 animate-floaty fill-blush-300 text-blush-400 transition-transform duration-300 group-hover:scale-110"
          strokeWidth={1.5}
        />
      </Link>
    </div>
  );
}
