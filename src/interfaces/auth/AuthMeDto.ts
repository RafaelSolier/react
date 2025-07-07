type UserRole = 'ROLE_PROVEEDOR' | 'ROLE_CLIENTE' | 'ROLE_ADMIN';

export interface AuthMeDto {
    id: number;
    idCD: number;
    nombre: string;
    email: string;
    telefono: string;
    descripcion: string;
    role: UserRole[];
}