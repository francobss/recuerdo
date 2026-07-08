import { useNavigate } from "react-router-dom";
import LoginCard from "../components/LoginCard";
import BackgroundBlobs from "../components/BackgroundBlobs";
import { USERNAME, PASSWORD } from "../data/auth";

export default function Login({ onAuthenticated }) {
  const navigate = useNavigate();

  function handleLogin(usuario, contrasena) {
    const esValido = usuario === USERNAME && contrasena === PASSWORD;
    if (esValido) {
      onAuthenticated();
      navigate("/", { replace: true });
    }
    return esValido;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-12">
      <BackgroundBlobs />
      <LoginCard onLogin={handleLogin} />
    </div>
  );
}
