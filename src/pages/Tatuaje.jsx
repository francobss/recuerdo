import CartaSection from "../components/CartaSection";
import VolverLink from "../components/VolverLink";
import { tatuaje } from "../data/tatuaje";

export default function Tatuaje() {
  return (
    <div className="mx-auto max-w-2xl animate-fadeIn">
      <VolverLink />
      <CartaSection {...tatuaje} />
    </div>
  );
}
