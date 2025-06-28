import Profile from "@components/Profile";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { getRoleBasedOnToken } from "src/utils/getRoleBasedOnToken";
import { useNavigate } from "react-router-dom";
import { getDriver } from "@services/driver/getDriver";
import { getPassenger } from "@services/passenger/getPassenger";
import { updateDriverInfo } from "@services/driver/updateDriverInfo";
import { updatePassenger } from "@services/passenger/updatePassenger";
import { deleteDriver } from "@services/driver/deleteDriver";
import { deletePassenger } from "@services/passenger/deletePassenger";
import { useAuthContext } from "@contexts/AuthContext";

export default function EditProfilePage() {
	const navigate = useNavigate();
	const { logout } = useAuthContext();
	const [userId, setUserId] = useState<number | null>(null);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		phoneNumber: ""
	});

	useEffect(() => {
		fetchUserData();
	}, []);

	async function fetchUserData() {
		try {
			const role = getRoleBasedOnToken();
			if (role === "ROLE_DRIVER") {
				const driver = await getDriver();
				setUserId(driver.id);
				setFormData({
					firstName: driver.firstName,
					lastName: driver.lastName,
					phoneNumber: driver.phoneNumber
				});
			} else if (role === "ROLE_PASSENGER") {
				const passenger = await getPassenger();
				// Note: Passenger doesn't have ID in response, handle accordingly
				setUserId(passenger.id);  
				setFormData({
					firstName: passenger.firstName,
					lastName: passenger.lastName,
					phoneNumber: passenger.phoneNumber
				});
			}
		} catch (error) {
			console.error("Error fetching user data:", error);
		}
	}

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	}

	async function fetchDeleteUser() {
		if (!userId) return;
		try {
			if (getRoleBasedOnToken() === "ROLE_DRIVER") {
				await deleteDriver(userId);
			} else if (getRoleBasedOnToken() === "ROLE_PASSENGER") {
				await deletePassenger(userId);
			}
			localStorage.removeItem("token");
			logout();
			navigate("/auth/login");
		} catch (error) {
			console.error("Error deleting user:", error);
		}
	}

	async function fetchUpdateUser() {
		try {
			if (getRoleBasedOnToken() === "ROLE_DRIVER") {
			if (!userId) return;
				await updateDriverInfo(userId, {
					firstName: formData.firstName, // Typo matches the interface
					lastName: formData.lastName,
					phoneNumber: formData.phoneNumber
				});
			} else {
				if (!userId) return;               // ahora sí existe
				await updatePassenger({
				firstName: formData.firstName,
				lastName:  formData.lastName,
				phoneNumber: formData.phoneNumber
				});
			}
		} catch (error) {
			console.error("Error updating user:", error);
		}
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
			e.preventDefault();
			await fetchUpdateUser();
			navigate("/dashboard");
		}

	return (
		<main className="p-10 max-w-4xl mx-auto">
			<article className="bg-white p-8 rounded-lg shadow-lg mb-6">
				<h1 className="text-3xl font-bold mb-6">Editar Perfil</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="firstName" className="block text-sm font-medium mb-2">Nombres</label>
						<input
							type="text"
							name="firstName"
							id="firstName"
							value={formData.firstName}
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
							value={formData.lastName}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
							required
						/>
					</div>
					<div>
						<label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">Celular</label>
						<input
							type="text"
							name="phoneNumber"
							id="phoneNumber"
							value={formData.phoneNumber}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
							required
						/>
					</div>
					<button
						id="updateSubmit"
						className="w-full bg-primary text-white font-bold py-3 px-4 rounded-full hover:bg-primary-dark transition-colors"
						type="submit"
					>
						Actualizar
					</button>
				</form>
			</article>

			<div className="bg-white p-8 rounded-lg shadow-lg mb-6">
				<Profile setUserId={setUserId} />
			</div>

			<button 
				id="deleteUser" 
				onClick={fetchDeleteUser}
				className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-full hover:bg-red-600 transition-colors"
			>
				Eliminar cuenta
			</button>
		</main>
	);
}