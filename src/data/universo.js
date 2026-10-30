// Configuración de "Nuestro universo" (escena 3D).
//
// PLANETAS: cada entrada es un recuerdo. Para agregar uno, importá la foto
// (desde src/assets) y sumá un objeto a `planetas`. Para quitarlo, borrá su
// entrada. Los textos son de ejemplo: cambialos por los tuyos.
//
//   id        único
//   name      título del recuerdo (opcional)
//   image     foto importada
//   message   mensaje que se muestra en el panel
//   date      fecha (opcional)
//   position  { x, y, z } en el espacio. Ella (el centro) está en 0,0,0.
//   size      radio del planeta (1.6–3.4 funciona bien)
//   color     tono de la atmósfera (opcional)
//   focus     { x, y } 0–1: qué parte de la foto se ve sobre el planeta (opcional)
//
// `en(radio, grados, altura)` calcula una posición sobre una órbita; también
// podés escribir { x, y, z } a mano. Mantené los planetas separados unos de otros.

import ella from "../assets/ella.jpeg";
import abrazo from "../assets/abrazo.jpeg";
import campo from "../assets/campo.jpeg";
import espejo from "../assets/espejo.jpeg";
import salida from "../assets/salida.jpeg";
import f2 from "../assets/WhatsApp Image 2023-10-03 at 10.14.55 PM (1).jpeg";
import f3 from "../assets/WhatsApp Image 2023-10-03 at 10.14.55 PM (2).jpeg";
import f5 from "../assets/WhatsApp Image 2023-10-03 at 10.14.55 PM.jpeg";
import f6 from "../assets/WhatsApp Image 2023-10-03 at 10.14.56 PM.jpeg";
import f7 from "../assets/WhatsApp Image 2023-10-03 at 10.25.14 PM.jpeg";
import f8 from "../assets/WhatsApp Image 2023-10-03 at 10.25.15 PM (1).jpeg";
import f9 from "../assets/WhatsApp Image 2023-10-03 at 10.25.15 PM (2).jpeg";
import f10 from "../assets/WhatsApp Image 2023-10-03 at 10.25.15 PM.jpeg";
import f11 from "../assets/WhatsApp Image 2023-10-03 at 10.25.16 PM.jpeg";

const en = (radio, grados, y = 0) => {
  const a = (grados * Math.PI) / 180;
  return { x: +(Math.cos(a) * radio).toFixed(2), y, z: +(Math.sin(a) * radio).toFixed(2) };
};

export const orbitas = [16, 28, 42];

export const planetas = [
  // Primera órbita
  {
    id: 1, name: "Abrazo", image: abrazo, size: 2.5, color: "#ff7ab8", focus: { x: 0.5, y: 0.8 },
    message: "No me canso de abrazarte.",
    position: en(16, 20, 1.2),
  },
  {
    id: 2, name: "Pegaditos", image: f2, size: 2.3, color: "#c78bff",
    message: "Me gusta cuando salimos así, uno al lado del otro.",
    position: en(16, 110, -1.5),
  },
  {
    id: 3, name: "Caras de siempre", image: f3, size: 2.6, color: "#ff9bd0",
    message: "Con vos hasta las caras raras salen lindas.",
    position: en(16, 200, 0.8),
  },
  {
    id: 4, name: "Siempre con una ocurrencia", image: f5, size: 2.2, color: "#ff6fb0", focus: { x: 0.5, y: 0.3 },
    message: "Vos siempre tenés alguna idea para hacerme reír.",
    position: en(16, 290, -0.8),
  },

  // Segunda órbita
  {
    id: 5, name: "Frente al lago", image: f7, size: 3.0, color: "#9a8cff",
    message: "Ese día no quería que se termine.",
    position: en(28, 0, 2.5),
  },
  {
    id: 6, name: "Atardecer", image: f10, size: 2.8, color: "#ff8ac4",
    message: "Qué lindo se veía todo, y más con vos al lado.",
    position: en(28, 75, -2.2),
  },
  {
    id: 7, name: "Mi lugar", image: f11, size: 2.6, color: "#ffa0c8", focus: { x: 0.5, y: 0.5 },
    message: "Mi lugar favorito es este.",
    position: en(28, 148, 1.8),
  },
  {
    id: 8, name: "En el espejo", image: espejo, size: 2.4, color: "#b98cff", focus: { x: 0.5, y: 0.2 },
    message: "Nos sacamos fotos en cualquier lado y me encanta.",
    position: en(28, 222, -1.4),
  },
  {
    id: 9, name: "Los cerros", image: campo, size: 2.7, color: "#ff7ab8", focus: { x: 0.5, y: 0.72 },
    message: "Qué lindo día. Y qué lindo estar con vos.",
    position: en(28, 296, 2.0),
  },

  // Tercera órbita
  {
    id: 10, name: "Una salida", image: salida, size: 2.6, color: "#8fb0ff", focus: { x: 0.5, y: 0.5 },
    message: "Esa noche estabas hermosa.",
    position: en(42, 35, 6),
  },
  {
    id: 11, name: "Al aire libre", image: f8, size: 2.6, color: "#ffb08a", focus: { x: 0.5, y: 0.45 },
    message: "Me gusta cuando salimos así, sin apuro.",
    position: en(42, 125, -5),
  },
  {
    id: 12, name: "Tarde de sol", image: f9, size: 2.5, color: "#ff8f9f", focus: { x: 0.5, y: 0.45 },
    message: "Otra tarde de las que quiero repetir.",
    position: en(42, 215, 4),
  },
  {
    id: 13, name: "Otro espejo", image: f6, size: 2.8, color: "#d28bff", focus: { x: 0.5, y: 0.5 },
    message: "Ya perdí la cuenta de cuántas fotos así tenemos.",
    position: en(42, 300, -6),
  },
];

export const centro = {
  imagen: ella, // la foto que se ve sobre el planeta central
  etiqueta: "Vos",
  titulo: "Mi estrella, mi universo",
  mensaje:
    "Sos la estrella más preciosa de mi universo. Sos el centro de todo, mi lugar favorito y esa persona que hace que todo tenga sentido. No existe alguien como vos. Y si tuviera que elegirte entre todos los universos posibles, volvería a encontrarte y elegirte siempre.",
};

export const textos = {
  indicador: "Explorá nuestro universo",
  intro:
    "Preparé un pequeño universo para vos. Exploralo, hay recuerdos nuestros escondidos entre las estrellas.",
  introBoton: "Entrar",
};

// MÚSICA (opcional): copiá una pista instrumental a src/assets/universo/ con el
// nombre `musica.mp3` (también .ogg, .m4a o .wav). Solo suena si ella toca el botón.
const audios = import.meta.glob("../assets/universo/musica.{mp3,ogg,m4a,wav}", {
  eager: true,
  query: "?url",
  import: "default",
});

export const musica = {
  src: Object.values(audios)[0] ?? null,
  volumen: 0.45,
};
