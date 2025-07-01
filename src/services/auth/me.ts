import { AuthMeResponse } from "@interfaces/auth/AuthMeResponse";
import Api from "@services/api";

export async function userCurrect(): Promise<AuthMeResponse> {
    const Apis = await Api.getInstance();
    const response = await Apis.get<null, AuthMeResponse>({
        url: "/auth/me",
    });
    return response.data;
}