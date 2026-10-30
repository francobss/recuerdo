import { useNavigate } from "react-router-dom";
import NuestroUniverso from "../components/universo/NuestroUniverso";

export default function Universo() {
  const navigate = useNavigate();
  return <NuestroUniverso onSalir={() => navigate("/")} />;
}
