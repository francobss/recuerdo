import { Suspense, lazy, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";

const Recuerdo = lazy(() => import("./pages/Recuerdos"));

const SESSION_KEY = "poemav_session";

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
          autenticado ? (
            <MainLayout onLogout={handleLogout}>
              <Home />
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/recuerdo"
        element={
          autenticado ? (
            <MainLayout onLogout={handleLogout}>
              <Suspense fallback={null}>
                <Recuerdo />
              </Suspense>
            </MainLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
