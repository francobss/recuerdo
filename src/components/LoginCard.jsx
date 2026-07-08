import { useState } from "react";
import { LogIn } from "lucide-react";
import Mascota from "./Mascota";

export default function LoginCard({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const exito = onLogin(usuario, contrasena);
    if (!exito) {
      setError("Usuario o contraseña incorrectos.");
    }
  }

  return (
    <div className="w-full max-w-sm animate-fadeIn rounded-3xl border border-blush-200/60 bg-white/70 p-8 shadow-soft backdrop-blur-md sm:p-10">
      <div className="flex justify-center">
        <Mascota flotante className="h-24 w-24 object-contain sm:h-28 sm:w-28" />
      </div>

      <h1 className="mt-6 text-center text-2xl font-semibold leading-snug text-ink sm:text-3xl">
        Un pequeño lugar para vos 🤍
      </h1>
      <p className="mt-2 text-center text-sm text-ink/60">
        Elegí el momento que necesites.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="usuario" className="mb-1.5 block text-xs font-medium text-ink/60">
            Usuario
          </label>
          <input
            id="usuario"
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoComplete="username"
            className="w-full rounded-2xl border border-blush-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-blush-400 focus:ring-4 focus:ring-blush-200/50"
            placeholder="Tu usuario"
          />
        </div>

        <div>
          <label htmlFor="contrasena" className="mb-1.5 block text-xs font-medium text-ink/60">
            Contraseña
          </label>
          <input
            id="contrasena"
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-2xl border border-blush-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-blush-400 focus:ring-4 focus:ring-blush-200/50"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="animate-fadeIn rounded-xl bg-blush-200/40 px-4 py-2 text-center text-sm text-ink/80">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-card transition-all hover:scale-[1.02] hover:bg-blush-400 active:scale-[0.98]"
        >
          Ingresar
          <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </form>
    </div>
  );
}
