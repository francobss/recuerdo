import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, History, Waves, Quote } from "lucide-react";
import CategoryCard from "../components/CategoryCard";
import VideoButton from "../components/VideoButton";
import { categories } from "../data/categories";
import { videos } from "../data/videos";

const seccionesExtra = [
  {
    slug: "recuerdo",
    nombre: "Un recuerdo especial",
    descripcion: "Antes de esto hice otra web para vos, en 2023. Volvé a leerla.",
    icono: History,
    ruta: "/recuerdo",
    textoBoton: "Revivir el recuerdo",
  },
  {
    slug: "tatuaje",
    nombre: "Significado Tatuaje",
    descripcion: "Los símbolos que elegí llevar conmigo, y lo que representan de vos.",
    icono: Waves,
    ruta: "/tatuaje",
    textoBoton: "Leer el significado",
  },
  {
    slug: "dedicatorias",
    nombre: "Dedicatorias Tw",
    descripcion: "Palabras que te escribí y que quise dejar guardadas acá también.",
    icono: Quote,
    ruta: "/dedicatorias",
    textoBoton: "Leer dedicatorias",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [categoriaActiva, setCategoriaActiva] = useState(null);

  if (categoriaActiva) {
    const listaVideos = videos[categoriaActiva.slug] ?? [];

    return (
      <div className="animate-fadeIn">
        <button
          onClick={() => setCategoriaActiva(null)}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-ink/60 transition-colors hover:text-blush-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a las categorías
        </button>

        <h2 className="text-2xl font-semibold text-ink sm:text-3xl">
          {categoriaActiva.nombre}
        </h2>
        <p className="mt-2 text-sm text-ink/60">{categoriaActiva.descripcion}</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {listaVideos.length > 0 ? (
            listaVideos.map((video) => (
              <VideoButton key={video.url} titulo={video.titulo} url={video.url} />
            ))
          ) : (
            <p className="col-span-full rounded-2xl border border-dashed border-blush-200 px-5 py-8 text-center text-sm text-ink/40">
              Todavía no hay videos cargados en esta categoría.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
          Elegí cómo te sentís hoy
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink/60">
          Cada botón guarda un mensaje pensado para acompañarte.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((categoria) => (
          <CategoryCard
            key={categoria.slug}
            categoria={categoria}
            onVerVideos={() => setCategoriaActiva(categoria)}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {seccionesExtra.map((seccion) => (
          <CategoryCard
            key={seccion.slug}
            categoria={seccion}
            onVerVideos={() => navigate(seccion.ruta)}
            textoBoton={seccion.textoBoton}
          />
        ))}
      </div>
    </div>
  );
}
