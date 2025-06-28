import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import App from "src/App";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuthContext } from "@contexts/AuthContext";
import LoginPage from "src/pages/LoginPage";
import RegisterPage from "src/pages/RegisterPage";
import Dashboard from "src/pages/DashboardPage";
import ProfileEdit from "src/pages/EditProfilePage";
import VehicleEdit from "src/pages/EditVehiclePage";
import NotFound from "src/pages/NotFoundPage";

// (Opcional) para rutas públicas que no deje entrar a quien ya esté logueado
function PublicRoute({ children }: { children: JSX.Element }) {
  const { session, isLoading } = useAuthContext();
  if (isLoading) return null;
  return session
    ? <Navigate to="/dashboard" replace />
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
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },

      // Rutas protegidas (privadas)
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "profile/edit", element: <ProfileEdit /> },
          { path: "vehicle/edit", element: <VehicleEdit /> },
        ],
      },

      // Cualquier otra ruta -> 404
      { path: "*", element: <NotFound /> },
    ],
  },
]);

