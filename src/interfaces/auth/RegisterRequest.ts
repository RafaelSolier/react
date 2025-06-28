import { VehicleResponse } from "@interfaces/vehicle/VehicleResponse";

export interface RegisterRequest {
    isDriver: boolean;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    category?: string; 
    vehicle?: VehicleResponse
}
