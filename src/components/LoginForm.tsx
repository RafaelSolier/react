import { LoginRequest } from "@interfaces/auth/LoginRequest";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@contexts/AuthContext";

export default function LoginForm() {
	const [formData, setFormData] = useState<LoginRequest>({
		email: "",
		password: ""
	});
	const [error, setError] = useState<string>("");
	const [successMessage, setSuccessMessage] = useState<string>("");
	const navigate = useNavigate();
	const { login } = useAuthContext();

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError("");
		setSuccessMessage("");

		try {
			await login(formData);
			setSuccessMessage("Login exitoso!");
			setTimeout(() => {
				navigate("/dashboard");
			}, 500);
		} catch (error: any) {
			setError(error.response?.data?.message || "Error al iniciar sesión");
		}
	}

	return (
		<section className="login-section bg-secondary p-8 rounded-2xl shadow-lg">
			<h1 className="title text-3xl font-bold mb-6">Ingresar a Uber</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
					<input 
						type="email" 
						name="email" 
						id="email" 
						value={formData.email} 
						onChange={handleChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						required
					/>
				</div>
				<div>
					<label htmlFor="password" className="block text-sm font-medium mb-2">Contraseña</label>
					<input
						type="password"
						name="password"
						id="password"
						value={formData.password}
						onChange={handleChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						required
					/>
				</div>
				<button 
					id="loginSubmit" 
					className="w-full bg-primary text-white font-bold py-3 px-4 rounded-full hover:bg-primary-dark transition-colors" 
					type="submit"
				>
					Iniciar Sesión
				</button>
			</form>
			{error && <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
			{successMessage && <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">{successMessage}</div>}
		</section>
	);
}