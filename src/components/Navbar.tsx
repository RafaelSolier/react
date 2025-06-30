// src/components/Navbar.tsx
import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Briefcase, ChevronDown } from "lucide-react";
import Button from "./Button";
import { useNavigate, useLocation, Link } from "react-router-dom";

interface NavbarProps {
  avatarUrl: string;
  userName: string;
  badgeLabel?: string;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  avatarUrl,
  userName,
  badgeLabel = "Proveedor",
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // 1. Quitar el token de almacenamiento
    localStorage.removeItem("token");
    // 2. Avisar al contexto que cerramos sesión
    onLogout?.();
    // 3. Redirigir al login, indicando desde dónde veníamos
    navigate(`/auth/login?from=${encodeURIComponent(location.pathname)}`, {
      replace: true,
    });
  };

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Briefcase className="w-6 h-6 text-white" />
          <span className="text-white font-bold text-lg">ServiMarket</span>
        </div>

        {/* Botones de navegación */}
        <div className="hidden sm:flex space-x-4">
          <Button message="Mis Servicios" to="/servicios" />
          <Button message="Mis Reservas" to="/reservas" />
        </div>

        {/* Perfil */}
        <div className="flex items-center space-x-4">
          <span className="bg-indigo-800 text-white text-sm font-semibold px-3 py-1 rounded-full">
            {badgeLabel}
          </span>

          <Menu as="div" className="relative">
            <MenuButton className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 rounded-md px-2 py-1">
              <img
                src={avatarUrl}
                alt={`Avatar de ${userName}`}
                className="w-8 h-8 rounded-full ring-2 ring-white"
                onError={(e) => {
                  e.currentTarget.src = '/default-avatar.png';
                }}
              />
              <span className="text-white font-medium">{userName}</span>
              <ChevronDown className="w-4 h-4 text-white" />
            </MenuButton>

            <MenuItems className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 focus:outline-none z-10">
              <MenuItem>
                {({ active }) => (
                  <Link
                    to="/perfil"
                    className={`block px-4 py-2 text-sm ${
                      active ? "bg-gray-100" : ""
                    } text-gray-700`}
                  >
                    Mi perfil
                  </Link>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      active ? "bg-gray-100" : ""
                    } text-gray-700`}
                  >
                    Cerrar sesión
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </nav>
  );
};
