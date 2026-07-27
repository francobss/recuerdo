import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function VolverLink({ to = "/", children = "Volver al inicio" }) {
  return (
    <Link
      to={to}
      className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink/60 transition-colors hover:text-blush-400"
    >
      <ArrowLeft className="h-4 w-4" />
      {children}
    </Link>
  );
}
