import { RegisterRequest } from "@interfaces/auth/RegisterRequest";
import { VehicleResponse } from "@interfaces/vehicle/VehicleResponse";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@contexts/AuthContext";

interface RegisterVehicleProps {
	formData: RegisterRequest & { isDriver?: boolean; category?: string };
}

export default function RegisterVehicle(props: RegisterVehicleProps) {
	const navigate = useNavigate();
	const { register } = useAuthContext();
	const [category, setCategory] = useState<"X" | "XL" | "BLACK">("X");
	const [vehicleData, setVehicleData] = useState<VehicleResponse>({
		brand: "",
		model: "",
		licensePlate: "",
		fabricationYear: new Date().getFullYear(),
		capacity: 4,
	});
	const [error, setError] = useState<string>("");

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setVehicleData(prev => ({
			...prev,
			[name]: name === "fabricationYear" || name === "capacity" ? parseInt(value) : value
		}));
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError("");

		// Crear el objeto de registro con toda la información
		const registerData: RegisterRequest = {
			firstName: props.formData.firstName,
			lastName: props.formData.lastName,
			email: props.formData.email,
			password: props.formData.password,
			phone: props.formData.phone,
			isDriver: true, // Importante: enviar como número
			category: category,
			vehicle: vehicleData
		};

		try {
			await register(registerData);
			navigate("/dashboard");
		} catch (error: any) {
			setError(error.response?.data?.message || "Error al registrar conductor");
		}
	}

	return (
		<section className="login-section bg-secondary p-8 rounded-2xl shadow-lg">
			<h1 className="text-3xl font-bold mb-6">Registra tu vehículo</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="category" className="block text-sm font-medium mb-2">Categoría</label>
					<select
						name="category"
						id="category"
						value={category}
						onChange={(e) => {
							if (
								e.target.value === "X" ||
								e.target.value === "XL" ||
								e.target.value === "BLACK"
							) {
								setCategory(e.target.value as "X" | "XL" | "BLACK");
							}
						}}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						required
					>
						<option value="X">X</option>
						<option value="XL">XL</option>
						<option value="BLACK">BLACK</option>
					</select>
				</div>
				<div>
					<label htmlFor="brand" className="block text-sm font-medium mb-2">Marca</label>
					<input 
						type="text" 
						name="brand" 
						id="brand" 
						value={vehicleData.brand} 
						onChange={handleChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						required
					/>
				</div>
				<div>
					<label htmlFor="model" className="block text-sm font-medium mb-2">Modelo</label>
					<input 
						type="text" 
						name="model" 
						id="model" 
						value={vehicleData.model} 
						onChange={handleChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						required
					/>
				</div>
				<div>
					<label htmlFor="licensePlate" className="block text-sm font-medium mb-2">Placa</label>
					<input
						type="text"
						name="licensePlate"
						id="licensePlate"
						value={vehicleData.licensePlate}
						onChange={handleChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						required
					/>
				</div>
				<div>
					<label htmlFor="fabricationYear" className="block text-sm font-medium mb-2">Año de Fabricación</label>
					<input
						type="number"
						name="fabricationYear"
						id="fabricationYear"
						// value={vehicleData.fabricationYear}
						onChange={handleChange}
						min="1990"
						max={new Date().getFullYear()}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						required
					/>
				</div>
				<div>
					<label htmlFor="capacity" className="block text-sm font-medium mb-2">Capacidad</label>
					<input
						type="number"
						name="capacity"
						id="capacity"
						// value={vehicleData.capacity}
						onChange={handleChange}
						min="1"
						max="8"
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						required
					/>
				</div>
				<button
					id="registerVehicleSubmit"
					className="w-full bg-primary text-white font-bold py-3 px-4 rounded-full hover:bg-primary-dark transition-colors"
					type="submit"
				>
					Completar Registro
				</button>
			</form>
			{error && <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
		</section>
	);
}