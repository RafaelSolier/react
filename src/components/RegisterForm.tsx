import { RegisterRequest } from "@interfaces/auth/RegisterRequest";
import { ChangeEvent, FormEvent, Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@contexts/AuthContext";

interface RegisterFormProps {
	setVehicleRegister: Dispatch<SetStateAction<boolean>>;
	formData: RegisterRequest & { isDriver?: boolean };
	setFormData: Dispatch<SetStateAction<RegisterRequest & { isDriver?: boolean }>>;
}

export default function RegisterForm(props: RegisterFormProps) {
	const navigate = useNavigate();
	const { register } = useAuthContext();

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value, type } = e.target;
		
		if (type === "radio" && name === "isDriver") {
			props.setFormData(prev => ({
				...prev,
				isDriver: value === "true"
			}));
		} else {
			props.setFormData(prev => ({
				...prev,
				[name]: value
			}));
		}
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (props.formData.isDriver) {
			// Si es conductor, mostrar el formulario de vehículo
			props.setVehicleRegister(true);
		} else {
			// Si es pasajero, registrar directamente
			try {
				await register(props.formData);
				// Asumimos que el registro fue exitoso si no lanza error
				navigate("/dashboard");
			} catch (error: any) {
				console.error("Error al registrar:", error);
			}
		}
	}

	return (
		<section className="login-section bg-secondary p-8 rounded-2xl shadow-lg">
			<h1 className="text-3xl font-bold mb-6">Registrarse a Uber</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="firstName" className="block text-sm font-medium mb-2">Nombres</label>
					<input
						type="text"
						name="firstName"
						id="firstName"
						value={props.formData.firstName || ""}
						onChange={handleChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						required
					/>
				</div>
				<div>
					<label htmlFor="lastName" className="block text-sm font-medium mb-2">Apellidos</label>
					<input
						type="text"
						name="lastName"
						id="lastName"
						value={props.formData.lastName || ""}
						onChange={handleChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						required
					/>
				</div>
				<div>
					<label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
					<input 
						type="email" 
						name="email" 
						id="email" 
						value={props.formData.email || ""} 
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
						value={props.formData.password || ""}
						onChange={handleChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						required
					/>
				</div>
				<div>
					<label htmlFor="phone" className="block text-sm font-medium mb-2">Celular</label>
					<input 
						type="text" 
						name="phone" 
						id="phone" 
						value={props.formData.phone || ""} 
						onChange={handleChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium mb-2">¿Eres Conductor?</label>
					<div className="flex gap-4">
						<label className="flex items-center">
							<input
								type="radio"
								name="isDriver"
								id="driver"
								value="true"
								checked={props.formData.isDriver === true}
								onChange={handleChange}
								className="mr-2"
							/>
							Sí
						</label>
						<label className="flex items-center">
							<input
								type="radio"
								name="isDriver"
								id="passenger"
								value="false"
								checked={props.formData.isDriver === false || props.formData.isDriver === undefined}
								onChange={handleChange}
								className="mr-2"
							/>
							No
						</label>
					</div>
				</div>
				<button
					id="registerSubmit"
					className="w-full bg-primary text-white font-bold py-3 px-4 rounded-full hover:bg-primary-dark transition-colors"
					type="submit"
				>
					Registrarse
				</button>
			</form>
		</section>
	);
}