import Button from "@components/Button";
import RegisterForm from "@components/RegisterForm";
import RegisterVehicle from "@components/RegisterVehicle";
import img6 from "../assets/Img6.png";
import { useState } from "react";
import { RegisterRequest } from "@interfaces/auth/RegisterRequest";

export default function RegisterPage() {
	const [vehicleRegister, setVehicleRegister] = useState(false);
	const [formData, setFormData] = useState<RegisterRequest & { isDriver?: boolean; category?: string }>({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		phone: "",
		isDriver: false
	});

	return (
		<main className="px-10 min-h-screen">
			<section className="flex justify-center items-center py-4 gap-4">
				<Button message="Iniciar Sesión" to="/auth/login" />
				<Button message="Registrarse" to="/auth/register" />
			</section>

			<article className="flex justify-between items-center gap-8">
				<section className="login-section flex flex-col items-center p-8 text-center">
					<h1 className="title text-4xl font-bold mb-4">¡Bienvenido!</h1>
					<p className="mb-6 text-gray-600">Regístrate como pasajero o conductor para empezar con Uber</p>
					<img src={img6} alt="uber" className="max-w-md" />
				</section>
				{vehicleRegister ? (
					<RegisterVehicle formData={formData} />
				) : (
					<RegisterForm
						setVehicleRegister={setVehicleRegister}
						formData={formData}
						setFormData={setFormData}
					/>
				)}
			</article>
		</main>
	);
}