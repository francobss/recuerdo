import { useState } from "react";
import { dedicatorias } from "../data/dedicatorias";
import DedicatoriaSection from "../components/DedicatoriaSection";
import VolverLink from "../components/VolverLink";
import PasoNavegador from "../components/PasoNavegador";

export default function Dedicatorias() {
  const [paso, setPaso] = useState(0);
  const dedicatoria = dedicatorias[paso];

  return (
    <div className="mx-auto max-w-2xl animate-fadeIn">
      <VolverLink />

      <DedicatoriaSection {...dedicatoria} />

      <PasoNavegador
        total={dedicatorias.length}
        paso={paso}
        onAnterior={() => setPaso((p) => Math.max(0, p - 1))}
        onSiguiente={() => setPaso((p) => Math.min(dedicatorias.length - 1, p + 1))}
      />
    </div>
  );
}
