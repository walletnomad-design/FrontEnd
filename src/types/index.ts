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

export interface BalancesResponse {
    balances: Balance[];
}

export interface Wallet {
    id: number;
    userId: number;
}

export interface Transaction {
  id: number;
  userId: number;
  walletId: number;
  type: ExchangeOperationType;
  fromCurrency: Currency;
  toCurrency: Currency;
  fromAmount: number;
  toAmount: number;
  rate: number;
  status: "completed" | "failed";
  createdAt: string;
  toUserId?: number;
}

export interface TransactionsResponse {
  transactions: Transaction[];
}
//Formato de error unico para todas las rutas, segun el contrato
export interface ApiErrorBody {
    error: string;
    message: string;
    currency?: Currency;
    available?: number;
}

export class ApiError extends Error {
    code: string;
    currency?: Currency;
    available?: number;

    constructor(body: ApiErrorBody) {
        super(body.message);
        this.name = "ApiError";
        this.code = body.error;
        this.currency = body.currency;
        this.available = body.available;
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

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  dni: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  password: string;
}


export type RatesSource = "currencyfreaks" | "fallback" | "cache";

export interface RatesResponse {
  base: Currency;
  rates: Record<Currency, number>;
  source: RatesSource;
  timestamp: string;
}

export interface ExchangePayload {
  type: ExchangeOperationType;
  fromCurrency: Currency;
  toCurrency: Currency;
  amount: number;
}

export interface ExchangeResult {
  id: number;
  type: ExchangeOperationType;
  fromCurrency: Currency;
  toCurrency: Currency;
  fromAmount: number;
  toAmount: number;
  rate: number;
  status: "completed" | "failed";
  createdAt: string;
}
export interface ExchangeResult {
  id: number;
  userId: number;
  type: ExchangeOperationType;
  fromCurrency: Currency;
  toCurrency: Currency;
  fromAmount: number;
  toAmount: number;
  rate: number;
  status: "completed" | "failed";
  createdAt: string;
}

export interface ExchangeApiResponse {
  transaction: ExchangeResult;
}

export interface Goal {
  id: number;
  userId: number;
  name: string;
  currency: Currency;
  targetAmount: number;
  currentAmount: number;
  progress: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GoalsResponse {
  goals: Goal[];
}

export interface CreateGoalPayload {
  name: string;
  currency: Currency;
  targetAmount: number;
}

export interface AddContributionPayload {
  amount: number;
}

export interface GoalApiResponse {
  goal: Goal;
}

export type AlertCondition = "gte" | "lte";
export type AlertStatus = "active" | "triggered";

export interface RateAlert {
  id: number;
  userId: number;
  fromCurrency: Currency;
  toCurrency: Currency;
  threshold: number;
  condition: AlertCondition;
  status: AlertStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RateAlertsResponse {
  alerts: RateAlert[];
}

export interface CreateRateAlertPayload {
  fromCurrency: Currency;
  toCurrency: Currency;
  threshold: number;
  condition: AlertCondition;
}

export interface RateAlertApiResponse {
  alert: RateAlert;
}

export type ExchangeOperationType = "buy" | "sell" | "exchange" | "deposit" | "transfer";

export interface DepositPayload {
  currency: Currency;
  amount: number;
}

export interface TransferPayload {
  toEmail: string;
  currency: Currency;
  amount: number;
}

export interface MoneyOpApiResponse {
  transaction: Transaction;
}

export interface AiChatPayload {
  message: string;
}

export interface AiChatResponse {
  reply: string;
}