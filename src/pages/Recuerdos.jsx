import { useState } from "react";
import { recuerdos } from "../data/recuerdos";
import CartaSection from "../components/CartaSection";
import GaleriaSection from "../components/GaleriaSection";
import VolverLink from "../components/VolverLink";
import PasoNavegador from "../components/PasoNavegador";

export default function Recuerdos() {
  const [paso, setPaso] = useState(0);
  const vista = recuerdos[paso];

  return (
    <div className="mx-auto max-w-2xl animate-fadeIn">
      <VolverLink />

      {vista.tipo === "carta" ? <CartaSection {...vista} /> : <GaleriaSection {...vista} />}

      <PasoNavegador
        total={recuerdos.length}
        paso={paso}
        onAnterior={() => setPaso((p) => Math.max(0, p - 1))}
        onSiguiente={() => setPaso((p) => Math.min(recuerdos.length - 1, p + 1))}
      />
    </div>
  );
}
