import { useStorageState } from "@hooks/useStorageState";
import { LoginRequest } from "@interfaces/auth/LoginRequest";
import { RegisterRequest } from "@interfaces/auth/RegisterRequest";
import Api from "@services/api";
import { login } from "@services/auth/login";
import { registerCliente, registerProveedor } from "@services/auth/register";
import { createContext, ReactNode, useContext, useEffect } from "react";
import {AuthResponse} from "@interfaces/auth/AuthResponse.ts";

interface AuthContextType {
	register: (SignupRequest: RegisterRequest, isClient: boolean) => Promise<void>;
	login: (loginRequest: LoginRequest) => Promise<void>;
	logout: () => void;
	session?: string | null;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function loginHandler(
	loginRequest: LoginRequest,
	setSession: (value: string) => void,
) {
	const response = await login(loginRequest);
	setSession(response.token);
}

async function signupHandler(
	signupRequest: RegisterRequest,
	isClient: boolean,
	setSession: (value: string) => void,

) {
	let response: AuthResponse;

	if (isClient) {
		response = await registerCliente(signupRequest);
	} else {
		response = await registerProveedor(signupRequest);
	}

	setSession(response.token);
}

export function AuthProvider(props: { children: ReactNode }) {
        const [[isLoading, session], setSession] = useStorageState("token");

        // Synchronize API authorization header whenever the session changes
        useEffect(() => {
                Api.getInstance().then((api) => {
						api.authorization = session ?? "";
                });
        }, [session]);

	return (
		<AuthContext.Provider
			value={{
				register: (signupRequest, isClient) => signupHandler(signupRequest, isClient,setSession),
				login: (loginRequest) => loginHandler(loginRequest, setSession),
                                logout: () => {
                                        setSession(null);
                                        Api.getInstance().then((api) => {
												api.authorization = "";
                                        });
                                },
				session,
				isLoading,
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