//Tipos del frontend - nombres de campos alineados 1:1 con backend
//"NomadWallet - Contrato fijo de Sprint 1". No renombrar sin acordar con el equipo.

export interface User {
    id: number;
    email: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export type Currency = "COP" | "USD" | "EUR";

export interface Balance {
    currency: Currency;
    amount: number;
}

export interface BalanceResponse {
    balance: Balance[];
}

export interface Wallet {
    id: number;
    userId: number;
}

export interface transaction {
    id: number;
    walletId: number;
    currency: Currency;
    amount: number;
    type?: string;
    createdAt: string;
}

export interface TransactionResponse {
    transactions: transaction[];
}

//Formato de error unico para todas las rutas, segun el contrato
export interface ApiErrorBody {
    error: string;
    message: string;
}

//Error tipado que lanzan las funciones de src/services ante una respuesta no-OK
export class ApiError extends Error {
    code: string;

    constructor(body: ApiErrorBody) {
        super(body.message);
        this.name = "ApiError";
        this.code = body.error;
    }
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
}