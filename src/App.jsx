import { Suspense, lazy, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";

const Recuerdo = lazy(() => import("./pages/Recuerdos"));
const Tatuaje = lazy(() => import("./pages/Tatuaje"));
const Dedicatorias = lazy(() => import("./pages/Dedicatorias"));
const Regreso = lazy(() => import("./pages/Regreso"));

const SESSION_KEY = "poemav_session";

function RutaProtegida({ autenticado, onLogout, children }) {
  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout onLogout={onLogout}>
      <Suspense fallback={null}>{children}</Suspense>
    </MainLayout>
  );
}

export default function App() {
  const [autenticado, setAutenticado] = useState(
    () => localStorage.getItem(SESSION_KEY) === "true"
  );

  function handleAuthenticated() {
    localStorage.setItem(SESSION_KEY, "true");
    setAutenticado(true);
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    setAutenticado(false);
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          autenticado ? (
            <Navigate to="/" replace />
          ) : (
            <Login onAuthenticated={handleAuthenticated} />
          )
        }
      />
      <Route
        path="/"
        element={
          <RutaProtegida autenticado={autenticado} onLogout={handleLogout}>
            <Home />
          </RutaProtegida>
        }
      />
      <Route
        path="/recuerdo"
        element={
          <RutaProtegida autenticado={autenticado} onLogout={handleLogout}>
            <Recuerdo />
          </RutaProtegida>
        }
      />
      <Route
        path="/tatuaje"
        element={
          <RutaProtegida autenticado={autenticado} onLogout={handleLogout}>
            <Tatuaje />
          </RutaProtegida>
        }
      />
      <Route
        path="/dedicatorias"
        element={
          <RutaProtegida autenticado={autenticado} onLogout={handleLogout}>
            <Dedicatorias />
          </RutaProtegida>
        }
      />
      <Route
        path="/regreso"
        element={
          <RutaProtegida autenticado={autenticado} onLogout={handleLogout}>
            <Regreso />
          </RutaProtegida>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
