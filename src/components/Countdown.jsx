import { useEffect, useState } from "react";

const destino = new Date("2026-12-27T08:40:00-03:00").getTime();

function calcularTiempoRestante() {
  const diferencia = Math.max(destino - Date.now(), 0);

  return {
    dias: Math.floor(diferencia / 86_400_000),
    horas: Math.floor((diferencia / 3_600_000) % 24),
    minutos: Math.floor((diferencia / 60_000) % 60),
    segundos: Math.floor((diferencia / 1_000) % 60),
  };
}

export default function Countdown({ compacto = false }) {
  const [tiempo, setTiempo] = useState(calcularTiempoRestante);

  useEffect(() => {
    const intervalo = window.setInterval(
      () => setTiempo(calcularTiempoRestante()),
      1_000
    );

    return () => window.clearInterval(intervalo);
  }, []);

  const unidades = compacto
    ? [["días", tiempo.dias], ["h", tiempo.horas], ["m", tiempo.minutos], ["s", tiempo.segundos]]
    : [["días", tiempo.dias], ["horas", tiempo.horas], ["minutos", tiempo.minutos], ["segundos", tiempo.segundos]];

  return (
    <div className={`grid grid-cols-4 ${compacto ? "gap-2" : "gap-3 sm:gap-5"}`}>
      {unidades.map(([etiqueta, valor]) => (
        <div key={etiqueta} className="text-center">
          <p className={`font-display font-semibold tabular-nums text-ink ${compacto ? "text-xl sm:text-2xl" : "text-3xl sm:text-5xl"}`}>
            {String(valor).padStart(2, "0")}
          </p>
          <p className={`mt-1 text-ink/50 ${compacto ? "text-[10px]" : "text-xs sm:text-sm"}`}>
            {etiqueta}
          </p>
        </div>
      ))}
    </div>
  );
}