import mascotaImg from "../assets/mascota.png";

export default function Mascota({ className = "", flotante = false }) {
  return (
    <img
      src={mascotaImg}
      alt="Mascota"
      className={`select-none drop-shadow-soft ${flotante ? "animate-floaty" : ""} ${className}`}
      draggable={false}
    />
  );
}
