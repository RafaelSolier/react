import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@contexts/AuthContext";

export default function Navbar() {
	const navigate = useNavigate();
	const { logout } = useAuthContext();

	function handleLogout() {
		localStorage.removeItem("token");
		logout();
		navigate("/auth/login");
	}

	const isAuthenticated = localStorage.getItem("token");

	return (
		<nav className="bg-black text-white p-4 flex justify-between items-center">
			<div className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>
				Uber
			</div>
			{isAuthenticated && (
				<button 
					id="logout" 
					onClick={handleLogout}
					className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
				>
					Cerrar Sesión
				</button>
			)}
		</nav>
	);
}