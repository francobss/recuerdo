import { LogOut } from "lucide-react";
import Mascota from "./Mascota";

export default function Navbar({ onLogout }) {
  return (
    <header className="sticky top-0 z-20 border-b border-blush-200/50 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <Mascota className="h-8 w-8 object-contain" />
          <span className="text-base font-semibold tracking-tight text-ink">
            un pequeño lugar
          </span>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 rounded-full border border-blush-200 px-4 py-2 text-xs font-medium text-ink/70 transition-all hover:border-blush-400 hover:text-ink hover:scale-[1.03] active:scale-95"
        >
          Cerrar sesión
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}
