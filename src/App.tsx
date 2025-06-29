import Navbar from "@components/Navbar";
import { Outlet } from "react-router-dom";
import {PhotoUpload} from "@components/PhotoUpload.tsx";
import {RegisterForm} from "@components/RegisterForm.tsx";
import AuthPage from "@pages/AuthPage.tsx";

export default function App() {
	return (
		<>
			<AuthPage/>
			{/*<Navbar />*/}
			{/*<Outlet />*/}
		</>
	);
}
