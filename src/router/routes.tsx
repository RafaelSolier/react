import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import App from "src/App";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuthContext } from "@contexts/AuthContext";
import AuthPage from "@pages/AuthPage";
import ServiciosPage from "@pages/ServiciosPage";
import NotFound from "@pages/NotFoundPage";
import ReservasPage from "@pages/ReservasPage";

// Para rutas públicas que no deje entrar a quien ya esté logueado
function PublicRoute({ children }: { children: JSX.Element }) {
  const { session, isLoading } = useAuthContext();
  if (isLoading) return null;
  return session
      ? <Navigate to="/servicios" replace />
      : children;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // REDIRECCIÓN raíz a login
      { index: true, element: <Navigate to="/auth/login" replace /> },

      // Rutas públicas
      {
        path: "auth",
        element: (
            <PublicRoute>
              <Outlet />
            </PublicRoute>
        ),
        children: [
          { path: "login", element: <AuthPage /> },
        ],
      },

      // Rutas protegidas (privadas)
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          { path: "servicios", element: <ServiciosPage /> },
          { path: "reservas", element: <ReservasPage /> }, // TODO: Implementar
        ],
      },

      // Cualquier otra ruta -> 404
      { path: "*", element: <NotFound /> },
    ],
  },
]);