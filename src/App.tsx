import Navbar from "@components/Navbar";
import { Outlet } from "react-router-dom";
import {PhotoUpload} from "@components/auth/PhotoUpload.tsx";
import {RegisterForm} from "@components/auth/RegisterForm.tsx";
import AuthPage from "@pages/AuthPage.tsx";

export default function App() {
	return (
		<>

			<Navbar />
			<Outlet />
		</>
	);
}
