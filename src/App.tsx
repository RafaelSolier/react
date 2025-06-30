//import {Navbar} from "@components/Navbar";
import { Outlet } from "react-router-dom";

export default function App() {
	return (
		<div className="min-h-screen bg-gray-50">
			<Outlet />
		</div>
	);
}