import { useLocation, useNavigate } from "react-router-dom";

interface ButtonProps {
	message: string;
	to?: string;
}

export default function Button(props: ButtonProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const isActive = location.pathname === props.to;
	
	const buttonStyle = isActive 
		? "bg-primary text-white" 
		: "bg-gray-200 text-gray-700 hover:bg-gray-300";

	function handleClick() {
		if (props.to) {
			navigate(props.to);
		}
	}

	return (
		<button 
			className={`${buttonStyle} px-6 py-2 rounded-full font-semibold transition-colors`} 
			onClick={handleClick}
		>
			{props.message}
		</button>
	);
}