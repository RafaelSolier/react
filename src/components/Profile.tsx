import { DriverResponse } from "@interfaces/driver/DriverResponse";
import { PassengerResponse } from "@interfaces/passenger/PassengerResponse";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { getRoleBasedOnToken } from "src/utils/getRoleBasedOnToken";
import { getDriver } from "@services/driver/getDriver";
import { getPassenger } from "@services/passenger/getPassenger";

interface ProfileProps {
	setUserId: (id: number | null) => void;
}

export default function Profile(props: ProfileProps) {
	const [profileInfo, setProfileInfo] = useState<DriverResponse | PassengerResponse | null>(null);
	const [isDriver, setIsDriver] = useState(false);

	useEffect(() => {
		fetchProfileInfo();
	}, []);

	async function fetchProfileInfo() {
		try {
			const role = getRoleBasedOnToken();
			if (role === "ROLE_DRIVER") {
				const driverData = await getDriver();
				setProfileInfo(driverData);
				setIsDriver(true);
				props.setUserId(driverData.id);
			} else if (role === "ROLE_PASSENGER") {
				const passengerData = await getPassenger();
				setProfileInfo(passengerData);
				setIsDriver(false);
				// Passenger response doesn't have id in the interface, but we can handle it
			} else {
				console.error("Error: No role found");
			}
		} catch (error) {
			console.error("Error fetching profile:", error);
		}
	}

	if (!profileInfo) {
		return <div>Cargando perfil...</div>;
	}

	return (
		<article>
			<h1 className="title text-2xl font-bold mb-3">
				{isDriver ? "Conductor" : "Pasajero"}
			</h1>
			<section className="flex items-center">
				<div className="w-2/5">
					<FaUserCircle className="w-full text-9xl text-gray-400" />
				</div>
				<ul className="w-3/5 ml-6 space-y-2">
					<li id="profileNames">
						{profileInfo.firstName} {profileInfo.lastName}
					</li>
					
					<li id="profileEmail">
						{(profileInfo as DriverResponse).email}
					</li>
			
					<li id="profilePhone">
						{profileInfo.phoneNumber}
					</li>
					{isDriver && (
						<li id="profileTrips">
						{(profileInfo as DriverResponse).trips}
						</li>
					)}
					<li>
						<b>Rating:</b> ⭐ {profileInfo.avgRating.toFixed(1)}
					</li>
				</ul>
			</section>
		</article>
	);
}