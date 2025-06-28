import Api from "@services/api";
import { RegisterRequest } from "@interfaces/auth/RegisterRequest";
import { AuthResponse } from "@interfaces/auth/AuthResponse";

export async function register(
  registerRequest: RegisterRequest
): Promise<AuthResponse> {
  const Apis = await Api.getInstance();
  const response = await Apis.post<RegisterRequest, AuthResponse>(
    registerRequest,
    { url: "/auth/register" }
  );
  // Set authorization token for subsequent requests
  if (response.data.token) {
    Apis.authorization = response.data.token;
  }
  return response.data;
}