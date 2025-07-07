import { useStorageState } from "@hooks/useStorageState";
import { LoginRequest } from "@interfaces/auth/LoginRequest";
import { RegisterRequest } from "@interfaces/auth/RegisterRequest";
import Api from "@services/api";
import { login } from "@services/auth/login";
import { registerCliente, registerProveedor } from "@services/auth/register";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import { AuthResponse } from "@interfaces/auth/AuthResponse";
import {AuthMeDto} from "@interfaces/auth/AuthMeDto.ts";
import {getMeInfo} from "@services/auth/me.ts";

interface AuthContextType {
	register: (SignupRequest: RegisterRequest, isClient: boolean) => Promise<void>;
	login: (loginRequest: LoginRequest) => Promise<void>;
	logout: () => void;
	session?: string | null;
	isLoading: boolean;
	userId?: number | null;
	userInfo?: AuthMeDto | null;
	refreshUserInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function loginHandler(
	loginRequest: LoginRequest,
	setSession: (value: string) => void,
	setUserId: (value: string) => void,
	setUserInfo: (value: string) => void
) {
	const response = await login(loginRequest);
	setSession(response.token);
	setUserId(response.id.toString());

	// Obtener información completa del usuario después del login
	try {
		const userInfo = await getMeInfo();
		setUserInfo(JSON.stringify(userInfo));
	} catch (error) {
		console.error("Error fetching user info after login:", error);
	}
}

async function signupHandler(
	signupRequest: RegisterRequest,
	isClient: boolean,
	setSession: (value: string) => void,
	setUserId: (value: string) => void,
	setUserInfo: (value: string) => void
) {
	let response: AuthResponse;

	if (isClient) {
		response = await registerCliente(signupRequest);
	} else {
		response = await registerProveedor(signupRequest);
	}

	setSession(response.token);
	setUserId(response.id.toString());

	// Obtener información completa del usuario después del registro
	try {
		const userInfo = await getMeInfo();
		setUserInfo(JSON.stringify(userInfo));
	} catch (error) {
		console.error("Error fetching user info after registration:", error);
	}
}

export function AuthProvider(props: { children: ReactNode }) {
	const [[isLoading, session], setSession] = useStorageState("token");
	const [[, userId], setUserId] = useStorageState("userId");
	const [[, userInfoString], setUserInfo] = useStorageState("userInfo");

	const [userInfo, setUserInfoState] = useState<AuthMeDto | null>(null);

	// Parse userInfo from localStorage
	useEffect(() => {
		if (userInfoString) {
			try {
				const parsed = JSON.parse(userInfoString);
				setUserInfoState(parsed);
			} catch (error) {
				console.error("Error parsing user info from localStorage:", error);
				setUserInfoState(null);
			}
		} else {
			setUserInfoState(null);
		}
	}, [userInfoString]);

	// Synchronize API authorization header whenever the session changes
	useEffect(() => {
		Api.getInstance().then((api) => {
			api.authorization = session ?? "";
		});
	}, [session]);

	// Function to refresh user info
	const refreshUserInfo = async () => {
		if (!session) return;

		try {
			const userInfo = await getMeInfo();
			setUserInfo(JSON.stringify(userInfo));
		} catch (error) {
			console.error("Error refreshing user info:", error);
		}
	};

	// Auto-fetch user info if we have a session but no user info
	useEffect(() => {
		if (session && !userInfo && !isLoading) {
			refreshUserInfo();
		}
	}, [session, userInfo, isLoading]);

	const logoutHandler = () => {
		setSession(null);
		setUserId(null);
		setUserInfo(null);
		setUserInfoState(null);
		Api.getInstance().then((api) => {
			api.authorization = "";
		});
	};

	return (
		<AuthContext.Provider
			value={{
				register: (signupRequest, isClient) =>
					signupHandler(signupRequest, isClient, setSession, setUserId, setUserInfo),
				login: (loginRequest) =>
					loginHandler(loginRequest, setSession, setUserId, setUserInfo),
				logout: logoutHandler,
				session,
				isLoading,
				userId: userId ? parseInt(userId) : null,
				userInfo,
				refreshUserInfo,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
}

export function useAuthContext() {
	const context = useContext(AuthContext);
	if (context === undefined)
		throw new Error("useAuthContext must be used within a AuthProvider");
	return context;
}